import React from "react";
import { Button, ButtonGroup, Container, ToggleButton } from "react-bootstrap";
import Select from "react-select";
import {
  changeMeasures,
  changeMeasuresWeight,
  changeGoalWeights,
} from "../action";
import { useDispatch, useSelector } from "react-redux";
import ReactTooltip from "react-tooltip";

const SelectDataMeasures = ({ setAssessStep }) => {
  const weights = useSelector((state) => state.weights);

  const dispatch = useDispatch();
  const handleChange = (value, name, label, type) => {
    dispatch(changeMeasuresWeight(value, name, label, type));
  };

  const handleWeights = (value, goal) => {
    const newValue = Number(value) > 100 ? 100 : Number(value);
    dispatch(changeGoalWeights(newValue, goal));
  };

  return (
    <Container>
      <br/>
      <h5>Data Measures:</h5>
      <a href="https://scatoolsuite.gitbook.io/sca-tool-suite/introduction/definitions-acronyms-and-abbreviations"
        style={{float:"right"}}
      >
        <em>What are Utility and Weight?</em>
      </a>
      <br/>
      <div>
        <span><b>Habitat:</b></span>
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

        {weights.hab.selected &&
          weights.hab.selected.map((measure) => (
            <div className="m-2" key={measure.value}>
              <span style={{ display: "block" }} className="my-1">
                {measure.label}
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
      </div>
      <br />
      <span><b>Water Quality & Quantity:</b></span>
      <Select
        styles={{ menuPortal: (base, state) => ({ ...base, zIndex: 9999 }) }}
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
      {weights.wq.selected &&
        weights.wq.selected.map((measure) => (
          <div className="m-2" key={measure.value}>
            <span style={{ display: "block" }} className="my-1">
              {measure.label}
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
      <br />
      <span><b>Living Coastal & Marine Resources:</b></span>
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
            label: "Threatened and Endangered Species - Critical Habitat Area ",
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
      {weights.lcmr.selected &&
        weights.lcmr.selected.map((measure) => (
          <div className="m-2" key={measure.value}>
            <span style={{ display: "block" }} className="my-1">
              {measure.label}
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
      <br />
      <span><b>Community Resilience:</b></span>
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
      {weights.cl.selected &&
        weights.cl.selected.map((measure) => (
          <div className="m-2" key={measure.value}>
            <span style={{ display: "block" }} className="my-1">
              {measure.label}
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
      <br />
      <span><b>Gulf Economy:</b></span>
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
      {weights.eco.selected &&
        weights.eco.selected.map((measure) => (
          <div className="m-2" key={measure.value}>
            <span style={{ display: "block" }} className="my-1">
              {measure.label}
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
      <br />
      <Button
        variant="dark"
        onClick={() => setAssessStep("reviewAssessSettings")}
      >
        Next
      </Button>
    </Container>
  );
};

export default SelectDataMeasures;
