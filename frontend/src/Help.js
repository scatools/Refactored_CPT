import React from 'react';
import { Container, Jumbotron, Button } from 'react-bootstrap';

const Help = () => {
	return (
        <div>
		<Container>
			<Jumbotron>
				<h2>Contact Us</h2>
				<p className="lead">
                Your input is really valuable to us. Please let us know!
				</p>
                <hr></hr>
				<p>
                    For more information, please contact our Project Coordinator
				</p>
                <b>Dr. Amanda Sesser</b>
                <p className='text-muted'>Project Coordinator</p>
                <Button variant="success" href="mailto:scaprojectgulf@gmail.com">Send an email</Button>
                <hr></hr>
				<p>
                Or one of our project's Principal Investigators:
				</p>
                <b className="mb-2">Dr. Kristine Evans</b>
                <p className="mb-0 text-muted">Co-Director of the Quantitative Ecology and Spatial Technologies Lab (QuEST) Lab</p>
                <p className="mb-0 text-muted">Department of Wildlife Fisheries and Aquaculture</p>
                <p className="mb-0 text-muted">Mississippi State University</p>
                <Button className="mt-2" variant="success" href="mailto:scaprojectgulf@gmail.com">Send an email</Button>
			</Jumbotron>
		</Container>
        </div>
	);
};

export default Help;