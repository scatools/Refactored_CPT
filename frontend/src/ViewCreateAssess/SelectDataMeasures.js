import React, { useState } from "react";
import { Button, ButtonGroup, Container, Table, ToggleButton } from "react-bootstrap";
import Modal from "react-bootstrap/Modal";
import Select from "react-select";
import { changeMeasures, changeMeasuresWeight, changeGoalWeights } from "../action";
import { useDispatch, useSelector } from "react-redux";
import ReactTooltip from "react-tooltip";
import { GoInfo, GoQuestion } from "react-icons/go"
import { FiPlusCircle } from "react-icons/fi"
import { HiExternalLink } from "react-icons/hi"

const SelectDataMeasures = ({ setAssessStep, aoiAssembled, customizedMeasures }) => {
  const [ show, setShow ] = useState(false);
  const [ restoreGoal, setRestoreGoal ] = useState("");
  const [ inputType, setInputType ] = useState("scaled");
  const [ inputMeasureName, setInputMeasureName ] = useState("");
  const [ inputMeasureValueList, setInputMeasureValueList ] = useState([]);
  const weights = useSelector((state) => state.weights);
  const aoi = useSelector((state) => state.aoi);
  const aoiAssembledList = aoiAssembled.map((aoi) => aoi.value);
  const aoiList = Object.values(aoi).filter((aoi) =>
    aoiAssembledList.includes(aoi.id)
  );
  const dispatch = useDispatch();

  const handleBack = () => {
    setAssessStep("selectRestoreWeights");
  };
  
  const handleNext = () => {
    setAssessStep("reviewAssessSettings");
  };

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
    const customizedMeasureID = goal+"-c"+String(customizedMeasures[goal].length+1);
    customizedMeasures[goal].push({
      name : inputMeasureName,
      value : customizedMeasureID,
      data : inputMeasureValueList,
      utility : "1",
      weight : "medium"
    });
    // console.log(customizedMeasures);
    handleClose();
  };

  const setMeasureUtility = (goal, index, newUtility) => {
    customizedMeasures[goal][index].utility = newUtility;
    // console.log(customizedMeasures);
  }

  const setMeasureWeight = (goal, index, newWeight) => {
    customizedMeasures[goal][index].weight = newWeight;
    // console.log(customizedMeasures);
  }

  return (
    <>
    <Modal centered show={show} onHide={handleClose} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>
          Input Your Customized Measure
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div style={{float:"left"}}>
          <b>Goal:</b> {restoreGoal}
        </div>
        <div className="form-group form-inline" style={{float:"right"}}>
          <b style={{marginRight: '10px'}}>Input Type:</b>
          <select 
            name="inputType"
            value="scaled"
            className="form-control"
            style={{width:"150px", height:"30px", fontSize:"12px"}}
            onChange={(e) => {
              setInputType(e.target.value);
            }}
          >
              <option value="scaled">Scaled Values</option>
              <option value="unscaled">Unscaled Values</option>
          </select>
        </div>
        <br/><br/>
        <Table striped bordered hover size="lg" className="justify-content-md-center text-center">
          <thead>
            <tr>
              <th class="align-top">Measure Name</th>
              {aoiList.map((aoi)=>
                <th class="align-top">Value of {aoi.name}</th>
              )}
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
              {aoiList.map((aoi, index)=>
                <td>
                  <input
                      type="number"
                      onChange={(e) => {
                        inputMeasureValueList[index] = parseFloat(e.target.value);
                      }}
                  />
                </td>
              )}
            </tr>
          </tbody>
        </Table>
        <br/><br/>
        <div className="d-flex justify-content-center text-center">
          <Button
            variant="dark"
            type="submit"
            onClick={() => submitMeasure(restoreGoal)}
          >
            Submit
          </Button>
        </div>
        <br/>
      </Modal.Body>
    </Modal>
    
    <Container>
      <br/>
      <h5>Data Measures:</h5>
      <a href="https://scatoolsuite.gitbook.io/sca-tool-suite/introduction/definitions-acronyms-and-abbreviations"
        target="_blank"
        style={{float:"right"}}
      >
        <GoQuestion/> &nbsp;
        <em>What are Utility and Weight?</em>
      </a>
      <br/>
      <div>
        <span><b>Habitat:</b></span>
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
          value={weights.hab.selected}
          onChange={(selectedOption) => {
            let state;
            if (selectedOption) {
              state = selectedOption.map((selected) => ({
                ...selected,
                utility: selected["utility"] || "1",
                weight: selected["weight"] || "medium",
              }));
            } else {
              state = null;
              handleWeights(0, "hab");
            }
            dispatch(changeMeasures("hab", state));
          }}
          className="basic-multi-select"
          classNamePrefix="select"
        />
        <div style={{float:"left"}}>
          <FiPlusCircle  onClick={() => {
            customizeMeasure("hab");
          }}/> &nbsp;
          <span>Customize Measure</span>
        </div>
        <a href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/habitat"
          target="_blank"
          style={{float:"right"}}
        >
          <HiExternalLink/> &nbsp;
          <em>Learn More</em>
        </a>
        <br/>

        {weights.hab.selected &&
          weights.hab.selected.map((measure) => (
            <div className="m-2" key={measure.value}>
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
              &nbsp;&nbsp; <label>Utility</label> &nbsp;
              <ButtonGroup toggle>
                <ToggleButton
                  type="radio"
                  variant="outline-secondary"
                  data-tip
                  data-for="positive-hab"
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
                  Positive
                </ToggleButton>
                <ReactTooltip id="positive-hab" place="top">
                  More or higher of this measure is desirable
                </ReactTooltip>
                <ToggleButton
                  type="radio"
                  variant="outline-secondary"
                  data-tip
                  data-for="negative-hab"
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
                  Negative
                </ToggleButton>
                <ReactTooltip id="negative-hab" place="top">
                  Less or lower of this measure is desirable
                </ReactTooltip>
              </ButtonGroup>
              &nbsp;&nbsp; <label>Weight</label> &nbsp;
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
              &nbsp;&nbsp; <label>Utility</label> &nbsp;
              <ButtonGroup toggle>
                <ToggleButton
                  type="radio"
                  variant="outline-secondary"
                  data-tip
                  data-for="positive-hab-c"
                  name="utility"
                  value="1"
                  checked={measure.utility === "1"}
                  onChange={(e) =>
                    setMeasureUtility("hab", index, "1")
                  }
                >
                  Positive
                </ToggleButton>
                <ReactTooltip id="positive-hab-c" place="top">
                  More or higher of this measure is desirable
                </ReactTooltip>
                <ToggleButton
                  type="radio"
                  variant="outline-secondary"
                  data-tip
                  data-for="negative-hab-c"
                  name="utility"
                  value="-1"
                  checked={measure.utility === "-1"}
                  onChange={(e) =>
                    setMeasureUtility("hab", index, "-1")
                  }
                >
                  Negative
                </ToggleButton>
                <ReactTooltip id="negative-hab-c" place="top">
                  Less or lower of this measure is desirable
                </ReactTooltip>
              </ButtonGroup>
              &nbsp;&nbsp; <label>Weight</label> &nbsp;
              <ButtonGroup toggle className="ml-2">
                <ToggleButton
                  type="radio"
                  variant="outline-secondary"
                  name="weight"
                  value="low"
                  checked={measure.weight === "low"}
                  onChange={(e) =>
                    setMeasureWeight("hab", index, "low")
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
                    setMeasureWeight("hab", index, "medium")
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
                    setMeasureWeight("hab", index, "high")
                  }
                >
                  High
                </ToggleButton>
              </ButtonGroup>
            </div>
          ))}
      </div>
      <br />


      <span><b>Water Quality & Quantity:</b></span>
      <Select
        styles={{ menuPortal: (base, state) => ({ ...base, zIndex: 9999 }) }}
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
            state = selectedOption.map((selected) => ({
              ...selected,
              utility: selected["utility"] || "1",
              weight: selected["weight"] || "medium",
            }));
          } else {
            state = null;
            handleWeights(0, "wq");
          }

          dispatch(changeMeasures("wq", state));
        }}
      />
      <div style={{float:"left"}}>
        <FiPlusCircle  onClick={() => {
          customizeMeasure("wq");
        }}/> &nbsp;
        <span>Customize Measure</span>
      </div>
      <a href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/waterquality_quantity"
        target="_blank"
        style={{float:"right"}}
      >
        <HiExternalLink/> &nbsp;
        <em>Learn More</em>
      </a>
      <br/>

      {weights.wq.selected &&
        weights.wq.selected.map((measure) => (
          <div className="m-2" key={measure.value}>
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
            &nbsp;&nbsp; <label>Utility</label> &nbsp;
            <ButtonGroup toggle>
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
                Positive
              </ToggleButton>
              <ReactTooltip id="positive-wq" place="top">
                More or higher of this measure is desirable
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
                Negative
              </ToggleButton>
              <ReactTooltip id="negative-wq" place="top">
                Less or lower of this measure is desirable
              </ReactTooltip>
            </ButtonGroup>
            &nbsp;&nbsp; <label>Weight</label> &nbsp;
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
              &nbsp;&nbsp; <label>Utility</label> &nbsp;
              <ButtonGroup toggle>
                <ToggleButton
                  type="radio"
                  variant="outline-secondary"
                  data-tip
                  data-for="positive-wq-c"
                  name="utility"
                  value="1"
                  checked={measure.utility === "1"}
                  onChange={(e) =>
                    setMeasureUtility("wq", index, "1")
                  }
                >
                  Positive
                </ToggleButton>
                <ReactTooltip id="positive-wq-c" place="top">
                  More or higher of this measure is desirable
                </ReactTooltip>
                <ToggleButton
                  type="radio"
                  variant="outline-secondary"
                  data-tip
                  data-for="negative-wq-c"
                  name="utility"
                  value="-1"
                  checked={measure.utility === "-1"}
                  onChange={(e) =>
                    setMeasureUtility("wq", index, "-1")
                  }
                >
                  Negative
                </ToggleButton>
                <ReactTooltip id="negative-wq-c" place="top">
                  Less or lower of this measure is desirable
                </ReactTooltip>
              </ButtonGroup>
              &nbsp;&nbsp; <label>Weight</label> &nbsp;
              <ButtonGroup toggle className="ml-2">
                <ToggleButton
                  type="radio"
                  variant="outline-secondary"
                  name="weight"
                  value="low"
                  checked={measure.weight === "low"}
                  onChange={(e) =>
                    setMeasureWeight("wq", index, "low")
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
                    setMeasureWeight("wq", index, "medium")
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
                    setMeasureWeight("wq", index, "high")
                  }
                >
                  High
                </ToggleButton>
              </ButtonGroup>
            </div>
          ))}
      <br />


      <span><b>Living Coastal & Marine Resources:</b></span>
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
            state = selectedOption.map((selected) => ({
              ...selected,
              utility: selected["utility"] || "1",
              weight: selected["weight"] || "medium",
            }));
          } else {
            state = null;

            handleWeights(0, "lcmr");
          }

          dispatch(changeMeasures("lcmr", state));
        }}
      />
      <div style={{float:"left"}}>
        <FiPlusCircle  onClick={() => {
          customizeMeasure("lcmr");
        }}/> &nbsp;
        <span>Customize Measure</span>
      </div>
      <a href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/lcmr"
        target="_blank"
        style={{float:"right"}}
      >
        <HiExternalLink/> &nbsp;
        <em>Learn More</em>
      </a>
      <br/>

      {weights.lcmr.selected &&
        weights.lcmr.selected.map((measure) => (
          <div className="m-2" key={measure.value}>
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
            &nbsp;&nbsp; <label>Utility</label> &nbsp;
            <ButtonGroup toggle>
              <ToggleButton
                type="radio"
                variant="outline-secondary"
                data-tip
                data-for="positive-lcmr"
                name="utility"
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
                Positive
              </ToggleButton>
              <ReactTooltip id="positive-lcmr" place="top">
                More or higher of this measure is desirable
              </ReactTooltip>
              <ToggleButton
                type="radio"
                variant="outline-secondary"
                data-tip
                data-for="negative-lcmr"
                name="utility"
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
                Negative
              </ToggleButton>
              <ReactTooltip id="negative-lcmr" place="top">
                Less or lower of this measure is desirable
              </ReactTooltip>
            </ButtonGroup>
            &nbsp;&nbsp; <label>Weight</label> &nbsp;
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
              &nbsp;&nbsp; <label>Utility</label> &nbsp;
              <ButtonGroup toggle>
                <ToggleButton
                  type="radio"
                  variant="outline-secondary"
                  data-tip
                  data-for="positive-lcmr-c"
                  name="utility"
                  value="1"
                  checked={measure.utility === "1"}
                  onChange={(e) =>
                    setMeasureUtility("lcmr", index, "1")
                  }
                >
                  Positive
                </ToggleButton>
                <ReactTooltip id="positive-lcmr-c" place="top">
                  More or higher of this measure is desirable
                </ReactTooltip>
                <ToggleButton
                  type="radio"
                  variant="outline-secondary"
                  data-tip
                  data-for="negative-lcmr-c"
                  name="utility"
                  value="-1"
                  checked={measure.utility === "-1"}
                  onChange={(e) =>
                    setMeasureUtility("lcmr", index, "-1")
                  }
                >
                  Negative
                </ToggleButton>
                <ReactTooltip id="negative-lcmr-c" place="top">
                  Less or lower of this measure is desirable
                </ReactTooltip>
              </ButtonGroup>
              &nbsp;&nbsp; <label>Weight</label> &nbsp;
              <ButtonGroup toggle className="ml-2">
                <ToggleButton
                  type="radio"
                  variant="outline-secondary"
                  name="weight"
                  value="low"
                  checked={measure.weight === "low"}
                  onChange={(e) =>
                    setMeasureWeight("lcmr", index, "low")
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
                    setMeasureWeight("lcmr", index, "medium")
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
                    setMeasureWeight("lcmr", index, "high")
                  }
                >
                  High
                </ToggleButton>
              </ButtonGroup>
            </div>
          ))}
      <br />


      <span><b>Community Resilience:</b></span>
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
            state = selectedOption.map((selected) => ({
              ...selected,
              utility: selected["utility"] || "1",
              weight: selected["weight"] || "medium",
            }));
          } else {
            state = null;

            handleWeights(0, "cl");
          }
          dispatch(changeMeasures("cl", state));
        }}
      />
      <div style={{float:"left"}}>
        <FiPlusCircle  onClick={() => {
          customizeMeasure("cl");
        }}/> &nbsp;
        <span>Customize Measure</span>
      </div>
      <a href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/community_resilience"
        target="_blank"
        style={{float:"right"}}
      >
        <HiExternalLink/> &nbsp;
        <em>Learn More</em>
      </a>
      <br/>

      {weights.cl.selected &&
        weights.cl.selected.map((measure) => (
          <div className="m-2" key={measure.value}>
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
            &nbsp;&nbsp; <label>Utility</label> &nbsp;
            <ButtonGroup toggle>
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
                Positive
              </ToggleButton>
              <ReactTooltip id="positive-cl" place="top">
                More or higher of this measure is desirable
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
                Negative
              </ToggleButton>
              <ReactTooltip id="negative-cl" place="top">
                Less or lower of this measure is desirable
              </ReactTooltip>
            </ButtonGroup>
            &nbsp;&nbsp; <label>Weight</label> &nbsp;
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
              &nbsp;&nbsp; <label>Utility</label> &nbsp;
              <ButtonGroup toggle>
                <ToggleButton
                  type="radio"
                  variant="outline-secondary"
                  data-tip
                  data-for="positive-cl-c"
                  name="utility"
                  value="1"
                  checked={measure.utility === "1"}
                  onChange={(e) =>
                    setMeasureUtility("cl", index, "1")
                  }
                >
                  Positive
                </ToggleButton>
                <ReactTooltip id="positive-cl-c" place="top">
                  More or higher of this measure is desirable
                </ReactTooltip>
                <ToggleButton
                  type="radio"
                  variant="outline-secondary"
                  data-tip
                  data-for="negative-cl-c"
                  name="utility"
                  value="-1"
                  checked={measure.utility === "-1"}
                  onChange={(e) =>
                    setMeasureUtility("cl", index, "-1")
                  }
                >
                  Negative
                </ToggleButton>
                <ReactTooltip id="negative-cl-c" place="top">
                  Less or lower of this measure is desirable
                </ReactTooltip>
              </ButtonGroup>
              &nbsp;&nbsp; <label>Weight</label> &nbsp;
              <ButtonGroup toggle className="ml-2">
                <ToggleButton
                  type="radio"
                  variant="outline-secondary"
                  name="weight"
                  value="low"
                  checked={measure.weight === "low"}
                  onChange={(e) =>
                    setMeasureWeight("cl", index, "low")
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
                    setMeasureWeight("cl", index, "medium")
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
                    setMeasureWeight("cl", index, "high")
                  }
                >
                  High
                </ToggleButton>
              </ButtonGroup>
            </div>
          ))}
      <br />


      <span><b>Gulf Economy:</b></span>
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
        placeholder="Select Gulf Economy measures..."
        name="colors"
        isClearable={false}
        className="basic-multi-select"
        classNamePrefix="select"
        value={weights.eco.selected}
        onChange={(selectedOption) => {
          let state;
          if (selectedOption) {
            state = selectedOption.map((selected) => ({
              ...selected,
              utility: selected["utility"] || "1",
              weight: selected["weight"] || "medium",
            }));
          } else {
            state = null;

            handleWeights(0, "eco");
          }

          dispatch(changeMeasures("eco", state));
        }}
      />
      <div style={{float:"left"}}>
        <FiPlusCircle  onClick={() => {
          customizeMeasure("eco");
        }}/> &nbsp;
        <span>Customize Measure</span>
      </div>
      <a href="https://scatoolsuite.gitbook.io/sca-tool-suite/support/economy"
        target="_blank"
        style={{float:"right"}}
      >
        <HiExternalLink/> &nbsp;
        <em>Learn More</em>
      </a>
      <br/>

      {weights.eco.selected &&
        weights.eco.selected.map((measure) => (
          <div className="m-2" key={measure.value}>
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
            &nbsp;&nbsp; <label>Utility</label> &nbsp;
            <ButtonGroup toggle>
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
                Positive
              </ToggleButton>
              <ReactTooltip id="positive-eco" place="top">
                More or higher of this measure is desirable
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
                Negative
              </ToggleButton>
              <ReactTooltip id="negative-eco" place="top">
                Less or lower of this measure is desirable
              </ReactTooltip>
            </ButtonGroup>
            &nbsp;&nbsp; <label>Weight</label> &nbsp;
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
              &nbsp;&nbsp; <label>Utility</label> &nbsp;
              <ButtonGroup toggle>
                <ToggleButton
                  type="radio"
                  variant="outline-secondary"
                  data-tip
                  data-for="positive-eco-c"
                  name="utility"
                  value="1"
                  checked={measure.utility === "1"}
                  onChange={(e) =>
                    setMeasureUtility("eco", index, "1")
                  }
                >
                  Positive
                </ToggleButton>
                <ReactTooltip id="positive-eco-c" place="top">
                  More or higher of this measure is desirable
                </ReactTooltip>
                <ToggleButton
                  type="radio"
                  variant="outline-secondary"
                  data-tip
                  data-for="negative-eco-c"
                  name="utility"
                  value="-1"
                  checked={measure.utility === "-1"}
                  onChange={(e) =>
                    setMeasureUtility("eco", index, "-1")
                  }
                >
                  Negative
                </ToggleButton>
                <ReactTooltip id="negative-eco-c" place="top">
                  Less or lower of this measure is desirable
                </ReactTooltip>
              </ButtonGroup>
              &nbsp;&nbsp; <label>Weight</label> &nbsp;
              <ButtonGroup toggle className="ml-2">
                <ToggleButton
                  type="radio"
                  variant="outline-secondary"
                  name="weight"
                  value="low"
                  checked={measure.weight === "low"}
                  onChange={(e) =>
                    setMeasureWeight("eco", index, "low")
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
                    setMeasureWeight("eco", index, "medium")
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
                    setMeasureWeight("eco", index, "high")
                  }
                >
                  High
                </ToggleButton>
              </ButtonGroup>
            </div>
          ))}
      <br />
      <Button variant="dark" onClick={handleBack} style={{float:"left"}}>
        Back
      </Button>
      <Button variant="dark" onClick={handleNext} style={{float:"right"}}>
        Next
      </Button>
    </Container>
    </>
  );
};

export default SelectDataMeasures;
