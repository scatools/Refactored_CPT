import React from "react";
import { Container, Jumbotron, Button } from "react-bootstrap";
import emailjs from "@emailjs/browser";
import * as Survey from "survey-react";
import "survey-react/modern.css";
import { SiGitbook, SiGithub } from "react-icons/si";
import { MdVideoLibrary } from "react-icons/md";

const Help = () => {
  Survey.StylesManager.applyTheme("modern");

  const json = {
    elements: [
      {
        type: "text",
        name: "name",
        title: "Please enter your name",
        isRequired: true,
      },
      {
        type: "text",
        name: "institution",
        title: "Please enter your institution",
        isRequired: false,
      },
      {
        type: "text",
        name: "email",
        title: "Please enter your Email",
        isRequired: true,
      },
      {
        type: "text",
        name: "feedback",
        title: "Please tell us any support you need or any feedback you have",
        isRequired: true,
      },
    ],
  };

  const onComplete = (survey, options) => {
    console.log("Survey results: " + JSON.stringify(survey.data));
    emailjs
      .send(
        "service_scagulf",
        "template_scagulf",
        survey.data,
        process.env.EMAILJS_USERID
      )
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        }
      );
  };

  const model = new Survey.Model(json);

  return (
    <div>
      <Container>
        <Jumbotron>
          <h2>Support Ticket</h2>
          <p className="lead">
            Please open a support ticket or leave your feedback here
          </p>
          <Survey.Survey model={model} onComplete={onComplete} />
          <hr />
          <h2>Contact Us</h2>
          <p className="lead">
            Please contact our project managers for more information about SCA
            Project
          </p>
          <div className="d-flex">
            <div
              className="d-flex flex-column justify-content-between"
              style={{ width: "50%" }}
            >
              <b>Ione Anderson</b>
              <p className="text-muted my-1">Project Coordinator</p>
              <br />
              <br />
              <br />
              <Button
                className="btn-primary"
                style={{ width: "30%" }}
                href="mailto:ioneanderson@icloud.com"
              >
                Send Email
              </Button>
            </div>
            <div
              className="d-flex flex-column justify-content-between"
              style={{ width: "50%" }}
            >
              <b>Dr. Kristine Evans</b>
              <p className="text-muted my-1">Principal Investigator</p>
              <p className="text-muted my-1">
                Assistant Professor of Conservation Biology, Mississippi State
                University
              </p>
              <p className="text-muted my-1">
                Co-Director of the Quantitative Ecology and Spatial Technologies
                Lab (QuEST) Lab
              </p>
              <Button
                className="btn-primary"
                style={{ width: "30%" }}
                href="mailto:kristine.evans@msstate.edu"
              >
                Send Email
              </Button>
            </div>
          </div>
          <hr />
          <h2>Documentation</h2>
          <p className="lead">
            Please visit our documentation page to get the glossary and know
            more about the methodology
          </p>
          <div className="d-flex justify-content-between">
            <p className="text-muted">
              <b>GitBook Glossary </b>
              <a
                href="https://scatoolsuite.gitbook.io/sca-tool-suite/"
                target="_blank"
                rel="noreferrer"
              >
                <SiGitbook size={30} />
              </a>
            </p>
            <p className="text-muted">
              <b>GitHub Repository </b>
              <a
                href="https://github.com/scatools/Refactored_CPT"
                target="_blank"
                rel="noreferrer"
              >
                <SiGithub size={30} />
              </a>
            </p>
            <p className="text-muted">
              <b>Video Tutorial </b>
              <a
                href="https://www.quest.fwrc.msstate.edu/sca/help-docs.php"
                target="_blank"
                rel="noreferrer"
              >
                <MdVideoLibrary size={30} />
              </a>
            </p>
          </div>
        </Jumbotron>
      </Container>
    </div>
  );
};

export default Help;
