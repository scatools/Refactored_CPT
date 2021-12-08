import React from "react";

const Legend = ({ aoiList, aoiColors }) => {
  return (
    <div className="legend">
      <div className="legend-title">Areas of Interest</div>
      <div className="legend-scale">
        <ul className="legend-labels">
          {aoiList.length > 0 &&
            aoiList.map((aoi) => (
              <li>
                <span
                  style={{
                    background: aoiColors[aoiList.indexOf(aoi)],
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
