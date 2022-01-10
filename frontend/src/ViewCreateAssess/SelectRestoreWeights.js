import React, { useState } from "react";
import { Button, Container, Col, Form, Row } from "react-bootstrap";
import { changeGoalWeights } from "../action";
import { useDispatch, useSelector } from "react-redux";
import RangeSlider from "react-bootstrap-range-slider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const arrowIcon = <FontAwesomeIcon icon={faArrowLeft} size="lg" />;

const SelectRestoreWeights = ({ setAssessStep, setAlerttext }) => {
  const weights = useSelector((state) => state.weights);
  const aoi = useSelector((state) => state.aoi);
  const dispatch = useDispatch();

  let sumWeights =
    weights.hab.weight +
    weights.wq.weight +
    weights.lcmr.weight +
    weights.cl.weight +
    weights.eco.weight;

  const handleNext = () => {
    if (sumWeights !== 100) {
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
      <p>RESTORE Goal Weights:</p>
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
        Total Sum:
        {sumWeights !== 100 ? (
          <span className="error-text">{sumWeights}</span>
        ) : (
          sumWeights
        )}
      </span>
      <Container className="add-assess-cont">
        <Button variant="secondary" onClick={() => setAssessStep("selectAOI")}>
          {arrowIcon} Select AOIs
        </Button>
        <Button variant="primary" onClick={() => handleNext()}>
          Select Weights
        </Button>
      </Container>
    </Container>
  );
};

export default SelectRestoreWeights;
