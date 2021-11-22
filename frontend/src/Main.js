import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { Button } from "react-bootstrap";
import { MdMenu } from "react-icons/md";
import Map from "./Map";
import AoiDetailTable from "./AoiDetailTable";

const Main = ({
  aoiSelected,
  setAoiSelected,
  aoiAssembled,
  setAoiAssembled,
  setReportLink,
}) => {
  const [activeSidebar, setActiveSidebar] = useState(false);
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
        />
      </div>
    </div>
  );
};

export default Main;
