// App.js
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route,Link } from "react-router-dom";
import WaferGallery from "./WaferGallery";
import WaferMap from "./WaferMap";
import DefectAnalysis from "./DefectAnalysis"; // ✅ import new component
import { Tabs,Button } from "antd";
import "antd/dist/reset.css";

const { TabPane } = Tabs;

function Home() {
  const [activeKey, setActiveKey] = useState("gallery");

  return (
    <div style={{ padding: 20 }}>
      <h1>Wafer Analysis</h1>
     <Link to="/defect-analysis"><Button className="bg-blue-200">Defect Analysis </Button></Link> 

      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "Analyze by Map",
            children: <WaferMap />,
          },
          {
            key: "2",
            label: "Analyze by Gallery",
            children: <WaferGallery />,
          },
        ]}
      />
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/defect-analysis" element={<DefectAnalysis />} /> {/* ✅ new route */}
      </Routes>
    </Router>
  );
}
