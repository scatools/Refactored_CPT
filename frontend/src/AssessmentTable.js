import React from 'react';
import {Table} from 'react-bootstrap';
import {useSelector} from 'react-redux';
import {v4 as uuid} from 'uuid';

const AssessmentTable = () =>{
    const assessment = useSelector(state => state.assessment);
    return(
        <Table striped bordered size="sm" variant="dark">
						<thead>
							<tr>
								<th>Measures</th>
                                {assessment.aoi.name.map(name=>(
                                    <th key={uuid()}>
                                        {name}
                                    </th>
                                ))}
							</tr>
						</thead>
						<tbody>
							<tr>
								<td colSpan={""+ (assessment.aoi.id.length+1)}>
									<b>Habitat: </b>{' '}
								</td>
							</tr>
							<tr>
								<td>Project area:</td>
                                {assessment.aoi.hab0.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td>Padus:</td>
								{assessment.aoi.hab1.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td>Structural Connectivity:</td>
								{assessment.aoi.hab2.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td>Threat of Urbanization:</td>
								{assessment.aoi.hab3.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td>Composition of Natural Lands:</td>
								{assessment.aoi.hab4.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td colSpan={""+ (assessment.aoi.id.length+1)}>
									<b>Water Quality: </b>{' '}
								</td>
							</tr>
							<tr>
								<td>Impaired Watershed Area:</td>
								{assessment.aoi.wq1.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td>Stream Abundance:</td>
								{assessment.aoi.wq2.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td colSpan={""+ (assessment.aoi.id.length+1)}>
									<b>LCMR:</b>{' '}
								</td>
							</tr>
							<tr>
								<td>Biodiversity Index: </td>
								{assessment.aoi.lcmr1.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td>T&E Area:</td>
								{assessment.aoi.lcmr2.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td>T&E Count:</td>
								{assessment.aoi.lcmr3.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td>Light Pollution Index:</td>
								{assessment.aoi.lcmr4.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td colSpan={""+ (assessment.aoi.id.length+1)}>
									<b>Community Resilience:</b>{' '}
								</td>
							</tr>
							<tr>
								<td>National Register of Historic Places: </td>
								{assessment.aoi.cl1.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td>National Heritage Area:</td>
								{assessment.aoi.cl2.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td>Social Vulnerability Index:</td>
								{assessment.aoi.cl3.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td>Community Threat Index:</td>
								{assessment.aoi.cl4.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td colSpan={""+ (assessment.aoi.id.length+1)}>
									<b>Economy:</b>{' '}
								</td>
							</tr>
							<tr>
								<td>Working Lands: </td>
								{assessment.aoi.eco1.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td>Commercial Fishery Index:</td>
								{assessment.aoi.eco2.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td>Recreational Fishery Index:</td>
								{assessment.aoi.eco3.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td>Access & Recreation:</td>
								{assessment.aoi.eco4.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
						</tbody>
					</Table>
    )
}

export default AssessmentTable;