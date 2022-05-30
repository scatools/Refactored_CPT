import React, { useState } from "react";
import { Button, ButtonGroup, Container, ToggleButton } from "react-bootstrap";
import Select from "react-select";
import { changeMeasuresWeight, changeGoalWeights } from "../action";
import { useDispatch, useSelector } from "react-redux";
import ReactTooltip from "react-tooltip";

const SingleMeasure = ({ dataStep }) => {
  const weights = useSelector((state) => state.weights);
  const dispatch = useDispatch();

  return <Container></Container>;
};

export default SingleMeasure;
