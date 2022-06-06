import React, { useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";

import { useSelector } from "react-redux";

import SingleMeasure from "./SingleMeasure";

const SelectDataMeasures = ({
  setAssessStep,
  aoiAssembled,
  customizedMeasures,
}) => {
  const [show, setShow] = useState(false);
  const [restoreGoal, setRestoreGoal] = useState("");
  const [inputMeasureName, setInputMeasureName] = useState("");
  const [inputMeasureValueList, setInputMeasureValueList] = useState([]);
  const aoi = useSelector((state) => state.aoi);
  const aoiAssembledList = aoiAssembled.map((aoi) => aoi.value);
  const aoiList = Object.values(aoi).filter((aoi) =>
    aoiAssembledList.includes(aoi.id)
  );

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

  let goalName = "";

  switch (restoreGoal) {
    case "hab":
      goalName = "Habitat";
      break;
    case "wq":
      goalName = "Water Quality & Quantity";
      break;
    case "lcmr":
      goalName = "Living Coastal & Marine Resources";
      break;
    case "cl":
      goalName = "Community Resilience";
      break;
    case "eco":
      goalName = "Gulf Economy";
      break;
    default:
      goalName = "";
  }

  return (
    <Container>
      <Modal centered show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Input Your Customized Measure</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ float: "left" }}>
            <b>Goal:</b> {goalName}
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
        customizeMeasure={customizeMeasure}
        setAssessStep={setAssessStep}
      />
    </Container>
  );
};

export default SelectDataMeasures;
