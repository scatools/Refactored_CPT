import React, { useState,useCallback } from 'react';
import { Container, ButtonGroup, ToggleButton, FormControl, InputGroup, Button, Alert } from 'react-bootstrap';
import SidebarMode from './SidebarMode';
import SidebarViewGroup from './SidebarViewGroup';
import SidebarViewDetail from './SidebarViewDetail';
import SidebarDismiss from './SidebarDismiss';
import SidebarAssemble from './SidebarAssemble';
import axios from 'axios';
import { calculateArea, aggregate, getStatus } from './helper/aggregateHex';
import { v4 as uuid } from 'uuid';
import { input_aoi } from './action';
import { useDispatch } from 'react-redux';
import Dropzone from 'react-dropzone';
import shp from 'shpjs';

const Sidebar = ({
	activeSidebar,
	setActiveSidebar,
	setActiveTable,
	setDrawingMode,
	featureList,
	aoiSelected,
	setAoiSelected,
	editAOI,
	setEditAOI
}) => {
	const [ mode, setMode ] = useState('add');
	const [ inputMode, setInputMode ] = useState('draw');
	const [ drawData, setDrawData ] = useState('');
	const [ alerttext, setAlerttext ] = useState(false);
	const dispatch = useDispatch();
	const handleSubmit = async () => {
		if (!drawData) {
			setAlerttext('Area of interest name is required.');
		} else if (featureList.length === 0) {
			setAlerttext('At least one polygon is required.');
		} else {
			setAlerttext(false);
			const newList = featureList;
			console.log(featureList);
			const data = {
				type: 'MultiPolygon',
				coordinates: newList.map((feature) => feature.geometry.coordinates)
			};
			const res = await axios.post('http://localhost:5000/data', { data });
			const planArea = calculateArea(newList);
			dispatch(
				input_aoi({
					name: drawData,
					geometry: newList,
					hexagons: res.data.data,
					rawScore: aggregate(res.data.data, planArea),
					scaleScore: getStatus(aggregate(res.data.data, planArea)),
					id: uuid()
				})
			);
			setDrawingMode(false);
			setMode("view");
		}
	};

	const handleNameChange = (e) => {
		setDrawData(e.target.value);
	};

	const onDrop = useCallback(async (acceptedFiles) => {

		const handleSubmitShapefile = async (features) => {
			setAlerttext(false);
			const newList = features.coordinates.map((feature)=>({
				type:"Feature",
				properties: { },
				geometry: {
					type: "Polygon",
					coordinates: feature,
				}
			}))
			const data = features;
			
			const res = await axios.post('http://localhost:5000/data', { data });
			const planArea = calculateArea(newList);
			dispatch(
				input_aoi({
					name: 'area of interest',
					geometry: newList,
					hexagons: res.data.data,
					rawScore: aggregate(res.data.data, planArea),
					scaleScore: getStatus(aggregate(res.data.data, planArea)),
					id: uuid()
				})
			);
		};

		for(let file of acceptedFiles){
		  const reader = new FileReader();
		  console.log(file);
		  
		  reader.onload = async () => {
			// Do whatever you want with the file contents
			const result = await shp(reader.result);
			console.log(result.features[0].geometry);
			if(result){
				handleSubmitShapefile(result.features[0].geometry)
			}
		  }
		  reader.readAsArrayBuffer(file);
		}
		
	  }, [dispatch])

	return (
		<div id="sidebar" className={activeSidebar ? 'active' : ''}>
			<SidebarDismiss setActiveSidebar={setActiveSidebar} />
			<div className="ControlWrapper">
				<p>Area of Interest</p>
				<hr />
				<SidebarMode mode={mode} setMode={setMode} />
				<hr />
				{mode === 'view' && (
					<Container>
						<SidebarViewGroup aoiSelected={aoiSelected} setAoiSelected={setAoiSelected} />
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
				{mode === 'add' && (
					<div>
						<p>Add Area of Interest</p>
						<Container className="d-flex">
							<ButtonGroup toggle className="m-auto">
								<ToggleButton
									type="radio"
									variant="outline-secondary"
									name="draw"
									value="draw"
									checked={inputMode === 'draw'}
									onChange={(e) => setInputMode(e.currentTarget.value)}
								>
									by Drawing
								</ToggleButton>
								<ToggleButton
									type="radio"
									variant="outline-secondary"
									name="shapefile"
									value="shapefile"
									checked={inputMode === 'shapefile'}
									onChange={(e) => setInputMode(e.currentTarget.value)}
								>
									by Zipped Shapefile
								</ToggleButton>
							</ButtonGroup>
						</Container>						
						<hr />

						{inputMode === 'shapefile' && (
							<Container className="m-auto file-drop">
								<Dropzone 
									onDrop={onDrop}
									accept=".zip"
								>
									{({ getRootProps, getInputProps }) => (
										<div {...getRootProps()}>
											<input {...getInputProps()} />
											Click me to upload a file!
										</div>
									)}
								</Dropzone>
							</Container>
						)}

						{inputMode === 'draw' && (
							<Container className="mt-3">
								<InputGroup className="m-auto" style={{ width: '80%' }}>
									<InputGroup.Prepend>
										<InputGroup.Text id="basic-addon1">Plan Name:</InputGroup.Text>
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
										style={{float: "left"}}
										onClick={() => {
											setDrawingMode(true);
											setAoiSelected(false);
										}}
									>
										Add a New Shape
									</Button>
									<Button variant="dark" style={{float: "right"}} onClick={handleSubmit}>
										Finalize Input
									</Button>
								</Container>
							</Container>
						)}

                        {alerttext && (
							<Alert
								className="mt-4"
								variant="light"
								onClose={() => setAlerttext(false)}
								dismissible
							>
								<p style={{ color: 'red' }}>{alerttext}</p>
							</Alert>
						)}
					</div>
				)}
				{mode === 'assemble' && (
					<Container>
						<SidebarAssemble />
					</Container>
				)}
			</div>
		</div>
	);
};

export default Sidebar;
