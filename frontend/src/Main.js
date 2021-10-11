import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Button } from "react-bootstrap";
import Map from "./Map";
import AoiDetailTable from "./AoiDetailTable";
import { useDispatch } from "react-redux";
import { setLoader } from "./action";
import { store } from "./store";

const Main = (props) => {
  const [activeSidebar, setActiveSidebar] = useState(false);
  const [activeTable, setActiveTable] = useState(null);
  const [drawingMode, setDrawingMode] = useState(false);
  const [featureList, setFeatureList] = useState([]);
  const [aoiSelected, setAoiSelected] = useState(null);
  const [editAOI, setEditAOI] = useState(false);
  const [viewport, setViewport] = useState({
    latitude: 27.8,
    longitude: -88.4,
    zoom: 5,
  });

  const dispatch = useDispatch();

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
        editAOI={editAOI}
        setEditAOI={setEditAOI}
        setViewport={setViewport}
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
          Start
        </Button>
        <Map
          drawingMode={drawingMode}
          setFeatureList={setFeatureList}
          aoiSelected={aoiSelected}
          editAOI={editAOI}
          viewport={viewport}
          setViewport={setViewport}
        />
      </div>
    </div>
  );
};

export default Main;
