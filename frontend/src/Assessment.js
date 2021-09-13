import React from 'react';
import {render} from 'react-dom';
import ReactDOMServer from 'react-dom/server';
import { Button, Container, Row } from 'react-bootstrap';
import AssessmentTable from './AssessmentTable';
import AssessmentScoreTable from './AssessmentScoreTable';
import UserDefinedResult from './UserDefinedResult';
import MCDAResult from './MCDAResult';
import PDFDownloader from "./PDFDownloader";
import {useSelector} from 'react-redux';
import {Redirect} from 'react-router-dom';
import axios from 'axios';

const Assessment = () => {
	const assessment = useSelector(state => state.assessment);
	if(!assessment.hasOwnProperty('aoi')){
		return <Redirect to="/"/>
	}

	// Download HTML report

	// Download from backend
	// const downloadHTMLReport = async () =>{
	// 	const result = await axios.get('http://localhost:5000/report');
	// 	const url = window.URL.createObjectURL(new Blob([result.data]));
	// 	console.log(url);
    //     const link = document.createElement('a');
    //     link.href = url;
    //     link.setAttribute('download', 'file.html');
    //     document.body.appendChild(link);
    //     link.click();
	// }

	// Download from frontend	
	const downloadHTMLReport = () =>{		
		var pageHTMLObject = document.getElementsByClassName("container")[0];
		var pageHTML = pageHTMLObject.outerHTML;
		var tempElement = document.createElement('a');

		tempElement.href = 'data:text/html;charset=UTF-8,' + encodeURIComponent(pageHTML);
		tempElement.target = '_blank';
		tempElement.download = 'report.html';
		tempElement.click();
	}

	return (
		<>		
		<div className="assessmentDownloadHTML">
			<Button variant="dark" onClick={downloadHTMLReport}>Download HTML Report</Button>
		</div>
		<div className="assessmentDownloadPDF">
			<PDFDownloader downloadFileName="Report" rootElementId="overview" />
		</div>
		
		<div id="overview">
			<div className="assessmentNav">
				<a href="#data">Data Summary</a>			
				<a href="#userDefined">Overall Scores</a>
				<a href="#mcda">MCDA Results</a>
			</div>
			<Container style={{position:"relative", top:"100px"}}>
				<h2>Data Summary:</h2>
				<Row id="data">
					<h4 style={{margin: 15}}>Values & Weights by Data Measure:</h4>
					<AssessmentTable/>
					<h4 style={{margin: 15}}>Values & Weights by RESTORE Goal:</h4>
					<AssessmentScoreTable/>				
				</Row>
				<hr/>
				<Row id="userDefined">
					<h2>Overall Scores with User-Provided Weights:</h2>
					<div>
						<UserDefinedResult/>
					</div>				
				</Row>
				<hr/>
				<Row id="mcda">
					<h2>SMAA MCDA Results:</h2>
					<div>
						<MCDAResult/>
					</div>
				</Row>			
			</Container>
		</div>
		
		</>
	);
};

export default Assessment;