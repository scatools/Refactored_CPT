import React, { useState } from "react";
import { Button, ButtonGroup, Container, ToggleButton } from "react-bootstrap";
import Select from "react-select";
import {
  changeMeasures,
  changeMeasuresWeight,
  changeGoalWeights,
} from "../action";
import { useDispatch, useSelector } from "react-redux";
import ReactTooltip from "react-tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const arrowIcon = <FontAwesomeIcon icon={faArrowLeft} size="lg" />;

const SelectDataMeasures = ({ setAssessStep }) => {
  const weights = useSelector((state) => state.weights);
  const [dataStep, setDataStep] = useState("habitat");
  const [habitatSelect, setHabitatSelect] = useState(false);
  const [waterSelect, setWaterSelect] = useState(false);
  const [resourceSelect, setResourceSelect] = useState(false);
  const [resilienceSelect, setResilienceSelect] = useState(false);
  const [ecoSelect, setEcoSelect] = useState(false);
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
      <h3>Data Measures </h3>
      <br />
      {dataStep === "habitat" && (
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
          <br />
          <Container className="add-assess-cont">
            <Button
              variant="secondary"
              onClick={() => setAssessStep("selectRestoreWeights")}
            >
              {arrowIcon} Edit RESTORE Weights
            </Button>
            <Button variant="primary" onClick={() => setDataStep("water")}>
              {habitatSelect ? "Next" : "Skip"}
            </Button>
          </Container>
        </Container>
      )}
      {dataStep === "water" && (
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
                    More
                  </ToggleButton>
                  <ReactTooltip id="More1" place="top">
                    Higher is better
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
                    Less
                  </ToggleButton>
                  <ReactTooltip id="Less1" place="top">
                    Lower is better
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
          <br />
          <Container className="add-assess-cont">
            <Button variant="secondary" onClick={() => setDataStep("habitat")}>
              {arrowIcon} Edit Habitat Measures
            </Button>
            <Button variant="primary" onClick={() => setDataStep("resource")}>
              {waterSelect ? "Next" : "Skip"}
            </Button>
          </Container>
        </Container>
      )}
      {dataStep === "resource" && (
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
                    More
                  </ToggleButton>
                  <ReactTooltip id="More" place="top">
                    More impact less conservations
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
                    Less
                  </ToggleButton>
                  <ReactTooltip id="Less" place="top">
                    Less impact better conservations
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
          <br />
          <Container className="add-assess-cont">
            <Button variant="secondary" onClick={() => setDataStep("water")}>
              {arrowIcon} Edit Water Measures
            </Button>
            <Button variant="primary" onClick={() => setDataStep("resilience")}>
              {resourceSelect ? "Next" : "Skip"}
            </Button>
          </Container>
        </Container>
      )}
      {dataStep === "resilience" && (
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
                    More
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
                    Less
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
          <br />

          <Container className="add-assess-cont">
            <Button variant="secondary" onClick={() => setDataStep("resource")}>
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
                    More
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
                    Less
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
          <br />

          <Container className="add-assess-cont">
            <Button
              variant="secondary"
              onClick={() => setDataStep("resilience")}
            >
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
