import React from 'react';
import { Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const AoiDetailTable = ({ activeTable, setActiveTable }) => {
    let aoi;
    let aoiList = useSelector((state) => state.aoi);
	
	if (activeTable) {
		aoi = Object.values(aoiList).filter((aoi) => aoi.id === activeTable);
	}
		

	return (
		<div className={activeTable ? 'AoiTableContainer active' : 'AoiTableContainer'}>
			<div
				id="dismiss"
				onClick={() => {
					setActiveTable(false);
				}}
			>
				X
			</div>
			<div style={{padding:"20px",marginTop:"50px"}}>
				{aoi && (
					<Table striped bordered size="sm" variant="dark">
						<thead>
							<tr>
								<th>Measures</th>
								<th>Scaled value</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td colSpan="2">
									<b>Habitat: </b>{' '}
								</td>
							</tr>
							<tr>
								<td>Project area:</td>
								<td>{aoi[0].scaleScore.hab0}</td>
							</tr>
							<tr>
								<td>Connectivity to Protected Areas:</td>
								<td>{aoi[0].scaleScore.hab1}</td>
							</tr>
							<tr>
								<td>Structural Connectivity:</td>
								<td>{aoi[0].scaleScore.hab2}</td>
							</tr>
							<tr>
								<td>Threat of Urbanization:</td>
								<td>{aoi[0].scaleScore.hab3}</td>
							</tr>
							<tr>
								<td>Composition of Natural Lands:</td>
								<td>{aoi[0].scaleScore.hab4}</td>
							</tr>
							<tr>
								<td colSpan="2">
									<b>Water Quality: </b>{' '}
								</td>
							</tr>
							<tr>
								<td>Impaired Watershed Area:</td>
								<td>{aoi[0].scaleScore.wq1}</td>
							</tr>
							<tr>
								<td>Stream Abundance:</td>
								<td>{aoi[0].scaleScore.wq2}</td>
							</tr>
							<tr>
								<td>Hydrologic Response to Land-Use Change:</td>
								<td>{aoi[0].scaleScore.wq3}</td>
							</tr>
							<tr>
								<td colSpan="2">
									<b>LCMR:</b>{' '}
								</td>
							</tr>
							<tr>
								<td>Biodiversity Index: </td>
								<td>{aoi[0].scaleScore.lcmr1}</td>
							</tr>
							<tr>
								<td>T&E Area:</td>
								<td>{aoi[0].scaleScore.lcmr2}</td>
							</tr>
							<tr>
								<td>T&E Count:</td>
								<td>{aoi[0].scaleScore.lcmr3}</td>
							</tr>
							<tr>
								<td>Light Pollution Index:</td>
								<td>{aoi[0].scaleScore.lcmr4}</td>
							</tr>
							<tr>
								<td colSpan="2">
									<b>Community Resilience:</b>{' '}
								</td>
							</tr>
							<tr>
								<td>National Register of Historic Places: </td>
								<td>{aoi[0].scaleScore.cl1}</td>
							</tr>
							<tr>
								<td>National Heritage Area:</td>
								<td>{aoi[0].scaleScore.cl2}</td>
							</tr>
							<tr>
								<td>Social Vulnerability Index:</td>
								<td>{aoi[0].scaleScore.cl3}</td>
							</tr>
							<tr>
								<td>Community Threat Index:</td>
								<td>{aoi[0].scaleScore.cl4}</td>
							</tr>
							<tr>
								<td colSpan="2">
									<b>Economy:</b>{' '}
								</td>
							</tr>
							<tr>
								<td>Working Lands: </td>
								<td>{aoi[0].scaleScore.eco1}</td>
							</tr>
							<tr>
								<td>Commercial Fishery Index:</td>
								<td>{aoi[0].scaleScore.eco2}</td>
							</tr>
							<tr>
								<td>Recreational Fishery Index:</td>
								<td>{aoi[0].scaleScore.eco3}</td>
							</tr>
							<tr>
								<td>Access & Recreation:</td>
								<td>{aoi[0].scaleScore.eco4}</td>
							</tr>
						</tbody>
					</Table>
				)}
			</div>
		</div>
	);
};

export default AoiDetailTable;
