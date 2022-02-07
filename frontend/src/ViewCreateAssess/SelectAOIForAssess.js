import React from "react";
import { Button, Container } from "react-bootstrap";
import Select from "react-select";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";

const arrowIcon = <FontAwesomeIcon icon={faArrowLeft} size="lg" />;

const SelectAOIForAssess = ({
  setAssessStep,
  aoiAssembled,
  setAoiAssembled,
  setAlerttext,
  setView,
}) => {
  const aoi = useSelector((state) => state.aoi);

  const handleNext = () => {
    if (aoiAssembled && aoiAssembled.length > 1) {
      setAssessStep("selectRestoreWeights");
    } else {
      setAlerttext("Add at least 2 AOIs for comparison");
      window.setTimeout(() => setAlerttext(false), 4000);
    }
  };

  let aoiList =
    Object.values(aoi).length > 0
      ? Object.values(aoi).map((item) => ({ label: item.name, value: item.id }))
      : [];

  return (
    <Container>
      <h3>Select two or more areas of interest</h3>
      <br />
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
      <Container className="add-assess-cont">
        <Button variant="secondary" onClick={() => setView("viewCurrent")}>
          {arrowIcon} Review/Edit AOIs
        </Button>
        {aoiAssembled && aoiAssembled.length > 1 ? (
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

export default SelectAOIForAssess;
