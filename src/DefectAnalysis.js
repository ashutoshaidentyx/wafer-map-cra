import React from "react";
import { Tabs } from "antd";
import "antd/dist/reset.css";

import DefectListGallery from "./defectAnalysis/DefectListGallery";
import DefectListGrid from "./defectAnalysis/DefectListGrid"; // Make sure this exists
import CompositeBinComponent from "./CompositBin";
import CompositBinPercantage from "./CompositBinPercantage";

const DefectAnalysis = () => {
  return (
    <div style={{ padding: 20 }}>
      <h1>Defect Analysis</h1>

      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "Analyze by Map",
            children:<DefectListGrid />,
          },
          {
            key: "2",
            label: "Analyze by Gallery",
            children: <DefectListGallery />,
          },
           {
            key: "3",
            label: "Bin Stack by bin number",
            children: <CompositeBinComponent gridCols={4}/>,
          },
          {
            key: "4",
            label: "Number of bin percentage",
            children: <CompositBinPercantage gridCols={4} />,
          }
        ]}
      />
    </div>
  );
};

export default DefectAnalysis;
