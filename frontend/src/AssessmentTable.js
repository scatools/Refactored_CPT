import React from 'react';
import { Table } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';

const AssessmentTable = ({ setAoiSelected, setReportLink }) =>{
    const assessment = useSelector(state => state.assessment);
    return(
        <Table id="assessmentTable" striped bordered size="sm" variant="light">
						<thead>
							<tr>
								<th>Measures</th>
                                {assessment.aoi.name.map(name=>(
                                    <th key={uuid()}>
										<Link to="/report" 
											onClick={() => {
												// Link to the single-AOI report
												setAoiSelected(assessment.aoi.id[assessment.aoi.name.indexOf(name)]);
												setReportLink(true);
											}}
										>
											{name}
										</Link>
                                    </th>
                                ))}
							</tr>
						</thead>
						<tbody>
							<tr>
								<td colSpan={""+ (assessment.aoi.id.length+1)}>
									<b>Habitat:</b>{' '}
								</td>
							</tr>
							<tr>
								<td>Project Area:</td>
                                {assessment.aoi.hab0.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td>Connectivity to Existing Protected Area:</td>
								{assessment.aoi.hab1.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td>Connectivity of Natural Lands:</td>
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
								<td>Composition of Priority Natural Lands:</td>
								{assessment.aoi.hab4.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td colSpan={""+ (assessment.aoi.id.length+1)}>
									<b>Water Quality & Quantity:</b>{' '}
								</td>
							</tr>
							<tr>
								<td>303(d): Impaired Watershed Area:</td>
								{assessment.aoi.wq1.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td>Hydrologic Response to Land-Use Change:</td>
								{assessment.aoi.wq2.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td>Percent Irrigated Agriculture:</td>
								{assessment.aoi.wq3.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td>Lateral Connectivity to Floodplain:</td>
								{assessment.aoi.wq4.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td>Composition of Riparian Zone Lands:</td>
								{assessment.aoi.wq5.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td>Presence of Impoundments:</td>
								{assessment.aoi.wq6.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td colSpan={""+ (assessment.aoi.id.length+1)}>
									<b>Living Coastal & Marine Resources:</b>{' '}
								</td>
							</tr>
							<tr>
								<td>Vulnerable Areas of Terrestrial Endemic Species:</td>
								{assessment.aoi.lcmr1.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td>Threatened and Endangered Species - Critical Habitat Area:</td>
								{assessment.aoi.lcmr2.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td>Threatened and Endangered Species - Number of Species:</td>
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
								<td>Terrestrial Vertebrate Biodiversity:</td>
								{assessment.aoi.lcmr5.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td>Vulnerability to Invasive Plants:</td>
								{assessment.aoi.lcmr6.map(value=>(
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
								<td>National Register of Historic Places:</td>
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
								<td>Proximity to Socially Vulnerable Communities:</td>
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
									<b>Gulf Economy:</b>{' '}
								</td>
							</tr>
							<tr>
								<td>High Priority Working Lands:</td>
								{assessment.aoi.eco1.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td>Commercial Fishing Reliance:</td>
								{assessment.aoi.eco2.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td>Recreational Fishing Engagement:</td>
								{assessment.aoi.eco3.map(value=>(
                                    <td key={uuid()}>
                                        {Math.floor(value*100)/100}
                                    </td>
                                ))}
							</tr>
							<tr>
								<td>Access & Recreation: Number of Access Points:</td>
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