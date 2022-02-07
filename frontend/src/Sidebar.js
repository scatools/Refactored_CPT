import React, { useState } from "react";
import { Alert, Container, Button, Modal } from "react-bootstrap";
import SidebarDismiss from "./SidebarDismiss";
import AddAOIView from "./ViewAddAOI/AddAOIView";
import CurrentAOIView from "./ViewCurrentAOI/CurrentAOIView";
import CreateAssessView from "./ViewCreateAssess/CreateAssessView";
import SidebarMode from "./SidebarMode";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRedo, faExclamationCircle } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";

const arrowIcon = (
  <FontAwesomeIcon
    icon={faRedo}
    color="red"
    size="lg"
    flip="horizontal"
    style={{ paddingLeft: "30px;" }}
  />
);

const alertIcon = (
  <FontAwesomeIcon
    icon={faExclamationCircle}
    color="red"
    style={{ margin: "0 5px;" }}
  />
);

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
  customizedMeasures,
  setHexGrid,
  setHexDeselection,
  hexIDDeselected,
  setHexIDDeselected,
  setHexFilterList,
  userLoggedIn,
  view,
  setView,
}) => {
  const [alerttext, setAlerttext] = useState(false);
  const aoi = useSelector((state) => state.aoi);
  const resetButton = () => {
    window.location.reload(true);
  };
  const [confirmShow, setConfirmShow] = useState(false);

  const confirmClose = () => setConfirmShow(false);
  const showConfirm = () => setConfirmShow(true);

  return (
    <div id="sidebar" className={activeSidebar ? "active" : ""}>
      <SidebarDismiss setActiveSidebar={setActiveSidebar} />
      <div className="ControlWrapper">
        <SidebarMode view={view} setView={setView} />
        <hr />
        {view === "add" && (
          <AddAOIView
            setDrawingMode={setDrawingMode}
            setAoiSelected={setAoiSelected}
            featureList={featureList}
            setAlerttext={setAlerttext}
            hucBoundary={hucBoundary}
            setHucBoundary={setHucBoundary}
            hucIDSelected={hucIDSelected}
            setHucIDSelected={setHucIDSelected}
            setFilterList={setFilterList}
            setReportLink={setReportLink}
            autoDraw={autoDraw}
            setView={setView}
          />
        )}
        {view === "viewCurrent" && (
          <CurrentAOIView
            aoiSelected={aoiSelected}
            setAoiSelected={setAoiSelected}
            setActiveTable={setActiveTable}
            setViewport={setViewport}
            setDrawingMode={setDrawingMode}
            editAOI={editAOI}
            setEditAOI={setEditAOI}
            featureList={featureList}
            setAlerttext={setAlerttext}
            setReportLink={setReportLink}
            setHexGrid={setHexGrid}
            setHexDeselection={setHexDeselection}
            hexIDDeselected={hexIDDeselected}
            setHexIDDeselected={setHexIDDeselected}
            setHexFilterList={setHexFilterList}
            userLoggedIn={userLoggedIn}
            view={view}
            setView={setView}
          />
        )}
        {view === "createAssess" && (
          <CreateAssessView
            aoiAssembled={aoiAssembled}
            setAoiAssembled={setAoiAssembled}
            setAlerttext={setAlerttext}
            customizedMeasures={customizedMeasures}
            setView={setView}
          />
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

      {Object.keys(aoi).length > 0 && (
        <Button
          id="resetButton"
          variant="dark"
          style={{ float: "left" }}
          onClick={showConfirm}
        >
          Start Over {arrowIcon}
        </Button>
      )}

      <Modal show={confirmShow} onHide={confirmClose}>
        <Modal.Header closeButton>
          <Modal.Title>
            <h1>WAIT{alertIcon}</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>This will delete everything you've done so far.</p>
          <p>Are you sure you'd like to continue?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={confirmClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={resetButton}>
            Yes, start over.
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Sidebar;
