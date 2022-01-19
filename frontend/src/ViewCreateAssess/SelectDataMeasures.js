import React, { useState } from "react";
import { Button, ButtonGroup, Container, Table, ToggleButton } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";
import ReactTooltip from "react-tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faPlusCircle } from "@fortawesome/free-solid-svg-icons";
import { Label } from "recharts";
import { GoInfo, GoQuestion } from "react-icons/go"
import { FiPlusCircle } from "react-icons/fi"
import { HiExternalLink } from "react-icons/hi"
import { changeMeasures, changeMeasuresWeight, changeGoalWeights } from "../action";

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
  const [economySelect, setEconomySelect] = useState(false);
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
        For each of the previously selected goals, here are data measures associated with each goal.
        <br />
        <br />
        Select each relevant data measure and set your prioritization level (Low, Medium, High)
      </p>
      
      {dataStep === "hab" && (
        <Container>
          <span>Habitat:</span>
          <Select
            styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
            menuPortalTarget={document.body}
            options={[
              { value: "hab1", label: "Connectivity to Existing Protected Area" },
              { value: "hab2", label: "Connectivity of Natural Lands" },
              { value: "hab3", label: "Threat of Urbanization" },
              { value: "hab4", label: "Composition of Priority Natural Lands" }
            ]}
            isMulti
            isClearable={false}
            placeholder="Select Habitat measures..."
            name="colors"
            className="basic-multi-select"
            classNamePrefix="select"
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
          />

          <div style={{ float: "left" }}>
            {plusCircle}
            <span>Add Custom Measure</span>
          </div>
          <br />

          {weights.hab.selected &&
            weights.hab.selected.map((measure) => (
              <div className="m-2 measure-container" key={measure.value}>
                <span style={{ display: "block" }} className="my-1">
                  {measure.label} &nbsp;
                  <GoInfo data-tip data-for={measure.value} />
                  <ReactTooltip id={measure.value} type='dark'>
                    <span>
                      {measure.label==='Connectivity to Existing Protected Area'? 'Connectivity to existing protected area indicates if the proposed conservation area is close to an area classified as protected by PAD-US 2.0 data.':
                      (measure.label==='Connectivity of Natural Lands'? 'A percent attribute that stands for the proportion of area classified as a hub or corridor.':
                      (measure.label==='Threat of Urbanization'? 'Threat of urbanization (ToU) indicates the likelihood of the given project area or area of interest (AoI) being urbanized by the year 2060.':
                      (measure.label==='Composition of Priority Natural Lands'? 'This attribute prioritizes rare habitat types and those that have been identified as conservation priorities in state and regional plans.':
                      "")))}
                    </span>
                  </ReactTooltip>
                </span>
                <div className="utility-btn-cont">
                  <div>
                    <div>
                      <p className="smaller-text no-margin no-padding">
                        Are higher or lower values better?
                      </p>
                    </div>
                    <ButtonGroup className="utility-inner" toggle>
                      <ToggleButton
                        type="radio"
                        data-tip
                        data-for="positive-hab"
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
                        Higher
                      </ToggleButton>
                      <ReactTooltip id="positive-hab" place="top">
                        More is better
                      </ReactTooltip>
                      <ToggleButton
                        type="radio"
                        data-tip
                        data-for="negative-hab"
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
                        Lower
                      </ToggleButton>
                      <ReactTooltip id="less" place="top">
                        Less is better
                      </ReactTooltip>
                    </ButtonGroup>
                  </div>
                  <div>
                    <div>
                      <p className="smaller-text no-margin">
                        Select the priority
                      </p>
                    </div>
                    <ButtonGroup toggle className="ml-2 weight-inner">
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
                </div>
              </div>
            ))
          }

          {!!customizedMeasures.hab.length &&
            customizedMeasures.hab.map((measure, index) => (
              <div className="m-2 measure-container" key={measure.name}>
                <span style={{ display: "block" }} className="my-1">
                  {measure.name}
                </span>
                <div className="utility-btn-cont">
                  <div>
                    <div>
                      <p className="smaller-text no-margin no-padding">
                        Are higher or lower values better?
                      </p>
                    </div>
                    <ButtonGroup className="utility-inner" toggle>
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
                  </div>
                  <div>
                    <div>
                      <p className="smaller-text no-margin">
                        Select the priority
                      </p>
                    </div>
                    <ButtonGroup toggle className="ml-2 weight-inner">
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
                </div>
              </div>
            ))
          }
          
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
              { value: "wq1", label: "303(d): Impaired Watershed Area" },
              { value: "wq2", label: "Hydrologic Response to Land-Use Change" },
              { value: "wq3", label: "Percent Irrigated Agriculture" },
              { value: "wq4", label: "Lateral Connectivity of Floodplain" },
              { value: "wq5", label: "Composition of Riparizan Zone Lands" },
              { value: "wq6", label: "Presence of Impoundments" }
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
            <span>Add Custom Measure</span>
          </div>
          <br />

          {weights.wq.selected &&
            weights.wq.selected.map((measure) => (
              <div className="m-2 measure-container" key={measure.value}>
                <span style={{ display: "block" }} className="my-1">
                  {measure.label} &nbsp;
                  <GoInfo data-tip data-for={measure.value} />
                  <ReactTooltip id={measure.value} type='dark'>
                    <span>
                      {measure.label==='303(d): Impaired Watershed Area'? 'A percent attribute that stands for the proportion of impaired watershed within each hexagon.':
                      (measure.label==='Hydrologic Response to Land-Use Change'? 'The magnitude of change in peak flow due to Land-Use/Land-Cover change from 1996 to 2016.':
                      (measure.label==='Percent Irrigated Agriculture'? 'The proportion (%) of the area of interest that is covered by irrigated agriculture.':
                      (measure.label==='Lateral Connectivity of Floodplain'? 'The proportion of floodplain within the area of interest that is connected.':
                      (measure.label==='Composition of Riparizan Zone Lands'? 'An average index value of the composition of lands within a 100-meter buffer of streams.':
                      (measure.label==='Presence of Impoundments'? 'This measure describes whether or not an area is impacted by hydromodification.':
                      "")))))}
                    </span>
                  </ReactTooltip>
                </span>
                <div className="utility-btn-cont">
                  <div>
                    <div>
                      <p className="smaller-text no-margin no-padding">
                        Are higher or lower values better?
                      </p>
                    </div>
                    <ButtonGroup className="utility-inner" toggle>
                      <ToggleButton
                        type="radio"
                        variant="outline-secondary"
                        data-tip
                        data-for="positive-wq"
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
                        Higher
                      </ToggleButton>
                      <ReactTooltip id="positive-wq" place="top">
                        More is better
                      </ReactTooltip>
                      <ToggleButton
                        type="radio"
                        variant="outline-secondary"
                        data-tip
                        data-for="negative-wq"
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
                        Lower
                      </ToggleButton>
                      <ReactTooltip id="negative-wq" place="top">
                        Less is better
                      </ReactTooltip>
                    </ButtonGroup>
                  </div>
                  <div>
                    <div>
                      <p className="smaller-text no-margin">
                        Select the priority
                      </p>
                    </div>
                    <ButtonGroup toggle className="ml-2 weight-inner">
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
                </div>
              </div>
            ))
          }
            
          {!!customizedMeasures.wq.length &&
            customizedMeasures.wq.map((measure, index) => (
              <div className="m-2 measure-container" key={measure.name}>
                <span style={{ display: "block" }} className="my-1">
                  {measure.name}
                </span>
                <div className="utility-btn-cont">
                  <div>
                    <div>
                      <p className="smaller-text no-margin no-padding">
                        Are higher or lower values better?
                      </p>
                    </div>
                    <ButtonGroup className="utility-inner" toggle>
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
                  </div>
                  <div>
                    <div>
                      <p className="smaller-text no-margin">
                        Select the priority
                      </p>
                    </div>
                    <ButtonGroup toggle className="ml-2 weight-inner">
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
                </div>
              </div>
            ))
          }

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
              { value: "lcmr1", label: "Vulnerable Areas of Terrestrial Endemic Species" },
              { value: "lcmr2", label: "Threatened and Endangered Species - Critical Habitat Area" },
              { value: "lcmr3", label: "Threatened and Endangered Species - Number of Species" },
              { value: "lcmr4", label: "Light Pollution Index" },
              { value: "lcmr5", label: "Terrestrial Vertebrate Biodiversity" },
              { value: "lcmr6", label: "Vulnerability to Invasive Plants" }
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
            <span>Add Custom Measure</span>
          </div>
          <br />
          
          {weights.lcmr.selected &&
            weights.lcmr.selected.map((measure) => (
              <div className="m-2 measure-container" key={measure.value}>
                <span style={{ display: "block" }} className="my-1">
                  {measure.label} &nbsp;
                  <GoInfo data-tip data-for={measure.value} />
                  <ReactTooltip id={measure.value} type='dark'>
                    <span>
                      {measure.label==='Vulnerable Areas of Terrestrial Endemic Species'? 'This measure represents the ratio of endemic species to the amount of protected land in the contiguous U.S.':
                      (measure.label==='Threatened and Endangered Species - Critical Habitat Area'? 'The measure is based on the U.S. Fish and Wildlife Service designated federally threatened and endangered (T&E) critical habitat.':
                      (measure.label==='Threatened and Endangered Species - Number of Species'? 'This attribute measures the number of federally threatened and endangered (T&E) species that have habitat ranges identified within each hexagon.':
                      (measure.label==='Light Pollution Index'? 'An index that measures the intensity of light pollution within each hexagon.':
                      (measure.label==='Terrestrial Vertebrate Biodiversity'? 'Definition of Terrestrial Vertebrate Biodiversity.':
                      (measure.label==='Vulnerability to Invasive Plants'? 'Definition of Vulnerability to Invasive Plants.':
                      "")))))}
                    </span>
                  </ReactTooltip>
                </span>
                <div className="utility-btn-cont">
                  <div>
                    <div>
                      <p className="smaller-text no-margin no-padding">
                        Are higher or lower values better?
                      </p>
                    </div>
                    <ButtonGroup className="utility-inner" toggle>
                      <ToggleButton
                        type="radio"
                        variant="outline-secondary"
                        name="utility"
                        data-tip
                        data-for="positive-lcmr"
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
                        Higher
                      </ToggleButton>
                      <ReactTooltip id="positive-lcmr" place="top">
                        More is better
                      </ReactTooltip>
                      <ToggleButton
                        type="radio"
                        variant="outline-secondary"
                        name="utility"
                        data-tip
                        data-for="negative-lcmr"
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
                        Lower
                      </ToggleButton>
                      <ReactTooltip id="negative-lcmr" place="top">
                        Less is better
                      </ReactTooltip>
                    </ButtonGroup>
                  </div>
                  <div>
                    <div>
                      <p className="smaller-text no-margin">
                        Select the priority
                      </p>
                    </div>
                    <ButtonGroup toggle className="ml-2 weight-inner">
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
                </div>
              </div>
            ))
          }

          {!!customizedMeasures.lcmr.length &&
            customizedMeasures.lcmr.map((measure, index) => (
              <div className="m-2 measure-container" key={measure.name}>
                <span style={{ display: "block" }} className="my-1">
                  {measure.name}
                </span>
                <div className="utility-btn-cont">
                  <div>
                    <div>
                      <p className="smaller-text no-margin no-padding">
                        Are higher or lower values better?
                      </p>
                    </div>
                    <ButtonGroup className="utility-inner" toggle>
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
                  </div>
                  <div>
                    <div>
                      <p className="smaller-text no-margin">
                        Select the priority
                      </p>
                    </div>
                    <ButtonGroup toggle className="ml-2 weight-inner">
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
                </div>
              </div>
            ))
          }

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
              { value: "cl3", label: "Proximity to Socially Vulnerability Communities" },
              { value: "cl4", label: "Community Threat Index" }
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
            <span>Add Custom Measure</span>
          </div>
          <br />

          {weights.cl.selected &&
            weights.cl.selected.map((measure) => (
              <div className="m-2 measure-container" key={measure.value}>
                <span style={{ display: "block" }} className="my-1">
                  {measure.label} &nbsp;
                  <GoInfo data-tip data-for={measure.value} />
                  <ReactTooltip id={measure.value} type='dark'>
                    <span>
                      {measure.label==='National Register of Historic Places'? 'A numeric attribute that represents the counts of historic places within each hexagon.':
                      (measure.label==='National Heritage Area'? 'A percent attribute that stands for the proportion of heritage area within each hexagon.':
                      (measure.label==='Proximity to Socially Vulnerability Communities'? 'This measure indicates the proximity to communities that are socially vulnerable according to the National Oceanic and Atmospheric Administration’s (NOAA) Social Vulnerability Index.':
                      (measure.label==='Community Threat Index'? 'The Community Threat Index (CTI) comes from the Coastal Resilience Evaluation and Siting Tool (CREST).':
                      "")))}
                    </span>
                  </ReactTooltip>
                </span>
                <div className="utility-btn-cont">
                  <div>
                    <div>
                      <p className="smaller-text no-margin no-padding">
                        Are higher or lower values better?
                      </p>
                    </div>
                    <ButtonGroup className="utility-inner" toggle>
                      <ToggleButton
                        type="radio"
                        variant="outline-secondary"
                        data-tip
                        data-for="positive-cl"
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
                        Higher
                      </ToggleButton>
                      <ReactTooltip id="positive-cl" place="top">
                        More score the better
                      </ReactTooltip>
                      <ToggleButton
                        type="radio"
                        variant="outline-secondary"
                        data-tip
                        data-for="negative-cl"
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
                        Lower
                      </ToggleButton>
                      <ReactTooltip id="negative-cl" place="top">
                        Less score the better
                      </ReactTooltip>
                    </ButtonGroup>
                  </div>
                  <div>
                    <div>
                      <p className="smaller-text no-margin">
                        Select the priority
                      </p>
                    </div>
                    <ButtonGroup toggle className="ml-2 weight-inner">
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
                </div>
              </div>
            ))
          }

          {!!customizedMeasures.cl.length &&
            customizedMeasures.cl.map((measure, index) => (
              <div className="m-2 measure-container" key={measure.name}>
                <span style={{ display: "block" }} className="my-1">
                  {measure.name}
                </span>
                <div className="utility-btn-cont">
                  <div>
                    <div>
                      <p className="smaller-text no-margin no-padding">
                        Are higher or lower values better?
                      </p>
                    </div>
                    <ButtonGroup className="utility-inner" toggle>
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
                  </div>
                  <div>
                    <div>
                      <p className="smaller-text no-margin">
                        Select the priority
                      </p>
                    </div>
                    <ButtonGroup toggle className="ml-2 weight-inner">
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
                </div>
              </div>
            ))
          }

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
              { value: "eco2", label: "Commercial Fishing Reliance" },
              { value: "eco3", label: "Recreational Fishing Engagement" },
              { value: "eco4", label: "Access & Recreation - Number of Access Points" }
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
                setEconomySelect(true);
                state = selectedOption.map((selected) => ({
                  ...selected,
                  utility: selected["utility"] || "1",
                  weight: selected["weight"] || "medium",
                }));
              } else {
                setEconomySelect(false);
                state = null;
                handleWeights(0, "eco");
              }
              dispatch(changeMeasures("eco", state));
            }}
          />

          <div style={{ float: "left" }}>
            {plusCircle}
            <span>Add Custom Measure</span>
          </div>
          <br />

          {weights.eco.selected &&
            weights.eco.selected.map((measure) => (
              <div className="m-2 measure-container" key={measure.value}>
                <span style={{ display: "block" }} className="my-1">
                  {measure.label} &nbsp;
                  <GoInfo data-tip data-for={measure.value} />
                  <ReactTooltip id={measure.value} type='dark'>
                    <span>
                      {measure.label==='High Priority Working Lands'? 'The percentage area of pine, cropland, and pasture/hay classes from the National Land Cover Database (NLCD) 2016 classification map.':
                      (measure.label==='Commercial Fishing Reliance'? 'Commercial fishing reliance measures the presence of commercial fishing through fishing activity as shown through permits and vessel landings relative to the population of a community. ':
                      (measure.label==='Recreational Fishing Engagement'? 'Recreational fishing engagement measures the presence of recreational fishing through fishing activity estimates, including charter fishing pressure, private fishing pressure, and shore fishing pressure.':
                      (measure.label==='Access & Recreation - Number of Access Points'? 'This measure indicates the number of points within a 25 km buffer radius of a hexagon, where the public can access places to engage in outdoor recreation.':
                      "")))}
                    </span>
                  </ReactTooltip>
                </span>
                <div className="utility-btn-cont">
                  <div>
                    <div>
                      <p className="smaller-text no-margin no-padding">
                        Are higher or lower values better?
                      </p>
                    </div>
                    <ButtonGroup className="utility-inner" toggle>
                      <ToggleButton
                        type="radio"
                        variant="outline-secondary"
                        data-tip
                        data-for="positive-eco"
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
                        Higher
                      </ToggleButton>
                      <ReactTooltip id="positive-eco" place="top">
                        More score the better
                      </ReactTooltip>
                      <ToggleButton
                        type="radio"
                        variant="outline-secondary"
                        data-tip
                        data-for="negative-eco"
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
                        Lower
                      </ToggleButton>
                      <ReactTooltip id="negative-eco" place="top">
                        Less score the better
                      </ReactTooltip>
                    </ButtonGroup>
                  </div>
                  <div>
                    <div>
                      <p className="smaller-text no-margin">
                        Select the priority
                      </p>
                    </div>
                    <ButtonGroup toggle className="ml-2 weight-inner">
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
                </div>
              </div>
            ))
          }

          {!!customizedMeasures.eco.length &&
            customizedMeasures.eco.map((measure, index) => (
              <div className="m-2 measure-container" key={measure.name}>
                <span style={{ display: "block" }} className="my-1">
                  {measure.name}
                </span>
                <div className="utility-btn-cont">
                  <div>
                    <div>
                      <p className="smaller-text no-margin no-padding">
                        Are higher or lower values better?
                      </p>
                    </div>
                    <ButtonGroup className="utility-inner" toggle>
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
                  </div>
                  <div>
                    <div>
                      <p className="smaller-text no-margin">
                        Select the priority
                      </p>
                    </div>
                    <ButtonGroup toggle className="ml-2 weight-inner">
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
                </div>
              </div>
            ))
          }

          <br />
          <Container className="add-assess-cont">
            <Button variant="secondary" onClick={() => setDataStep("cl")}>
              {arrowIcon} Edit Resilience Measures
            </Button>
            <Button
              variant="primary"
              onClick={() => setAssessStep("reviewAssessSettings")}
            >
              {economySelect ? "Next" : "Skip"}
            </Button>
          </Container>
        </Container>
      )}
    </Container>
  );
};

export default SelectDataMeasures;
