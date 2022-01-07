import React, { useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import { generate_assessment, setLoader } from "../action";
import { useDispatch, useSelector } from "react-redux";
import { calculateMeasures, getScaledForAssessment, mergeIntoArray } from "../helper/aggregateHex";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { GoInfo } from "react-icons/go";
import ReactTooltip from "react-tooltip";

const RESTOREGoal = [
  "Habitat",
  "Water Quality & Quantity",
  "Living Coastal & Marine Resources",
  "Community Resilience",
  "Gulf Economy",
];

const ReviewAssessSettings = ({ aoiAssembled }) => {
  const weights = useSelector((state) => state.weights);
  const aoi = useSelector((state) => state.aoi);

  const dispatch = useDispatch();

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const history = useHistory();

  return (
    <>
      <Container className="card-body">
        Data Measure Weights Summary:
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th class="align-top">Measure Name</th>
              <th class="align-top">Goal Related</th>
              <th class="align-top">
                Utility &nbsp;
                <GoInfo data-tip data-for="utility" />
                <ReactTooltip id="utility" type="dark">
                  <span>Utility functions are mathematical representations of how users prefer varying values of a single measure</span>
                </ReactTooltip>
              </th>
              <th class="align-top">
                Weights &nbsp;
                <GoInfo data-tip data-for="measureWeights" />
                <ReactTooltip id="measureWeights" type="dark">
                  <span>Measure weights are set by users to emphasize certain priority attributes</span>
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
                  <td>{measure.utility === "1" ? "Positive" : "Negative"}</td>
                  <td>{measure.weight.toUpperCase()}</td>
                </tr>
              ))}
            {weights.wq.selected &&
              weights.wq.selected.map((measure) => (
                <tr key={measure.value}>
                  <td>{measure.label}</td>
                  <td>Water</td>
                  <td>{measure.utility === "1" ? "Positive" : "Negative"}</td>
                  <td>{measure.weight.toUpperCase()}</td>
                </tr>
              ))}
            {weights.lcmr.selected &&
              weights.lcmr.selected.map((measure) => (
                <tr key={measure.value}>
                  <td>{measure.label}</td>
                  <td>LCMR</td>
                  <td>{measure.utility === "1" ? "Positive" : "Negative"}</td>
                  <td>{measure.weight.toUpperCase()}</td>
                </tr>
              ))}
            {weights.cl.selected &&
              weights.cl.selected.map((measure) => (
                <tr key={measure.value}>
                  <td>{measure.label}</td>
                  <td>Resilience</td>
                  <td>{measure.utility === "1" ? "Positive" : "Negative"}</td>
                  <td>{measure.weight.toUpperCase()}</td>
                </tr>
              ))}
            {weights.eco.selected &&
              weights.eco.selected.map((measure) => (
                <tr key={measure.value}>
                  <td>{measure.label}</td>
                  <td>Economy</td>
                  <td>{measure.utility === "1" ? "Positive" : "Negative"}</td>
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
              <th>
                Goal Weights &nbsp;
                <GoInfo data-tip data-for="goalWeights" />
                <ReactTooltip id="goalWeights" type="dark">
                  <span>Goal weights are set by users to emphasize specific RESTORE goals</span>
                </ReactTooltip>
              </th>
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
          className="ml-2"
          variant="dark"
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
