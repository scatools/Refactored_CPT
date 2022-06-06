import React, { useState, useRef, useEffect } from "react";
import MapGL, { Source, Layer, Popup } from "react-map-gl";
import { Editor, EditingMode } from "react-map-gl-draw";
import MultiSwitch from "react-multi-switch-toggle";
import { Button } from "react-bootstrap";
import { useSelector } from "react-redux";
import { FiMap } from "react-icons/fi";
import "mapbox-gl/dist/mapbox-gl.css";
import bbox from "@turf/bbox";
import shp from "shpjs";
import Legend from "../Components/Legend";
import { getFeatureStyle, getEditHandleStyle } from "./drawStyle";

const MAPBOX_TOKEN =
  "pk.eyJ1IjoiY2h1Y2swNTIwIiwiYSI6ImNrMDk2NDFhNTA0bW0zbHVuZTk3dHQ1cGUifQ.dkjP73KdE6JMTiLcUoHvUA";

const Map = ({
  drawingMode,
  setFeatureList,
  aoiSelected,
  editAOI,
  viewport,
  setViewport,
  hucBoundary,
  hucIDSelected,
  filterList,
  mode,
  setMode,
  interactiveLayerIds,
  setInteractiveLayerIds,
  autoDraw,
  hexGrid,
  hexDeselection,
  hexIDDeselected,
  hexFilterList,
}) => {
  const [selectBasemap, setSelectBasemap] = useState(false);
  const [basemapStyle, setBasemapStyle] = useState("light-v10");
  const [selectedFeatureIndex, setSelectedFeatureIndex] = useState(null);
  const [hucData, setHucData] = useState(null);
  const [hovered, setHovered] = useState(false);
  const [hoveredProperty, setHoveredProperty] = useState(null);
  const [hoveredGeometry, setHoveredGeometry] = useState(null);
  const [clicked, setClicked] = useState(false);
  const [clickedProperty, setClickedProperty] = useState(null);
  const [filter, setFilter] = useState(["in", "HUC12", "default"]);
  const [hexFilter, setHexFilter] = useState(["in", "objectid", "default"]);
  const editorRef = useRef(null);

  // Up to 10 colors for 10 different AOIs
  const aoiColors = [
    "#00188f",
    "#00bcf2",
    "#00b294",
    "#009e49",
    "#bad80a",
    "#fff100",
    "#ff8c00",
    "#e81123",
    "#ec008c",
    "#68217a",
  ];

  const aoiFullList = Object.values(useSelector((state) => state.aoi));

  const aoiList = Object.values(useSelector((state) => state.aoi)).filter(
    (aoi) => aoi.id === aoiSelected
  );

  const onToggle = (value) => {
    if (value === 0) {
      setBasemapStyle("light-v10");
    } else if (value === 1) {
      setBasemapStyle("dark-v10");
    } else if (value === 2) {
      setBasemapStyle("satellite-v9");
    } else if (value === 3) {
      setBasemapStyle("outdoors-v11");
    }
  };

  const onSelect = (options) => {
    setSelectedFeatureIndex(options && options.selectedFeatureIndex);
  };

  const onDelete = () => {
    const selectedIndex = selectedFeatureIndex;
    if (selectedIndex !== null && selectedIndex >= 0) {
      editorRef.current.deleteFeatures(selectedIndex);
    }
  };

  const onUpdate = ({ editType }) => {
    if (editType === "addFeature") {
      setMode(new EditingMode());
    }
  };

  const renderDrawTools = () => {
    // Copy from mapbox
    return (
      <div className="mapboxgl-ctrl-top-right">
        <div className="mapboxgl-ctrl-group mapboxgl-ctrl">
          <button
            className="mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_polygon"
            title="Polygon tool (p)"
            onClick={autoDraw}
          />

          <button
            className="mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_trash"
            title="Delete"
            onClick={onDelete}
          />
        </div>
      </div>
    );
  };

  const getCursor = ({ isHovering, isDragging }) => {
    return isDragging ? "grabbing" : isHovering ? "crosshair" : "default";
  };

  const onHover = (e) => {
    setHovered(true);
    if (e.features) {
      const featureHovered = e.features[0];
      if (featureHovered) {
        setHoveredProperty(featureHovered.properties);
        setHoveredGeometry(featureHovered.geometry);
      }
    }
  };

  const onClick = (e) => {
    setClicked(true);
    if (e.features) {
      const featureClicked = e.features[0];
      // console.log(featureClicked);
      if (featureClicked) {
        setClickedProperty(featureClicked.properties);
      }
    }
  };

  const renderPopup = () => {
    var aoiBbox = bbox({
      type: "Feature",
      geometry: hoveredGeometry,
    });
    var popupLongitude = (aoiBbox[0] + aoiBbox[2]) / 2;
    var popupLatitude = (aoiBbox[1] + aoiBbox[3]) / 2;

    // Use HUC12 as the unique property to filter out undesired layer
    if (popupLongitude && popupLatitude && hoveredProperty.HUC12) {
      return (
        <Popup
          tipSize={5}
          anchor="top"
          longitude={popupLongitude}
          latitude={popupLatitude}
          closeOnClick={false}
        >
          <div>
            <p>
              <span>
                <b>ID:</b>
              </span>
              {hoveredProperty.HUC12 && <span> {hoveredProperty.HUC12} </span>}
            </p>
            <p>
              <span>
                <b>Name:</b>
              </span>
              {hoveredProperty.NAME && <span> {hoveredProperty.NAME} </span>}
            </p>
          </div>
        </Popup>
      );
    }
  };

  const loadHucBoundary = () => {
    fetch("HUC12_SCA.zip")
      .then((res) => res.arrayBuffer())
      .then((arrayBuffer) => {
        shp(arrayBuffer).then(function (geojson) {
          setHucData(geojson);
        });
      });
  };

  const renderHexGrid = () => {
    const hexFeatureList = aoiList[0].hexagons.map((hex) => {
      return {
        type: "Feature",
        geometry: JSON.parse(hex.geometry),
        properties: { gid: hex.gid, objectid: hex.objectid },
      };
    });
    const hexData = {
      type: "FeatureCollection",
      features: hexFeatureList,
    };
    return (
      <Source type="geojson" data={hexData}>
        <Layer
          id="hex"
          type="fill"
          paint={{
            "fill-outline-color": "#484896",
            "fill-color": "#6e599f",
            "fill-opacity": 0.2,
          }}
        />
        {hexFilterList.map((filter) => (
          <Layer
            id={filter[2]}
            type="fill"
            paint={{
              "fill-outline-color": "red",
              "fill-color": "red",
              "fill-opacity": 0.2,
            }}
            filter={filter}
          />
        ))}
      </Source>
    );
  };

  useEffect(() => {
    if (editorRef.current) {
      const featureList = editorRef.current.getFeatures();
      setFeatureList(featureList);
    }
  });

  useEffect(() => {
    if (!drawingMode && editorRef.current) {
      const featureList = editorRef.current.getFeatures();
      const featureListIdx = featureList.map((feature, idx) => idx);
      setFeatureList([]);
      if (featureListIdx.length > 0) {
        editorRef.current.deleteFeatures(featureListIdx);
      }
    }
  }, [drawingMode, setFeatureList]);

  useEffect(() => {
    if (
      editAOI &&
      aoiSelected &&
      drawingMode &&
      editorRef.current.getFeatures().length === 0
    ) {
      editorRef.current.addFeatures(aoiList[0].geometry);
    }
  }, [editAOI, aoiList, drawingMode, aoiSelected]);

  useEffect(() => {
    if (hucBoundary) {
      setInteractiveLayerIds(["huc"]);
    } else if (hexGrid && hexDeselection) {
      setInteractiveLayerIds(["hex"]);
    } else if (!drawingMode) {
      setInteractiveLayerIds([]);
    }
  }, [drawingMode, hucBoundary, hexGrid, hexDeselection]);

  useEffect(() => {
    if (clickedProperty) {
      // For HUC-12 boundary layer, same watershed area won't be counted twice
      if (
        clickedProperty.HUC12 &&
        !hucIDSelected.includes(clickedProperty.HUC12)
      ) {
        // Array hucIDSelected is stored in a format like [{value: 'xx', label: 'xx'}]
        hucIDSelected.push({
          value: clickedProperty.HUC12,
          label: clickedProperty.HUC12,
        });
        setFilter(["in", "HUC12", clickedProperty.HUC12]);
      }
      // console.log(hucIDSelected);

      // For hex grid layer, same hexagon won't be counted twice
      if (
        clickedProperty.objectid &&
        !hexIDDeselected.includes(clickedProperty.objectid)
      ) {
        // Array hexIDDeselected is stored in a simple array format
        hexIDDeselected.push(clickedProperty.objectid);
        // console.log(hexIDDeselected);
        setHexFilter(["in", "objectid", clickedProperty.objectid]);
      }
    }
  }, [clickedProperty]);

  useEffect(() => {
    filterList.push(filter);
    // console.log(filterList);
  }, [filter]);

  useEffect(() => {
    hexFilterList.push(hexFilter);
    // console.log(hexFilterList);
  }, [hexFilter]);

  return (
    <>
      <Button
        className="basemapButton"
        variant="secondary"
        onClick={() => setSelectBasemap(!selectBasemap)}
      >
        <FiMap />
      </Button>
      {selectBasemap && (
        <div className="basemapSwitch">
          <MultiSwitch
            texts={["Light", "Dark", "Satellite", "Terrain", ""]}
            selectedSwitch={0}
            bgColor={"gray"}
            onToggleCallback={onToggle}
            height={"38px"}
            fontSize={"15px"}
            fontColor={"white"}
            selectedFontColor={"#6e599f"}
            selectedSwitchColor={"white"}
            borderWidth={0}
            eachSwitchWidth={80}
          />
        </div>
      )}
      <MapGL
        {...viewport}
        style={{ position: "fixed" }}
        width="100vw"
        height="94.3vh"
        mapStyle={"mapbox://styles/mapbox/" + basemapStyle}
        onViewportChange={(nextViewport) => setViewport(nextViewport)}
        mapboxApiAccessToken={MAPBOX_TOKEN}
        onHover={onHover}
        onClick={onClick}
        onLoad={loadHucBoundary}
        getCursor={getCursor}
        interactiveLayerIds={interactiveLayerIds}
      >
        <Editor
          ref={editorRef}
          style={{ width: "100%", height: "100%" }}
          clickRadius={12}
          mode={mode}
          onSelect={onSelect}
          onUpdate={onUpdate}
          editHandleShape={"circle"}
          featureStyle={getFeatureStyle}
          editHandleStyle={getEditHandleStyle}
        />
        {!hucBoundary && (
          <Source
            type="vector"
            url="mapbox://chuck0520.bardd4y7"
            maxzoom={22}
            minzoom={0}
          >
            <Layer
              id="sca-boundry"
              source-layer="SCA_Boundry-13ifc0"
              type="fill"
              paint={{
                "fill-outline-color": "#484896",
                "fill-color": "#6e599f",
                "fill-opacity": 0.2,
              }}
              minzoom={0}
              maxzoom={22}
            />
          </Source>
        )}
        {aoiFullList.length > 0 &&
          !hucBoundary &&
          aoiFullList.map((aoi, index) => (
            <Source
              type="geojson"
              data={{
                type: "FeatureCollection",
                features: aoi.geometry,
              }}
            >
              {aoi.id && (
                <Layer
                  id={aoi.id}
                  type="fill"
                  paint={{
                    "fill-color": aoiColors[index],
                    "fill-opacity": 0.5,
                  }}
                />
              )}
            </Source>
          ))}
        {aoiFullList.length > 0 && (
          <Legend aoiList={aoiFullList} aoiColors={aoiColors}></Legend>
        )}
        {aoiList.length > 0 && !drawingMode && !hucBoundary && (
          <Source
            type="geojson"
            data={{
              type: "FeatureCollection",
              features: aoiList[0].geometry,
            }}
          >
            <Layer
              id="data"
              type="fill"
              paint={{
                "fill-color": "transparent",
                "fill-outline-color": "white",
              }}
            />
          </Source>
        )}
        {hucBoundary && hucData && (
          <Source type="geojson" data={hucData}>
            <Layer
              id="huc"
              type="fill"
              paint={{
                "fill-outline-color": "#484896",
                "fill-color": "#6e599f",
                "fill-opacity": 0.2,
              }}
            />
            {filterList.map((filter) => (
              <Layer
                id={filter[2]}
                type="fill"
                paint={{
                  "fill-outline-color": "#484896",
                  "fill-color": "#00ffff",
                  "fill-opacity": 0.2,
                }}
                filter={filter}
              />
            ))}
          </Source>
        )}
        {aoiList.length > 0 && hexGrid && renderHexGrid()}
        {drawingMode && renderDrawTools()}
        {hucBoundary && hovered && renderPopup()}
      </MapGL>
    </>
  );
};

export default Map;
