import React from "react";
import { Button, Container } from "react-bootstrap";
import Select from "react-select";
import { useSelector } from "react-redux";

const SelectAOIForAssess = ({
  setAssessStep,
  aoiAssembled,
  setAoiAssembled,
  setAlerttext,
}) => {
  const aoi = useSelector((state) => state.aoi);

  const handleNext = () => {
    if (aoiAssembled.length < 2) {
      setAlerttext("Add at least 2 AOIs for comparison");
      window.setTimeout(() => setAlerttext(false), 4000);
    } else setAssessStep("selectRestoreWeights");
  };

  let aoiList =
    Object.values(aoi).length > 0
      ? Object.values(aoi).map((item) => ({ label: item.name, value: item.id }))
      : [];

  return (
    <Container>
      Select Areas of Interests:
      <Select
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        menuPortalTarget={document.body}
        options={aoiList}
        isMulti
        isClearable={false}
        placeholder="Select areas of interests..."
        name="colors"
        value={aoiAssembled}
        onChange={(selectedOption) => {
          setAoiAssembled(selectedOption);
        }}
        className="basic-multi-select"
        classNamePrefix="select"
      />
      <br />
      <Button variant="dark" onClick={() => handleNext()}>
        Next
      </Button>
    </Container>
  );
};

export default SelectAOIForAssess;
