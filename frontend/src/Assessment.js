import React from 'react';
import { Button, Container, Row } from 'react-bootstrap';
import AssessmentTable from './AssessmentTable';
import AssessmentScoreTable from './AssessmentScoreTable';
import UserDefinedResult from './UserDefinedResult';
import MCDAResult from './MCDAResult';
import {useSelector} from 'react-redux';
import {Redirect} from 'react-router-dom';
import axios from 'axios';

const Assessment = () => {
	const assessment = useSelector(state => state.assessment);
	if(!assessment.hasOwnProperty('aoi')){
		return <Redirect to="/"/>
	}

	const downloadReport = async () =>{
		const result = await axios.get('http://localhost:5000/report');
		const url = window.URL.createObjectURL(new Blob([result.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'file.html');
        document.body.appendChild(link);
        link.click();
	}
	return (
		<>
		<div className="assessmentNav">
			<a href="#data">Data Overview</a>			
			<a href="#userDefined">User-defined Weights Results</a>
			<a href="#mcda">MCDA Results</a>
		</div>
		<div className="assessmentDownload">
			<Button variant="dark" onClick={downloadReport}>Download Report</Button>
		</div>
		<Container style={{position:"relative", top:"50px"}}>
			<Row id="data">
				<h2>Data Summary:</h2>
				<AssessmentTable/>
				<AssessmentScoreTable/>
			</Row>
			<hr/>
			<Row id="userDefined">
			    <h2>User-defined Weights Results:</h2>
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
		</>
	);
};

export default Assessment;