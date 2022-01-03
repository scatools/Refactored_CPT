import React, { useCallback, useState, useRef } from "react";
import Dropzone from "react-dropzone";
import { Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setLoader, input_aoi } from "../action";
import { calculateArea, aggregate, getStatus } from "../helper/aggregateHex";
import shp from "shpjs";
import { v4 as uuid } from "uuid";
import TimeoutError from "../TimeoutError";

const AddZip = ({ setAlerttext, setView }) => {
  const dispatch = useDispatch();
  const [timeoutError, setTimeoutError] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const zipRef = useRef(countdown);

  function updateState(newState) {
    zipRef.current = newState;
    setCountdown(newState);
  }

  const timeoutHandler = () => {
    setTimeoutError(true);
    setInterval(() => {
      updateState(zipRef.current - 1);
    }, 1000);
    window.setTimeout(resetButton, 5000);
  };

  const resetButton = () => {
    window.location.reload(true);
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const handleSubmitShapefile = async (
        geometry,
        geometryType,
        aoiNumber,
        aoiName
      ) => {
        setAlerttext(false);
        // Coordinates must be a single array for the area to be correctly calculated
        const newList = geometry.coordinates.map((coordinates) => ({
          type: "Feature",
          properties: {},
          geometry: {
            type: geometryType,
            coordinates: [coordinates],
          },
        }));
        // console.log(newList);
        const data = geometry;

        // For development on local server
        // const res = await axios.post('http://localhost:5000/data', { data });
        // For production on Heroku
        dispatch(setLoader(true));
        let loadTimer = setTimeout(() => timeoutHandler(), 3000);
        const res = await axios.post(
          "https://sca-cpt-backend.herokuapp.com/data",
          { data }
        );
        const planArea = calculateArea(newList);
        dispatch(
          input_aoi({
            name: aoiName ? aoiName : "Area of Interest " + aoiNumber,
            geometry: newList,
            hexagons: res.data.data,
            rawScore: aggregate(res.data.data, planArea),
            scaleScore: getStatus(aggregate(res.data.data, planArea)),
            id: uuid(),
          })
        );
        setView("viewCurrent");
        dispatch(setLoader(false));
        clearTimeout(loadTimer);
      };

      for (let file of acceptedFiles) {
        dispatch(setLoader(true));
        const reader = new FileReader();
        reader.onload = async () => {
          const result = await shp(reader.result);
          if (result) {
            // console.log(result.features);
            // Features are stored as [0:{}, 1:{}, 2:{}, ...]
            for (var num in result.features) {
              var featureGeometry = result.features[num].geometry;
              var featureGeometryType = result.features[num].geometry.type;
              var featureNumber = parseInt(num) + 1;
              var featureName = null;
              // Check if each feature has a name-like property
              for (var property in result.features[num].properties) {
                if (
                  property.indexOf("name") != -1 ||
                  property.indexOf("Name") != -1 ||
                  property.indexOf("NAME") != -1
                ) {
                  featureName = result.features[num].properties[property];
                }
              }
              // Add geometry type as a parameter to cater to both Polygon and MultiPolygon
              handleSubmitShapefile(
                featureGeometry,
                featureGeometryType,
                featureNumber,
                featureName
              );
            }
          }
        };
        reader.readAsArrayBuffer(file);
      }
      dispatch(setLoader(true));
    },
    [dispatch]
  );

  return (
    <div>
      {timeoutError && <TimeoutError countdown={countdown} />}
      <Container className="m-auto file-drop">
        <Dropzone onDrop={onDrop} accept=".zip">
          {({ getRootProps, getInputProps }) => (
            <div {...getRootProps()}>
              <input {...getInputProps()} />
              Click me to upload a file!
            </div>
          )}
        </Dropzone>
      </Container>
    </div>
  );
};

export default AddZip;
