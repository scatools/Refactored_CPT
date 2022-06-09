import React from 'react';
import { Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import {v4 as uuid} from 'uuid';

const AssessmentScoreTable = ({ aoiScoreCustomized }) => {
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
                {assessment.aoiScore[0].map((goal, index)=>
                    (<tr key={uuid()}>
                        <td>{assessment.weights[index].goal}</td>
                        {aoiScoreCustomized.map(planScore=>(
                            <td key={uuid()}>{Math.floor(planScore[index]*100)/100}</td>
                        ))}
                        <td>{assessment.weights[index].weights*100+"%"}</td>
                    </tr>)
                )}
            </tbody>
		</Table>
	);
};

export default AssessmentScoreTable;
