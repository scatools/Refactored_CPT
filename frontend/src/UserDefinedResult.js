import React from 'react';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useSelector } from 'react-redux';

const UserDefinedResult = () => {
	const aoiColors = ["#00188f", "#00bcf2", "#00b294", "#009e49", "#bad80a", "#fff100", "#ff8c00", "#e81123", "#ec008c", "#68217a"];
	const assessment = useSelector((state) => state.assessment);
	const data = assessment.aoiScore.map((aoi,index)=>{
			return {
				score: Math.floor(aoi.reduce((a,b,index)=>{return a+b*assessment.weights[index].weights},0)*100)/100,
				name:assessment.aoi.name[index]}
	});
	return (
		<BarChart width={1000} height={500} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
			<CartesianGrid strokeDasharray="3 3" />
			<XAxis dataKey="name" />
			<YAxis />
			<Tooltip />
			<Legend />
			<Bar dataKey="score" fill="#8884d8">
				{data.map((entry, index) => (
					<Cell key={`cell-${index}`} fill={aoiColors[index % 20]} fillOpacity={0.5} />
				))}
			</Bar>
		</BarChart>
	);
};

export default UserDefinedResult;
