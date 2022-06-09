import React from "react";

const UserReport = ({ reportScript }) => {
  return <div dangerouslySetInnerHTML={{ __html: reportScript }} />;
};

export default UserReport;
