import React, { useState } from "react";
import { ButtonGroup, Container, ToggleButton } from "react-bootstrap";
import AddZip from "./AddZip";
import AddBoundary from "./AddBoundary";
import AddDraw from "./AddDraw";

const AddAOIView = ({
  setDrawingMode,
  setAoiSelected,
  featureList,
  setAlerttext,
  setView,
}) => {
  const [inputMode, setInputMode] = useState("draw");

  return (
    <>
      <p>Add Area of Interest</p>
      <Container className="d-flex">
        <ButtonGroup toggle className="m-auto">
          <ToggleButton
            type="radio"
            variant="outline-secondary"
            name="draw"
            value="draw"
            checked={inputMode === "draw"}
            onChange={(e) => {
              setAoiSelected(false);
              setInputMode(e.currentTarget.value);
            }}
          >
            by Drawing
          </ToggleButton>
          <ToggleButton
            type="radio"
            variant="outline-secondary"
            name="shapefile"
            value="shapefile"
            checked={inputMode === "shapefile"}
            onChange={(e) => {
              setDrawingMode(false);
              setInputMode(e.currentTarget.value);
            }}
          >
            by Zipped Shapefile
          </ToggleButton>
          <ToggleButton
            type="radio"
            variant="outline-secondary"
            name="boundary"
            value="boundary"
            checked={inputMode === "boundary"}
            onChange={(e) => {
              setDrawingMode(false);
              setInputMode(e.currentTarget.value);
            }}
          >
            by Existing Boundary
          </ToggleButton>
        </ButtonGroup>
      </Container>
      <hr />

      {inputMode === "draw" && (
        <AddDraw
          setDrawingMode={setDrawingMode}
          setAoiSelected={setAoiSelected}
          featureList={featureList}
          setAlerttext={setAlerttext}
          setView={setView}
        />
      )}

      {inputMode === "shapefile" && (
        <AddZip setAlerttext={setAlerttext} setView={setView} />
      )}

      {inputMode === "boundary" && (
        <AddBoundary setAlerttext={setAlerttext} setView={setView} />
      )}
    </>
  );
};

export default AddAOIView;
