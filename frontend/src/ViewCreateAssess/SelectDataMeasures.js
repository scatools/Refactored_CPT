import React, { useState } from "react";
import {
  Button,
  ButtonGroup,
  Container,
  Table,
  ToggleButton,
} from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import {
  changeMeasures,
  changeMeasuresWeight,
  changeGoalWeights,
} from "../action";
import { useDispatch, useSelector } from "react-redux";
import ReactTooltip from "react-tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import DataMeasure from "./DataMeasure";

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
  const [dataStep, setDataStep] = useState("hab");
  const [habitatSelect, setHabitatSelect] = useState(false);
  const [waterSelect, setWaterSelect] = useState(false);
  const [resourceSelect, setResourceSelect] = useState(false);
  const [resilienceSelect, setResilienceSelect] = useState(false);
  const [ecoSelect, setEcoSelect] = useState(false);
  const dispatch = useDispatch();
  const arrowIcon = <FontAwesomeIcon icon={faArrowLeft} size="lg" />;
  const plusCircle = (
    <FontAwesomeIcon
      className="hover-icon"
      icon={faPlusCircle}
      size="lg"
      onClick={() => {
        customizeMeasure(dataStep);
      }}
    />
  );
  // For predefined data measures

  const handleChange = (value, name, label, type) => {
    dispatch(changeMeasuresWeight(value, name, label, type));
  };

  const handleWeights = (value, goal) => {
    const newValue = Number(value) > 100 ? 100 : Number(value);
    dispatch(changeGoalWeights(newValue, goal));
  };

  const [options, setOptions] = useState({
    hab: [
      {
        value: "hab1",
        label: "Padus - Connectivity to Existing Protected Area",
      },
      { value: "hab2", label: "Connectivity of Natural Lands" },
      { value: "hab3", label: "Threat of Urbanization" },
      {
        value: "hab4",
        label: "Land Cover - Composition of Natural Lands ",
      },
    ],
    wq: [
      {
        value: "wq1",
        type: "checkbox",
        label: "303(D): Impaired Watershed Area ",
      },
      {
        value: "wq2",
        type: "checkbox",
        label: "Hydrologic Response to Land-Use Change",
      },
      {
        value: "wq3",
        type: "checkbox",
        label: "Percent Irrigated Agriculture",
      },
      {
        value: "wq4",
        type: "checkbox",
        label: "Lateral Connectivity to Floodplain",
      },
      {
        value: "wq5",
        type: "checkbox",
        label: "Composition of Riparizan Zone Lands",
      },
    ],
    lcmr: [
      {
        value: "lcmr1",
        label: "Vulnerable Area of Terrestrial Endemic Species",
      },
      {
        value: "lcmr2",
        label: "Threatened and Endangered Species - Critical Habitat Area ",
      },
      {
        value: "lcmr3",
        label: "Threatened and Endangered Species - Number of Species ",
      },
      { value: "lcmr4", label: "Light Pollution Index" },
    ],
    cl: [
      { value: "cl1", label: "National Register of Historic Places" },
      { value: "cl2", label: "National Heritage Area" },
      {
        value: "cl3",
        label: "Proximity to Socially Vulnerability Communities",
      },
      { value: "cl4", label: "Community Threat Index " },
    ],
    eco: [
      { value: "eco1", label: "High Priority Working Lands" },
      { value: "eco2", label: "Commercial Fishery Reliance" },
      { value: "eco3", label: "Recreational Fishery Engagement" },
      {
        value: "eco4",
        label: "Access & Recreation - Number of Access Points",
      },
    ],
  });

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
    // console.log(customizedMeasures);
    handleClose();
  };

  const setMeasureUtility = (goal, index, newUtility) => {
    customizedMeasures[goal][index].utility = newUtility;
    // console.log(customizedMeasures);
  };

  const setMeasureWeight = (goal, index, newWeight) => {
    customizedMeasures[goal][index].weight = newWeight;
    // console.log(customizedMeasures);
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
        Select each relevant data measure and set your prioritization level(Low,
        Medium, or High)
      </p>

      {dataStep === "hab" && (
        <div>
          <span>Habitat:</span>
          <DataMeasure
            dataStep={dataStep}
            options={options}
            weights={weights}
            handleWeights={handleWeights}
            plusCircle={plusCircle}
            changeMeasures={changeMeasures}
            handleChange={handleChange}
            customizedMeasures={customizedMeasures}
            setMeasureUtility={setMeasureUtility}
            setMeasureWeight={setMeasureWeight}
          />
          <br />
          <Container className="add-assess-cont">
            <Button
              variant="secondary"
              onClick={() => setAssessStep("selectRestoreWeights")}
            >
              {arrowIcon} Edit RESTORE Weights
            </Button>
            <Button variant="primary" onClick={() => setDataStep("wq")}>
              Next
            </Button>
          </Container>
        </div>
      )}
      {dataStep === "wq" && (
        <div>
          <span>Water Quality & Quantity:</span>
          <DataMeasure
            dataStep={dataStep}
            options={options}
            weights={weights}
            handleWeights={handleWeights}
            plusCircle={plusCircle}
            changeMeasures={changeMeasures}
            handleChange={handleChange}
            customizedMeasures={customizedMeasures}
            setMeasureUtility={setMeasureUtility}
            setMeasureWeight={setMeasureWeight}
          />
          <br />
          <Container className="add-assess-cont">
            <Button variant="secondary" onClick={() => setDataStep("hab")}>
              {arrowIcon} Edit Habitat Measures
            </Button>
            <Button variant="primary" onClick={() => setDataStep("lcmr")}>
              Next
            </Button>
          </Container>
        </div>
      )}

      {dataStep === "lcmr" && (
        <div>
          <span>Living Coastal & Marine Resources:</span>
          <DataMeasure
            dataStep={dataStep}
            options={options}
            weights={weights}
            handleWeights={handleWeights}
            plusCircle={plusCircle}
            changeMeasures={changeMeasures}
            handleChange={handleChange}
            customizedMeasures={customizedMeasures}
            setMeasureUtility={setMeasureUtility}
            setMeasureWeight={setMeasureWeight}
          />
          <br />
          <Container className="add-assess-cont">
            <Button variant="secondary" onClick={() => setDataStep("wq")}>
              {arrowIcon} Edit Water Measures
            </Button>
            <Button variant="primary" onClick={() => setDataStep("cl")}>
              Next
            </Button>
          </Container>
        </div>
      )}
      {dataStep === "cl" && (
        <div>
          <span>Community Resilience:</span>
          <DataMeasure
            dataStep={dataStep}
            options={options}
            weights={weights}
            handleWeights={handleWeights}
            plusCircle={plusCircle}
            changeMeasures={changeMeasures}
            handleChange={handleChange}
            customizedMeasures={customizedMeasures}
            setMeasureUtility={setMeasureUtility}
            setMeasureWeight={setMeasureWeight}
          />
          <br />

          <Container className="add-assess-cont">
            <Button variant="secondary" onClick={() => setDataStep("lcmr")}>
              {arrowIcon} Edit Resources Measures
            </Button>
            <Button variant="primary" onClick={() => setDataStep("eco")}>
              Next
            </Button>
          </Container>
        </div>
      )}

      {dataStep === "eco" && (
        <div>
          <span>Gulf Economy:</span>
          <DataMeasure
            dataStep={dataStep}
            options={options}
            weights={weights}
            handleWeights={handleWeights}
            plusCircle={plusCircle}
            changeMeasures={changeMeasures}
            handleChange={handleChange}
            customizedMeasures={customizedMeasures}
            setMeasureUtility={setMeasureUtility}
            setMeasureWeight={setMeasureWeight}
          />
          <br />

          <Container className="add-assess-cont">
            <Button variant="secondary" onClick={() => setDataStep("cl")}>
              {arrowIcon} Edit Resilience Measures
            </Button>
            <Button
              variant="primary"
              onClick={() => setAssessStep("reviewAssessSettings")}
            >
              Next
            </Button>
          </Container>
        </div>
      )}
    </Container>
  );
};

export default SelectDataMeasures;
