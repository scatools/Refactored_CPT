import React, { useState } from "react";
import SelectAOIForAssess from "./SelectAOIForAssess";
import SelectRestoreWeights from "./SelectRestoreWeights";
import SelectDataMeasures from "./SelectDataMeasures";
import ReviewAssessSettings from "./ReviewAssessSettings";

const CreateAssessView = ({
  setAlerttext,
  aoiAssembled,
  setAoiAssembled,
  setView,
  customizedMeasures
}) => {
  const [assessStep, setAssessStep] = useState("selectAOI");

  return (
    <>
      <h2>Create Assesment for Two or More AOIs</h2>
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
        aoiAssembled={aoiAssembled}
        customizedMeasures={customizedMeasures}
        />
      )}
    </>
  );
};

export default CreateAssessView;
