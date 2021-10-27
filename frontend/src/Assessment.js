import React from 'react';
import { Container, Dropdown, DropdownButton, Row } from 'react-bootstrap';
import AssessmentTable from './AssessmentTable';
import AssessmentScoreTable from './AssessmentScoreTable';
import UserDefinedResult from './UserDefinedResult';
import MCDAResult from './MCDAResult';
import PDFDownloader from './PDFDownloader';
import Appendix from './Appendix';
import { useSelector } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { FaChrome } from 'react-icons/fa';
import axios from 'axios';

const Assessment = () => {
	const assessment = useSelector(state => state.assessment);
	if(!assessment.hasOwnProperty('aoi')){
		return <Redirect to="/"/>
	}

	// Download HTML report

	// Download from backend
	// const downloadHTMLReport = async () =>{
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
		<div className="assessmentDownload">
			<DropdownButton id="reportDownload" variant="dark" title="Download Report">
				<Dropdown.Item variant="dark" onClick={downloadHTMLReport}>
					<FaChrome /> &nbsp;
					Download as HTML
				</Dropdown.Item>
				<PDFDownloader downloadFileName="Report" rootElementId="overview" />
			</DropdownButton>			
		</div>
		
		<div id="overview">
			<div className="assessmentNav">
				<a href="#data">Data Summary</a>			
				<a href="#userDefined">Overall Scores</a>
				<a href="#mcda">MCDA Results</a>
				<a href="#appendix">Appendix</a>
			</div>
			<Container style={{position:"relative", top:"100px"}}>				
				<Row id="heading">
					<h2>Data Summary:</h2>			
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
				<Row id="userDefined">
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