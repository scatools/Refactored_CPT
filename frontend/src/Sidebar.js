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
	const [ hucIDSelected, setHucIDSelected ]= useState([]);
	const dispatch = useDispatch();
	
	const handleSubmit = async () => {
    dispatch(setLoader(true));
		if (!drawData) {
			setAlerttext('A name for this area of interest is required.');
		} else if (featureList.length === 0) {
			setAlerttext('At least one polygon is required.');
		} else {
			setAlerttext(false);
			const newList = featureList;
			// console.log(newList);
			const data = {
				type: 'MultiPolygon',
				coordinates: newList.map((feature) => feature.geometry.coordinates)
			};

      // For development on local server
      // const res = await axios.post('http://localhost:5000/data', { data });
      // For production on Heroku
      const res = await axios.post(
        "https://sca-cpt-backend.herokuapp.com/data",
        { data }
      );
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
      setMode("view");
    }

    dispatch(setLoader(false));
  };

  const handleNameChange = (e) => {
    setDrawData(e.target.value);
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const handleSubmitShapefile = async (
        geometry,
        geometryType,
        aoiNumber
      ) => {
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
      const res = await axios.post(
        "https://sca-cpt-backend.herokuapp.com/data",
        { data }
      );
      const planArea = calculateArea(newList);
      dispatch(
        input_aoi({
          name: "Area of Interest " + aoiNumber,
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

    for(let file of acceptedFiles){
      dispatch(setLoader(true));
			const reader = new FileReader();
			reader.onload = async () => {
				const result = await shp(reader.result);
				if (result) {
					// console.log(result.features);
					// Features are stored as [0:{}, 1:{}, 2:{}, ...]
					for (var num in result.features) {
						// Add geometry type as a parameter to cater to both Polygon and MultiPolygon 
						handleSubmitShapefile(result.features[num].geometry, result.features[num].geometry.type, parseInt(num)+1);
					}
				}
			}
			reader.readAsArrayBuffer(file);
		}
		dispatch(setLoader(true));
	}, [dispatch]);

	const onLoad = () => {
		// To successfully fetch the zip file, it needs to be in the /public folder
		fetch('HUC12_SCA.zip').then(res => res.arrayBuffer()).then(arrayBuffer => {
			shp(arrayBuffer).then(function(geojson){
				console.log(geojson);
				setHucList(geojson.features);
				setHucNameList(geojson.features.map((feature) => ({
					value: feature.properties.NAME, 
					label: feature.properties.NAME 
				})))
				setHucIDList(geojson.features.map((feature) => ({ 
					value: feature.properties.HUC12, 
					label: feature.properties.HUC12 
				})))
			});
		});
	};

	const handleSubmitBoundaryAsSingle = async () => {
		if (hucNameSelected.length === 0 && hucIDSelected.length === 0) {
			setAlerttext('At least one of the existing boundaries is required.');
		} else {
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
			const res = await axios.post('https://sca-cpt-backend.herokuapp.com/data', { data });
			const planArea = calculateArea(newList);
			dispatch(
				input_aoi({
					name: 'Watershed Area',
					geometry: newList,
					hexagons: res.data.data,
					rawScore: aggregate(res.data.data, planArea),
					scaleScore: getStatus(aggregate(res.data.data, planArea)),
					id: uuid()
				})
			);
			setMode("view");
		}
	};

	const handleSubmitBoundaryAsMultiple = () => {
		if (hucNameSelected.length === 0 && hucIDSelected.length === 0) {
			setAlerttext('At least one of the existing boundaries is required.');
		} else {
			setAlerttext(false);
			const newList = hucList.filter((feature) => hucNameSelected.map((hucName) => hucName.value).includes(feature.properties.NAME) 
														|| hucIDSelected.map((hucID) => hucID.value).includes(feature.properties.HUC12));
			// console.log(newList);
			newList.forEach(async feature => {
				const data = feature.geometry;
				// For development on local server
				// const res = await axios.post('http://localhost:5000/data', { data });
				// For production on Heroku
				const res = await axios.post('https://sca-cpt-backend.herokuapp.com/data', { data });				
				const planArea = calculateArea(newList);
				// Geometry needs to be a list
				dispatch(
					input_aoi({
						name: 'Watershed Area',
						geometry: [feature],
						hexagons: res.data.data,
						rawScore: aggregate(res.data.data, planArea),
						scaleScore: getStatus(aggregate(res.data.data, planArea)),
						id: uuid()
					})
				);
			});
			setMode("view");
		}
	};

	const dropdownStyles = {
		option: (provided, state) => ({
			...provided,
			color: state.isSelected ? 'white' : 'black',
		}),
		singleValue: (provided, state) => {
			const opacity = state.isDisabled ? 0.5 : 1;		
			return { ...provided, opacity };
		}
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
            <p>Add Area of Interest</p>
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
                  onChange={(e) => setInputMode(e.currentTarget.value)}
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

            {inputMode === 'boundary' && (
							<Container className="m-auto" style={{ width: '80%' }}>
								<div>
									<p style={{ fontSize: '110%' }}>Geographic Scale</p>
									<Select 
										placeholder="Select a scale"
										options = {[
											{ value: 'watershed', label: 'Watershed Coastal Zone' }
										]}
										theme={(theme) => ({
											...theme,
											colors: {
											...theme.colors,
												primary: 'gray',
												primary25: 'lightgray'
											},
										})}
										styles={dropdownStyles}
									/>
								</div>
								<br></br>
								<div>
									<p style={{ fontSize: '110%' }}>Retrieving Options</p>
									<Select 
										placeholder="Select an option"
										options = {[
											{ value: 'hucName', label: 'by HUC 12 Watershed Name' },
											{ value: 'hucID', label: 'by HUC 12 Watershed ID' },
											{ value: 'hucBoundary', label: 'by HUC 12 Watershed Boundary' }
										]}
										theme={(theme) => ({
											...theme,
											colors: {
											...theme.colors,
												primary: 'gray',
												primary25: 'lightgray'
											},
										})}
										styles={dropdownStyles}
										onChange={(e) => setRetrievingOptions(e.value)}
									/>
								</div>
								<br></br>
								{retrievingOptions === 'hucName' && (
									<div>
										<p style={{ fontSize: '110%' }}>Watershed Selection</p>
										<Select 
											// styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
											menuPortalTarget={document.body}										
											options = {hucNameList}
											isMulti
											isClearable={true}
											isSearchable={true}
											placeholder="Select watersheds from the list"
											theme={(theme) => ({
												...theme,
												colors: {
												...theme.colors,
													primary: 'gray',
													primary25: 'lightgray'
												},
											})}
											styles={dropdownStyles}
											value={hucNameSelected}
											onChange={(selectedOption) => {
												setHucNameSelected(selectedOption)
											}}
										/>
									</div>
								)}
								{retrievingOptions === 'hucID' && (
									<div>
										<p style={{ fontSize: '110%' }}>Watershed Selection</p>
										<Select 
											// styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
											menuPortalTarget={document.body}										
											options = {hucIDList}
											isMulti
											isClearable={true}
											isSearchable={true}
											placeholder="Select watersheds from the list"
											theme={(theme) => ({
												...theme,
												colors: {
												...theme.colors,
													primary: 'gray',
													primary25: 'lightgray'
												},
											})}
											styles={dropdownStyles}
											value={hucIDSelected}
											onChange={(selectedOption) => {
												setHucIDSelected(selectedOption)
											}}
										/>
									</div>
								)}
								<br />
								<Button variant="dark" style={{float: "left"}} onClick={handleSubmitBoundaryAsSingle}>
									Add as Single AOI
								</Button>
								<Button variant="dark" style={{float: "right"}} onClick={handleSubmitBoundaryAsMultiple}>
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
