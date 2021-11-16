import React, { useState } from "react";
import { Button, Container } from "react-bootstrap";
import Select from "react-select";
import { useDispatch, useSelector } from "react-redux";

import { Redirect, useHistory } from "react-router-dom";

const SelectAOIForAssess = ({ setAssessStep, setAoiSelected, aoiSelected }) => {
  const aoi = useSelector((state) => state.aoi);
  let aoiList =
    Object.values(aoi).length > 0
      ? Object.values(aoi).map((item) => ({ label: item.name, value: item.id }))
      : [];
  const dispatch = useDispatch();

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
        value={aoiSelected}
        onChange={(selectedOption) => {
          setAoiSelected(selectedOption);
        }}
        className="basic-multi-select"
        classNamePrefix="select"
      />
      <br />
      <Button
        variant="dark"
        onClick={() => setAssessStep("selectRestoreWeights")}
      >
        Next
      </Button>
    </Container>
  );
};

export default SelectAOIForAssess;
