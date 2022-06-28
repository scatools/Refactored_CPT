import React from "react";
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { useSelector } from "react-redux";

const UserDefinedResult = ({ aoiScoreCustomized }) => {
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
  const assessment = useSelector((state) => state.assessment);
  const data = aoiScoreCustomized.map((aoi, index) => {
    return {
      Score:
        Math.floor(
          aoi.reduce((a, b, index) => {
            return a + b * assessment.weights[index].weights;
          }, 0) * 100
        ) / 100,
      Name: assessment.aoi.name[index],
      Fill: aoiColors[index % 20],
    };
  });

  const payloadData = data.map((e) => {
    return {
      value: e.Name,
      type: "square",
      color: `${e.Fill}80`,
    };
  });

  console.log(payloadData);

  return (
    <>
      <BarChart
        width={1000}
        height={500}
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="none" label="Area of Interset" />
        <YAxis
          label={{ value: "Overall Score", angle: -90, position: "insideLeft" }}
        />
        <Tooltip />
        <Legend
          align="right"
          verticalAlign="middle"
          layout="vertical"
          payload={payloadData}
        />
        <Bar dataKey="Score">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.Fill} fillOpacity={0.5} />
          ))}
        </Bar>
      </BarChart>
    </>
  );
};

export default UserDefinedResult;
