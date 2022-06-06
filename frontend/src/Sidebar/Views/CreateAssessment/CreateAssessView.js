import React, { useState } from "react";
import SelectAOIForAssess from "./SelectAOIForAssess";
import SelectRestoreWeights from "./SelectRestoreWeights";
import SelectDataMeasures from "./SelectDataMeasures";
import ReviewAssessSettings from "./ReviewAssessSettings";
import { Container } from "react-bootstrap";

const CreateAssessView = ({
  aoiAssembled,
  setAoiAssembled,
  customizedMeasures,
  setView,
  setAlertText,
  setAlertType
}) => {
  const [assessStep, setAssessStep] = useState("selectAOI");

  return (
    <Container>
      {console.log(assessStep)}
      {assessStep === "selectAOI" && (
        <SelectAOIForAssess
          setAssessStep={setAssessStep}
          aoiAssembled={aoiAssembled}
          setAoiAssembled={setAoiAssembled}
          setView={setView}
          setAlertText={setAlertText}
          setAlertType={setAlertType}
        />
      )}

      {assessStep === "selectRestoreWeights" && (
        <SelectRestoreWeights
          setAssessStep={setAssessStep}
          setAlertText={setAlertText}
          setAlertType={setAlertType}
        />
      )}

      {assessStep === "selectDataMeasures" && (
        <SelectDataMeasures
          setAssessStep={setAssessStep}
          aoiAssembled={aoiAssembled}
          customizedMeasures={customizedMeasures}
        />
      )}

      {assessStep === "reviewAssessSettings" && (
        <ReviewAssessSettings
          setAssessStep={setAssessStep}
          aoiAssembled={aoiAssembled}
          customizedMeasures={customizedMeasures}
        />
      )}
    </Container>
  );
};

export default CreateAssessView;
