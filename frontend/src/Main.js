import React,{useState} from 'react';
import Sidebar from './Sidebar';
import { Button } from 'react-bootstrap';
import Map from './Map';
import AoiDetailTable from './AoiDetailTable';
import Modal from 'react-bootstrap/Modal';

const Main = () => {
	const [activeSidebar, setActiveSidebar] = useState(false);
	const [activeTable, setActiveTable] = useState(null);
	const [drawingMode,setDrawingMode] = useState(false);
	const [featureList,setFeatureList] = useState([]);
	const [ aoiSelected, setAoiSelected ] = useState(null);
	const [editAOI, setEditAOI] = useState(false);
	const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
	return (
		<div>
			<AoiDetailTable activeTable={activeTable} setActiveTable={setActiveTable}/>
			<Sidebar activeSidebar={activeSidebar} 
					setActiveSidebar={setActiveSidebar} 
					setActiveTable={setActiveTable} 
					setDrawingMode={setDrawingMode} 
					featureList={featureList}
					aoiSelected={aoiSelected} 
					setAoiSelected={setAoiSelected}
					editAOI={editAOI} 
					setEditAOI={setEditAOI}
			/>
			<div className="content">
				<Button
					style={{ position: 'absolute', top: '20px', left: '50px', zIndex: 1 }}
					className="sidebarControlBtn"
					variant="secondary"
					onClick={() => {
						setActiveSidebar(true);
					}}
				>
					Start
				</Button>
                <Map drawingMode={drawingMode} setFeatureList={setFeatureList} aoiSelected={aoiSelected} editAOI={editAOI}/>
			<div className="content">
			<Button variant="secondary" 
			style={{ position: 'absolute', top: '20px', left: '150px', zIndex: 1 }}
			onClick={handleShow}>
       		Project Mode
      		</Button>

      		<Modal show={show} onHide={handleClose} size="lg">
        	<Modal.Header closeButton>
          	<Modal.Title>Welcome to the Gulf State's Land Conservation Prioritization Tool</Modal.Title>
        	</Modal.Header>
        	<Modal.Body>Using this tool, you can create a custom report on your areas of interest (up to 10), with our catalog of over 15 metrics and address particular conservation and restoration questions.
			<br/> <br/>
			<b>Some key features:</b><br/>
			<ul>
			<li>Quickly create custom prioritization maps</li>
			<li>HTML and CSV outputs</li>
			<li>Over 15 metrics</li>
			</ul>
			<b>Intended Use</b><br/>
    		<p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The Gulf Conservation Prioritization Tool (CPT) is <b>not</b> intended to be prescriptive. Instead this tool was designed to provide data to <b>support</b> conservation planning efforts across the Gulf Coast Region. All users acknowledge that the CPT model is intended to <b>explore</b> ecological and socioeconomic co-benefits of proposed areas of land conservation, and should <b>not</b> be used in a decision making context.
			</p><p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;The flexibility of this tool enables a user to evaluate conservation alternatives using either a multi-criteria decision analysis (MCDA) framework, or user-defined values.</p>
			</Modal.Body>
			<Modal.Footer>
          	<Button variant="secondary" onClick={handleClose}>
            Single Project Mode
          	</Button>
          	<Button variant="secondary" onClick={handleClose}>
            Multiple Project Mode
          	</Button>
			<Button variant="secondary" onClick={handleClose}>
            Portfolio Mode
          	</Button>
        	</Modal.Footer>
      		</Modal>
			</div>
			</div>
			
		</div>
	);
};

export default Main;
