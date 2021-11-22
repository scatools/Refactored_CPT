import React from 'react';
import { Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import {v4 as uuid} from 'uuid';

const AssessmentScoreTable = () => {
    const assessment = useSelector((state) => state.assessment);
	return (
		<Table striped bordered size="sm" variant="light">
			<thead>
				<tr>
					<th>Goals</th>
					{assessment.aoi.name.map((name) => <th key={uuid()}>{name}</th>)}
					<th>Weights</th>
				</tr>
			</thead>
			<tbody>
                {assessment.aoiScore[0].map((goal,idx)=>
                    (<tr key={uuid()}>
                        <td>{assessment.weights[idx].goal}</td>
                        {assessment.aoiScore.map(planScore=>(
                            <td key={uuid()}>{Math.floor(planScore[idx]*100)/100}</td>
                        ))}
                        <td>{assessment.weights[idx].weights*100+"%"}</td>
                    </tr>)
                )}
            </tbody>
		</Table>
	);
};

export default AssessmentScoreTable;
