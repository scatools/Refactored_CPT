import React from "react";
import { Button, Container } from "react-bootstrap";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { MultiSelect } from "../../../Components/MultiSelect";

const arrowIcon = <FontAwesomeIcon icon={faArrowLeft} size="lg" />;

const SelectAOIForAssess = ({
  setAssessStep,
  aoiAssembled,
  setAoiAssembled,
  setView,
  setAlertText,
  setAlertType,
}) => {
  const aoi = useSelector((state) => state.aoi);
  const aoiList = Object.values(aoi).map((item) => ({
    label: item.name,
    value: item.id,
  }));

  const handleNext = () => {
    if (aoiAssembled && aoiAssembled.length > 1) {
      setAssessStep("selectRestoreWeights");
    } else {
      setAlertType("danger");
      setAlertText("Add at least 2 AOIs for comparison");
      window.setTimeout(() => setAlertText(false), 4000);
    }
  };

  return (
    <Container>
      <h3>Select two or more areas of interest</h3>
      <br />
      <MultiSelect
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        menuPortalTarget={document.body}
        options={aoiList}
        isMulti
        isClearable={true}
        placeholder="Select areas of interests..."
        name="colors"
        value={aoiAssembled}
        onChange={(selectedOption) => {
          if (selectedOption) {
            setAoiAssembled(selectedOption);
          } else {
            setAoiAssembled([]);
          }
        }}
        className="basic-multi-select"
        classNamePrefix="select"
      />
      {/* <Select
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        menuPortalTarget={document.body}
        options={aoiList}
        isMulti
        isClearable={true}
        placeholder="Select areas of interests..."
        name="colors"
        value={aoiAssembled}
        onChange={(selectedOption) => {
          if (selectedOption) {
            setAoiAssembled(selectedOption);
          } else {
            setAoiAssembled([]);
          }
        }}
        className="basic-multi-select"
        classNamePrefix="select"
      /> */}
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
