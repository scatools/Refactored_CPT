import React, { useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { generate_assessment, setLoader } from "../action";
import { useDispatch, useSelector } from "react-redux";
import {
  calculateMeasures,
  getScaledForAssessment,
  mergeIntoArray,
} from "../helper/aggregateHex";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { GoInfo } from "react-icons/go";
import ReactTooltip from "react-tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const arrowIcon = <FontAwesomeIcon icon={faArrowLeft} size="lg" />;

const RESTOREGoal = [
  "Habitat",
  "Water Quality & Quantity",
  "Living Coastal & Marine Resources",
  "Community Resilience",
  "Gulf Economy",
];

const ReviewAssessSettings = ({ aoiAssembled, setAssessStep }) => {
  const weights = useSelector((state) => state.weights);
  const aoi = useSelector((state) => state.aoi);

  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const history = useHistory();

  return (
    <>
      <Container id="assessment-card" className="card-body">
        Data Measure Weights Summary:
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Measure Name</th>
              <th>Goal Related</th>
              <th>
                Utility &nbsp;
                <GoInfo data-tip data-for="GoInfo" />
                <ReactTooltip id="GoInfo" type="dark">
                  <span>Pragna this thing worked</span>
                </ReactTooltip>
              </th>
              <th>
                Weights &nbsp;
                <GoInfo data-tip data-for="GoInfo" />
                <ReactTooltip id="GoInfo" type="dark">
                  <span>Pragna this thing worked</span>
                </ReactTooltip>
              </th>
            </tr>
          </thead>
          <tbody>
            {weights.hab.selected &&
              weights.hab.selected.map((measure) => (
                <tr key={measure.value}>
                  <td>{measure.label}</td>
                  <td>Habitat</td>
                  <td>{measure.utility === "1" ? "Desired" : "UnDesired"}</td>
                  <td>{measure.weight.toUpperCase()}</td>
                </tr>
              ))}
            {weights.wq.selected &&
              weights.wq.selected.map((measure) => (
                <tr key={measure.value}>
                  <td>{measure.label}</td>
                  <td>Water</td>
                  <td>{measure.utility === "1" ? "Desired" : "UnDesired"}</td>
                  <td>{measure.weight.toUpperCase()}</td>
                </tr>
              ))}
            {weights.lcmr.selected &&
              weights.lcmr.selected.map((measure) => (
                <tr key={measure.value}>
                  <td>{measure.label}</td>
                  <td>LCMR</td>
                  <td>{measure.utility === "1" ? "Desired" : "UnDesired"}</td>
                  <td>{measure.weight.toUpperCase()}</td>
                </tr>
              ))}
            {weights.cl.selected &&
              weights.cl.selected.map((measure) => (
                <tr key={measure.value}>
                  <td>{measure.label}</td>
                  <td>Resilience</td>
                  <td>{measure.utility === "1" ? "Desired" : "UnDesired"}</td>
                  <td>{measure.weight.toUpperCase()}</td>
                </tr>
              ))}
            {weights.eco.selected &&
              weights.eco.selected.map((measure) => (
                <tr key={measure.value}>
                  <td>{measure.label}</td>
                  <td>Economy</td>
                  <td>{measure.utility === "1" ? "Desired" : "UnDesired"}</td>
                  <td>{measure.weight.toUpperCase()}</td>
                </tr>
              ))}
          </tbody>
        </Table>
        Goal Weights:
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>RESTORE Goal</th>
              <th>Goal Weights</th>
            </tr>
          </thead>
          <tbody>
            {RESTOREGoal.map((goal, idx) => {
              return (
                <tr key={idx}>
                  <td>{goal}</td>
                  <td>{Object.values(weights)[idx].weight}%</td>
                </tr>
              );
            })}
          </tbody>
        </Table>
        <Button
          style={{ float: "left" }}
          variant="secondary"
          onClick={() => setAssessStep("selectDataMeasures")}
        >
          {arrowIcon} Edit Data Measures
        </Button>
        <Button
          className="ml-2"
          variant="primary"
          style={{ float: "right" }}
          onClick={() => {
            dispatch(setLoader(true));
            async function calculateNewData() {
              const newAoiData = aoiAssembled.map((item) =>
                getScaledForAssessment(
                  aoi[item.value].rawScore,
                  aoi[item.value].id,
                  aoi[item.value].name
                )
              );
              const goalList = {
                hab: "Habitat",
                wq: "Water Quality & Quantity",
                lcmr: "Living Costal & Marine Resources",
                cl: "Community Resilience",
                eco: "Gulf Economy",
              };
              const newWeights = Object.entries(weights).map((goal) => {
                return {
                  goal: goalList[goal[0]],
                  weights: goal[1].weight / 100,
                };
              });
              const newAoi = mergeIntoArray(newAoiData);
              const scoreByGoal = calculateMeasures(newAoiData, weights);

              // For development on local server
              // const result = await axios.post('http://localhost:5000/mcda',{
              // 	mean: scoreByGoal,
              // 	std: 0.1
              // });
              // For production on Heroku
              const result = await axios.post(
                "https://sca-cpt-backend.herokuapp.com/mcda",
                {
                  mean: scoreByGoal,
                  std: 0.1,
                }
              );
              const returnData = {
                aoi: newAoi,
                aoiScore: scoreByGoal,
                weights: newWeights,
                rankAccept: result.data.rankAccept,
                centralWeight: result.data.centralWeight,
              };
              dispatch(generate_assessment(returnData));
            }

            if (
              Object.values(weights).reduce((a, b) => {
                return a + b.weight;
              }, 0) !== 100 ||
              aoiAssembled.length <= 1
            ) {
              handleShow();
            } else {
              calculateNewData().then(() => {
                history.push("/assessment");
                // This won't work
                // return <Redirect to="/assessment"/>
              });
            }
          }}
        >
          Generate Assessment
        </Button>
      </Container>
    </>
  );
};

export default ReviewAssessSettings;
