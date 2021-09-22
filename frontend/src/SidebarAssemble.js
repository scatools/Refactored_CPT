import React,{useState} from 'react';
import {Accordion,Button,ButtonGroup,Card,Col,Form,Modal,Row,Table,ToggleButton} from 'react-bootstrap';
import Select from 'react-select';
import {changeMeasures,changeMeasuresWeight,changeGoalWeights,generate_assessment} from './action';
import {useDispatch,useSelector} from 'react-redux';
import RangeSlider from 'react-bootstrap-range-slider';
import {calculateMeasures,getScaledForAssessment,mergeIntoArray} from './helper/aggregateHex';
import {Redirect,useHistory} from 'react-router-dom';
import axios from 'axios';
import { GoInfo } from 'react-icons/go';
import ReactTooltip from "react-tooltip";

const RESTOREGoal = ['Habitat', 'Water Quality & Quantity', 'Living Coastal & Marine Resources','Community Resilience','Gulf Economy']

const SidebarAssemble = () =>{
	const weights =  useSelector(state => state.weights);
	const aoi = useSelector(state=>state.aoi);
	let aoiList = Object.values(aoi).length > 0 ? Object.values(aoi).map(item=>({label:item.name, value:item.id })) :[];
	const dispatch = useDispatch();
	const [aoiSelected, setAoiSelected]= useState([]);
    const handleChange = (value, name, label, type) => {	
		dispatch(changeMeasuresWeight(value,name, label, type))
	};

	const handleWeights = (value, goal) =>{
		const newValue = Number(value)> 100 ? 100 : Number(value);
		dispatch(changeGoalWeights(newValue, goal))
    }
    
    const [show, setShow] = useState(false);
	const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
	const history = useHistory();

    return (
        <div>
        <div>
        <Accordion defaultActiveKey="0">
						<Card>
							<Accordion.Toggle as={Card.Header} eventKey="0">
								Select Areas of Interests:
							</Accordion.Toggle>
							<Accordion.Collapse eventKey="0">
								<Card.Body>
								    <Select
										styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
										menuPortalTarget={document.body}
										options={aoiList}
										isMulti
										isClearable={false}
										placeholder="Select areas of interests..."
										name="colors"
										value={aoiSelected}
										onChange={(selectedOption) => {
											setAoiSelected(selectedOption)
										}}    
										className="basic-multi-select"
										classNamePrefix="select"
									/>
									<br />
									<Accordion.Toggle eventKey="1" as={Button} variant="dark">
										Next
									</Accordion.Toggle>
								</Card.Body>
							</Accordion.Collapse>
						</Card>
						<Card className="my-2">
							<Accordion.Toggle as={Card.Header} eventKey="1">
								RESTORE Goal Weights:
							</Accordion.Toggle>
							<Accordion.Collapse eventKey="1">
								<Card.Body>
									<Form>
									    <>
										<span>Habitat:</span>
										<Form.Group as={Row}>
											<Col xs="9">
												<RangeSlider
													step = {5}
													value={weights.hab.weight}
													onChange={(e) => handleWeights(e.target.value,'hab')}
													variant="secondary"
												/>
											</Col>
											<Col xs="3">
												<Form.Control
													value={weights.hab.weight}
													onChange={(e) => handleWeights(e.target.value, 'hab')}
												/>
											</Col>
										</Form.Group>
										</>
									    <>
										<span>Water Quality & Quantity:</span>
										<Form.Group as={Row}>
										<Col xs="9">
												<RangeSlider
													step = {5}
													value={weights.wq.weight}
													onChange={(e) => handleWeights(e.target.value, 'wq')}
													variant="secondary"
												/>
											</Col>
											<Col xs="3">
												<Form.Control
													value={weights.wq.weight}
													onChange={(e) => handleWeights(e.target.value, 'wq')}
												/>
											</Col>
										</Form.Group>
										</>
										<>
										<span>Living Coastal & Marine Resources:</span>
										<Form.Group as={Row}>
										<Col xs="9">
												<RangeSlider
													step = {5}
													value={weights.lcmr.weight}
													onChange={(e) => handleWeights(e.target.value, 'lcmr')}
													variant="secondary"
												/>
											</Col>
											<Col xs="3">
												<Form.Control
													value={weights.lcmr.weight}
													onChange={(e) => handleWeights(e.target.value, 'lcmr')}
												/>
											</Col>
										</Form.Group>
										</>
                                    	<>
										<span>Community Resilience:</span>
										<Form.Group as={Row}>
										<Col xs="9">
												<RangeSlider
													step = {5}
													value={weights.cl.weight}
													onChange={(e) => handleWeights(e.target.value, 'cl')}
													variant="secondary"
												/>
											</Col>
											<Col xs="3">
												<Form.Control
													value={weights.cl.weight}
													onChange={(e) => handleWeights(e.target.value, 'cl')}
												/>
											</Col>
										</Form.Group>
										</>
                    					<>
										<span>Gulf Economy:</span>
										<Form.Group as={Row}>
										<Col xs="9">
												<RangeSlider
													step = {5}
													value={weights.eco.weight}
													onChange={(e) => handleWeights(e.target.value, 'eco')}
													variant="secondary"
												/>
											</Col>
											<Col xs="3">
												<Form.Control
													value={weights.eco.weight}
													onChange={(e) => handleWeights(e.target.value, 'eco')}
												/>
											</Col>
										</Form.Group>
										</>
									</Form>
									<br />
									<label>Total Sum: &nbsp;&nbsp;</label>
									<span>
										<input
											type="text"
											value={weights.hab.weight+weights.wq.weight+weights.lcmr.weight+weights.cl.weight+weights.eco.weight}							
											disabled
										>	
										</input>
									</span>
									<br></br>
									<br></br>
									<Accordion.Toggle eventKey="2" as={Button} variant="dark">
										Next
									</Accordion.Toggle>
								</Card.Body>
							</Accordion.Collapse>
						</Card>
					

						<Card className="my-2">
							<Accordion.Toggle as={Card.Header} eventKey="2">
								Data Measures:
							</Accordion.Toggle>
							<Accordion.Collapse eventKey="2">
								<Card.Body>
									<div>
									<span>Habitat:</span>
									<Select
										styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
										menuPortalTarget={document.body}
										options={[
											{ value: 'hab1', label: 'Padus - Connectivity to Existing Protected Area' },
											{ value: 'hab2', label: 'Connectivity of Natural Lands' },
											{ value: 'hab3', label: 'Threat of Urbanization' },
											{ value: 'hab4', label: 'Land Cover - Composition of Natural Lands ' }
										]}
										isMulti
										isClearable={false}
										placeholder="Select Habitat measures..."
										name="colors"
										value={weights.hab.selected}
										onChange={(selectedOption) => {
											let state;
											if (selectedOption) {
											    state = selectedOption.map((selected) => ({
											    	...selected,
											    	utility: selected['utility'] || '1',
											    	weight: selected['weight'] || 'medium'
											    }));
										    }else{
										    	state = null;
										    	handleWeights(0,'hab');
										    }
										    dispatch(changeMeasures('hab', state))
										}}    
										className="basic-multi-select"
										classNamePrefix="select"
									/>
									
									{weights.hab.selected &&
										weights.hab.selected.map((measure) => (
											<div className="m-2" key={measure.value}>
												<span style={{ display: 'block' }} className="my-1">
													{measure.label}
												</span>
												<ButtonGroup toggle>
													<ToggleButton
														type="radio"
														data-tip data-for="more"
														variant="outline-secondary"
														name="utility"
														value="-1"
														checked={measure.utility === '-1'}
														onChange={(e) =>
															handleChange(
																e.currentTarget.value,
																e.currentTarget.name,
																measure.value,
																'hab'
															)}
													>
														Higher
													</ToggleButton>
													<ReactTooltip id="more" place="top">
        											More is better
     												</ReactTooltip>
													<ToggleButton
														type="radio"
														data-tip data-for="less"
														variant="outline-secondary"
														name="utility"
														value="1"
														checked={measure.utility === '1'}
														onChange={(e) =>
															handleChange(
																e.currentTarget.value,
																e.currentTarget.name,
																measure.value,
																'hab'
															)}
													>
														Lower
													</ToggleButton>
													<ReactTooltip id="less" place="top">
        											Less is better
     												</ReactTooltip>
												</ButtonGroup>
												<ButtonGroup toggle className="ml-2">
													<ToggleButton
														type="radio"
														variant="outline-secondary"
														name="weight"
														value="low"
														checked={measure.weight === 'low'}
														onChange={(e) =>
															handleChange(
																e.currentTarget.value,
																e.currentTarget.name,
																measure.value,
																'hab'
															)}
													>
														Low
													</ToggleButton>
													<ToggleButton
														type="radio"
														variant="outline-secondary"
														name="weight"
														value="medium"
														checked={measure.weight === 'medium'}
														onChange={(e) =>
															handleChange(
																e.currentTarget.value,
																e.currentTarget.name,
																measure.value,
																'hab'
															)}
													>
														Medium
													</ToggleButton>
													<ToggleButton
														type="radio"
														variant="outline-secondary"
														name="weight"
														value="high"
														checked={measure.weight === 'high'}
														onChange={(e) =>
															handleChange(
																e.currentTarget.value,
																e.currentTarget.name,
																measure.value,
																'hab'
															)}
													>
														High
													</ToggleButton>
												</ButtonGroup>
											</div>
										))}
										</div>
									<br />
									
									<span>Water Quality & Quantity:</span>
									<Select
										styles={{ menuPortal: (base, state) => ({ ...base, zIndex: 9999 }) }}
										menuPortalTarget={document.body}
										options={[
											{ value: 'wq1', type: 'checkbox', label: "303(D): Impaired Watershed Area " },
											{ value: 'wq2', type: 'checkbox', label: 'Hydrologic Response to Land-Use Change' },
											{ value: 'wq3', type: 'checkbox', label: 'Percent Irrigated Agriculture' },
											{ value: 'wq4', type: 'checkbox', label: 'Lateral Connectivity to Floodplain' },
											{ value: 'wq5', type: 'checkbox', label: 'Composition of Riparizan Zone Lands' }
										]}
										isMulti
										placeholder="Select Water Quality & Quantity measures..."
										name="colors"
										className="basic-multi-select"
										classNamePrefix="select"
										value={weights.wq.selected}
										isClearable={false}
										onChange={(selectedOption) => {
											let state;
											if (selectedOption) {
											state = selectedOption.map((selected) => ({
												...selected,
												utility: selected['utility'] || '1',
												weight: selected['weight'] || 'medium'
											}));
										}else{
											state = null;
											handleWeights(0,'wq');
										}
										
										dispatch(changeMeasures('wq', state))
										}}
									/>
									{weights.wq.selected &&
										weights.wq.selected.map((measure) => (
											<div className="m-2" key={measure.value}>
												<span style={{ display: 'block' }} className="my-1">
													{measure.label}
												</span>
												<ButtonGroup toggle>
													<ToggleButton
														type="radio"
														variant="outline-secondary"
														data-tip data-for="More1"
														name="utility"
														value="-1"
														checked={measure.utility === '-1'}
														onChange={(e) =>
															handleChange(
																e.currentTarget.value,
																e.currentTarget.name,
																measure.value,
																'wq'
															)}
													>
														More
													</ToggleButton>
													<ReactTooltip id="More1" place="top">
													Higher is better
													</ReactTooltip>
													<ToggleButton
														type="radio"
														variant="outline-secondary"
														data-tip data-for="Less1"
														name="utility"
														value="1"
														checked={measure.utility === '1'}
														onChange={(e) =>
															handleChange(
																e.currentTarget.value,
																e.currentTarget.name,
																measure.value,
																'wq'
															)}
													>
														Less
													</ToggleButton>
													<ReactTooltip id="Less1" place="top">
													Lower is better
													</ReactTooltip>
												</ButtonGroup>
												<ButtonGroup toggle className="ml-2">
													<ToggleButton
														type="radio"
														variant="outline-secondary"
														name="weight"
														value="low"
														checked={measure.weight === 'low'}
														onChange={(e) =>
															handleChange(
																e.currentTarget.value,
																e.currentTarget.name,
																measure.value,
																'wq'
															)}
													>
														Low
													</ToggleButton>
													<ToggleButton
														type="radio"
														variant="outline-secondary"
														name="weight"
														value="medium"
														checked={measure.weight === 'medium'}
														onChange={(e) =>
															handleChange(
																e.currentTarget.value,
																e.currentTarget.name,
																measure.value,
																'wq'
															)}
													>
														Medium
													</ToggleButton>
													<ToggleButton
														type="radio"
														variant="outline-secondary"
														name="weight"
														value="high"
														checked={measure.weight === 'high'}
														onChange={(e) =>
															handleChange(
																e.currentTarget.value,
																e.currentTarget.name,
																measure.value,
																'wq'
															)}
													>
														High
													</ToggleButton>
												</ButtonGroup>
											</div>
										))}
									<br />
									<span>Living Coastal & Marine Resources:</span>
									<Select
										styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
										menuPortalTarget={document.body}
										options={[
											{ value: 'lcmr1', label: 'Vulnerable Area of Terrestrial Endemic Species' },
											{
												value: 'lcmr2',
												label: 'Threatened and Endangered Species - Critical Habitat Area '
											},
											{
												value: 'lcmr3',
												label: 'Threatened and Endangered Species - Number of Species '
											},
											{ value: 'lcmr4', label: 'Light Pollution Index' }
										]}
										isMulti
										placeholder="Select Living Coastal & Marine Resources measures..."
										name="colors"
										className="basic-multi-select"
										classNamePrefix="select"
										isClearable={false}
										value={weights.lcmr.selected}
										onChange={(selectedOption) => {
											let state
											if (selectedOption) {
												state = selectedOption.map((selected) => ({
													...selected,
													utility: selected['utility'] || '1',
													weight: selected['weight'] || 'medium'
												}));
											}else{
												state = null;
												
										    	handleWeights(0,'lcmr');
											}
											
										    dispatch(changeMeasures('lcmr', state))
										}}
									/>
									{weights.lcmr.selected &&
										weights.lcmr.selected.map((measure) => (
											<div className="m-2" key={measure.value}>
												<span style={{ display: 'block' }} className="my-1">
													{measure.label}
												</span>
												<ButtonGroup toggle>
													<ToggleButton
														type="radio"
														variant="outline-secondary"
														name="utility"
														data-tip data-for="More"
														value="-1"
														checked={measure.utility === '-1'}
														onChange={(e) =>
															handleChange(
																e.currentTarget.value,
																e.currentTarget.name,
																measure.value,
																'lcmr'
															)}
													>
														More
													</ToggleButton>
													<ReactTooltip id="More" place="top">
													More impact less conservations
													</ReactTooltip>
													<ToggleButton
														type="radio"
														variant="outline-secondary"
														name="utility"
														data-tip data-for="Less"
														value="1"
														checked={measure.utility === '1'}
														onChange={(e) =>
															handleChange(
																e.currentTarget.value,
																e.currentTarget.name,
																measure.value,
																'lcmr'
															)}
													>
														Less
													</ToggleButton>
													<ReactTooltip id="Less" place="top">
													Less impact better conservations
													</ReactTooltip>
												</ButtonGroup>
												<ButtonGroup toggle className="ml-2">
													<ToggleButton
														type="radio"
														variant="outline-secondary"
														name="weight"
														value="low"
														checked={measure.weight === 'low'}
														onChange={(e) =>
															handleChange(
																e.currentTarget.value,
																e.currentTarget.name,
																measure.value,
																'lcmr'
															)}
													>
														Low
													</ToggleButton>
													<ToggleButton
														type="radio"
														variant="outline-secondary"
														name="weight"
														value="medium"
														checked={measure.weight === 'medium'}
														onChange={(e) =>
															handleChange(
																e.currentTarget.value,
																e.currentTarget.name,
																measure.value,
																'lcmr'
															)}
													>
														Medium
													</ToggleButton>
													<ToggleButton
														type="radio"
														variant="outline-secondary"
														name="weight"
														value="high"
														checked={measure.weight === 'high'}
														onChange={(e) =>
															handleChange(
																e.currentTarget.value,
																e.currentTarget.name,
																measure.value,
																'lcmr'
															)}
													>
														High
													</ToggleButton>
												</ButtonGroup>
											</div>
										))}
									<br />
									<span>Community Resilience:</span>
									<Select
										styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
										menuPortalTarget={document.body}
										options={[
											{ value: 'cl1', label: 'National Register of Historic Places' },
											{ value: 'cl2', label: 'National Heritage Area' },
											{ value: 'cl3', label: 'Proximity to Socially Vulnerability Communities' },
											{ value: 'cl4', label: 'Community Threat Index ' }
										]}
										isMulti
										placeholder="Select Community Resilience measures..."
										name="colors"
										isClearable={false}
										className="basic-multi-select"
										classNamePrefix="select"
										value={weights.cl.selected}
										onChange={(selectedOption) => {
											let state
											if (selectedOption) {
											state = selectedOption.map((selected) => ({
												...selected,
												utility: selected['utility'] || '1',
												weight: selected['weight'] || 'medium'
											}));
										}else{
											state = null;
											
											handleWeights(0,'cl');
										}
										dispatch(changeMeasures('cl', state))
										}}
									/>
									{weights.cl.selected &&
										weights.cl.selected.map((measure) => (
											<div className="m-2" key={measure.value}>
												<span style={{ display: 'block' }} className="my-1">
													{measure.label}
												</span>
												<ButtonGroup toggle>
													<ToggleButton
														type="radio"
														variant="outline-secondary"
														data-tip data-for="more"
														name="utility"
														value="-1"
														checked={measure.utility === '-1'}
														onChange={(e) =>
															handleChange(
																e.currentTarget.value,
																e.currentTarget.name,
																measure.value,
																'cl'
															)}
													>
														More
													</ToggleButton>
													<ReactTooltip id="more" place="top">
													More score the better
													</ReactTooltip>
													<ToggleButton
														type="radio"
														variant="outline-secondary"
														data-tip data-for="less"
														name="utility"
														value="1"
														checked={measure.utility === '1'}
														onChange={(e) =>
															handleChange(
																e.currentTarget.value,
																e.currentTarget.name,
																measure.value,
																'cl'
															)}
													>
														Less
													</ToggleButton>
													<ReactTooltip id="less" place="top">
													Less score the better
												    </ReactTooltip>
												</ButtonGroup>
												<ButtonGroup toggle className="ml-2">
													<ToggleButton
														type="radio"
														variant="outline-secondary"
														name="weight"
														value="low"
														checked={measure.weight === 'low'}
														onChange={(e) =>
															handleChange(
																e.currentTarget.value,
																e.currentTarget.name,
																measure.value,
																'cl'
															)}
													>
														Low
													</ToggleButton>
													<ToggleButton
														type="radio"
														variant="outline-secondary"
														name="weight"
														value="medium"
														checked={measure.weight === 'medium'}
														onChange={(e) =>
															handleChange(
																e.currentTarget.value,
																e.currentTarget.name,
																measure.value,
																'cl'
															)}
													>
														Medium
													</ToggleButton>
													<ToggleButton
														type="radio"
														variant="outline-secondary"
														name="weight"
														value="high"
														checked={measure.weight === 'high'}
														onChange={(e) =>
															handleChange(
																e.currentTarget.value,
																e.currentTarget.name,
																measure.value,
																'cl'
															)}
													>
														High
													</ToggleButton>
												</ButtonGroup>
											</div>
										))}
									<br />
									<span>Gulf Economy:</span>
									<Select
										styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
										menuPortalTarget={document.body}
										options={[
											{ value: 'eco1', label: 'High Priority Working Lands' },
											{ value: 'eco2', label: 'Commercial Fishery Reliance' },
											{ value: 'eco3', label: 'Recreational Fishery Engagement' },
											{ value: 'eco4', label: 'Access & Recreation - Number of Access Points' }
										]}
										isMulti
										placeholder="Select Gulf Economy..."
										name="colors"
										isClearable={false}
										className="basic-multi-select"
										classNamePrefix="select"
										value={weights.eco.selected}
										onChange={(selectedOption) => {
											let state;
											if (selectedOption) {
											state = selectedOption.map((selected) => ({
												...selected,
												utility: selected['utility'] || '1',
												weight: selected['weight'] || 'medium'
											}));
										}else{
											state = null;
											
											handleWeights(0,'eco');
										}
										
										dispatch(changeMeasures('eco', state))
										}}
									/>
									{weights.eco.selected &&
										weights.eco.selected.map((measure) => (
											<div className="m-2" key={measure.value}>
												<span style={{ display: 'block' }} className="my-1">
													{measure.label}
												</span>
												<ButtonGroup toggle>
													<ToggleButton
														type="radio"
														variant="outline-secondary"
														data-tip data-for="more"
														name="utility"
														value="-1"
														checked={measure.utility === '-1'}
														onChange={(e) =>
															handleChange(
																e.currentTarget.value,
																e.currentTarget.name,
																measure.value,
																'eco'
															)}
													>
														More
													</ToggleButton>
													<ReactTooltip id="more" place="top">
													More score the better
													</ReactTooltip>
													<ToggleButton
														type="radio"
														variant="outline-secondary"
														data-tip data-for="less"
														name="utility"
														value="1"
														checked={measure.utility === '1'}
														onChange={(e) =>
															handleChange(
																e.currentTarget.value,
																e.currentTarget.name,
																measure.value,
																'eco'
															)}
													>
														Less
													</ToggleButton>
													<ReactTooltip id="less" place="top">
													Less score the better
													</ReactTooltip>
												</ButtonGroup>
												<ButtonGroup toggle className="ml-2">
													<ToggleButton
														type="radio"
														variant="outline-secondary"
														name="weight"
														value="low"
														checked={measure.weight === 'low'}
														onChange={(e) =>
															handleChange(
																e.currentTarget.value,
																e.currentTarget.name,
																measure.value,
																'eco'
															)}
													>
														Low
													</ToggleButton>
													<ToggleButton
														type="radio"
														variant="outline-secondary"
														name="weight"
														value="medium"
														checked={measure.weight === 'medium'}
														onChange={(e) =>
															handleChange(
																e.currentTarget.value,
																e.currentTarget.name,
																measure.value,
																'eco'
															)}
													>
														Medium
													</ToggleButton>
													<ToggleButton
														type="radio"
														variant="outline-secondary"
														name="weight"
														value="high"
														checked={measure.weight === 'high'}
														onChange={(e) =>
															handleChange(
																e.currentTarget.value,
																e.currentTarget.name,
																measure.value,
																'eco'
															)}
													>
														High
													</ToggleButton>
												</ButtonGroup>
											</div>
										))}
										<br />
									<Accordion.Toggle eventKey="3" as={Button} variant="dark">
										Next
									</Accordion.Toggle>
								</Card.Body>
							</Accordion.Collapse>
						</Card>

						<Card className="my-2">
							<Accordion.Toggle as={Card.Header} eventKey="3">
								Review & Result:
							</Accordion.Toggle>
							<Accordion.Collapse eventKey="3">
								<Card.Body>
									Data Measure Weights Summary:
									<Table striped bordered hover size="sm">
									<thead>
                                        <tr>
                                          <th>Measure Name</th>
										  <th>Goal Related</th>
                                          <th>Utility &nbsp;<GoInfo data-tip data-for='GoInfo' />
										  <ReactTooltip id='GoInfo' type='dark'>
  										  <span>Pragna this thing worked</span>
										  </ReactTooltip></th>
                                          <th>Weights &nbsp;<GoInfo data-tip data-for='GoInfo' />
											<ReactTooltip id='GoInfo' type='dark'>
  											<span>Pragna this thing worked</span>
											</ReactTooltip>
										  </th>
                                        </tr>
                                    </thead>
									<tbody>
										{weights.hab.selected&&
										   weights.hab.selected.map(measure=>(
											   <tr key={measure.value}>
												   <td>{measure.label}</td>
												   <td>Habitat</td>
												   <td>{measure.utility==='1'? 'Desired':'UnDesired'}</td>
												   <td>{measure.weight.toUpperCase()}</td>
											   </tr>
										   ))
										}
										{weights.wq.selected&&
										   weights.wq.selected.map(measure=>(
											   <tr key={measure.value}>
												   <td>{measure.label}</td>
												   <td>Water</td>
												   <td>{measure.utility==='1'? 'Desired':'UnDesired'}</td>
												   <td>{measure.weight.toUpperCase()}</td>
											   </tr>
										   ))
										}
										{weights.lcmr.selected&&
										   weights.lcmr.selected.map(measure=>(
											   <tr key={measure.value}>
												   <td>{measure.label}</td>
												   <td>LCMR</td>
												   <td>{measure.utility==='1'? 'Desired':'UnDesired'}</td>
												   <td>{measure.weight.toUpperCase()}</td>
											   </tr>
										   ))
										}
										{weights.cl.selected&&
										   weights.cl.selected.map(measure=>(
											   <tr key={measure.value}>
												   <td>{measure.label}</td>
												   <td>Resilience</td>
												   <td>{measure.utility==='1'? 'Desired':'UnDesired'}</td>
												   <td>{measure.weight.toUpperCase()}</td>
											   </tr>
										   ))
										}
										{weights.eco.selected&&
										   weights.eco.selected.map(measure=>(
											   <tr key={measure.value}>
												   <td>{measure.label}</td>
												   <td>Economy</td>
												   <td>{measure.utility==='1'? 'Desired':'UnDesired'}</td>
												   <td>{measure.weight.toUpperCase()}</td>
											   </tr>
										   ))
										}
                                    </tbody>     
								    </Table>
									Goal Weights:
									<Table striped bordered hover size="sm">
									<thead>
                                        <tr>
                                          <th>RESTORE Goal</th>
										  <th>Goal Weights</th>
                                        </tr>
                                    </thead>
									<tbody>
										{RESTOREGoal.map((goal,idx)=>{
											return (
												<tr key={idx}>
													<td>{goal}</td>
													<td>{Object.values(weights)[idx].weight}%</td>
												</tr>
											)
										})}

								    </tbody>
									</Table>
									<Button className="ml-2" variant='dark' onClick={()=>{
										async function calculateNewData(){
											const newAoiData = aoiSelected.map(item=>getScaledForAssessment(aoi[item.value].rawScore,aoi[item.value].id,aoi[item.value].name))
											const goalList ={
												hab:"Habitat",
												wq:"Water Quality & Quantity",
												lcmr:"Living Costal & Marine Resources",
												cl:"Community Resilience",
												eco:"Gulf Economy"
											}
											const newWeights = Object.entries(weights).map(goal=>{
												return {goal: goalList[goal[0]], weights:goal[1].weight/100}
											})
											const newAoi = mergeIntoArray(newAoiData);
											const scoreByGoal = calculateMeasures(newAoiData,weights);
											const result = await axios.post('http://localhost:5000/mcda',{
												mean: scoreByGoal,
												std: 0.1
											});
											const returnData = {
												aoi: newAoi,
												aoiScore: scoreByGoal,
												weights: newWeights,
												rankAccept: result.data.rankAccept,
												centralWeight: result.data.centralWeight
											}
											dispatch(generate_assessment(returnData));
										}
										
										if(Object.values(weights).reduce((a,b)=>{return a+b.weight},0)!==100 || aoiSelected.length<=1){
											handleShow()
										}else{
											calculateNewData().then(()=>{
												history.push("/assessment");
												// This won't work
												// return <Redirect to="/assessment"/>
											});
										}
										
									}}>Generate Assessment</Button>
								</Card.Body>
							</Accordion.Collapse>
						</Card>
					</Accordion>
                    </div>
                    <Modal show={show} onHide={handleClose} centered>
                    <Modal.Header closeButton>
                        <Modal.Title>Oops, Something went wrong!</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>Please make sure the sum of RESTORE Goals to be 100, at least 1 data measure is selected and at least 2 area of interests selected.</Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    </Modal.Footer>
                </Modal>
                </div>
    )
}

export default SidebarAssemble;