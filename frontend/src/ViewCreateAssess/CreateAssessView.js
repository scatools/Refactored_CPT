import React, { useState } from "react";
import {
  Accordion,
  Button,
  ButtonGroup,
  Card,
  Col,
  Form,
  Modal,
  Row,
  Table,
  ToggleButton,
} from "react-bootstrap";
import Select from "react-select";
import {
  changeMeasures,
  changeMeasuresWeight,
  changeGoalWeights,
  generate_assessment,
} from "../action";
import { useDispatch, useSelector } from "react-redux";

import { Redirect, useHistory } from "react-router-dom";
import axios from "axios";
import { GoInfo } from "react-icons/go";
import ReactTooltip from "react-tooltip";
import SelectAOIForAssess from "./SelectAOIForAssess";
import SelectRestoreWeights from "./SelectRestoreWeights";
import SelectDataMeasures from "./SelectDataMeasures";
import ReviewAssessSettings from "./ReviewAssessSettings";

const RESTOREGoal = [
  "Habitat",
  "Water Quality & Quantity",
  "Living Coastal & Marine Resources",
  "Community Resilience",
  "Gulf Economy",
];

const CreateAssessView = () => {
  const weights = useSelector((state) => state.weights);
  const aoi = useSelector((state) => state.aoi);
  let aoiList =
    Object.values(aoi).length > 0
      ? Object.values(aoi).map((item) => ({ label: item.name, value: item.id }))
      : [];
  const dispatch = useDispatch();
  const handleChange = (value, name, label, type) => {
    dispatch(changeMeasuresWeight(value, name, label, type));
  };

  const handleWeights = (value, goal) => {
    const newValue = Number(value) > 100 ? 100 : Number(value);
    dispatch(changeGoalWeights(newValue, goal));
  };

  const [assessStep, setAssessStep] = useState("selectAOI");
  const [aoiSelected, setAoiSelected] = useState([]);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const history = useHistory();

  return (
    <>
      <h2>Create Assesment for Two or More AOIs</h2>
      {console.log(assessStep)}
      {assessStep === "selectAOI" && (
        <SelectAOIForAssess
          setAssessStep={setAssessStep}
          aoiSelected={aoiSelected}
          setAoiSelected={setAoiSelected}
        />
      )}

      {assessStep === "selectRestoreWeights" && (
        <SelectRestoreWeights setAssessStep={setAssessStep} />
      )}

      {assessStep === "selectDataMeasures" && (
        <SelectDataMeasures setAssessStep={setAssessStep} />
      )}

      {assessStep === "reviewAssessSettings" && (
        <ReviewAssessSettings aoiSelected={aoiSelected} />
      )}
    </>
  );
};

export default CreateAssessView;
