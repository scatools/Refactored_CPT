import React, { useState, useCallback } from "react";
import { Alert, Button, ButtonGroup, Container, FormControl, InputGroup, ToggleButton } from "react-bootstrap";
import Select from "react-select";
import SidebarMode from "./SidebarMode";
import SidebarViewGroup from "./SidebarViewGroup";
import SidebarViewDetail from "./SidebarViewDetail";
import SidebarDismiss from "./SidebarDismiss";
import SidebarAssemble from "./SidebarAssemble";
import axios from "axios";
import { calculateArea, aggregate, getStatus } from "./helper/aggregateHex";
import { v4 as uuid } from "uuid";
import { input_aoi } from "./action";
import { setLoader } from "./action";
import { useDispatch } from "react-redux";
import Dropzone from "react-dropzone";
import shp from "shpjs";

const Sidebar = ({
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
	setFilterList
}) => {
	const [ mode, setMode ] = useState('add');
	const [ inputMode, setInputMode ] = useState('draw');
	const [ drawData, setDrawData ] = useState('');
	const [ alerttext, setAlerttext ] = useState(false);
	const [ retrievingOptions, setRetrievingOptions ] = useState('hucBoundary');
	const [ hucList, setHucList ] = useState([]);
	const [ hucNameList, setHucNameList ] = useState([]);
	const [ hucIDList, setHucIDList ] = useState([]);
	const [ hucNameSelected, setHucNameSelected ]= useState([]);
	const dispatch = useDispatch();

  const handleSubmit = async () => {
    if (!drawData) {
      setAlerttext("A name for this area of interest is required.");
    } else if (featureList.length === 0) {
      setAlerttext("At least one polygon is required.");
    } else {
      setAlerttext(false);
      const newList = featureList;
      // console.log(newList);
      const data = {
        type: "MultiPolygon",
        coordinates: newList.map((feature) => feature.geometry.coordinates),
      };

      // For development on local server
      // const res = await axios.post('http://localhost:5000/data', { data });
      // For production on Heroku
      dispatch(setLoader(true));
      const res = await axios.post("https://sca-cpt-backend.herokuapp.com/data", { data });
      const planArea = calculateArea(newList);
      dispatch(
        input_aoi({
          name: drawData,
          geometry: newList,
          hexagons: res.data.data,
          rawScore: aggregate(res.data.data, planArea),
          scaleScore: getStatus(aggregate(res.data.data, planArea)),
          id: uuid(),
        })
      );
      setDrawingMode(false);
      dispatch(setLoader(false));
      setMode("view");
    }
  };

  const handleNameChange = (e) => {
    setDrawData(e.target.value);
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const handleSubmitShapefile = async (geometry, geometryType, aoiNumber, aoiName) => {
        setAlerttext(false);
        // Coordinates must be a single array for the area to be correctly calculated
        const newList = geometry.coordinates.map((coordinates) => ({
          type: "Feature",
          properties: {},
          geometry: {
            type: geometryType,
            coordinates: [coordinates],
          },
        }));
        // console.log(newList);
        const data = geometry;
        // For development on local server
        // const res = await axios.post('http://localhost:5000/data', { data });
        // For production on Heroku
        dispatch(setLoader(true));
        const res = await axios.post("https://sca-cpt-backend.herokuapp.com/data", { data });
        const planArea = calculateArea(newList);
        dispatch(
          input_aoi({
            name: aoiName?aoiName:"Area of Interest " + aoiNumber,
            geometry: newList,
            hexagons: res.data.data,
            rawScore: aggregate(res.data.data, planArea),
            scaleScore: getStatus(aggregate(res.data.data, planArea)),
            id: uuid(),
          })
        );
        dispatch(setLoader(false));
        setMode("view");
      };

      for (let file of acceptedFiles) {
        dispatch(setLoader(true));
        const reader = new FileReader();
        reader.onload = async () => {
          const result = await shp(reader.result);
          if (result) {
            // console.log(result.features);
            // Features are stored as [0:{}, 1:{}, 2:{}, ...]
            for (var num in result.features) {
              var featureGeometry = result.features[num].geometry;
              var featureGeometryType = result.features[num].geometry.type;
              var featureNumber = parseInt(num) + 1;
              var featureName = null;
              // Check if each feature has a name-like property
              for (var property in result.features[num].properties) {
                if (property.indexOf("name") != -1 || 
                    property.indexOf("Name") != -1 || 
                    property.indexOf("NAME") != -1) {
                      featureName = result.features[num].properties[property];
                }                
              }
              // Add geometry type as a parameter to cater to both Polygon and MultiPolygon
              handleSubmitShapefile(
                featureGeometry,
                featureGeometryType,
                featureNumber,
                featureName
              );
            }
          }
        };
        reader.readAsArrayBuffer(file);
      }
      dispatch(setLoader(true));
    },
    [dispatch]
  );

	const onLoad = () => {
		// To successfully fetch the zip file, it needs to be in the /public folder
		fetch('HUC12_SCA.zip').then(res => res.arrayBuffer()).then(arrayBuffer => {
			shp(arrayBuffer).then(function(geojson){
				// console.log(geojson);
				setHucList(geojson.features);
        // HUC names contain a few unnamed items using their IDs as default names
        // Those will show up at the bottom of the list
        var sortedHucNameArray = geojson.features.map((feature) => feature.properties.NAME).sort(function(a, b) {
          return /^[A-Za-z]/.test(b) - /^[A-Za-z]/.test(a) || a.charCodeAt(0) - b.charCodeAt(0)
        });
				setHucNameList(sortedHucNameArray.map((name) => ({value: name, label: name})));
        var sortedHucIDArray = geojson.features.map((feature) => feature.properties.HUC12).sort();
				setHucIDList(sortedHucIDArray.map((id) => ({value: id, label: id})));
			});
		});
	};

	const handleSubmitBoundaryAsSingle = async () => {
		if (hucNameSelected.length === 0 && hucIDSelected.length === 0) {
			setAlerttext('At least one of the existing boundaries is required.');
		} else {
			if (hucBoundary) {
				setHucBoundary(false);
			}
			setAlerttext(false);
			const newList = hucList.filter((feature) => hucNameSelected.map((hucName) => hucName.value).includes(feature.properties.NAME) 
														|| hucIDSelected.map((hucID) => hucID.value).includes(feature.properties.HUC12));
			// console.log(newList);
			const data = {
				type: 'MultiPolygon',
				coordinates: newList.map((feature) => feature.geometry.coordinates)
			};
			
			// For development on local server
			// const res = await axios.post('http://localhost:5000/data', { data });
			// For production on Heroku
      dispatch(setLoader(true));
			const res = await axios.post('https://sca-cpt-backend.herokuapp.com/data', { data });
			const planArea = calculateArea(newList);
			dispatch(
				input_aoi({
					name: 'Combined Watershed Area',
					geometry: newList,
					hexagons: res.data.data,
					rawScore: aggregate(res.data.data, planArea),
					scaleScore: getStatus(aggregate(res.data.data, planArea)),
					id: uuid()
				})
			);
      dispatch(setLoader(false));
			setMode("view");
			setHucNameSelected([]);
			setHucIDSelected([]);
			setFilterList([]);
		}
	};

	const handleSubmitBoundaryAsMultiple = () => {
		if (hucNameSelected.length === 0 && hucIDSelected.length === 0) {
			setAlerttext('At least one of the existing boundaries is required.');
		} else {
			if (hucBoundary) {
				setHucBoundary(false);
			}
			setAlerttext(false);
			const newList = hucList.filter((feature) => hucNameSelected.map((hucName) => hucName.value).includes(feature.properties.NAME) 
														|| hucIDSelected.map((hucID) => hucID.value).includes(feature.properties.HUC12));
			// console.log(newList);
      dispatch(setLoader(true));
			newList.forEach(async feature => {
				const data = feature.geometry;
				// For development on local server
				// const res = await axios.post('http://localhost:5000/data', { data });
				// For production on Heroku
				const res = await axios.post('https://sca-cpt-backend.herokuapp.com/data', { data });				
				const planArea = calculateArea([feature]);
				// Geometry needs to be a list
				dispatch(
					input_aoi({
						name: feature.properties.NAME,
						geometry: [feature],
						hexagons: res.data.data,
						rawScore: aggregate(res.data.data, planArea),
						scaleScore: getStatus(aggregate(res.data.data, planArea)),
						id: uuid()
					})
				);
			});
      dispatch(setLoader(false));
			setMode("view");
			setHucNameSelected([]);
			setHucIDSelected([]);
			setFilterList([]);
		}
	};

  const dropdownStyles = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "white" : "black",
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      return { ...provided, opacity };
    },
  };

  const dropdownStyles2 = {
    option: (provided, state) => ({
      ...provided,
      color: state.isSelected ? "white" : "black",
    }),
    singleValue: (provided, state) => {
      const opacity = state.isDisabled ? 0.5 : 1;
      return { ...provided, opacity };
    },
    menu: (provided, state) => ({
      ...provided,
      bottom: "100%",
      top: "auto",
    }),
    menuPlacement: "auto",
  };

  return (
    <div id="sidebar" className={activeSidebar ? "active" : ""}>
      <SidebarDismiss setActiveSidebar={setActiveSidebar} />
      <div className="ControlWrapper">
        <p>Area of Interest</p>
        <hr />
        <SidebarMode mode={mode} setMode={setMode} />
        <hr />
        {mode === "add" && (
          <div>
            <Container className="d-flex">
              <ButtonGroup toggle className="m-auto">
                <ToggleButton
                  type="radio"
                  variant="outline-secondary"
                  name="draw"
                  value="draw"
                  checked={inputMode === "draw"}
                  onChange={(e) => setInputMode(e.currentTarget.value)}
                >
                  by Drawing
                </ToggleButton>
                <ToggleButton
                  type="radio"
                  variant="outline-secondary"
                  name="shapefile"
                  value="shapefile"
                  checked={inputMode === "shapefile"}
                  onChange={(e) => setInputMode(e.currentTarget.value)}
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
              <Container className="mt-3">
                <InputGroup className="m-auto" style={{ width: "80%" }}>
                  <InputGroup.Prepend>
                    <InputGroup.Text id="basic-addon1">
                      Plan Name:
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    name="planName"
                    value={drawData}
                    onChange={handleNameChange}
                    placeholder="Name area of interest here..."
                  />
                </InputGroup>
                <hr />
                <Container>
                  <Button
                    variant="dark"
                    style={{ float: "left" }}
                    onClick={() => {
                      setDrawingMode(true);
                      setAoiSelected(false);
                    }}
                  >
                    Add a New Shape
                  </Button>
                  <Button
                    variant="dark"
                    style={{ float: "right" }}
                    onClick={handleSubmit}
                  >
                    Finalize Input
                  </Button>
                </Container>
              </Container>
            )}

            {inputMode === "shapefile" && (
              <Container className="m-auto file-drop">
                <Dropzone onDrop={onDrop} accept=".zip">
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      Click me to upload a file!
                    </div>
                  )}
                </Dropzone>
              </Container>
            )}

            {inputMode === "boundary" && (
              <Container className="m-auto" style={{ width: "80%" }}>
                <div>
                  <p style={{ fontSize: "110%" }}>Geographic Scale</p>
                  <Select
                    placeholder="Select a scale"
                    options={[
                      { value: "watershed", label: "Watershed Coastal Zone" },
                    ]}
                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        primary: "gray",
                        primary25: "lightgray",
                      },
                    })}
                    styles={dropdownStyles}
                  />
                </div>
                <br></br>
                <div>
                  <p style={{ fontSize: "110%" }}>Retrieving Options</p>
                  <Select
                    placeholder="Select an option"
                    options={[
                      { value: "hucName", label: "by HUC 12 Watershed Name" },
                      { value: "hucID", label: "by HUC 12 Watershed ID" },
                      { value: "hucBoundary", label: "by HUC 12 Watershed Boundary"}
                    ]}
                    theme={(theme) => ({
                      ...theme,
                      colors: {
                        ...theme.colors,
                        primary: "gray",
                        primary25: "lightgray",
                      },
                    })}
                    styles={dropdownStyles2}
                    onChange={(e) => {
											setRetrievingOptions(e.value);
											setHucNameSelected([]);
											setHucIDSelected([]);
											setFilterList([]);
											if (e.value === 'hucBoundary') {
												setHucBoundary(true);
											} else {
												setHucBoundary(false);
											};
										}}
                  />
                </div>
                <br></br>
                {retrievingOptions === "hucName" && (
                  <div>
                    <p style={{ fontSize: "110%" }}>Watershed Selection</p>
                    <Select
                      options={hucNameList}
                      isMulti
                      isClearable={true}
                      isSearchable={true}
                      placeholder="Select watersheds from the list"
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary: "gray",
                          primary25: "lightgray",
                        },
                      })}
                      styles={dropdownStyles2}
                      value={hucNameSelected}
                      onChange={(selectedOption) => {
                        setHucNameSelected(selectedOption);
                      }}
                    />
                  </div>
                )}
                {retrievingOptions === "hucID" && (
                  <div>
                    <p style={{ fontSize: "110%" }}>Watershed Selection</p>
                    <Select
                      options={hucIDList}
                      isMulti
                      isClearable={true}
                      isSearchable={true}
                      placeholder="Select watersheds from the list"
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary: "gray",
                          primary25: "lightgray",
                        },
                      })}
                      styles={dropdownStyles2}
                      value={hucIDSelected}
                      onChange={(selectedOption) => {
                        setHucIDSelected(selectedOption);
                      }}
                    />
                  </div>
                )}
                <br />
                <Button
                  variant="dark"
                  style={{ float: "left" }}
                  onClick={handleSubmitBoundaryAsSingle}
                >
                  Add as Single AOI
                </Button>
                <Button
                  variant="dark"
                  style={{ float: "right" }}
                  onClick={handleSubmitBoundaryAsMultiple}
                >
                  Add as Multiple AOIs
                </Button>
              </Container>
            )}

            {alerttext && (
              <Alert
                className="mt-4"
                variant="light"
                onClose={() => setAlerttext(false)}
                dismissible
              >
                <p style={{ color: "red" }}>{alerttext}</p>
              </Alert>
            )}
          </div>
        )}

        {mode === "view" && (
          <Container>
            <SidebarViewGroup
              aoiSelected={aoiSelected}
              setAoiSelected={setAoiSelected}
              setViewport={setViewport}
            />
            <SidebarViewDetail
              aoiSelected={aoiSelected}
              setActiveTable={setActiveTable}
              setDrawingMode={setDrawingMode}
              editAOI={editAOI}
              setEditAOI={setEditAOI}
              featureList={featureList}
              setAlerttext={setAlerttext}
            />
          </Container>
        )}

        {mode === "assemble" && (
          <Container>
            <SidebarAssemble />
          </Container>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
