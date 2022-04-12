import React, { useState, useEffect } from 'react';
import { ButtonGroup, ToggleButton, Row, Col } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { v4 as uuid } from 'uuid';
import { Cell, PieChart, Pie, Sector, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";

const MCDAResult = () => {
    const aoiColors = ["#00188f", "#00bcf2", "#00b294", "#009e49", "#bad80a", "#fff100", "#ff8c00", "#e81123", "#ec008c", "#68217a"];
    const colorOpacity = ["FF", "E6", "CC", "B3", "99", "80", "66", "4D", "33", "1A"];
    const opacitySettings = [
      [0],
      [0, 5],
      [0, 4, 8],
      [0, 3, 6, 9],
      [0, 2, 4, 6, 8],
      [0, 1, 2, 3, 4, 5],
      [0, 1, 2, 3, 4, 5, 6],
      [0, 1, 2, 3, 4, 5, 6, 7],
      [0, 1, 2, 3, 4, 5, 6, 7, 8],
      [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
    ];
    const assessment = useSelector((state) => state.assessment);
    const [ aoi, setAoi ] = useState(0);
    const [ fillColor, setFillColor ] = useState("#8884d8");
    const [ pieColors, setPieColors ] = useState(aoiColors);
    const [ activeIndex, setActiveIndex ] = useState(0);
    const [ pieData, setPieData ] = useState([]);
    const [ radarData, setRadarData ] = useState(
        [
            { subject: 'Habitat', score: 0,  fullMark: 1 },
            { subject: 'WQ',score: 0,  fullMark: 1 },
            { subject: 'LCMR', score: 0,  fullMark: 1 },
            { subject: 'Community Resilience', score: 0,  fullMark: 1 },
            { subject: 'Gulf Economy', score: 0, fullMark: 1 }
        ]
    );

    useEffect(()=>{
        setRadarData(data=>[...data].map((goal,index)=>{
            return {
                ...goal,
                score:assessment.centralWeight[aoi][index]
            };
        }));
        setPieData(assessment.rankAccept.map((item,index)=>{return {name:`Rank ${index+1}`, value: item[aoi]}}));
        // Use the same AOI-based color scheme for pie chart and radar chart
        setFillColor(aoiColors[aoi]);
        let aoiLength = assessment.aoi.id.length;
        setPieColors(assessment.aoi.id.map((id,index)=>{return aoiColors[aoi]+colorOpacity[opacitySettings[aoiLength-1][index]]}));
    },[aoi,assessment]);
    
    function onPieEnter(data, index) {
        setActiveIndex(index);
    };

    const renderActiveShape = (props) => {
        const RADIAN = Math.PI / 180;
        const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle,
          fill,  percent,name } = props;
        const sin = Math.sin(-RADIAN * midAngle);
        const cos = Math.cos(-RADIAN * midAngle);
        const sx = cx + (outerRadius + 10) * cos;
        const sy = cy + (outerRadius + 10) * sin;
        const mx = cx + (outerRadius + 30) * cos;
        const my = cy + (outerRadius + 30) * sin;
        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
        const ey = my;
        const textAnchor = cos >= 0 ? 'start' : 'end';
      
        return (
          <g>
            <Sector
              cx={cx}
              cy={cy}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              startAngle={startAngle}
              endAngle={endAngle}
              fill={fill}
            />
            <Sector
              cx={cx}
              cy={cy}
              startAngle={startAngle}
              endAngle={endAngle}
              innerRadius={outerRadius + 6}
              outerRadius={outerRadius + 10}
              fill={fill}
            />
            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none"/>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">{`${name}`}</text>
            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
              {`(Rate ${(percent * 100).toFixed(2)}%)`}
            </text>
          </g>
        );
    };

	return (
        <>
        <Row>
		<ButtonGroup toggle className="ml-4">
			{assessment.aoi.id.map((item, index) => (
				<ToggleButton
          key={uuid()}
					type="radio"
					variant="outline-secondary"
					name={index}
					value={index}
					checked={aoi === index}
					onChange={(e) => setAoi(e.currentTarget.value)}
				>
					{assessment.aoi.name[index]}
				</ToggleButton>
			))}
		</ButtonGroup>
        <hr/>
        <p>Currently Viewing: {assessment.aoi.name[aoi]}</p>
        </Row>
        <Row>
            <Col style={{padding:'10px'}}>
              <PieChart width={550} height={400}>
                <Pie 
                  activeIndex={activeIndex}
                  activeShape={renderActiveShape} 
                  data={pieData} 
                  cx={300} 
                  cy={200} 
                  innerRadius={60}
                  outerRadius={80} 
                  fill={fillColor}
                  onMouseEnter={onPieEnter}
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % 20]} opacity={0.5} />
                  ))}
                </Pie>
              </PieChart>
            </Col>
            <Col>
              <RadarChart cx={300} cy={250} outerRadius={150} width={500} height={500} data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="subject" />
                <PolarRadiusAxis/>
                <Radar dataKey="score" stroke={fillColor} fill={fillColor} fillOpacity={0.5}/>
              </RadarChart>
            </Col>
        </Row>
        
        </>
	);
};

export default MCDAResult;
