import React, { useState } from "react";
import { Button, Container, Col, Form, Row } from "react-bootstrap";
import { changeGoalWeights } from "../action";
import { useDispatch, useSelector } from "react-redux";
import RangeSlider from "react-bootstrap-range-slider";
import { useHistory } from "react-router-dom";
import { HiExternalLink } from "react-icons/hi"

const SelectRestoreWeights = ({ setAssessStep, setAlerttext }) => {
  const weights = useSelector((state) => state.weights);
  const aoi = useSelector((state) => state.aoi);
  const dispatch = useDispatch();

  const handleBack = () => {
    setAssessStep("selectAOI");
  };

  const handleNext = () => {
    if (
      weights.hab.weight +
        weights.wq.weight +
        weights.lcmr.weight +
        weights.cl.weight +
        weights.eco.weight !=
      100
    ) {
      setAlerttext("Make sure all weights add to exactly 100");
      window.setTimeout(() => setAlerttext(false), 4000);
    } else setAssessStep("selectDataMeasures");
  };

  const handleWeights = (value, goal) => {
    const newValue = Number(value) > 100 ? 100 : Number(value);
    dispatch(changeGoalWeights(newValue, goal));
  };

  return (
    <Container>
      <br/>
      <h5>RESTORE Goal Weights:</h5>
      <a href="https://scatoolsuite.gitbook.io/sca-tool-suite/introduction/definitions-acronyms-and-abbreviations"
        target="_blank"
        style={{float:"right"}}
      >
        <HiExternalLink/> &nbsp;
        <em>Learn More about RESTORE Goals</em>
      </a>
      <br/>
      <Form>
        <>
          <span>Habitat:</span>
          <Form.Group as={Row}>
            <Col xs="9">
              <RangeSlider
                step={5}
                value={weights.hab.weight}
                onChange={(e) => handleWeights(e.target.value, "hab")}
                variant="secondary"
              />
            </Col>
            <Col xs="3">
              <Form.Control
                value={weights.hab.weight}
                onChange={(e) => handleWeights(e.target.value, "hab")}
              />
            </Col>
          </Form.Group>
        </>
        <>
          <span>Water Quality & Quantity:</span>
          <Form.Group as={Row}>
            <Col xs="9">
              <RangeSlider
                step={5}
                value={weights.wq.weight}
                onChange={(e) => handleWeights(e.target.value, "wq")}
                variant="secondary"
              />
            </Col>
            <Col xs="3">
              <Form.Control
                value={weights.wq.weight}
                onChange={(e) => handleWeights(e.target.value, "wq")}
              />
            </Col>
          </Form.Group>
        </>
        <>
          <span>Living Coastal & Marine Resources:</span>
          <Form.Group as={Row}>
            <Col xs="9">
              <RangeSlider
                step={5}
                value={weights.lcmr.weight}
                onChange={(e) => handleWeights(e.target.value, "lcmr")}
                variant="secondary"
              />
            </Col>
            <Col xs="3">
              <Form.Control
                value={weights.lcmr.weight}
                onChange={(e) => handleWeights(e.target.value, "lcmr")}
              />
            </Col>
          </Form.Group>
        </>
        <>
          <span>Community Resilience:</span>
          <Form.Group as={Row}>
            <Col xs="9">
              <RangeSlider
                step={5}
                value={weights.cl.weight}
                onChange={(e) => handleWeights(e.target.value, "cl")}
                variant="secondary"
              />
            </Col>
            <Col xs="3">
              <Form.Control
                value={weights.cl.weight}
                onChange={(e) => handleWeights(e.target.value, "cl")}
              />
            </Col>
          </Form.Group>
        </>
        <>
          <span>Gulf Economy:</span>
          <Form.Group as={Row}>
            <Col xs="9">
              <RangeSlider
                step={5}
                value={weights.eco.weight}
                onChange={(e) => handleWeights(e.target.value, "eco")}
                variant="secondary"
              />
            </Col>
            <Col xs="3">
              <Form.Control
                value={weights.eco.weight}
                onChange={(e) => handleWeights(e.target.value, "eco")}
              />
            </Col>
          </Form.Group>
        </>
      </Form>
      <br />
      <label>Total Sum: &nbsp;&nbsp;</label>
      <span>
        <input
          type="text"
          value={
            weights.hab.weight +
            weights.wq.weight +
            weights.lcmr.weight +
            weights.cl.weight +
            weights.eco.weight
          }
          disabled
        ></input>
      </span>
      <br></br>
      <br></br>
      <Button variant="dark" onClick={handleBack} style={{float:"left"}}>
        Back
      </Button>
      <Button variant="dark" onClick={handleNext} style={{float:"right"}}>
        Next
      </Button>
    </Container>
  );
};

export default SelectRestoreWeights;
