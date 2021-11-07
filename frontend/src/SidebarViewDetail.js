import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Card, Container, Button, InputGroup, FormControl } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { MdViewList, MdEdit, MdDelete } from 'react-icons/md';
import { HiDocumentReport } from 'react-icons/hi';
import axios from 'axios';
import { delete_aoi, edit_aoi } from './action';
import { calculateArea, aggregate, getStatus } from './helper/aggregateHex';

const SidebarViewDetail = ({ aoiSelected, setActiveTable, setDrawingMode, editAOI, setEditAOI, featureList, setAlerttext, setReportLink}) => {
	const aoi = Object.values(useSelector((state) => state.aoi)).filter(aoi=>aoi.id===aoiSelected);
	const dispatch = useDispatch();
	const history = useHistory();
	const [ aoiName, setAoiName ] = useState("");
	const handleEdit = async()=>{
		if(!aoiName){
			setAlerttext('Name is required.');
		} else {
			setEditAOI(false);
			setAlerttext(false);
			const newList = featureList;
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
				edit_aoi(aoi[0].id, {
				name: aoiName,
				geometry: newList.length ? newList: aoi[0].geometry,
				hexagons: newList.length ? res.data.data: aoi[0].hexagons ,
				rawScore: newList.length ? aggregate(res.data.data,planArea): aoi[0].rawScore,
				scaleScore: newList.length ? getStatus(aggregate(res.data.data,planArea)): aoi[0].scaleScore,
				id: aoi[0].id})
			);
			setDrawingMode(false);
		}
	}

	return (
		<>
		{aoi && aoi.length>0 &&
		<Card>
			<Card.Header>Area of Interest Details:</Card.Header>
			<Card.Body>
				<Card.Title>{aoi[0].name}</Card.Title>
				<ul>
					<li>This area of interest has an area of {Math.round(aoi[0].rawScore.hab0*100)/100} km<sup>2</sup></li>
					<li>This area of interest contains {aoi[0].hexagons.length} hexagons</li>
				</ul>
				<Container className="m-auto" style={{ width: "80%" }}>
					<Button variant="dark" className="ml-1"
						onClick={()=>{setActiveTable(aoiSelected)}}
					>
						<MdViewList /> &nbsp;
						View
					</Button>
					<Button variant="dark" className="ml-1"
							onClick={()=>{
								setEditAOI(true);
								setDrawingMode(true);
								setAoiName(aoi[0].name);
							}}
					>
						<MdEdit /> &nbsp;
						Edit
					</Button>
					<Button variant="dark" className="ml-1"
						onClick={()=>{
							setActiveTable(false);
							dispatch(delete_aoi(aoi[0].id));
						}}
					>
						<MdDelete /> &nbsp;
						Delete
					</Button>
					<Button variant="dark" className="ml-1"
						onClick={() => {
							history.push("/report");
							setReportLink(true);
						}}
					>
						<HiDocumentReport /> &nbsp;
						Report
					</Button>
				</Container>	
				{editAOI && (
					<>
						<hr/>
						<InputGroup className="mb-3" style={{ width: '60%' }}>
							<InputGroup.Prepend>
								<InputGroup.Text id="basic-addon1">Plan Name:</InputGroup.Text>
							</InputGroup.Prepend>
							<FormControl 
								name="planName"
								value={aoiName}
								onChange={(e)=>{setAoiName(e.target.value)}}
								placeholder="Name area of interest here..."
							/>
						</InputGroup>
						<Button variant="dark"
								onClick={handleEdit}
						>
							Finalize Changes
						</Button>
					</>
				)}								
			</Card.Body>
		</Card>
		}
		</>
		
	);
};

export default SidebarViewDetail;