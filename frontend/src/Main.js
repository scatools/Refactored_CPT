import React, { useState, useDispatch } from "react";
import Sidebar from "./Sidebar";
import { Button } from "react-bootstrap";
import { MdMenu } from "react-icons/md";
import Map from "./Map";
import AoiDetailTable from "./AoiDetailTable";
import { DrawPolygonMode } from "react-map-gl-draw";

const Main = ({
  aoiSelected,
  setAoiSelected,
  aoiAssembled,
  setAoiAssembled,
  setReportLink,
}) => {
  const [mode, setMode] = useState(null);
  const [interactiveLayerIds, setInteractiveLayerIds] = useState([]);
  const [activeSidebar, setActiveSidebar] = useState(true);
  const [activeTable, setActiveTable] = useState(null);
  const [drawingMode, setDrawingMode] = useState(false);
  const [featureList, setFeatureList] = useState([]);
  const [editAOI, setEditAOI] = useState(false);
  const [viewport, setViewport] = useState({
    latitude: 27.8,
    longitude: -88.4,
    zoom: 5,
  });
  const [hucBoundary, setHucBoundary] = useState(false);
  const [hucIDSelected, setHucIDSelected] = useState([]);
  const [filterList, setFilterList] = useState([]);

  const autoDraw = async () => {
    setMode(new DrawPolygonMode());
    // Use crosshair as cursor style when drawing new shapes over SCA boundary
    setInteractiveLayerIds(["sca-boundry"]);
  };

  return (
    <div>
      <AoiDetailTable
        activeTable={activeTable}
        setActiveTable={setActiveTable}
      />
      <Sidebar
        activeSidebar={activeSidebar}
        setActiveSidebar={setActiveSidebar}
        setActiveTable={setActiveTable}
        setDrawingMode={setDrawingMode}
        featureList={featureList}
        aoiSelected={aoiSelected}
        setAoiSelected={setAoiSelected}
        aoiAssembled={aoiAssembled}
        setAoiAssembled={setAoiAssembled}
        editAOI={editAOI}
        setEditAOI={setEditAOI}
        setViewport={setViewport}
        hucBoundary={hucBoundary}
        setHucBoundary={setHucBoundary}
        hucIDSelected={hucIDSelected}
        setHucIDSelected={setHucIDSelected}
        setFilterList={setFilterList}
        setReportLink={setReportLink}
        autoDraw={autoDraw}
      />
      <div className="content">
        <Button
          style={{ position: "absolute", top: "20px", left: "50px", zIndex: 1 }}
          className="sidebarControlBtn"
          variant="secondary"
          onClick={() => {
            setActiveSidebar(true);
          }}
        >
          <MdMenu />
        </Button>
        <Map
          drawingMode={drawingMode}
          setFeatureList={setFeatureList}
          aoiSelected={aoiSelected}
          editAOI={editAOI}
          viewport={viewport}
          setViewport={setViewport}
          hucBoundary={hucBoundary}
          hucIDSelected={hucIDSelected}
          filterList={filterList}
          mode={mode}
          setMode={setMode}
          interactiveLayerIds={interactiveLayerIds}
          setInteractiveLayerIds={setInteractiveLayerIds}
          autoDraw={autoDraw}
        />
      </div>
    </div>
  );
};

export default Main;
