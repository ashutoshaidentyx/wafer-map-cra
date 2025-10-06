 import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Carousel as BCarousel, Card, Spinner } from "react-bootstrap";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";


const DefectListGrid = () => {
  const [waferDataList, setWaferDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    fetch("/wafer_inspetion.json")
      .then((res) => res.json())
      .then((data) => {
        console.log("Fetched JSON:", data);
        setWaferDataList(Array.isArray(data) ? data : [data]);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading JSON:", err);
        setLoading(false);
      });
  }, []);

  const handleSelect = (selectedIndex) => {
    setActiveIndex(selectedIndex);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  if (!waferDataList.length) return <p>No data found.</p>;

  // Wafer scaling
  const baseWaferSize = 755.90551181;
  const cardSize = 600;
  const scale = cardSize / baseWaferSize;
  const waferSize = baseWaferSize * scale;
  const center = waferSize / 2;

  return (
    <div style={{ padding: 16 }}>
      <BCarousel
        activeIndex={activeIndex}
        onSelect={handleSelect}
        controls={true}
        indicators={true}
        interval={null}
        wrap={true}
        nextIcon={<RightOutlined style={{ fontSize: 24, color: "#333" }} />}
        prevIcon={<LeftOutlined style={{ fontSize: 24, color: "#333" }} />}
      >
        {waferDataList.map((waferData, index) => {
          const dieCoordinates = waferData.SampleTestPlan || [];
          const defects =
            waferData.DefectList?.map((d) => ({
              x: d.XINDEX,
              y: d.YINDEX,
              size: (d.DSIZE / 1000) * scale * 10,
            })) || [];

          // Calculate die grid bounds
          const xs = dieCoordinates.map(([x]) => x);
          const ys = dieCoordinates.map(([_, y]) => y);
          const minX = Math.min(...xs);
          const maxX = Math.max(...xs);
          const minY = Math.min(...ys);
          const maxY = Math.max(...ys);
          const numDiesX = maxX - minX + 1;
          const numDiesY = maxY - minY + 1;
          const dieSizeX = waferSize / numDiesX;
          const dieSizeY = waferSize / numDiesY;
          const dieSize = Math.min(dieSizeX, dieSizeY);

          return (
            <BCarousel.Item key={`wafer-${index}`}>
              <div className="d-flex justify-content-center py-4">
                <Card
                  style={{
                    width: 900,
                    height:700,
                    borderRadius: 12,
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                  }}
                >
                  <Card.Body className="text-center">
                    <Card.Title>Wafer {waferData.WaferID || index + 1}</Card.Title>

                    <div
                      style={{
                        position: "relative",
                        width: waferSize,
                        height: waferSize,
                        borderRadius: "50%",
                        border: "3px solid red",
                        margin: "0 auto",
                        background: "#fff",
                        overflow: "hidden",
                      }}
                    >
                      {/* Cross lines */}
                      <div
                        style={{
                          position: "absolute",
                          left: center,
                          top: 0,
                          width: 1,
                          height: "100%",
                          background: "blue",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: center,
                          left: 0,
                          width: "100%",
                          height: 1,
                          background: "blue",
                        }}
                      />

                      {/* Die grid */}
                      {dieCoordinates.map(([x, y], idx) => {
                        const posX = center + (x - (minX + maxX) / 2) * dieSize;
                        const posY = center - (y - (minY + maxY) / 2) * dieSize;
                        const dx = posX - center;
                        const dy = posY - center;
                        if (Math.sqrt(dx * dx + dy * dy) > waferSize / 2) return null;

                        return (
                          <div
                            key={`die-${idx}`}
                            style={{
                              position: "absolute",
                              left: posX - dieSize / 2,
                              top: posY - dieSize / 2,
                              width: dieSize,
                              height: dieSize,
                              border: "1px solid #ddd",
                              backgroundColor:
                                x === 0 && y === 0 ? "#ffeb3b" : "#f9f9f9",
                            }}
                          />
                        );
                      })}

                      {/* Defects */}
                      {defects.map((defect, idx) => {
                        const posX =
                          center + (defect.x - (minX + maxX) / 2) * dieSize;
                        const posY =
                          center - (defect.y - (minY + maxY) / 2) * dieSize;
                        const dx = posX - center;
                        const dy = posY - center;
                        if (Math.sqrt(dx * dx + dy * dy) > waferSize / 2) return null;

                        return (
                          <div
                            key={`defect-${idx}`}
                            style={{
                              position: "absolute",
                              left: posX - defect.size / 2,
                              top: posY - defect.size / 2,
                              width: defect.size,
                              height: defect.size,
                              backgroundColor: "black",
                              opacity: 0.7,
                            }}
                            title={`Defect at (${defect.x}, ${defect.y})`}
                          />
                        );
                      })}
                    </div>
                  </Card.Body>
                </Card>
              </div>
            </BCarousel.Item>
          );
        })}
      </BCarousel>
    </div>
  );
};

export default DefectListGrid;