import React, { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { setLoader } from "../Redux/action";

const TimeoutError = () => {
  const dispatch = useDispatch();
  const [show, setShow] = useState(true);
  const handleClose = () => setShow(false);

  dispatch(setLoader(false));

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          <h1>TIMEOUT ERROR</h1>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Your Areas of Interest is too large, or you have overlapping polygons.{" "}
        <br />
        Please make your AOI smaller, or ensure that you do not have overlapping
        polygons.
      </Modal.Body>
      <Modal.Footer className="timeout">
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default TimeoutError;
