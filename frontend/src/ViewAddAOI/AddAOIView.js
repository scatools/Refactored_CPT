import React, { useState } from "react";
import { ButtonGroup, Container, ToggleButton } from "react-bootstrap";
import AddZip from "./AddZip";
import AddBoundary from "./AddBoundary";
import AddDraw from "./AddDraw";
import shp from "shpjs";

const AddAOIView = ({
  setDrawingMode,
  setAoiSelected,
  featureList,
  setAlerttext,
  setView,
  hucBoundary,
  setHucBoundary,
  hucIDSelected,
  setHucIDSelected,
  setFilterList,
  setReportLink,
}) => {
  const [inputMode, setInputMode] = useState("draw");
  const [hucList, setHucList] = useState([]);
  const [hucNameList, setHucNameList] = useState([]);
  const [hucIDList, setHucIDList] = useState([]);
  const [hucNameSelected, setHucNameSelected] = useState([]);

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
              onLoad();
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
          setReportLink={setReportLink}
        />
      )}

      {inputMode === "shapefile" && (
        <AddZip setAlerttext={setAlerttext} setView={setView} />
      )}

      {inputMode === "boundary" && (
        <AddBoundary
          setAlerttext={setAlerttext}
          setView={setView}
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
        />
      )}
    </>
  );
};

export default AddAOIView;
