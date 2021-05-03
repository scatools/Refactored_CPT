import React, { useState, useRef, useEffect } from 'react';
import MapGL,{Source, Layer} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Editor, DrawPolygonMode, EditingMode } from 'react-map-gl-draw';
import { getFeatureStyle, getEditHandleStyle } from './drawStyle';
import { useSelector } from 'react-redux';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiY2h1Y2swNTIwIiwiYSI6ImNrMDk2NDFhNTA0bW0zbHVuZTk3dHQ1cGUifQ.dkjP73KdE6JMTiLcUoHvUA';

const Map = ({ drawingMode, setFeatureList, aoiSelected,editAOI }) => {
	const [ viewport, setViewport ] = useState({
		latitude: 27.8,
		longitude: -88.4,
		zoom: 6,
		bearing: 0,
		pitch: 0
	});
	const aoi = Object.values(useSelector((state) => state.aoi)).filter((aoi) => aoi.id === aoiSelected);
	const [ mode, setMode ] = useState(null);
	const [ selectedFeatureIndex, setSelectedFeatureIndex ] = useState(null);
	const onSelect = (options) => {
		setSelectedFeatureIndex(options && options.selectedFeatureIndex);
	};
	const editorRef = useRef(null);
	const onDelete = () => {
		const selectedIndex = selectedFeatureIndex;
		if (selectedIndex !== null && selectedIndex >= 0) {
			editorRef.current.deleteFeatures(selectedIndex);
		}
	};

	const onUpdate = ({ editType }) => {
		if (editType === 'addFeature') {
			setMode(new EditingMode());
		}
	};
	useEffect(() => {
		if (editorRef.current) {
			const featureList = editorRef.current.getFeatures();
			setFeatureList(featureList);
		}
	});
	useEffect(
		() => {
			if (!drawingMode && editorRef.current) {
				const featureList = editorRef.current.getFeatures();
				const featureListIdx = featureList.map((feature, idx) => idx);
				setFeatureList([]);
				if (featureListIdx.length > 0) {
					editorRef.current.deleteFeatures(featureListIdx);
				}
			}
		},
		[ drawingMode, setFeatureList ]
	);

	useEffect(
		()=>{
			if(editAOI && aoiSelected && drawingMode && editorRef.current.getFeatures().length===0){
				editorRef.current.addFeatures(aoi[0].geometry);
			}
		},[editAOI,aoi,drawingMode,aoiSelected]
	)

	const renderDrawTools = () => {
		// copy from mapbox
		return (
			<div className="mapboxgl-ctrl-top-right">
				<div className="mapboxgl-ctrl-group mapboxgl-ctrl">
					<button
						className="mapbox-gl-draw_ctrl-draw-btn mapbox-gl-draw_polygon"
						title="Polygon tool (p)"
						onClick={async () => {
							setMode(new DrawPolygonMode());
						}}
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

	return (
		<MapGL
			{...viewport}
			style={{ position: 'fixed' }}
			width="100vw"
			height="94.3vh"
			mapStyle="mapbox://styles/mapbox/light-v9"
			onViewportChange={(nextViewport) => setViewport(nextViewport)}
			mapboxApiAccessToken={MAPBOX_TOKEN}
		>
			<Editor
				ref={editorRef}
				style={{ width: '100%', height: '100%' }}
				clickRadius={12}
				mode={mode}
				onSelect={onSelect}
				onUpdate={onUpdate}
				editHandleShape={'circle'}
				featureStyle={getFeatureStyle}
				editHandleStyle={getEditHandleStyle}
			/>
			{aoi.length > 0 && !editAOI && (
				<Source type="geojson" data={{
					type:'FeatureCollection',
					features: aoi[0].geometry
				}}>
					<Layer  id="data" type="fill" paint={{"fill-color":'#fee08b','fill-opacity': 0.8}}/>
				</Source>
			)}
			{drawingMode && renderDrawTools()}
		</MapGL>
	);
};

export default Map;
