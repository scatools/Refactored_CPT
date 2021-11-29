import React, { useState } from "react";
import { Alert, Container } from "react-bootstrap";
import SidebarViewDetail from "./SidebarViewDetail";
import SidebarDismiss from "./SidebarDismiss";
import AddAOIView from "./ViewAddAOI/AddAOIView";
import CurrentAOIView from "./ViewCurrentAOI/CurrentAOIView";
import CreateAssessView from "./ViewCreateAssess/CreateAssessView";

const Sidebar = ({
  aoiAssembled,
  setAoiAssembled,
  activeSidebar,
  setActiveSidebar,
  setActiveTable,
  setDrawingMode,
  featureList,
  aoiSelected,
  setAoiSelected,
  editAOI,
  setEditAOI,
  setViewport,
  hucBoundary,
  setHucBoundary,
  hucIDSelected,
  setHucIDSelected,
  setFilterList,
  setReportLink,
  autoDraw,
}) => {
  const [view, setView] = useState("add");
  const [alerttext, setAlerttext] = useState(false);

  return (
    <div id="sidebar" className={activeSidebar ? "active" : ""}>
      <SidebarDismiss setActiveSidebar={setActiveSidebar} />
      <div className="ControlWrapper">
        <hr />
        {view === "add" && (
          <AddAOIView
            setDrawingMode={setDrawingMode}
            setAoiSelected={setAoiSelected}
            featureList={featureList}
            setAlerttext={setAlerttext}
            setView={setView}
            hucBoundary={hucBoundary}
            setHucBoundary={setHucBoundary}
            hucIDSelected={hucIDSelected}
            setHucIDSelected={setHucIDSelected}
            setFilterList={setFilterList}
            setReportLink={setReportLink}
            autoDraw={autoDraw}
          />
        )}
        {view === "viewCurrent" && (
          <Container>
            <CurrentAOIView
              aoiSelected={aoiSelected}
              setAoiSelected={setAoiSelected}
              setViewport={setViewport}
              setView={setView}
            />
            <SidebarViewDetail
              aoiSelected={aoiSelected}
              setActiveTable={setActiveTable}
              setDrawingMode={setDrawingMode}
              editAOI={editAOI}
              setEditAOI={setEditAOI}
              featureList={featureList}
              setAlerttext={setAlerttext}
              setReportLink={setReportLink}
            />
          </Container>
        )}
        {view === "createAssess" && (
          <Container>
            <CreateAssessView
              aoiAssembled={aoiAssembled}
              setAoiAssembled={setAoiAssembled}
              setAlerttext={setAlerttext}
            />
          </Container>
        )}
        {alerttext && (
          <Alert
            className="mt-4"
            variant="danger"
            onClose={() => setAlerttext(false)}
            dismissible
          >
            <Alert.Heading>You've got an error!</Alert.Heading>
            <p style={{ color: "#842029" }}>{alerttext}</p>
          </Alert>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
