import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Card, Container, Button, InputGroup, FormControl, Modal } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { MdViewList, MdEdit, MdDelete, MdSave } from "react-icons/md";
import { HiDocumentReport } from "react-icons/hi";
import { FaFileExport } from "react-icons/fa";
import { download } from "shp-write";
import axios from "axios";
import { delete_aoi, edit_aoi, setLoader } from "../action";
import { calculateArea, aggregate, getStatus } from "../helper/aggregateHex";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faExclamationCircle } from "@fortawesome/free-solid-svg-icons";

const alertIcon = (
  <FontAwesomeIcon
    icon={faExclamationCircle}
    color="red"
    style={{ margin: "0 5px;" }}
  />
);

const SidebarViewDetail = ({
  aoiSelected,
  setActiveTable,
  setDrawingMode,
  editAOI,
  setEditAOI,
  featureList,
  setAlerttext,
  setReportLink,
  setHexGrid,
  setHexDeselection,
  hexIDDeselected,
  setHexIDDeselected,
  setHexFilterList,
  userLoggedIn,
  editMode,
  stopDraw
}) => {
  const aoiList = Object.values(useSelector((state) => state.aoi)).filter(
    (aoi) => aoi.id === aoiSelected
  );
  const dispatch = useDispatch();
  const history = useHistory();
  const [aoiName, setAoiName] = useState("");
  const [modifyButtonState, setModifyButtonState] = useState("modify");
  const [modifyButtonLabel, setModifyButtonLabel] = useState("Modify Shape");
  const [modifyButtonDisabled, setModifyButtonDisabled] = useState(false);
  const [showButtonState, setShowButtonState] = useState("show");
  const [showButtonLabel, setShowButtonLabel] = useState("Show Hexagon Grid");
  const [showButtonDisabled, setShowButtonDisabled] = useState(false);
  const [deselectButtonState, setDeselectButtonState] = useState("deselect");
  const [deselectButtonLabel, setDeselectButtonLabel] = useState("Deselect Hexagon");
  const [deselectButtonDisabled, setDeselectButtonDisabled] = useState(true);
  const [confirmButtonDisabled, setConfirmButtonDisabled] = useState(true);
  const [confirmShow, setConfirmShow] = useState(false);

  const modifyShape = () => {
    if (modifyButtonState === "modify") {
      setModifyButtonState("finalize");
      setModifyButtonLabel("Finalize Shape");
      setConfirmButtonDisabled(true);
      setShowButtonDisabled(true);
      setDrawingMode(true);
      editMode();
    } else {
      setModifyButtonState("modify");
      setModifyButtonLabel("Modify Shape");
      setConfirmButtonDisabled(false);
      stopDraw();
    };
  };

  const handleNameEdit = async () => {
    if (!aoiName) {
      setAlerttext("Name is required.");
    } else {
      dispatch(setLoader(true));
      setEditAOI(false);
      setAlerttext(false);
      dispatch(
        edit_aoi(aoiList[0].id, {
          name: aoiName,
          geometry: aoiList[0].geometry,
          hexagons: aoiList[0].hexagons,
          rawScore: aoiList[0].rawScore,
          scaleScore: aoiList[0].scaleScore,
          speciesName: aoiList[0].speciesName,
          id: aoiList[0].id,
        })
      );
      dispatch(setLoader(false));
    };
  };
  
  const handleBasicEdit = async () => {
    if (!aoiName) {
      setAlerttext("Name is required.");
    } else {
      dispatch(setLoader(true));
      setEditAOI(false);
      setAlerttext(false);
      const newList = featureList;
      const data = {
        type: "MultiPolygon",
        coordinates: newList.map((feature) => feature.geometry.coordinates),
      };
      // console.log(data);

      // For development on local server
      // const res = await axios.post('http://localhost:5000/data', { data });

      // For production on Heroku
      const res = await axios.post(
        "https://sca-cpt-backend.herokuapp.com/data",
        { data }
      );
      const planArea = calculateArea(newList);
      dispatch(
        edit_aoi(aoiList[0].id, {
          name: aoiName,
          geometry: newList && newList.length ? newList : aoiList[0].geometry,
          hexagons:
            newList && newList.length ? res.data.data : aoiList[0].hexagons,
          rawScore:
            newList && newList.length
              ? aggregate(res.data.data, planArea)
              : aoiList[0].rawScore,
          scaleScore: newList.length
            ? getStatus(aggregate(res.data.data, planArea))
            : aoiList[0].scaleScore,
          speciesName: newList.length
            ? res.data.speciesName
            : aoiList[0].speciesName,
          id: aoiList[0].id,
        })
      );
      setDrawingMode(false);
      dispatch(setLoader(false));
    };
  };

  const handleAdvancedEdit = async () => {
    if (!aoiName) {
      setAlerttext("Name is required.");
    } else {
      dispatch(setLoader(true));
      setEditAOI(false);
      setAlerttext(false);
      // Use the unselected hexagons as new geometry to recalculate AOI
      const newList = aoiList[0].hexagons.filter(
        (hexagon) => !hexIDDeselected.includes(hexagon.objectid)
      );
      const data = {
        type: "MultiPolygon",
        coordinates: newList.map((feature) => {
          const geometry = JSON.parse(feature.geometry);
          // Database returns all hexagons intersecting with the input shape, including overlapping and touching
          // Shrink the size of input shapes so that the hexagons only sharing mutual sides won't be involved
          const coordinates = geometry.coordinates[0][0].map(
            (coords, index) => {
              var longitude = coords[0];
              var latitude = coords[1];
              if (index === 0 || index === 6) {
                longitude = coords[0] - 0.0001;
              } else if (index === 1 || index === 2) {
                latitude = coords[1] + 0.0001;
              } else if (index === 3) {
                longitude = coords[0] + 0.0001;
              } else if (index === 4 || index === 5) {
                latitude = coords[1] - 0.0001;
              }
              return [longitude, latitude];
            }
          );

          return [coordinates];
        }),
      };
      // console.log(data);

      // For development on local server
      // const res = await axios.post('http://localhost:5000/data', { data });

      // For production on Heroku
      const res = await axios.post(
        "https://sca-cpt-backend.herokuapp.com/data",
        { data }
      );
      // Keep the original id, name, geometry (also area)
      // Replace the scores with the query result
      const planArea = aoiList[0].rawScore.hab0;
      dispatch(
        edit_aoi(aoiList[0].id, {
          name: aoiName,
          geometry: aoiList[0].geometry,
          hexagons: newList.length ? res.data.data : aoiList[0].hexagons,
          rawScore: newList.length
            ? aggregate(res.data.data, planArea)
            : aoiList[0].rawScore,
          scaleScore: newList.length
            ? getStatus(aggregate(res.data.data, planArea))
            : aoiList[0].scaleScore,
          speciesName: newList.length
            ? res.data.speciesName
            : aoiList[0].speciesName,
          id: aoiList[0].id,
        })
      );
      dispatch(setLoader(false));
    };
  };

  const showHexagon = () => {
    setDrawingMode(false);
    if (showButtonState === "show") {
      setHexGrid(true);
      setShowButtonState("hide");
      setShowButtonLabel("Hide Hexagon Grid");
      setDeselectButtonDisabled(false);
      setModifyButtonDisabled(true);
      setHexIDDeselected([]);
      setHexFilterList([]);
    } else {
      setHexGrid(false);
      setShowButtonState("show");
      setShowButtonLabel("Show Hexagon Grid");
      setDeselectButtonDisabled(true);
    };
  };

  const deselectHexagon = () => {
    setDrawingMode(false);
    if (deselectButtonState === "deselect") {
      setHexDeselection(true);
      setDeselectButtonState("finalize");
      setDeselectButtonLabel("Finalize Hexagon");
      setShowButtonDisabled(true);
      setConfirmButtonDisabled(true);
      setHexIDDeselected([]);
      setHexFilterList([]);
    } else {
      setHexDeselection(false);
      setDeselectButtonState("deselect");
      setDeselectButtonLabel("Deselect Hexagon");
      setShowButtonDisabled(false);
      setConfirmButtonDisabled(false);
    };
  };

  const exitEdit = () => {
    setEditAOI(false);
    setModifyButtonDisabled(false);
    setShowButtonDisabled(false);
    setConfirmButtonDisabled(true);
    // Turn off map editing and reset buttons after cancellation
    stopDraw();
    setDrawingMode(false);
    setModifyButtonState("modify");
    setModifyButtonLabel("Modify Shape");
    // Turn off hex grid layer and reset buttons after cancellation
    setHexGrid(false);
    setShowButtonState("show");
    setShowButtonLabel("Show Hexagon Grid");
    setDeselectButtonDisabled(true);
  };

  const confirmEdit = () => {
    if (featureList.length) {
      handleBasicEdit();
    } else if (hexIDDeselected.length) {
      handleAdvancedEdit();
    } else if (aoiName) {
      handleNameEdit();
    };
    setModifyButtonDisabled(false);
    setShowButtonDisabled(false);
    setConfirmButtonDisabled(true);
    // Turn off hex grid layer and reset buttons after submission
    setHexGrid(false);
    setShowButtonState("show");
    setShowButtonLabel("Show Hexagon Grid");
    setDeselectButtonDisabled(true);
  };

  const saveFile = async () => {
    try {
      // For development on local server
      // const res = await axios.post(
      //   "http://localhost:5000/save/shapefile",
      //   {
      //     file_name: aoiList[0].name,
      //     geometry: aoiList[0].geometry,
      //     username: userLoggedIn
      //   }
      // );

      // For production on Heroku
      const res = await axios.post(
        "https://sca-cpt-backend.herokuapp.com/save/shapefile",
        {
          file_name: aoiList[0].name,
          geometry: aoiList[0].geometry,
          username: userLoggedIn,
        }
      );
      if (res) {
        alert("You have saved " + aoiList[0].name + " in your account.");
      }
    } catch (e) {
      alert("Failed to save the file in your account!");
      console.error(e);
    }
  };

  const confirmClose = () => setConfirmShow(false);
  const showConfirm = () => setConfirmShow(true);

  return (
    <>
      {aoiList && aoiList.length > 0 && (
        <Card id="sidebar-view-detial">
          <Card.Header>Area of Interest Details:</Card.Header>
          <Card.Body>
            <Card.Title>{aoiList[0].name}</Card.Title>
            <ul>
              <li>
                This area of interest has an area of{" "}
                {Math.round(aoiList[0].rawScore.hab0 * 100) / 100} km
                <sup>2</sup>
              </li>
              <li>
                This area of interest contains {aoiList[0].hexagons.length}{" "}
                hexagons
              </li>
            </ul>
            <Container className="detail-buttons mb-2">
              <Button
                variant="dark"
                className="ml-1"
                onClick={() => {
                  setEditAOI(true);
                  setAoiName(aoiList[0].name);
                }}
              >
                <MdEdit /> &nbsp; Edit
              </Button>
              <Button
                variant="dark"
                className="ml-1"
                onClick={() => {
                  setActiveTable(aoiSelected);
                }}
              >
                <MdViewList /> &nbsp; Summary
              </Button>
              <Button
                variant="dark"
                className="ml-1"
                onClick={() => {
                  history.push("/report");
                  setReportLink(true);
                }}
              >
                <HiDocumentReport /> &nbsp; Report
              </Button>
              <Button
                variant="dark"
                className="ml-1"
                onClick={() => {
                  var aoiGeoJson = {
                    type: "FeatureCollection",
                    features: aoiList[0].geometry,
                  };
                  var options = {
                    folder: "Spatial Footprint",
                    types: {
                      polygon: aoiList[0].name,
                    },
                  };
                  download(aoiGeoJson, options);
                }}
              >
                <FaFileExport /> &nbsp; Export
              </Button>
              <Button variant="dark" className="ml-1" onClick={showConfirm}>
                <MdDelete /> &nbsp; Delete
              </Button>
            </Container>
            {userLoggedIn && (
              <Container className="detail-buttons">
                <Button variant="dark" className="ml-1" onClick={saveFile}>
                  <MdSave /> &nbsp; Save to: {userLoggedIn}
                </Button>
              </Container>
            )}
            {editAOI && (
              <>
                <hr />
                <label>Basic Options:</label>
                <br />
                <div className="d-flex justify-content-between">
                  <InputGroup className="mb-3" style={{width: "70%"}}>
                    <InputGroup.Prepend>
                      <InputGroup.Text id="basic-addon1">
                        AOI Name:
                      </InputGroup.Text>
                    </InputGroup.Prepend>
                    <FormControl
                      name="planName"
                      value={aoiName}
                      onChange={(e) => {
                        setAoiName(e.target.value);
                        setConfirmButtonDisabled(false);
                      }}
                      placeholder="Name area of interest here..."
                    />
                  </InputGroup>
                  <Button
                    variant="dark"
                    style={{height:"40px"}}
                    value={modifyButtonState}
                    onClick={modifyShape}
                    disabled={modifyButtonDisabled}
                  >
                    {modifyButtonLabel}
                  </Button>
                </div>
                <hr />
                <label>Advanced Options:</label>
                <br />
                <div className="d-flex justify-content-between">
                  <Button
                    variant="dark"
                    value={showButtonState}
                    onClick={showHexagon}
                    disabled={showButtonDisabled}
                  >
                    {showButtonLabel}
                  </Button>
                  <Button
                    variant="dark"
                    value={deselectButtonState}
                    onClick={deselectHexagon}
                    disabled={deselectButtonDisabled}
                  >
                    {deselectButtonLabel}
                  </Button>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <Button variant="warning" onClick={exitEdit}>
                    Leave Editing
                  </Button>
                  <Button variant="success" onClick={confirmEdit} disabled={confirmButtonDisabled}>
                    Confirm Edits
                  </Button>
                </div>
              </>
            )}
          </Card.Body>
        </Card>
      )}
      {aoiList && aoiList.length > 0 && (
        <Modal show={confirmShow} onHide={confirmClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              <h1>WAIT{alertIcon}</h1>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>This will permanently delete the {aoiList[0].name} AOI.</p>
            <p>Are you sure you'd like to continue?</p>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={confirmClose}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                setActiveTable(false);
                dispatch(delete_aoi(aoiList[0].id));
                setConfirmShow(false);
              }}
            >
              Yes, remove this AOI
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </>
  );
};

export default SidebarViewDetail;
