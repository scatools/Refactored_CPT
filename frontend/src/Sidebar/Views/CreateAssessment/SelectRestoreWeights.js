import React from "react";
import { Button, Container, Col, Form, Row } from "react-bootstrap";
import { changeGoalWeights } from "../../../Redux/action";
import { useDispatch, useSelector } from "react-redux";
import RangeSlider from "react-bootstrap-range-slider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router-dom";
import { HiExternalLink } from "react-icons/hi";

const arrowIcon = <FontAwesomeIcon icon={faArrowLeft} size="lg" />;

const SelectRestoreWeights = ({
  setAssessStep,
  setAlertText,
  setAlertType,
}) => {
  const weights = useSelector((state) => state.weights);
  const dispatch = useDispatch();

  let sumWeights =
    weights.hab.weight +
    weights.wq.weight +
    weights.lcmr.weight +
    weights.cl.weight +
    weights.eco.weight;

  const handleNext = () => {
    if (sumWeights !== 100) {
      setAlertType("danger");
      setAlertText("Make sure all weights add to exactly 100");
      window.setTimeout(() => setAlertText(false), 4000);
    } else setAssessStep("selectDataMeasures");
  };

  const handleWeights = (value, goal) => {
    const newValue = Number(value) > 100 ? 100 : Number(value);
    dispatch(changeGoalWeights(newValue, goal));
  };

  return (
    <Container>
      <h3>RESTORE Council Goal Weights:</h3>
      <p className="smaller-text">
        Below are the 5 RESTORE Council Goals
        <br />
        Rank them by importance to your organization
        <br />
        <span className="glow">Total must add up to 100</span>
      </p>
      {/* 
      <a href="https://scatoolsuite.gitbook.io/sca-tool-suite/introduction/definitions-acronyms-and-abbreviations"
        target="_blank"
        style={{float:"right"}}
      >
        <em>Learn More about RESTORE Council Goals</em>
      </a>
      <br /> */}
      <Form>
        <>
          <span>Habitat: {weights.hab.weight}</span>
          <Form.Group as={Row}>
            <Col xs="9">
              <RangeSlider
                step={5}
                value={weights.hab.weight}
                onChange={(e) => handleWeights(e.target.value, "hab")}
                variant="secondary"
              />
            </Col>
            {/* <Col xs="3">
              <Form.Control
                value={weights.hab.weight}
                onChange={(e) => handleWeights(e.target.value, "hab")}
              />
            </Col> */}
          </Form.Group>
        </>
        <>
          <span>Water Quality & Quantity: {weights.wq.weight}</span>
          <Form.Group as={Row}>
            <Col xs="9">
              <RangeSlider
                step={5}
                value={weights.wq.weight}
                onChange={(e) => handleWeights(e.target.value, "wq")}
                variant="secondary"
              />
            </Col>
            {/* <Col xs="3">
              <Form.Control
                value={weights.wq.weight}
                onChange={(e) => handleWeights(e.target.value, "wq")}
              />
            </Col> */}
          </Form.Group>
        </>
        <>
          <span>Living Coastal & Marine Resources: {weights.lcmr.weight}</span>
          <Form.Group as={Row}>
            <Col xs="9">
              <RangeSlider
                step={5}
                value={weights.lcmr.weight}
                onChange={(e) => handleWeights(e.target.value, "lcmr")}
                variant="secondary"
              />
            </Col>
            {/* <Col xs="3">
              <Form.Control
                value={weights.lcmr.weight}
                onChange={(e) => handleWeights(e.target.value, "lcmr")}
              />
            </Col> */}
          </Form.Group>
        </>
        <>
          <span>Community Resilience: {weights.cl.weight}</span>
          <Form.Group as={Row}>
            <Col xs="9">
              <RangeSlider
                step={5}
                value={weights.cl.weight}
                onChange={(e) => handleWeights(e.target.value, "cl")}
                variant="secondary"
              />
            </Col>
            {/* <Col xs="3">
              <Form.Control
                value={weights.cl.weight}
                onChange={(e) => handleWeights(e.target.value, "cl")}
              />
            </Col> */}
          </Form.Group>
        </>
        <>
          <span>Gulf Economy: {weights.eco.weight}</span>
          <Form.Group as={Row}>
            <Col xs="9">
              <RangeSlider
                step={5}
                value={weights.eco.weight}
                onChange={(e) => handleWeights(e.target.value, "eco")}
                variant="secondary"
              />
            </Col>
            {/* <Col xs="3">
              <Form.Control
                value={weights.eco.weight}
                onChange={(e) => handleWeights(e.target.value, "eco")}
              />
            </Col> */}
          </Form.Group>
        </>
      </Form>
      <span className="sum-text">
        Total:
        {sumWeights !== 100 ? (
          <span className="error-text">{sumWeights}</span>
        ) : (
          <span className="total-text">{sumWeights}</span>
        )}
      </span>
      <Container className="add-assess-cont">
        <Button variant="secondary" onClick={() => setAssessStep("selectAOI")}>
          {arrowIcon} Select AOIs
        </Button>

        {sumWeights === 100 ? (
          <Button variant="primary" onClick={() => handleNext()}>
            Next
          </Button>
        ) : (
          <Button variant="secondary" disabled onClick={() => handleNext()}>
            Next
          </Button>
        )}
      </Container>
    </Container>
  );
};

export default SelectRestoreWeights;
