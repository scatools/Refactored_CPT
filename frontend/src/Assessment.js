import React, { useState } from 'react';
import { Container, Dropdown, DropdownButton, Row } from 'react-bootstrap';
import MapGL, { Source, Layer, WebMercatorViewport } from 'react-map-gl';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { ImDownload } from "react-icons/im";
import { FaChrome } from 'react-icons/fa';
import { VscFolder, VscFileSubmodule } from "react-icons/vsc";
import { download } from 'shp-write';
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

const Assessment = ({ aoiAssembled, setAoiSelected, setReportLink }) => {
	const assessment = useSelector(state => state.assessment);
	const aoi = useSelector((state) => state.aoi);
	const aoiAssembledList = aoiAssembled.map(aoi => aoi.value);
	// Constant aoi contains all the AOIs provided so those not assembled need to be filtered out
	const aoiList = Object.values(aoi).filter(aoi => aoiAssembledList.includes(aoi.id));
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

	const downloadFootprintAsSingle = () => {
		var aoiGeoJson = {type: 'FeatureCollection', features: aoiAssembly};
		var options = {
			folder: 'Spatial Footprint',
			types: {
				polygon: 'Combined Assessment Area'
			}
		};
		download(aoiGeoJson, options);
	}

	const downloadFootprintAsMultiple = () => {
		aoiList.forEach((aoi, index) => {
			var aoiGeoJson = {type: 'FeatureCollection', features: aoi.geometry};
			var options = {
				folder: 'Spatial Footprint ' + (index+1).toString,
				types: {
					polygon: aoi.name
				}
			};
			download(aoiGeoJson, options);
		});
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

		<div className="footprintDownload">
			<DropdownButton id="footprintDownloadButton" variant="dark" title="Download Footprint">
				<Dropdown.Item variant="dark" onClick={downloadFootprintAsSingle}>
					<VscFolder /> &nbsp;
					Download as Single Shapefile
				</Dropdown.Item>
				<Dropdown.Item variant="dark" onClick={downloadFootprintAsMultiple}>
					<VscFileSubmodule /> &nbsp;
					Download as Multiple Shapefiles
				</Dropdown.Item>
			</DropdownButton>
		</div>

		<div className="assessmentNav">
			<a href="#mapHeading">Spatial Footprint</a>
			<a href="#scoreHeading">Overall Scores</a>
			<a href="#dataHeading">Data Summary</a>
			<a href="#mcdaHeading">MCDA Results</a>
			<a href="#appendix">Appendix</a>
		</div>
		
		<div id="assessmentOverview">
			<Container style={{position:"relative", top:"100px"}}>								
				<Row id="mapHeading">
					<h2>Spatial Footprint:</h2>			
				</Row>
				<br/>
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
				<hr/>
				<Row id="scoreHeading">
					<h2>Overall Scores with User-Provided Weights:</h2>
				</Row>
				<br/>
				<Row id="score">
					<p>
						The following chart indicates the overall weighted scores for each area of interest (AOI).
					</p>
					<div>
						<UserDefinedResult/>
					</div>				
				</Row>
				<hr/>
				<Row id="dataHeading">
					<h2>Data Summary:</h2>
				</Row>
				<br/>
				<Row id="data">
					<h4>Values & Weights by RESTORE Goal:</h4>
					<p>
						The following table indicates the weighted scores of all RESTORE goals for each each area of interest (AOI) achieved, along with user-provided weights for different goals displayed in the rightmost column.
					</p>
					<AssessmentScoreTable/>
					<h4>Values & Weights by Data Measure:</h4>
					<p> 
						The following table indicates the weighted scores of all data measures for each area of interest (AOI) achieved, along with user-provided weights for different priority attributes displayed in the rightmost column.
					</p>
					<AssessmentTable setAoiSelected={setAoiSelected} setReportLink={setReportLink}/>
				</Row>
				<hr/>
				<Row id="mcdaHeading">
					<h2>SMAA MCDA Results:</h2>
				</Row>
				<br/>
				<Row id="mcda">
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