import React, { useState } from 'react';
import { Container, Dropdown, DropdownButton, Row } from 'react-bootstrap';
import MapGL, { Source, Layer, WebMercatorViewport } from 'react-map-gl';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { FaChrome } from 'react-icons/fa';
import bbox from "@turf/bbox";
// import axios from 'axios';
import AssessmentTable from './AssessmentTable';
import AssessmentScoreTable from './AssessmentScoreTable';
import UserDefinedResult from './UserDefinedResult';
import MCDAResult from './MCDAResult';
import PDFDownloader from './PDFDownloader';
import Appendix from './Appendix';
import Legend from './Legend';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2h1Y2swNTIwIiwiYSI6ImNrMDk2NDFhNTA0bW0zbHVuZTk3dHQ1cGUifQ.dkjP73KdE6JMTiLcUoHvUA';

const Assessment = ({ aoiAssembled }) => {
	const assessment = useSelector(state => state.assessment);
	const aoi = useSelector((state) => state.aoi);
	const aoiAssembledList = aoiAssembled.map(aoi => aoi.value);
	// Constant aoi contains all the AOIs provided so those not assembled need to be filtered out
	const aoiList = Object.values(aoi).filter(aoi => aoiAssembledList.includes(aoi.id));
	// console.log(aoiList);
	// Up to 10 colors for 10 different AOIs
	const aoiColors = ["#00188f", "#00bcf2", "#00b294", "#009e49", "#bad80a", "#fff100", "#ff8c00", "#e81123", "#ec008c", "#68217a"];
	var aoiAssembly = [];
	
	// AOIs are stored as [0:{}, 1:{}, 2:{}, ...]
	for (var num in aoiList) {
		aoiAssembly = aoiAssembly.concat(aoiList[num].geometry);
	}
	// Use the set of all selected AOIs to calculate the bounding box
	var aoiBbox = bbox({
		type: 'FeatureCollection',
		features: aoiAssembly
	});
	// Format of the bounding box needs to be an array of two opposite corners ([[lon,lat],[lon,lat]])
	var viewportBbox = [[aoiBbox[0],aoiBbox[1]],[aoiBbox[2],aoiBbox[3]]];
	// Use WebMercatorViewport to get center longitude/latitude and zoom level
	var newViewport = new WebMercatorViewport({ width: 800, height: 600}).fitBounds(viewportBbox, { padding: 200 });
	// console.log(newViewport);

	const [ viewport, setViewport ] = useState({ 
		latitude: newViewport.latitude, 
		longitude: newViewport.longitude, 
		zoom: newViewport.zoom 
	});

	if(!assessment.hasOwnProperty('aoi')){
		return <Redirect to="/"/>
	}

	// Download HTML report

	// Download from backend
	// const downloadHTML = async () =>{
	// For development on local server
	// 	const result = await axios.get('http://localhost:5000/report');
	// For production on Heroku
	// 	const result = await axios.get('https://sca-cpt-backend.herokuapp.com/report');
	// 	const url = window.URL.createObjectURL(new Blob([result.data]));
	// 	console.log(url);
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.setAttribute('download', 'file.html');
    //     document.body.appendChild(link);
    //     link.click();
	// }

	// Download from frontend	
	const downloadHTML = () =>{		
		var pageHTMLObject = document.getElementsByClassName("container")[0];
		var pageHTML = pageHTMLObject.outerHTML;
		var tempElement = document.createElement('a');

		tempElement.href = 'data:text/html;charset=UTF-8,' + encodeURIComponent(pageHTML);
		tempElement.target = '_blank';
		tempElement.download = 'assessment.html';
		tempElement.click();
	}

	return (
		<>		
		<div className="assessmentDownload">
			<DropdownButton id="assessmentDownloadButton" variant="dark" title="Download Assessment">
				<Dropdown.Item variant="dark" onClick={downloadHTML}>
					<FaChrome /> &nbsp;
					Download as HTML
				</Dropdown.Item>
				<PDFDownloader downloadFileName="Assessment" rootElementId="assessmentOverview" />
			</DropdownButton>			
		</div>
		
		<div id="assessmentOverview">
			<div className="assessmentNav">
				<a href="#data">Data Summary</a>			
				<a href="#score">Overall Scores</a>
				<a href="#mcda">MCDA Results</a>
				<a href="#appendix">Appendix</a>
			</div>
			<Container style={{position:"relative", top:"100px"}}>				
				<Row id="heading">
					<h2>Data Summary:</h2>			
				</Row>
				<br/>
				<Row id="mapHeading">
					<h4>Spatial Footprint:</h4>			
				</Row>
				<Row id="map">
					<MapGL
						{...viewport}
						style={{ position: 'relative' }}
						width="100vw"
						height="50vh"
						mapStyle="mapbox://styles/mapbox/light-v9"
						onViewportChange={(nextViewport) => setViewport(nextViewport)}
						mapboxApiAccessToken={MAPBOX_TOKEN}
					>
						{aoiList.length > 0 && aoiList.map(aoi => 
							<Source type="geojson" data={{
								type: "FeatureCollection",
								features: aoi.geometry
							}}>
								<Layer  
									id={aoi.name}
									type="fill"
									paint={{"fill-color": aoiColors[aoiList.indexOf(aoi)], "fill-opacity": 0.5}}
								/>
							</Source>
						)}
						{aoiList.length > 0 && <Legend aoiList={aoiList} aoiColors={aoiColors}></Legend>}
					</MapGL>
				</Row>
				<br/>
				<Row id="data">
					<h4>Values & Weights by Data Measure:</h4>
					<p> 
						The following table indicates the weighted scores of all data measures for each area of interest (AOI) achieved, along with user-provided weights for different priority attributes displayed in the rightmost column.
					</p>
					<AssessmentTable/>
					<h4>Values & Weights by RESTORE Goal:</h4>
					<p>
						The following table indicates the weighted scores of all RESTORE goals for each each area of interest (AOI) achieved, along with user-provided weights for different goals displayed in the rightmost column.
					</p>
					<AssessmentScoreTable/>
				</Row>
				<hr/>
				<Row id="score">
					<h2>Overall Scores with User-Provided Weights:</h2>
					<p>
						The following chart indicates the overall weighted scores for each area of interest (AOI).
					</p>
					<div>
						<UserDefinedResult/>
					</div>				
				</Row>
				<hr/>
				<Row id="mcda">
					<h2>SMAA MCDA Results:</h2>
					<p>
						<b>Stochastic Multicriteria Acceptability Analysis (SMAA) </b>
						 is a collection of
						 <b> Multi-Criteria Decision Analysis (MCDA) </b>
						 methods that considers user preference as a weight space to rank the proposed projects from most preferred to least preferred. The SMAA algorithms produce an index called 
						 <b> Rank Acceptability (RA) </b>
						 , which helps the user to understand the problem in conjunction with the preference. This RA index describes the combination of user preferences resulting in a certain rank for a project. The following charts indicate the RA results for each area of interest (AOI). 
					</p>
					<div>
						<MCDAResult/>
					</div>
				</Row>
				<hr/>
				<Row id="appendix">
					<Appendix/>
				</Row>
			</Container>
		</div>
		
		</>
	);
};

export default Assessment;