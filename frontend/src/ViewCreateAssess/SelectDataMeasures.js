import React, { useCallback, useState } from "react";
import {
  Button,
  ButtonGroup,
  Container,
  Table,
  ToggleButton,
} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import ReactTooltip from "react-tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import parse from "html-react-parser";
import { faArrowLeft, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import DataMeasure from "./DataMeasure";
import { Label } from "recharts";
import { GoInfo, GoQuestion } from "react-icons/go";
import { FiPlusCircle } from "react-icons/fi";
import { HiExternalLink } from "react-icons/hi";
import {
  changeMeasures,
  changeMeasuresWeight,
  changeGoalWeights,
} from "../action";
import SingleMeasure from "./SingleMeasure";

const SelectDataMeasures = ({
  setAssessStep,
  aoiAssembled,
  customizedMeasures,
}) => {
  const [show, setShow] = useState(false);
  const [restoreGoal, setRestoreGoal] = useState("");
  const [inputType, setInputType] = useState("scaled");
  const [inputMeasureName, setInputMeasureName] = useState("");
  const [inputMeasureValueList, setInputMeasureValueList] = useState([]);
  const weights = useSelector((state) => state.weights);
  const aoi = useSelector((state) => state.aoi);
  const aoiAssembledList = aoiAssembled.map((aoi) => aoi.value);
  const aoiList = Object.values(aoi).filter((aoi) =>
    aoiAssembledList.includes(aoi.id)
  );
  const [habitatSelect, setHabitatSelect] = useState(false);
  const [waterSelect, setWaterSelect] = useState(false);
  const [resourceSelect, setResourceSelect] = useState(false);
  const [resilienceSelect, setResilienceSelect] = useState(false);
  const [economySelect, setEconomySelect] = useState(false);
  const dispatch = useDispatch();
  const arrowIcon = <FontAwesomeIcon icon={faArrowLeft} size="lg" />;
  const plusCircle = (
    <FontAwesomeIcon
      className="hover-icon"
      icon={faPlusCircle}
      size="lg"
      onClick={() => {
        customizeMeasure(dataMeasList[dataI]);
      }}
    />
  );
  // For predefined data measures

  const handleChange = (value, name, label, type) => {
    dispatch(changeMeasuresWeight(value, name, label, type));
  };

  // For customized data measures

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const customizeMeasure = (goal) => {
    setInputMeasureName("");
    setInputMeasureValueList([]);
    setRestoreGoal(goal);
    handleShow();
  };

  const submitMeasure = (goal) => {
    const customizedMeasureID =
      goal + "-c" + String(customizedMeasures[goal].length + 1);
    customizedMeasures[goal].push({
      name: inputMeasureName,
      value: customizedMeasureID,
      data: inputMeasureValueList,
      utility: "1",
      weight: "medium",
    });
    handleClose();
  };

  const setMeasureUtility = (goal, index, newUtility) => {
    customizedMeasures[goal][index].utility = newUtility;
  };

  const setMeasureWeight = (goal, index, newWeight) => {
    customizedMeasures[goal][index].weight = newWeight;
  };

  let dataMeasList = ["hab", "wq", "lcmr", "cl", "eco"];
  const [dataI, setDataI] = useState(0);

  for (const elem of dataMeasList) {
    if (!weights[elem].weight)
      dataMeasList = dataMeasList.filter((a) => a !== elem);
  }

  const handleNext = () => {
    if (dataI === dataMeasList.length - 1) {
      setAssessStep("reviewAssessSettings");
    } else {
      setDataI(dataI + 1);
    }
  };

  const handleBack = () => {
    if (dataI === 0) {
      setAssessStep("selectRestoreWeights");
    } else {
      let newI = dataI - 1;
      setDataI(newI);
    }
  };

  return (
    <Container>
      <Modal centered show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Input Your Customized Measure</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ float: "left" }}>
            <b>Goal:</b> {restoreGoal}
          </div>
          <div className="form-group form-inline" style={{ float: "right" }}>
            <b style={{ marginRight: "10px" }}>Input Type:</b>
            <select
              name="inputType"
              className="form-control"
              style={{ width: "150px", height: "30px", fontSize: "12px" }}
              onChange={(e) => {
                setInputType(e.target.value);
              }}
            >
              <option value="scaled">Scaled Values</option>
              <option value="unscaled">Unscaled Values</option>
            </select>
          </div>
          <br />
          <br />
          <Table
            striped
            bordered
            hover
            size="lg"
            className="justify-content-md-center text-center"
          >
            <thead>
              <tr>
                <th class="align-top">Measure Name</th>
                {aoiList.map((aoi) => (
                  <th class="align-top">Value of {aoi.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <input
                    type="text"
                    placeholder="New Measure Name"
                    value={inputMeasureName}
                    onChange={(e) => {
                      setInputMeasureName(e.target.value);
                    }}
                  />
                </td>
                {aoiList.map((aoi, index) => (
                  <td>
                    <input
                      type="number"
                      onChange={(e) => {
                        inputMeasureValueList[index] = parseFloat(
                          e.target.value
                        );
                      }}
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </Table>
          <br />
          <br />
          <div className="d-flex justify-content-center text-center">
            <Button
              variant="dark"
              type="submit"
              onClick={() => submitMeasure(restoreGoal)}
            >
              Submit
            </Button>
          </div>
          <br />
        </Modal.Body>
      </Modal>

      <h3>Data Measures </h3>
      <p className="smaller-text">
        For each of the previously selected goals, here are data measures
        associated with each goal.
        <br />
        <br />
        Select each relevant data measure and set your prioritization level
        (Low, Medium, High)
      </p>

      <SingleMeasure
        customizedMeasures={customizedMeasures}
        setAssessStep={setAssessStep}
      />
    </Container>
  );
};

export default SelectDataMeasures;
