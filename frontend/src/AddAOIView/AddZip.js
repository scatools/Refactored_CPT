import React, { useCallback } from "react";
import Dropzone from "react-dropzone";
import { Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setLoader, input_aoi } from "../action";
import { calculateArea, aggregate, getStatus } from "../helper/aggregateHex";
import shp from "shpjs";
import { v4 as uuid } from "uuid";

const AddZip = ({ setAlerttext, setView }) => {
  const dispatch = useDispatch();

  const onDrop = useCallback(
    async (acceptedFiles) => {
      const handleSubmitShapefile = async (
        geometry,
        geometryType,
        aoiNumber
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
        const res = await axios.post(
          "https://sca-cpt-backend.herokuapp.com/data",
          { data }
        );
        const planArea = calculateArea(newList);
        dispatch(
          input_aoi({
            name: "Area of Interest " + aoiNumber,
            geometry: newList,
            hexagons: res.data.data,
            rawScore: aggregate(res.data.data, planArea),
            scaleScore: getStatus(aggregate(res.data.data, planArea)),
            id: uuid(),
          })
        );
        dispatch(setLoader(false));
        setView("viewCurrent");
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
              // Add geometry type as a parameter to cater to both Polygon and MultiPolygon
              handleSubmitShapefile(
                result.features[num].geometry,
                result.features[num].geometry.type,
                parseInt(num) + 1
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
