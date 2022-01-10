import React, { useState } from "react";
import SelectAOIForAssess from "./SelectAOIForAssess";
import SelectRestoreWeights from "./SelectRestoreWeights";
import SelectDataMeasures from "./SelectDataMeasures";
import ReviewAssessSettings from "./ReviewAssessSettings";
import { Button, Container } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const arrowIcon = <FontAwesomeIcon icon={faArrowLeft} size="lg" />;

const CreateAssessView = ({
  setAlerttext,
  aoiAssembled,
  setAoiAssembled,
  setView,
}) => {
  const [assessStep, setAssessStep] = useState("selectAOI");

  return (
    <Container>
      <h3>Evaluate AOIs</h3>
      {console.log(assessStep)}
      {assessStep === "selectAOI" && (
        <SelectAOIForAssess
          setAssessStep={setAssessStep}
          aoiAssembled={aoiAssembled}
          setAoiAssembled={setAoiAssembled}
          setAlerttext={setAlerttext}
          setView={setView}
        />
      )}

      {assessStep === "selectRestoreWeights" && (
        <SelectRestoreWeights
          setAssessStep={setAssessStep}
          setAlerttext={setAlerttext}
        />
      )}

      {assessStep === "selectDataMeasures" && (
        <SelectDataMeasures setAssessStep={setAssessStep} />
      )}

      {assessStep === "reviewAssessSettings" && (
        <ReviewAssessSettings
          setAssessStep={setAssessStep}
          aoiAssembled={aoiAssembled}
        />
      )}
    </Container>
  );
};

export default CreateAssessView;
