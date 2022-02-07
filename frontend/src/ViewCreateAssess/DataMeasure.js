import React, { useState } from "react";
import { Button, ButtonGroup, Container, ToggleButton } from "react-bootstrap";
import Select from "react-select";
import { changeMeasuresWeight, changeGoalWeights } from "../action";
import { useDispatch, useSelector } from "react-redux";
import ReactTooltip from "react-tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const DataMeasure = ({
  dataStep,
  options,
  handleWeights,
  plusCircle,
  changeMeasures,
  handleChange,
  customizedMeasures,
  setMeasureUtility,
  setMeasureWeight,
}) => {
  const weights = useSelector((state) => state.weights);
  const dispatch = useDispatch();

  // For customized data measures

  return (
    <Container>
      <Select
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        menuPortalTarget={document.body}
        options={options[dataStep]}
        isMulti
        isClearable={false}
        placeholder="Select Habitat measures..."
        name="colors"
        value={weights[dataStep].selected}
        onChange={(selectedOption) => {
          let state;
          if (selectedOption) {
            // setHabitatSelect(true);
            state = selectedOption.map((selected) => ({
              ...selected,
              utility: selected["utility"] || "1",
              weight: selected["weight"] || "medium",
            }));
          } else {
            // setHabitatSelect(false);
            state = null;
            handleWeights(0, dataStep);
          }
          dispatch(changeMeasures(dataStep, state));
        }}
        className="basic-multi-select"
        classNamePrefix="select"
      />

      <div style={{ float: "left" }}>
        {plusCircle}
        <span>Add Custom Measures</span>
      </div>

      <br />
      <Container className="utility-wrap">
        {weights[dataStep].selected &&
          weights[dataStep].selected.map((measure) => (
            <div className="m-2 measure-container" key={measure.value}>
              <span style={{ display: "block" }} className="my-1">
                <h4>{measure.label}</h4>
              </span>
              <div className="utility-btn-cont">
                <div>
                  <div>
                    <p className="smaller-text no-margin no-padding">
                      Are higher or lower values better?
                    </p>
                  </div>
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
                          dataStep
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
                          dataStep
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
                          dataStep
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
                          dataStep
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
                          dataStep
                        )
                      }
                    >
                      High
                    </ToggleButton>
                  </ButtonGroup>
                </div>
              </div>
            </div>
          ))}

        {!!customizedMeasures[dataStep].length &&
          customizedMeasures[dataStep].map((measure, index) => (
            <div className="m-2 measure-container" key={measure.name}>
              <span style={{ display: "block" }} className="my-1">
                <h4>{measure.name}</h4>
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
                      data-for={`positive-${dataStep}-c`}
                      name="utility"
                      value="1"
                      checked={measure.utility === "1"}
                      onChange={(e) => setMeasureUtility(dataStep, index, "1")}
                    >
                      Higher
                    </ToggleButton>
                    <ReactTooltip id={`positive-${dataStep}-c`} place="top">
                      More is better
                    </ReactTooltip>
                    <ToggleButton
                      type="radio"
                      variant="outline-secondary"
                      data-tip
                      data-for={`negative-${dataStep}-c`}
                      name="utility"
                      value="-1"
                      checked={measure.utility === "-1"}
                      onChange={(e) => setMeasureUtility(dataStep, index, "-1")}
                    >
                      Lower
                    </ToggleButton>
                    <ReactTooltip id={`negative-${dataStep}-c`} place="top">
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
                      onChange={(e) => setMeasureWeight(dataStep, index, "low")}
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
                        setMeasureWeight(dataStep, index, "medium")
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
                        setMeasureWeight(dataStep, index, "high")
                      }
                    >
                      High
                    </ToggleButton>
                  </ButtonGroup>
                </div>
              </div>
            </div>
          ))}
      </Container>
    </Container>
  );
};

export default DataMeasure;
