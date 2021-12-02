import React, { useState } from "react";
import { Button, Container, FormControl, InputGroup } from "react-bootstrap";
import axios from "axios";
import { calculateArea, aggregate, getStatus } from "../helper/aggregateHex";
import { v4 as uuid } from "uuid";
import { input_aoi, setLoader } from "../action";
import { useDispatch } from "react-redux";

const AddDraw = ({
  setDrawingMode,
  setAoiSelected,
  featureList,
  setAlerttext,
  setView,
  setReportLink,
  autoDraw,
}) => {
  const dispatch = useDispatch();
  const [drawData, setDrawData] = useState("");
  const handleNameChange = (e) => {
    setDrawData(e.target.value);
  };
  const handleSubmit = async () => {
    dispatch(setLoader(true));
    if (!drawData) {
      setAlerttext("A name for this area of interest is required.");
      window.setTimeout(() => setAlerttext(false), 4000);
    } else if (featureList.length === 0) {
      setAlerttext("At least one polygon is required.");
      window.setTimeout(() => setAlerttext(false), 4000);
    } else {
      setAlerttext(false);
      const newList = featureList;
      const data = {
        type: "MultiPolygon",
        coordinates: newList.map((feature) => feature.geometry.coordinates),
      };

      // For development on local server
      // const res = await axios.post('http://localhost:5000/data', { data });
      // For production on Heroku
      const res = await axios.post(
        "https://sca-cpt-backend.herokuapp.com/data",
        { data }
      );
      const planArea = calculateArea(newList);
      dispatch(
        input_aoi({
          name: drawData,
          geometry: newList,
          hexagons: res.data.data,
          rawScore: aggregate(res.data.data, planArea),
          scaleScore: getStatus(aggregate(res.data.data, planArea)),
          id: uuid(),
        })
      );
      setDrawingMode(false);
      setView("viewCurrent");
    }

    dispatch(setLoader(false));
  };

  const resetButton = () => {
    window.location.reload(true);
  };

  return (
    <Container className="mt-3">
      <InputGroup className="m-auto" style={{ width: "80%" }}>
        <InputGroup.Prepend>
          <InputGroup.Text id="basic-addon1">Plan Name:</InputGroup.Text>
        </InputGroup.Prepend>
        <FormControl
          name="planName"
          value={drawData}
          onChange={handleNameChange}
          placeholder="Name area of interest here..."
        />
      </InputGroup>
      <hr />
      <Container>
        <Button
          variant="dark"
          style={{ float: "left" }}
          onClick={() => {
            setDrawingMode(true);
            autoDraw();
            setAoiSelected(false);
            setReportLink(false);
          }}
        >
          Add a New Shape
        </Button>
        <Button variant="dark" style={{ float: "left" }} onClick={resetButton}>
          Start Over
        </Button>
        <Button
          variant="dark"
          style={{ float: "right" }}
          onClick={handleSubmit}
        >
          Finalize Input
        </Button>
      </Container>
    </Container>
  );
};

export default AddDraw;