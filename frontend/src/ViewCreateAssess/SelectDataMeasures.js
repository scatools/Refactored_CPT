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
      {console.log(weights)}
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
      <br />
      {dataStep === "hab" && (
        <Container>
          <span>Habitat:</span>
          <Select
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            menuPortalTarget={document.body}
            options={[
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
            ]}
            isMulti
            isClearable={false}
            placeholder="Select Habitat measures..."
            name="colors"
            value={weights.hab.selected}
            onChange={(selectedOption) => {
              console.log(habitatSelect);
              let state;
              if (selectedOption) {
                setHabitatSelect(true);
                state = selectedOption.map((selected) => ({
                  ...selected,
                  utility: selected["utility"] || "1",
                  weight: selected["weight"] || "medium",
                }));
              } else {
                setHabitatSelect(false);
                state = null;
                handleWeights(0, "hab");
              }
              dispatch(changeMeasures("hab", state));
            }}
            className="basic-multi-select"
            classNamePrefix="select"
          />

          <div style={{ float: "left" }}>
            {plusCircle}
            <span>Customize Measure</span>
          </div>

          <br />

          {weights.hab.selected &&
            weights.hab.selected.map((measure) => (
              <div className="m-2" key={measure.value}>
                <span style={{ display: "block" }} className="my-1">
                  {measure.label}
                </span>
                <ButtonGroup toggle>
                  <ToggleButton
                    type="radio"
                    data-tip
                    data-for="more"
                    variant="outline-secondary"
                    name="utility"
                    value="-1"
                    checked={measure.utility === "-1"}
                    onChange={(e) =>
                      handleChange(
                        e.currentTarget.value,
                        e.currentTarget.name,
                        measure.value,
                        "hab"
                      )
                    }
                  >
                    Higher
                  </ToggleButton>
                  <ReactTooltip id="more" place="top">
                    More is better
                  </ReactTooltip>
                  <ToggleButton
                    type="radio"
                    data-tip
                    data-for="less"
                    variant="outline-secondary"
                    name="utility"
                    value="1"
                    checked={measure.utility === "1"}
                    onChange={(e) =>
                      handleChange(
                        e.currentTarget.value,
                        e.currentTarget.name,
                        measure.value,
                        "hab"
                      )
                    }
                  >
                    Lower
                  </ToggleButton>
                  <ReactTooltip id="less" place="top">
                    Less is better
                  </ReactTooltip>
                </ButtonGroup>
                <ButtonGroup toggle className="ml-2">
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="low"
                    checked={measure.weight === "low"}
                    onChange={(e) =>
                      handleChange(
                        e.currentTarget.value,
                        e.currentTarget.name,
                        measure.value,
                        "hab"
                      )
                    }
                  >
                    Low
                  </ToggleButton>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="medium"
                    checked={measure.weight === "medium"}
                    onChange={(e) =>
                      handleChange(
                        e.currentTarget.value,
                        e.currentTarget.name,
                        measure.value,
                        "hab"
                      )
                    }
                  >
                    Medium
                  </ToggleButton>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="high"
                    checked={measure.weight === "high"}
                    onChange={(e) =>
                      handleChange(
                        e.currentTarget.value,
                        e.currentTarget.name,
                        measure.value,
                        "hab"
                      )
                    }
                  >
                    High
                  </ToggleButton>
                </ButtonGroup>
              </div>
            ))}

          {!!customizedMeasures.hab.length &&
            customizedMeasures.hab.map((measure, index) => (
              <div className="m-2" key={measure.name}>
                <span style={{ display: "block" }} className="my-1">
                  {measure.name}
                </span>
                <ButtonGroup toggle>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    data-tip
                    data-for="positive-hab-c"
                    name="utility"
                    value="1"
                    checked={measure.utility === "1"}
                    onChange={(e) => setMeasureUtility("hab", index, "1")}
                  >
                    Higher
                  </ToggleButton>
                  <ReactTooltip id="positive-hab-c" place="top">
                    More is better
                  </ReactTooltip>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    data-tip
                    data-for="negative-hab-c"
                    name="utility"
                    value="-1"
                    checked={measure.utility === "-1"}
                    onChange={(e) => setMeasureUtility("hab", index, "-1")}
                  >
                    Lower
                  </ToggleButton>
                  <ReactTooltip id="negative-hab-c" place="top">
                    Less is better
                  </ReactTooltip>
                </ButtonGroup>
                <ButtonGroup toggle className="ml-2">
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="low"
                    checked={measure.weight === "low"}
                    onChange={(e) => setMeasureWeight("hab", index, "low")}
                  >
                    Low
                  </ToggleButton>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="medium"
                    checked={measure.weight === "medium"}
                    onChange={(e) => setMeasureWeight("hab", index, "medium")}
                  >
                    Medium
                  </ToggleButton>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="high"
                    checked={measure.weight === "high"}
                    onChange={(e) => setMeasureWeight("hab", index, "high")}
                  >
                    High
                  </ToggleButton>
                </ButtonGroup>
              </div>
            ))}
          <br />
          <Container className="add-assess-cont">
            <Button
              variant="secondary"
              onClick={() => setAssessStep("selectRestoreWeights")}
            >
              {arrowIcon} Edit RESTORE Weights
            </Button>
            <Button variant="primary" onClick={() => setDataStep("wq")}>
              {habitatSelect ? "Next" : "Skip"}
            </Button>
          </Container>
        </Container>
      )}
      {dataStep === "wq" && (
        <Container>
          <span>Water Quality & Quantity:</span>
          <Select
            styles={{
              menuPortal: (base, state) => ({ ...base, zIndex: 9999 }),
            }}
            menuPortalTarget={document.body}
            options={[
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
            ]}
            isMulti
            placeholder="Select Water Quality & Quantity measures..."
            name="colors"
            className="basic-multi-select"
            classNamePrefix="select"
            value={weights.wq.selected}
            isClearable={false}
            onChange={(selectedOption) => {
              let state;
              if (selectedOption) {
                setWaterSelect(true);
                state = selectedOption.map((selected) => ({
                  ...selected,
                  utility: selected["utility"] || "1",
                  weight: selected["weight"] || "medium",
                }));
              } else {
                setWaterSelect(false);
                state = null;
                handleWeights(0, "wq");
              }

              dispatch(changeMeasures("wq", state));
            }}
          />
          <div style={{ float: "left" }}>
            {plusCircle}
            <span>Customize Measure</span>
          </div>
          <br />
          {weights.wq.selected &&
            weights.wq.selected.map((measure) => (
              <div className="m-2" key={measure.value}>
                <span style={{ display: "block" }} className="my-1">
                  {measure.label}
                </span>
                <ButtonGroup toggle>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    data-tip
                    data-for="More1"
                    name="utility"
                    value="-1"
                    checked={measure.utility === "-1"}
                    onChange={(e) =>
                      handleChange(
                        e.currentTarget.value,
                        e.currentTarget.name,
                        measure.value,
                        "wq"
                      )
                    }
                  >
                    Higher
                  </ToggleButton>
                  <ReactTooltip id="More1" place="top">
                    More is better
                  </ReactTooltip>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    data-tip
                    data-for="Less1"
                    name="utility"
                    value="1"
                    checked={measure.utility === "1"}
                    onChange={(e) =>
                      handleChange(
                        e.currentTarget.value,
                        e.currentTarget.name,
                        measure.value,
                        "wq"
                      )
                    }
                  >
                    Lower
                  </ToggleButton>
                  <ReactTooltip id="Less1" place="top">
                    Less is better
                  </ReactTooltip>
                </ButtonGroup>
                <ButtonGroup toggle className="ml-2">
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="low"
                    checked={measure.weight === "low"}
                    onChange={(e) =>
                      handleChange(
                        e.currentTarget.value,
                        e.currentTarget.name,
                        measure.value,
                        "wq"
                      )
                    }
                  >
                    Low
                  </ToggleButton>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="medium"
                    checked={measure.weight === "medium"}
                    onChange={(e) =>
                      handleChange(
                        e.currentTarget.value,
                        e.currentTarget.name,
                        measure.value,
                        "wq"
                      )
                    }
                  >
                    Medium
                  </ToggleButton>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="high"
                    checked={measure.weight === "high"}
                    onChange={(e) =>
                      handleChange(
                        e.currentTarget.value,
                        e.currentTarget.name,
                        measure.value,
                        "wq"
                      )
                    }
                  >
                    High
                  </ToggleButton>
                </ButtonGroup>
              </div>
            ))}
          {!!customizedMeasures.wq.length &&
            customizedMeasures.wq.map((measure, index) => (
              <div className="m-2" key={measure.name}>
                <span style={{ display: "block" }} className="my-1">
                  {measure.name}
                </span>
                <ButtonGroup toggle>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    data-tip
                    data-for="positive-wq-c"
                    name="utility"
                    value="1"
                    checked={measure.utility === "1"}
                    onChange={(e) => setMeasureUtility("wq", index, "1")}
                  >
                    Higher
                  </ToggleButton>
                  <ReactTooltip id="positive-wq-c" place="top">
                    More is better
                  </ReactTooltip>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    data-tip
                    data-for="negative-wq-c"
                    name="utility"
                    value="-1"
                    checked={measure.utility === "-1"}
                    onChange={(e) => setMeasureUtility("wq", index, "-1")}
                  >
                    Lower
                  </ToggleButton>
                  <ReactTooltip id="negative-wq-c" place="top">
                    Less is better
                  </ReactTooltip>
                </ButtonGroup>
                <ButtonGroup toggle className="ml-2">
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="low"
                    checked={measure.weight === "low"}
                    onChange={(e) => setMeasureWeight("wq", index, "low")}
                  >
                    Low
                  </ToggleButton>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="medium"
                    checked={measure.weight === "medium"}
                    onChange={(e) => setMeasureWeight("wq", index, "medium")}
                  >
                    Medium
                  </ToggleButton>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="high"
                    checked={measure.weight === "high"}
                    onChange={(e) => setMeasureWeight("wq", index, "high")}
                  >
                    High
                  </ToggleButton>
                </ButtonGroup>
              </div>
            ))}

          <br />
          <Container className="add-assess-cont">
            <Button variant="secondary" onClick={() => setDataStep("hab")}>
              {arrowIcon} Edit Habitat Measures
            </Button>
            <Button variant="primary" onClick={() => setDataStep("lcmr")}>
              {waterSelect ? "Next" : "Skip"}
            </Button>
          </Container>
        </Container>
      )}

      {dataStep === "lcmr" && (
        <Container>
          <span>Living Coastal & Marine Resources:</span>
          <Select
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            menuPortalTarget={document.body}
            options={[
              {
                value: "lcmr1",
                label: "Vulnerable Area of Terrestrial Endemic Species",
              },
              {
                value: "lcmr2",
                label:
                  "Threatened and Endangered Species - Critical Habitat Area ",
              },
              {
                value: "lcmr3",
                label: "Threatened and Endangered Species - Number of Species ",
              },
              { value: "lcmr4", label: "Light Pollution Index" },
            ]}
            isMulti
            placeholder="Select Living Coastal & Marine Resources measures..."
            name="colors"
            className="basic-multi-select"
            classNamePrefix="select"
            isClearable={false}
            value={weights.lcmr.selected}
            onChange={(selectedOption) => {
              let state;
              if (selectedOption) {
                setResourceSelect(true);
                state = selectedOption.map((selected) => ({
                  ...selected,
                  utility: selected["utility"] || "1",
                  weight: selected["weight"] || "medium",
                }));
              } else {
                setResourceSelect(false);
                state = null;

                handleWeights(0, "lcmr");
              }

              dispatch(changeMeasures("lcmr", state));
            }}
          />

          <div style={{ float: "left" }}>
            {plusCircle}
            <span>Customize Measure</span>
          </div>
          <br />
          {weights.lcmr.selected &&
            weights.lcmr.selected.map((measure) => (
              <div className="m-2" key={measure.value}>
                <span style={{ display: "block" }} className="my-1">
                  {measure.label}
                </span>
                <ButtonGroup toggle>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="utility"
                    data-tip
                    data-for="More"
                    value="-1"
                    checked={measure.utility === "-1"}
                    onChange={(e) =>
                      handleChange(
                        e.currentTarget.value,
                        e.currentTarget.name,
                        measure.value,
                        "lcmr"
                      )
                    }
                  >
                    Higher
                  </ToggleButton>
                  <ReactTooltip id="More" place="top">
                    More is better
                  </ReactTooltip>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="utility"
                    data-tip
                    data-for="Less"
                    value="1"
                    checked={measure.utility === "1"}
                    onChange={(e) =>
                      handleChange(
                        e.currentTarget.value,
                        e.currentTarget.name,
                        measure.value,
                        "lcmr"
                      )
                    }
                  >
                    Lower
                  </ToggleButton>
                  <ReactTooltip id="Less" place="top">
                    Less is better
                  </ReactTooltip>
                </ButtonGroup>
                <ButtonGroup toggle className="ml-2">
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="low"
                    checked={measure.weight === "low"}
                    onChange={(e) =>
                      handleChange(
                        e.currentTarget.value,
                        e.currentTarget.name,
                        measure.value,
                        "lcmr"
                      )
                    }
                  >
                    Low
                  </ToggleButton>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="medium"
                    checked={measure.weight === "medium"}
                    onChange={(e) =>
                      handleChange(
                        e.currentTarget.value,
                        e.currentTarget.name,
                        measure.value,
                        "lcmr"
                      )
                    }
                  >
                    Medium
                  </ToggleButton>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="high"
                    checked={measure.weight === "high"}
                    onChange={(e) =>
                      handleChange(
                        e.currentTarget.value,
                        e.currentTarget.name,
                        measure.value,
                        "lcmr"
                      )
                    }
                  >
                    High
                  </ToggleButton>
                </ButtonGroup>
              </div>
            ))}

          {!!customizedMeasures.lcmr.length &&
            customizedMeasures.lcmr.map((measure, index) => (
              <div className="m-2" key={measure.name}>
                <span style={{ display: "block" }} className="my-1">
                  {measure.name}
                </span>
                <ButtonGroup toggle>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    data-tip
                    data-for="positive-lcmr-c"
                    name="utility"
                    value="1"
                    checked={measure.utility === "1"}
                    onChange={(e) => setMeasureUtility("lcmr", index, "1")}
                  >
                    Higher
                  </ToggleButton>
                  <ReactTooltip id="positive-lcmr-c" place="top">
                    More is better
                  </ReactTooltip>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    data-tip
                    data-for="negative-lcmr-c"
                    name="utility"
                    value="-1"
                    checked={measure.utility === "-1"}
                    onChange={(e) => setMeasureUtility("lcmr", index, "-1")}
                  >
                    Lower
                  </ToggleButton>
                  <ReactTooltip id="negative-lcmr-c" place="top">
                    Less is better
                  </ReactTooltip>
                </ButtonGroup>
                <ButtonGroup toggle className="ml-2">
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="low"
                    checked={measure.weight === "low"}
                    onChange={(e) => setMeasureWeight("lcmr", index, "low")}
                  >
                    Low
                  </ToggleButton>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="medium"
                    checked={measure.weight === "medium"}
                    onChange={(e) => setMeasureWeight("lcmr", index, "medium")}
                  >
                    Medium
                  </ToggleButton>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="high"
                    checked={measure.weight === "high"}
                    onChange={(e) => setMeasureWeight("lcmr", index, "high")}
                  >
                    High
                  </ToggleButton>
                </ButtonGroup>
              </div>
            ))}

          <br />
          <Container className="add-assess-cont">
            <Button variant="secondary" onClick={() => setDataStep("wq")}>
              {arrowIcon} Edit Water Measures
            </Button>
            <Button variant="primary" onClick={() => setDataStep("cl")}>
              {resourceSelect ? "Next" : "Skip"}
            </Button>
          </Container>
        </Container>
      )}
      {dataStep === "cl" && (
        <Container>
          <span>Community Resilience:</span>
          <Select
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            menuPortalTarget={document.body}
            options={[
              { value: "cl1", label: "National Register of Historic Places" },
              { value: "cl2", label: "National Heritage Area" },
              {
                value: "cl3",
                label: "Proximity to Socially Vulnerability Communities",
              },
              { value: "cl4", label: "Community Threat Index " },
            ]}
            isMulti
            placeholder="Select Community Resilience measures..."
            name="colors"
            isClearable={false}
            className="basic-multi-select"
            classNamePrefix="select"
            value={weights.cl.selected}
            onChange={(selectedOption) => {
              let state;
              if (selectedOption) {
                setResilienceSelect(true);
                state = selectedOption.map((selected) => ({
                  ...selected,
                  utility: selected["utility"] || "1",
                  weight: selected["weight"] || "medium",
                }));
              } else {
                setResilienceSelect(false);
                state = null;

                handleWeights(0, "cl");
              }
              dispatch(changeMeasures("cl", state));
            }}
          />

          <div style={{ float: "left" }}>
            {plusCircle}
            <span>Customize Measure</span>
          </div>
          <br />
          {weights.cl.selected &&
            weights.cl.selected.map((measure) => (
              <div className="m-2" key={measure.value}>
                <span style={{ display: "block" }} className="my-1">
                  {measure.label}
                </span>
                <ButtonGroup toggle>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    data-tip
                    data-for="more"
                    name="utility"
                    value="-1"
                    checked={measure.utility === "-1"}
                    onChange={(e) =>
                      handleChange(
                        e.currentTarget.value,
                        e.currentTarget.name,
                        measure.value,
                        "cl"
                      )
                    }
                  >
                    Higher
                  </ToggleButton>
                  <ReactTooltip id="more" place="top">
                    More score the better
                  </ReactTooltip>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    data-tip
                    data-for="less"
                    name="utility"
                    value="1"
                    checked={measure.utility === "1"}
                    onChange={(e) =>
                      handleChange(
                        e.currentTarget.value,
                        e.currentTarget.name,
                        measure.value,
                        "cl"
                      )
                    }
                  >
                    Lower
                  </ToggleButton>
                  <ReactTooltip id="less" place="top">
                    Less score the better
                  </ReactTooltip>
                </ButtonGroup>
                <ButtonGroup toggle className="ml-2">
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="low"
                    checked={measure.weight === "low"}
                    onChange={(e) =>
                      handleChange(
                        e.currentTarget.value,
                        e.currentTarget.name,
                        measure.value,
                        "cl"
                      )
                    }
                  >
                    Low
                  </ToggleButton>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="medium"
                    checked={measure.weight === "medium"}
                    onChange={(e) =>
                      handleChange(
                        e.currentTarget.value,
                        e.currentTarget.name,
                        measure.value,
                        "cl"
                      )
                    }
                  >
                    Medium
                  </ToggleButton>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="high"
                    checked={measure.weight === "high"}
                    onChange={(e) =>
                      handleChange(
                        e.currentTarget.value,
                        e.currentTarget.name,
                        measure.value,
                        "cl"
                      )
                    }
                  >
                    High
                  </ToggleButton>
                </ButtonGroup>
              </div>
            ))}

          {!!customizedMeasures.cl.length &&
            customizedMeasures.cl.map((measure, index) => (
              <div className="m-2" key={measure.name}>
                <span style={{ display: "block" }} className="my-1">
                  {measure.name}
                </span>
                <ButtonGroup toggle>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    data-tip
                    data-for="positive-cl-c"
                    name="utility"
                    value="1"
                    checked={measure.utility === "1"}
                    onChange={(e) => setMeasureUtility("cl", index, "1")}
                  >
                    Higher
                  </ToggleButton>
                  <ReactTooltip id="positive-cl-c" place="top">
                    More is better
                  </ReactTooltip>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    data-tip
                    data-for="negative-cl-c"
                    name="utility"
                    value="-1"
                    checked={measure.utility === "-1"}
                    onChange={(e) => setMeasureUtility("cl", index, "-1")}
                  >
                    Lower
                  </ToggleButton>
                  <ReactTooltip id="negative-cl-c" place="top">
                    Less is better
                  </ReactTooltip>
                </ButtonGroup>
                <ButtonGroup toggle className="ml-2">
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="low"
                    checked={measure.weight === "low"}
                    onChange={(e) => setMeasureWeight("cl", index, "low")}
                  >
                    Low
                  </ToggleButton>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="medium"
                    checked={measure.weight === "medium"}
                    onChange={(e) => setMeasureWeight("cl", index, "medium")}
                  >
                    Medium
                  </ToggleButton>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="high"
                    checked={measure.weight === "high"}
                    onChange={(e) => setMeasureWeight("cl", index, "high")}
                  >
                    High
                  </ToggleButton>
                </ButtonGroup>
              </div>
            ))}

          <br />

          <Container className="add-assess-cont">
            <Button variant="secondary" onClick={() => setDataStep("lcmr")}>
              {arrowIcon} Edit Resources Measures
            </Button>
            <Button variant="primary" onClick={() => setDataStep("eco")}>
              {resilienceSelect ? "Next" : "Skip"}
            </Button>
          </Container>
        </Container>
      )}

      {dataStep === "eco" && (
        <Container>
          <span>Gulf Economy:</span>
          <Select
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            menuPortalTarget={document.body}
            options={[
              { value: "eco1", label: "High Priority Working Lands" },
              { value: "eco2", label: "Commercial Fishery Reliance" },
              { value: "eco3", label: "Recreational Fishery Engagement" },
              {
                value: "eco4",
                label: "Access & Recreation - Number of Access Points",
              },
            ]}
            isMulti
            placeholder="Select Gulf Economy..."
            name="colors"
            isClearable={false}
            className="basic-multi-select"
            classNamePrefix="select"
            value={weights.eco.selected}
            onChange={(selectedOption) => {
              let state;
              if (selectedOption) {
                setEcoSelect(true);
                state = selectedOption.map((selected) => ({
                  ...selected,
                  utility: selected["utility"] || "1",
                  weight: selected["weight"] || "medium",
                }));
              } else {
                setEcoSelect(false);
                state = null;

                handleWeights(0, "eco");
              }

              dispatch(changeMeasures("eco", state));
            }}
          />

          <div style={{ float: "left" }}>
            {plusCircle}
            <span>Customize Measure</span>
          </div>
          <br />
          {weights.eco.selected &&
            weights.eco.selected.map((measure) => (
              <div className="m-2" key={measure.value}>
                <span style={{ display: "block" }} className="my-1">
                  {measure.label}
                </span>
                <ButtonGroup toggle>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    data-tip
                    data-for="more"
                    name="utility"
                    value="-1"
                    checked={measure.utility === "-1"}
                    onChange={(e) =>
                      handleChange(
                        e.currentTarget.value,
                        e.currentTarget.name,
                        measure.value,
                        "eco"
                      )
                    }
                  >
                    Higher
                  </ToggleButton>
                  <ReactTooltip id="more" place="top">
                    More score the better
                  </ReactTooltip>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    data-tip
                    data-for="less"
                    name="utility"
                    value="1"
                    checked={measure.utility === "1"}
                    onChange={(e) =>
                      handleChange(
                        e.currentTarget.value,
                        e.currentTarget.name,
                        measure.value,
                        "eco"
                      )
                    }
                  >
                    Lower
                  </ToggleButton>
                  <ReactTooltip id="less" place="top">
                    Less score the better
                  </ReactTooltip>
                </ButtonGroup>
                <ButtonGroup toggle className="ml-2">
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="low"
                    checked={measure.weight === "low"}
                    onChange={(e) =>
                      handleChange(
                        e.currentTarget.value,
                        e.currentTarget.name,
                        measure.value,
                        "eco"
                      )
                    }
                  >
                    Low
                  </ToggleButton>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="medium"
                    checked={measure.weight === "medium"}
                    onChange={(e) =>
                      handleChange(
                        e.currentTarget.value,
                        e.currentTarget.name,
                        measure.value,
                        "eco"
                      )
                    }
                  >
                    Medium
                  </ToggleButton>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="high"
                    checked={measure.weight === "high"}
                    onChange={(e) =>
                      handleChange(
                        e.currentTarget.value,
                        e.currentTarget.name,
                        measure.value,
                        "eco"
                      )
                    }
                  >
                    High
                  </ToggleButton>
                </ButtonGroup>
              </div>
            ))}

          {!!customizedMeasures.eco.length &&
            customizedMeasures.eco.map((measure, index) => (
              <div className="m-2" key={measure.name}>
                <span style={{ display: "block" }} className="my-1">
                  {measure.name}
                </span>
                <ButtonGroup toggle>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    data-tip
                    data-for="positive-eco-c"
                    name="utility"
                    value="1"
                    checked={measure.utility === "1"}
                    onChange={(e) => setMeasureUtility("eco", index, "1")}
                  >
                    Higher
                  </ToggleButton>
                  <ReactTooltip id="positive-eco-c" place="top">
                    More is better
                  </ReactTooltip>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    data-tip
                    data-for="negative-eco-c"
                    name="utility"
                    value="-1"
                    checked={measure.utility === "-1"}
                    onChange={(e) => setMeasureUtility("eco", index, "-1")}
                  >
                    Lower
                  </ToggleButton>
                  <ReactTooltip id="negative-eco-c" place="top">
                    Less is better
                  </ReactTooltip>
                </ButtonGroup>
                <ButtonGroup toggle className="ml-2">
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="low"
                    checked={measure.weight === "low"}
                    onChange={(e) => setMeasureWeight("eco", index, "low")}
                  >
                    Low
                  </ToggleButton>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="medium"
                    checked={measure.weight === "medium"}
                    onChange={(e) => setMeasureWeight("eco", index, "medium")}
                  >
                    Medium
                  </ToggleButton>
                  <ToggleButton
                    type="radio"
                    variant="outline-secondary"
                    name="weight"
                    value="high"
                    checked={measure.weight === "high"}
                    onChange={(e) => setMeasureWeight("eco", index, "high")}
                  >
                    High
                  </ToggleButton>
                </ButtonGroup>
              </div>
            ))}

          <br />

          <Container className="add-assess-cont">
            <Button variant="secondary" onClick={() => setDataStep("cl")}>
              {arrowIcon} Edit Resilience Measures
            </Button>
            <Button
              variant="primary"
              onClick={() => setAssessStep("reviewAssessSettings")}
            >
              {ecoSelect ? "Next" : "Skip"}
            </Button>
          </Container>
        </Container>
      )}
    </Container>
  );
};

export default SelectDataMeasures;
