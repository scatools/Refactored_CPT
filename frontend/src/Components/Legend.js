import React from "react";
import { v4 as uuid } from "uuid";

const Legend = ({ aoiList, aoiColors }) => {
  return (
    <div className="legend">
      <div className="legend-title">Areas of Interest</div>
      <div className="legend-scale">
        <ul className="legend-labels">
          {aoiList.length > 0 &&
            aoiList.map((aoi, index) => (
              <li id={uuid()}>
                <span
                  style={{
                    background: aoiColors[index],
                    opacity: 0.5,
                  }}
                />
                {aoi.name}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};
export default Legend;
