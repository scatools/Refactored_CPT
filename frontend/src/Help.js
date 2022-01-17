import React from "react";
import { Container, Jumbotron, Button } from "react-bootstrap";

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
          <p>For more information, please contact our Project Coordinator</p>
          <b>Dr. Amanda Sesser</b>
          <p className="text-muted">Project Coordinator</p>
          <Button variant="success" href="mailto:scaprojectgulf@gmail.com">
            Send an email
          </Button>
          <hr></hr>
          <p>Or one of our project's Principal Investigators:</p>
          <b className="mb-2">Dr. Kristine Evans</b>
          <p className="mb-0 text-muted">
            Co-Director of the Quantitative Ecology and Spatial Technologies Lab
            (QuEST) Lab
          </p>
          <p className="mb-0 text-muted">Mississippi State University</p>
          <Button
            className="mt-2"
            variant="success"
            href="mailto:scaprojectgulf@gmail.com"
          >
            Send an email
          </Button>
          <br /> <br />
          <a href="https://scatools.github.io/learnmore/" target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="black"
              class="bi bi-github"
              viewBox="0 0 16 16"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>{" "}
          <span /> <span /> <span /> <span /> <span />
          <a href="https://www.quest.fwrc.msstate.edu/sca/help-docs.php" target="_blank">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="30"
              height="30"
              fill="black"
              class="bi bi-file-earmark-play"
              viewBox="0 0 16 16"
            >
              <path d="M6 6.883v4.234a.5.5 0 0 0 .757.429l3.528-2.117a.5.5 0 0 0 0-.858L6.757 6.454a.5.5 0 0 0-.757.43z" />
              <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2zM9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5v2z" />
            </svg>
          </a>
        </Jumbotron>
      </Container>
    </div>
  );
};

export default Help;
