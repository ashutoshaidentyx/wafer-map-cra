import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner } from "react-bootstrap";
import { Row, Col, Grid, Card } from "antd";

const { useBreakpoint } = Grid;

const DefectListGallery = () => {
  const [waferDataList, setWaferDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const screens = useBreakpoint();

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

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spinner animation="border" />
      </div>
    );
  }

  if (!waferDataList.length) return <p>No data found.</p>;

  // Responsive wafer sizing
  const getWaferSize = () => {
    if (screens.xxl) return 280;
    if (screens.xl) return 250;
    if (screens.lg) return 220;
    if (screens.md) return 200;
    if (screens.sm) return 180;
    return 160;
  };

  const baseWaferSize = 755.90551181;
  const cardSize = getWaferSize();
  const scale = cardSize / baseWaferSize;
  const waferSize = baseWaferSize * scale;
  const center = waferSize / 2;

  return (
    <div style={{ padding: "16px" }}>
      <Row gutter={[16, 16]}>
        {waferDataList.map((waferData, index) => {
          const dieCoordinates = waferData.SampleTestPlan || [];
          const defects =
            waferData.DefectList?.map((d) => ({
              x: d.XINDEX,
              y: d.YINDEX,
              size: (d.DSIZE / 1000) * scale * 10,
            })) || [];

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
            <Col key={index} xs={24} sm={12} md={8} lg={6} xl={6} xxl={4}>
           
                <div
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: `${waferSize}px`,
                  }}
                >
                  <div
                    style={{
                      position: "relative",
                      width: waferSize,
                      height: waferSize,
                      borderRadius: "50%",
                      border: "2px solid #ff4d4f",
                      background: "#fff",
                      overflow: "hidden",
                      flexShrink: 0,
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
                        background: "#1890ff",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: center,
                        left: 0,
                        width: "100%",
                        height: 1,
                        background: "#1890ff",
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
                          key={idx}
                          style={{
                            position: "absolute",
                            left: posX - dieSize / 2,
                            top: posY - dieSize / 2,
                            width: dieSize,
                            height: dieSize, border: "1px solid #d9d9d9",
                            backgroundColor: x === 0 && y === 0 ? "#fff566" : "#fafafa",
                          }}
                        />
                      );
                    })}

                    {/* Defects */}
                    {defects.map((defect, idx) => {
                      const posX = center + (defect.x - (minX + maxX) / 2) * dieSize;
                      const posY = center - (defect.y - (minY + maxY) / 2) * dieSize;
                      const dx = posX - center;
                      const dy = posY - center;
                      if (Math.sqrt(dx * dx + dy * dy) > waferSize / 2) return null;

                      return (
                        <div
                          key={idx}
                          style={{
                            position: "absolute",
                            left: posX - defect.size / 2,
                            top: posY - defect.size / 2,
                            width: defect.size,
                            height: defect.size,
                            backgroundColor: "#000",
                            opacity: 0.7,
                          }}
                          title={`Defect at (${defect.x}, ${defect.y})`}
                        />
                      );
                    })}
                  </div>
                </div>

                 <div style={{ marginTop: 8, fontWeight: "bold",display:"flex",justifyContent:"center" }}>
              {`Wafer ${waferData.WaferID || index + 1}`}
              </div>
            </Col>
          );
        })}
      </Row>
    </div>
  );
};

export default DefectListGallery;