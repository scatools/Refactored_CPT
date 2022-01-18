import React, { useState } from "react";
import SelectAOIForAssess from "./SelectAOIForAssess";
import SelectRestoreWeights from "./SelectRestoreWeights";
import SelectDataMeasures from "./SelectDataMeasures";
import ReviewAssessSettings from "./ReviewAssessSettings";
import { Container } from "react-bootstrap";

const CreateAssessView = ({
  setAlerttext,
  aoiAssembled,
  setAoiAssembled,
  setView,
  customizedMeasures,
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
