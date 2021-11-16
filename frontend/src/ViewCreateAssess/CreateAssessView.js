import React, { useState } from "react";
import SelectAOIForAssess from "./SelectAOIForAssess";
import SelectRestoreWeights from "./SelectRestoreWeights";
import SelectDataMeasures from "./SelectDataMeasures";
import ReviewAssessSettings from "./ReviewAssessSettings";

const CreateAssessView = ({ setAlerttext }) => {
  const [assessStep, setAssessStep] = useState("selectAOI");
  const [aoiSelected, setAoiSelected] = useState([]);

  return (
    <>
      <h2>Create Assesment for Two or More AOIs</h2>
      {console.log(assessStep)}
      {assessStep === "selectAOI" && (
        <SelectAOIForAssess
          setAssessStep={setAssessStep}
          aoiSelected={aoiSelected}
          setAoiSelected={setAoiSelected}
          setAlerttext={setAlerttext}
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
        <ReviewAssessSettings aoiSelected={aoiSelected} />
      )}
    </>
  );
};

export default CreateAssessView;
