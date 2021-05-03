import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { useSelector } from 'react-redux';

const UserDefinedResult = () => {
	const assessment = useSelector((state) => state.assessment);
	const data = assessment.aoiScore.map((aoi,index)=>{
			return {
				score: Math.floor(aoi.reduce((a,b,idx)=>{return a+b*assessment.weights[idx].weights},0)*100)/100,
				name:assessment.aoi.name[index]}
	});
	return (
		<BarChart width={1000} height={500} data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
			<CartesianGrid strokeDasharray="3 3" />
			<XAxis dataKey="name" />
			<YAxis />
			<Tooltip />
			<Legend />
			<Bar dataKey="score" fill="#8884d8" />
		</BarChart>
	);
};

export default UserDefinedResult;
