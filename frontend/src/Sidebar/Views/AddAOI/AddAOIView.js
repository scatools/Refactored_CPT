import React, { useEffect, useState } from "react";
import { ButtonGroup, Container, ToggleButton } from "react-bootstrap";
import AddZip from "./AddZip";
import AddBoundary from "./AddBoundary";
import AddDraw from "./AddDraw";
import shp from "shpjs";

const AddAOIView = ({
  setDrawingMode,
  setAoiSelected,
  featureList,
  hucBoundary,
  setHucBoundary,
  hucIDSelected,
  setHucIDSelected,
  setFilterList,
  setReportLink,
  autoDraw,
  stopDraw,
  setView,
  setAlertText,
  setAlertType,
}) => {
  const [inputMode, setInputMode] = useState("");
  const [hucList, setHucList] = useState([]);
  const [hucNameList, setHucNameList] = useState([]);
  const [hucIDList, setHucIDList] = useState([]);
  const [hucNameSelected, setHucNameSelected] = useState([]);
  const [timeoutError, setTimeoutError] = useState(false);

  const timeoutHandler = () => {
    setTimeoutError(true);
  };

  const onLoad = () => {
    // To successfully fetch the zip file, it needs to be in the /public folder
    fetch("HUC12_SCA.zip")
      .then((res) => res.arrayBuffer())
      .then((arrayBuffer) => {
        shp(arrayBuffer).then(function (geojson) {
          // console.log(geojson);
          setHucList(geojson.features);
          // HUC names contain a few unnamed items using their IDs as default names
          // Those will show up at the bottom of the list
          var sortedHucNameArray = geojson.features
            .map((feature) => feature.properties.NAME)
            .sort(function (a, b) {
              return (
                /^[A-Za-z]/.test(b) - /^[A-Za-z]/.test(a) ||
                a.charCodeAt(0) - b.charCodeAt(0)
              );
            });
          setHucNameList(
            sortedHucNameArray.map((name) => ({ value: name, label: name }))
          );
          var sortedHucIDArray = geojson.features
            .map((feature) => feature.properties.HUC12)
            .sort();
          setHucIDList(
            sortedHucIDArray.map((id) => ({ value: id, label: id }))
          );
        });
      });
  };

  useEffect(() => {
    if (inputMode === "draw") {
      setDrawingMode(true);
      autoDraw();
      setAoiSelected(false);
      setReportLink(false);
    }
  }, [inputMode]);

  return (
    <Container>
      <h3 style={{ marginBottom: "20px" }}>
        Define Your Area of Interest (AOI)
      </h3>
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
              stopDraw();
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
              onLoad();
              stopDraw();
            }}
          >
            by Existing Boundary
          </ToggleButton>
        </ButtonGroup>
      </Container>
      <Container className="instruction">
        {inputMode === "" && (
          <p>
            You can define one or more areas of interest by uploading a
            shapefile with one or more areas, choose from an existing set of
            areas of interest like watersheds, or draw your own. Choose the type
            above to get started.
          </p>
        )}
      </Container>
      {inputMode === "draw" && (
        <AddDraw
          setDrawingMode={setDrawingMode}
          setAoiSelected={setAoiSelected}
          featureList={featureList}
          setReportLink={setReportLink}
          autoDraw={autoDraw}
          timeoutError={timeoutError}
          setTimeoutError={setTimeoutError}
          timeoutHandler={timeoutHandler}
          setHucBoundary={setHucBoundary}
          setView={setView}
          setAlertText={setAlertText}
          setAlertType={setAlertType}
        />
      )}

      {inputMode === "shapefile" && (
        <AddZip
          timeoutError={timeoutError}
          setTimeoutError={setTimeoutError}
          timeoutHandler={timeoutHandler}
          setHucBoundary={setHucBoundary}
          setDrawingMode={setDrawingMode}
          setView={setView}
          setAlertText={setAlertText}
          setAlertType={setAlertType}
        />
      )}

      {inputMode === "boundary" && (
        <AddBoundary
          hucList={hucList}
          hucNameList={hucNameList}
          hucIDList={hucIDList}
          hucNameSelected={hucNameSelected}
          setHucNameSelected={setHucNameSelected}
          hucIDSelected={hucIDSelected}
          setHucIDSelected={setHucIDSelected}
          hucBoundary={hucBoundary}
          setHucBoundary={setHucBoundary}
          setFilterList={setFilterList}
          setView={setView}
          setAlertText={setAlertText}
          setAlertType={setAlertType}
        />
      )}
    </Container>
  );
};

export default AddAOIView;
