import React, { useCallback } from "react";
import Dropzone from "react-dropzone";
import { Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setLoader, input_aoi } from "../action";
import { calculateArea, aggregate, getStatus } from "../helper/aggregateHex";
import shp from "shpjs";
import { v4 as uuid } from "uuid";
import TimeoutError from "../TimeoutError";

const AddZip = ({
  timeoutError,
  timeoutHandler,
  setHucBoundary,
  setDrawingMode,
  setView,
  setAlertText,
  setAlertType
}) => {
  const dispatch = useDispatch();

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const handleSubmitShapefile = async (
        geometry,
        geometryType,
        aoiNumber,
        aoiName
      ) => {
        setAlertText(false);
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
            speciesName: res.data.speciesName,
            id: uuid(),
          })
        );

        // clearTimeout(loadTimer);
        setView("viewCurrent");
        dispatch(setLoader(false));
      };

      for (let file of acceptedFiles) {
        const reader = new FileReader();
        reader.onload = async () => {
          setTimeout(() => timeoutHandler(), 20000);
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
      // let loadTimer = setTimeout(() => timeoutHandler(), 20);
    },

    [dispatch]
  );
  setHucBoundary(false);
  setDrawingMode(false);
  return (
    <div>
      {timeoutError && <TimeoutError />}

      <Container className="instruction">
        <p>
          You can upload a shapefile with one more areas of interest. Each
          record in the file will become a separate area of interest.{" "}
        </p>
        <p>
          Your zip file must include at least the following files:
          <ul>
            <li>.shp</li>
            <li>.shx</li>
            <li>.prj</li>
          </ul>
        </p>
      </Container>
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
