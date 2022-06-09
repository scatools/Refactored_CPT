import React from 'react';
import { Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const ReportTable = ({ aoiSelected }) => {
    let aoi;
    let aoiList = useSelector((state) => state.aoi);
	
	if (aoiSelected) {
		aoi = Object.values(aoiList).filter((aoi) => aoi.id === aoiSelected);
	}
	
	return (aoi && (
                <Table striped bordered size="sm" variant="light">
                    <thead>
                        <tr>
                            <th>Measures</th>
                            <th>Scaled Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td colSpan="2">
                                <b>Habitat:</b>{' '}
                            </td>
                        </tr>
                        <tr>
                            <td>Project area:</td>
                            <td>{aoi[0].scaleScore.hab0}</td>
                        </tr>
                        <tr>
                            <td>Connectivity to Existing Protected Area:</td>
                            <td>{aoi[0].scaleScore.hab1}</td>
                        </tr>
                        <tr>
                            <td>Connectivity of Natural Lands:</td>
                            <td>{aoi[0].scaleScore.hab2}</td>
                        </tr>
                        <tr>
                            <td>Threat of Urbanization:</td>
                            <td>{aoi[0].scaleScore.hab3}</td>
                        </tr>
                        <tr>
                            <td>Composition of Priority Natural Lands:</td>
                            <td>{aoi[0].scaleScore.hab4}</td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <b>Water Quality & Quantity:</b>{' '}
                            </td>
                        </tr>
                        <tr>
                            <td>303(d): Impaired Watershed Area:</td>
                            <td>{aoi[0].scaleScore.wq1}</td>
                        </tr>
                        <tr>
                            <td>Hydrologic Response to Land-Use Change:</td>
                            <td>{aoi[0].scaleScore.wq2}</td>
                        </tr>
                        <tr>
                            <td>Percent Irrigated Agriculture:</td>
                            <td>{aoi[0].scaleScore.wq3}</td>
                        </tr>
                        <tr>
                            <td>Lateral Connectivity to Floodplain:</td>
                            <td>{aoi[0].scaleScore.wq4}</td>
                        </tr>
                        <tr>
                            <td>Composition of Riparian Zone Lands:</td>
                            <td>{aoi[0].scaleScore.wq5}</td>
                        </tr>
                        <tr>
                            <td>Presence of Impoundments:</td>
                            <td>{aoi[0].scaleScore.wq6}</td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <b>Living Coastal & Marine Resources:</b>{' '}
                            </td>
                        </tr>
                        <tr>
                            <td>Vulnerable Areas of Terrestrial Endemic Species:</td>
                            <td>{aoi[0].scaleScore.lcmr1}</td>
                        </tr>
                        <tr>
                            <td>T&E Species - Critical Habitat Area:</td>
                            <td>{aoi[0].scaleScore.lcmr2}</td>
                        </tr>
                        <tr>
                            <td>T&E Species - Number of Species:</td>
                            <td>{aoi[0].scaleScore.lcmr3}</td>
                        </tr>
                        <tr>
                            <td>Light Pollution Index:</td>
                            <td>{aoi[0].scaleScore.lcmr4}</td>
                        </tr>
                        <tr>
                            <td>Terrestrial Vertebrate Biodiversity:</td>
                            <td>{aoi[0].scaleScore.lcmr5}</td>
                        </tr>
                        <tr>
                            <td>Vulnerability to Invasive Plants:</td>
                            <td>{aoi[0].scaleScore.lcmr6}</td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <b>Community Resilience:</b>{' '}
                            </td>
                        </tr>
                        <tr>
                            <td>National Register of Historic Places:</td>
                            <td>{aoi[0].scaleScore.cl1}</td>
                        </tr>
                        <tr>
                            <td>National Heritage Area:</td>
                            <td>{aoi[0].scaleScore.cl2}</td>
                        </tr>
                        <tr>
                            <td>Proximity to Socially Vulnerable Communities:</td>
                            <td>{aoi[0].scaleScore.cl3}</td>
                        </tr>
                        <tr>
                            <td>Community Threat Index:</td>
                            <td>{aoi[0].scaleScore.cl4}</td>
                        </tr>
                        <tr>
                            <td>Social Vulnerability Index:</td>
                            <td>{aoi[0].scaleScore.cl5}</td>
                        </tr>
                        <tr>
                            <td colSpan="2">
                                <b>Gulf Economy:</b>{' '}
                            </td>
                        </tr>
                        <tr>
                            <td>High Priority Working Lands:</td>
                            <td>{aoi[0].scaleScore.eco1}</td>
                        </tr>
                        <tr>
                            <td>Commercial Fishing Reliance:</td>
                            <td>{aoi[0].scaleScore.eco2}</td>
                        </tr>
                        <tr>
                            <td>Recreational Fishing Engagement:</td>
                            <td>{aoi[0].scaleScore.eco3}</td>
                        </tr>
                        <tr>
                            <td>Access & Recreation: Number of Access Points:</td>
                            <td>{aoi[0].scaleScore.eco4}</td>
                        </tr>
                    </tbody>
                </Table>
            )
	);
};

export default ReportTable;
