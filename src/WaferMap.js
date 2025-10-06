// // WaferCarouselBootstrap.jsx
// import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import {
//   Carousel as BCarousel,
//   Card,
//   Spinner,
//   Form,
//   Button,
//   Tabs,
//   Tab,
// } from "react-bootstrap";
// import { LeftOutlined, RightOutlined } from "@ant-design/icons";

// const WaferCarouselBootstrap = () => {
//   const [wafers, setWafers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeIndex, setActiveIndex] = useState(0);

//   const [selectedBin, setSelectedBin] = useState("");
//   const [selectedLot, setSelectedLot] = useState("");
//   const [selectedWaferID, setSelectedWaferID] = useState("");
//   const [selectedDevice, setSelectedDevice] = useState("");
//    const [binResult, setBinResult] = useState(null);

//   useEffect(() => {
//     fetch("/waferDataDetail.json")
//       .then((res) => res.json())
//       .then((data) => {
//         setWafers(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error loading JSON:", err);
//         setLoading(false);
//       });
//         // load binResult.json
//     fetch("/binResult.json")
//       .then((res) => res.json())
//       .then((data) => {
//         setBinResult(data); // this file should already be a BinResult object
//       })
//       .catch((err) => {
//         console.error("Error loading binResult.json:", err);
//       });
//   }, []);

//   const getBinColor = (bin) => {
//     switch (bin) {
//       case 1:
//         return "#3f51b5";
//       case 2:
//         return "#00bcd4";
//       case 3:
//         return "#4caf50";
//       case 4:
//         return "#ff9800";
//       case 5:
//         return "#f44336";
//       default:
//         return "#ccc";
//     }
//   };

//   const resetFilters = () => {
//     setSelectedBin("");
//     setSelectedLot("");
//     setSelectedWaferID("");
//     setSelectedDevice("");
//   };

//   const availableLots = [
//     ...new Set(
//       wafers
//         .filter((w) => !selectedDevice || w.Device === selectedDevice)
//         .map((w) => w.Lot)
//     ),
//   ];

//   const availableWafers = [
//     ...new Set(
//       wafers
//         .filter(
//           (w) =>
//             (!selectedDevice || w.Device === selectedDevice) &&
//             (!selectedLot || w.Lot === selectedLot)
//         )
//         .map((w) => w.WaferID)
//     ),
//   ];

//   const filteredWafers = wafers.filter((wafer) => {
//     return (
//       (!selectedDevice || wafer.Device === selectedDevice) &&
//       (!selectedLot || wafer.Lot === selectedLot) &&
//       (!selectedWaferID || wafer.WaferID === selectedWaferID)
//     );
//   });

//   const currentWafer = filteredWafers[activeIndex] || null;

//   if (loading) {
//     return (
//       <div className="text-center py-5">
//         <Spinner animation="border" />
//       </div>
//     );
//   }

//   return (
//     <div style={{ padding: 16 }}>
//       {/* 🔹 Top cascading filter bar */}
//       <div className="d-flex gap-3 mb-4 bg-white p-3 shadow-sm rounded">
//         <Form.Select
//           value={selectedDevice}
//           onChange={(e) => {
//             setSelectedDevice(e.target.value);
//             setSelectedLot("");
//             setSelectedWaferID("");
//           }}
//           style={{ maxWidth: 180 }}
//         >
//           <option value="">Device</option>
//           {[...new Set(wafers.map((w) => w.Device))].map((d) => (
//             <option key={d} value={d}>
//               {d}
//             </option>
//           ))}
//         </Form.Select>

//         <Form.Select
//           value={selectedLot}
//           onChange={(e) => {
//             setSelectedLot(e.target.value);
//             setSelectedWaferID("");
//           }}
//           style={{ maxWidth: 180 }}
//         >
//           <option value="">Lot</option>
//           {availableLots.map((lot) => (
//             <option key={lot} value={lot}>
//               {lot}
//             </option>
//           ))}
//         </Form.Select>

//         <Form.Select
//           value={selectedWaferID}
//           onChange={(e) => setSelectedWaferID(e.target.value)}
//           style={{ maxWidth: 180 }}
//         >
//           <option value="">Wafer</option>
//           {availableWafers.map((id) => (
//             <option key={id} value={id}>
//               {id}
//             </option>
//           ))}
//         </Form.Select>

//         <Form.Select
//           value={selectedBin}
//           onChange={(e) => setSelectedBin(e.target.value)}
//           style={{ maxWidth: 140 }}
//         >
//           <option value="">Bin</option>
//           {[1, 2, 3, 4, 5].map((b) => (
//             <option key={b} value={b}>
//               {b}
//             </option>
//           ))}
//         </Form.Select>

//         <Button variant="primary" onClick={resetFilters}>
//           Retrieve
//         </Button>
//       </div>

//       {/* 🔹 Layout: carousel | right tabs */}
//       <div className="d-flex" style={{ gap: 24 }}>
//         {/* Carousel */}
//         <div className="flex-grow-1">
//           <BCarousel
//             activeIndex={activeIndex}
//             onSelect={(index) => setActiveIndex(index)}
//             controls
//             indicators
//             interval={null}
//             wrap
//             prevIcon={
//               <LeftOutlined style={{ fontSize: "24px", color: "#333" }} />
//             }
//             nextIcon={
//               <RightOutlined style={{ fontSize: "24px", color: "#333" }} />
//             }
//           >
//             {filteredWafers.map((wafer) => {
//               const diePitchX = wafer.DiePitch[0]; // in µm
//               const diePitchY = wafer.DiePitch[1]; // in µm

//               // 🔹 Convert µm → mm
//               const diePitchXmm = diePitchX / 1000;
//               const diePitchYmm = diePitchY / 1000;

//               // 🔹 Convert mm → px (at 96 DPI)
//               const DPI = 96;
//               const diePitchXpx = (diePitchXmm * DPI) / 25.4;
//               const diePitchYpx = (diePitchYmm * DPI) / 25.4;

//               // 🔹 Force square dies (use smaller pitch)
//               const dieSize = Math.min(diePitchXpx, diePitchYpx);
//               const waferRadius = "755.90551181px";

//               // 🔹 Save layout info
//               wafer.layoutInfo = {
//                 diePitchX: diePitchXpx,
//                 diePitchY: diePitchYpx,
//                 waferRadius,
//               };
//               const waferSize = 755.90551181;
//               const center = waferSize / 2;
//               return (
//                 <BCarousel.Item key={wafer.WaferID}>
//                   <div className="d-flex justify-content-center py-4">
//                     <Card
//                       style={{
//                         width: 500,
//                         borderRadius: 12,
//                         boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//                       }}
//                     >
//                       <Card.Body className="text-center">
//                         <Card.Title>Wafer {wafer.WaferID}</Card.Title>

//                         <div
//                           style={{
//                             position: "relative",
//                             width: `${waferSize}px`,
//                             height: `${waferSize}px`,
//                             borderRadius: "50%",
//                             border: "3px solid red", // 🔴 wafer edge
//                             margin: "0 auto",
//                             background: "#fff",
//                             overflow: "hidden", // clip to circle
//                           }}
//                         >
//                           {/* 🔹 Cross lines */}
//                           {/* 🔹 Cross lines */}
//                           <div
//                             style={{
//                               position: "absolute",
//                               left: center,
//                               top: 0,
//                               width: "1px",
//                               height: "100%",
//                               background: "blue",
//                             }}
//                           />
//                           <div
//                             style={{
//                               position: "absolute",
//                               top: center,
//                               left: 0,
//                               width: "100%",
//                               height: "1px",
//                               background: "blue",
//                             }}
//                           />

//                           {/* 🔹 Axis Labels */}
//                           {/* 🔹 Axis Labels */}
//                           {[...Array(11)].map((_, i) => {
//                             const offset = i - 5; // gives -5..+5
//                             if (offset === 0) return null; // skip 0 at center

//                             return (
//                               <React.Fragment key={i}>
//                                 {/* X-axis labels */}
//                                 <div
//                                   style={{
//                                     position: "absolute",
//                                     top: center + 4, // slightly below X axis
//                                     left: center + offset * dieSize - 6,
//                                     fontSize: "12px",
//                                     color: "green",
//                                     fontWeight: "bold",
//                                     zIndex: 9999, // 👉 keeps labels above dies
//                                     pointerEvents: "none", // 👉 makes sure they don't block clicks
//                                   }}
//                                 >
//                                   {offset}
//                                 </div>

//                                 {/* Y-axis labels */}
//                                 <div
//                                   style={{
//                                     position: "absolute",
//                                     left: center + 4, // slightly right of Y axis
//                                     top: center - offset * dieSize - 6,
//                                     fontSize: "12px",
//                                     color: "green",
//                                     fontWeight: "bold",
//                                     zIndex: 9999,
//                                     pointerEvents: "none",
//                                   }}
//                                 >
//                                   {offset}
//                                 </div>
//                               </React.Fragment>
//                             );
//                           })}

//                           {/* 🔹 Sites */}
//                           {/* 🔹 Sites */}
//                           {wafer.BinResult.map((site) => {
//                             const posX = center + site.x * dieSize;
//                             const posY = center - site.y * dieSize;

//                             return (
//                               <div
//                                 key={site.SiteID}
//                                 style={{
//                                   position: "absolute",
//                                   left: `${posX}px`,
//                                   top: `${posY}px`,
//                                   width: `${dieSize}px`,
//                                   height: `${dieSize}px`,
//                                   background: getBinColor(site.Bin),
//                                   border: "1px solid black",
//                                   fontSize: "12px",
//                                   color: "#fff",
//                                   textAlign: "center",
//                                   lineHeight: `${dieSize}px`,
//                                 }}
//                               >
//                                 {site.Bin}
//                               </div>
//                             );
//                           })}
//                         </div>
//                       </Card.Body>
//                     </Card>
//                   </div>
//                 </BCarousel.Item>
//               );
//             })}
//           </BCarousel>
//         </div>

//         {/* Right Tabs */}
//         <div
//           style={{
//             width: 320,
//             background: "#fff",
//             padding: 20,
//             borderRadius: 12,
//             boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//           }}
//         >
//           <Tabs defaultActiveKey="filters" id="wafer-tabs" className="mb-3">
//             <Tab eventKey="filters" title="Filters">
//               {/* Filters content (same as before) */}
//               <Form.Group className="mb-3">
//                 <Form.Label>Device</Form.Label>
//                 <Form.Select
//                   value={selectedDevice}
//                   onChange={(e) => setSelectedDevice(e.target.value)}
//                 >
//                   <option value="">All Devices</option>
//                   {[...new Set(wafers.map((w) => w.Device))].map((d) => (
//                     <option key={d} value={d}>
//                       {d}
//                     </option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Lot</Form.Label>
//                 <Form.Select
//                   value={selectedLot}
//                   onChange={(e) => setSelectedLot(e.target.value)}
//                 >
//                   <option value="">All Lots</option>
//                   {availableLots.map((lot) => (
//                     <option key={lot} value={lot}>
//                       {lot}
//                     </option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Wafer</Form.Label>
//                 <Form.Select
//                   value={selectedWaferID}
//                   onChange={(e) => setSelectedWaferID(e.target.value)}
//                 >
//                   <option value="">All Wafers</option>
//                   {availableWafers.map((id) => (
//                     <option key={id} value={id}>
//                       {id}
//                     </option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>
//               <Form.Group className="mb-3">
//                 <Form.Label>Bin</Form.Label>
//                 <Form.Select
//                   value={selectedBin}
//                   onChange={(e) => setSelectedBin(e.target.value)}
//                 >
//                   <option value="">All Bins</option>
//                   {[1, 2, 3, 4, 5].map((b) => (
//                     <option key={b} value={b}>
//                       {b}
//                     </option>
//                   ))}
//                 </Form.Select>
//               </Form.Group>
//               <Button variant="secondary" onClick={resetFilters}>
//                 Reset
//               </Button>
//             </Tab>

//             {/* Summary tab */}
//             <Tab eventKey="summary" title="Summary">
//               {currentWafer ? (
//                 (() => {
//                   const binSummary = currentWafer.BinResult.reduce(
//                     (acc, site) => {
//                       acc[site.Bin] = (acc[site.Bin] || 0) + 1;
//                       return acc;
//                     },
//                     {}
//                   );
//                   const totalDies = currentWafer.BinResult.length;

//                   return (
//                     <div>
//                       <p>
//                         <strong>Device:</strong> {currentWafer.Device}
//                       </p>
//                       <p>
//                         <strong>Lot:</strong> {currentWafer.Lot}
//                       </p>
//                       <p>
//                         <strong>Wafer ID:</strong> {currentWafer.WaferID}
//                       </p>
//                       <p>
//                         <strong>Total Dies:</strong> {totalDies}
//                       </p>
//                       <hr />
//                       <p>
//                         <strong>Die Pitch X:</strong>{" "}
//                         {currentWafer.layoutInfo?.diePitchX}px
//                       </p>
//                       <p>
//                         <strong>Die Pitch Y:</strong>{" "}
//                         {currentWafer.layoutInfo?.diePitchY}px
//                       </p>
//                       <p>
//                         <strong>Wafer Width:</strong>{" "}
//                         {currentWafer.layoutInfo?.waferWidth}px
//                       </p>
//                       <p>
//                         <strong>Wafer Height:</strong>{" "}
//                         {currentWafer.layoutInfo?.waferHeight}px
//                       </p>
//                       <hr />
//                       <p>
//                         <strong>Bin Summary:</strong>
//                       </p>
//                       <ul>
//                         {Object.entries(binSummary).map(([bin, count]) => (
//                           <li key={bin}>
//                             Bin {bin}: {count} dies (
//                             {((count / totalDies) * 100).toFixed(1)}%)
//                           </li>
//                         ))}
//                       </ul>
//                     </div>
//                   );
//                 })()
//               ) : (
//                 <p>No wafer selected.</p>
//               )}
//             </Tab>
//           </Tabs>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WaferCarouselBootstrap;
// WaferCarouselBootstrap.jsx
import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import {
  Carousel as BCarousel,
  Card,
  Spinner,
  Form,
  Button,
  Tabs,
  Tab,
} from "react-bootstrap";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const WaferCarouselBootstrap = () => {
  const [wafers, setWafers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);

  const [selectedBin, setSelectedBin] = useState("");
  const [selectedLot, setSelectedLot] = useState("");
  const [selectedWaferID, setSelectedWaferID] = useState("");
  const [selectedDevice, setSelectedDevice] = useState("");
  const [binResult, setBinResult] = useState(null);

  useEffect(() => {
    fetch("/waferDataDetail.json")
      .then((res) => res.json())
      .then((data) => {
        setWafers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading JSON:", err);
        setLoading(false);
      });

    // load binResult.json
    fetch("/binResult.json")
      .then((res) => res.json())
      .then((data) => {
        setBinResult(data); // this file should already be a BinResult object
      })
      .catch((err) => {
        console.error("Error loading binResult.json:", err);
      });
  }, []);

  const getBinColor = (bin) => {
    switch (bin) {
      case 1:
        return "#3f51b5";
      case 2:
        return "#00bcd4";
      case 3:
        return "#4caf50";
      case 4:
        return "#ff9800";
      case 5:
        return "#f44336";
      default:
        return "#ccc";
    }
  };

  const resetFilters = () => {
    setSelectedBin("");
    setSelectedLot("");
    setSelectedWaferID("");
    setSelectedDevice("");
  };

  const availableLots = [
    ...new Set(
      wafers
        .filter((w) => !selectedDevice || w.Device === selectedDevice)
        .map((w) => w.Lot)
    ),
  ];

  const availableWafers = [
    ...new Set(
      wafers
        .filter(
          (w) =>
            (!selectedDevice || w.Device === selectedDevice) &&
            (!selectedLot || w.Lot === selectedLot)
        )
        .map((w) => w.WaferID)
    ),
  ];

  const filteredWafers = wafers.filter((wafer) => {
    return (
      (!selectedDevice || wafer.Device === selectedDevice) &&
      (!selectedLot || wafer.Lot === selectedLot) &&
      (!selectedWaferID || wafer.WaferID === selectedWaferID)
    );
  });

  const currentWafer = filteredWafers[activeIndex] || null;

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div style={{ padding: 16 }}>
      {/* 🔹 Top cascading filter bar */}
      <div className="d-flex gap-3 mb-4 bg-white p-3 shadow-sm rounded">
        <Form.Select
          value={selectedDevice}
          onChange={(e) => {
            setSelectedDevice(e.target.value);
            setSelectedLot("");
            setSelectedWaferID("");
          }}
          style={{ maxWidth: 180 }}
        >
          <option value="">Device</option>
          {[...new Set(wafers.map((w) => w.Device))].map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </Form.Select>

        <Form.Select
          value={selectedLot}
          onChange={(e) => {
            setSelectedLot(e.target.value);
            setSelectedWaferID("");
          }}
          style={{ maxWidth: 180 }}
        >
          <option value="">Lot</option>
          {availableLots.map((lot) => (
            <option key={lot} value={lot}>
              {lot}
            </option>
          ))}
        </Form.Select>

        <Form.Select
          value={selectedWaferID}
          onChange={(e) => setSelectedWaferID(e.target.value)}
          style={{ maxWidth: 180 }}
        >
          <option value="">Wafer</option>
          {availableWafers.map((id) => (
            <option key={id} value={id}>
              {id}
            </option>
          ))}
        </Form.Select>

        <Form.Select
          value={selectedBin}
          onChange={(e) => setSelectedBin(e.target.value)}
          style={{ maxWidth: 140 }}
        >
          <option value="">Bin</option>
          {[1, 2, 3, 4, 5].map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </Form.Select>

        <Button variant="primary" onClick={resetFilters}>
          Retrieve
        </Button>
      </div>

      {/* 🔹 Layout: carousel | right tabs */}
      <div className="d-flex" style={{ gap: 24 }}>
        {/* Carousel */}
        <div className="flex-grow-1">
          <BCarousel
            activeIndex={activeIndex}
            onSelect={(index) => setActiveIndex(index)}
            controls
            indicators
            interval={null}
            wrap
            prevIcon={
              <LeftOutlined style={{ fontSize: "24px", color: "#333" }} />
            }
            nextIcon={
              <RightOutlined style={{ fontSize: "24px", color: "#333" }} />
            }
          >
            {filteredWafers.map((wafer) => {
              const diePitchX = wafer.DiePitch[0]; // in µm
              const diePitchY = wafer.DiePitch[1]; // in µm

              // 🔹 Convert µm → mm
              const diePitchXmm = diePitchX / 1000;
              const diePitchYmm = diePitchY / 1000;

              // 🔹 Convert mm → px (at 96 DPI)
              const DPI = 96;
              const diePitchXpx = (diePitchXmm * DPI) / 25.4;
              const diePitchYpx = (diePitchYmm * DPI) / 25.4;

              // 🔹 Force square dies (use smaller pitch)
              const dieSize = Math.min(diePitchXpx, diePitchYpx);

              // 🔹 Base wafer size in px
              const baseWaferSize = 755.90551181;
              const cardSize = 450; // inner size we want to fit wafer into
              const scale = cardSize / baseWaferSize;

              const waferSize = baseWaferSize * scale;
              const center = waferSize / 2;
              const scaledDieSize = dieSize * scale;

              // 🔹 Save layout info
              wafer.layoutInfo = {
                diePitchX: diePitchXpx,
                diePitchY: diePitchYpx,
                waferSize,
              };

              return (
                <BCarousel.Item key={wafer.WaferID}>
                  <div className="d-flex justify-content-center py-4">
                    <Card
                      style={{
                        width: 500,
                        borderRadius: 12,
                        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Card.Body className="text-center">
                        <Card.Title>Wafer {wafer.WaferID}</Card.Title>

                        <div
                          style={{
                            position: "relative",
                            width: `${waferSize}px`,
                            height: `${waferSize}px`,
                            borderRadius: "50%",
                            border: "3px solid red", // 🔴 wafer edge
                            margin: "0 auto",
                            background: "#fff",
                            overflow: "hidden", // clip to circle
                          }}
                        >
                          {/* 🔹 Cross lines */}
                          <div
                            style={{
                              position: "absolute",
                              left: center,
                              top: 0,
                              width: "1px",
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
                              height: "1px",
                              background: "blue",
                            }}
                          />

                          {/* 🔹 Axis Labels */}
                          {[...Array(11)].map((_, i) => {
                            const offset = i - 5; // gives -5..+5
                            if (offset === 0) return null; // skip 0 at center

                            return (
                              <React.Fragment key={i}>
                                {/* X-axis labels */}
                                <div
                                  style={{
                                    position: "absolute",
                                    top: center + 4,
                                    left: center + offset * scaledDieSize - 6,
                                    fontSize: "12px",
                                    color: "green",
                                    fontWeight: "bold",
                                    zIndex: 9999,
                                    pointerEvents: "none",
                                  }}
                                >
                                  {offset}
                                </div>

                                {/* Y-axis labels */}
                                <div
                                  style={{
                                    position: "absolute",
                                    left: center + 4,
                                    top: center - offset * scaledDieSize - 6,
                                    fontSize: "12px",
                                    color: "green",
                                    fontWeight: "bold",
                                    zIndex: 9999,
                                    pointerEvents: "none",
                                  }}
                                >
                                  {offset}
                                </div>
                              </React.Fragment>
                            );
                          })}

                         {/* 🔹 Sites (with bin filter) */}
{wafer.BinResult.filter(
  (site) => !selectedBin || site.Bin === Number(selectedBin)
).map((site) => {
  const posX = center + site.x * scaledDieSize;
  const posY = center - site.y * scaledDieSize;

  // ✅ Check if die is partially outside wafer
  const dx = posX + scaledDieSize / 2 - center;
  const dy = posY + scaledDieSize / 2 - center;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const isPartial = distance + scaledDieSize / 2 > waferSize / 2;
  if (isPartial) return null; // ❌ skip partial dies

  return (
    <div
      key={site.SiteID}
      style={{
        position: "absolute",
        left: `${posX}px`,
        top: `${posY}px`,
        width: `${scaledDieSize}px`,
        height: `${scaledDieSize}px`,
        background: getBinColor(site.Bin),
        border: "0.5px solid #202020",
        fontSize: "12px",
        color: "#fff",
        textAlign: "center",
        lineHeight: `${scaledDieSize}px`,
      }}
    >
      {site.cordinateDieNo}
    </div>
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

        {/* Right Tabs */}
        <div
          style={{
            width: 320,
            background: "#fff",
            padding: 20,
            borderRadius: 12,
            boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          }}
        >
          <Tabs defaultActiveKey="filters" id="wafer-tabs" className="mb-3">
            <Tab eventKey="filters" title="Filters">
              {/* Filters content */}
              <Form.Group className="mb-3">
                <Form.Label>Device</Form.Label>
                <Form.Select
                  value={selectedDevice}
                  onChange={(e) => setSelectedDevice(e.target.value)}
                >
                  <option value="">All Devices</option>
                  {[...new Set(wafers.map((w) => w.Device))].map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Lot</Form.Label>
                <Form.Select
                  value={selectedLot}
                  onChange={(e) => setSelectedLot(e.target.value)}
                >
                  <option value="">All Lots</option>
                  {availableLots.map((lot) => (
                    <option key={lot} value={lot}>
                      {lot}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Wafer</Form.Label>
                <Form.Select
                  value={selectedWaferID}
                  onChange={(e) => setSelectedWaferID(e.target.value)}
                >
                  <option value="">All Wafers</option>
                  {availableWafers.map((id) => (
                    <option key={id} value={id}>
                      {id}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Bin</Form.Label>
                <Form.Select
                  value={selectedBin}
                  onChange={(e) => setSelectedBin(e.target.value)}
                >
                  <option value="">All Bins</option>
                  {[1, 2, 3, 4, 5].map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Button variant="secondary" onClick={resetFilters}>
                Reset
              </Button>
            </Tab>

            {/* Summary tab */}
            <Tab eventKey="summary" title="Summary">
              {currentWafer ? (
                (() => {
                  const binSummary = currentWafer.BinResult.reduce(
                    (acc, site) => {
                      acc[site.Bin] = (acc[site.Bin] || 0) + 1;
                      return acc;
                    },
                    {}
                  );
                  const totalDies = currentWafer.BinResult.length;

                  return (
                    <div>
                      <p>
                        <strong>Device:</strong> {currentWafer.Device}
                      </p>
                      <p>
                        <strong>Lot:</strong> {currentWafer.Lot}
                      </p>
                      <p>
                        <strong>Wafer ID:</strong> {currentWafer.WaferID}
                      </p>
                      <p>
                        <strong>Total Dies:</strong> {totalDies}
                      </p>
                      <hr />
                      <p>
                        <strong>Die Pitch X:</strong>{" "}
                        {currentWafer.layoutInfo?.diePitchX}px
                      </p>
                      <p>
                        <strong>Die Pitch Y:</strong>{" "}
                        {currentWafer.layoutInfo?.diePitchY}px
                      </p>
                      <p>
                        <strong>Wafer Size:</strong>{" "}
                        {currentWafer.layoutInfo?.waferSize}px
                      </p>
                      <hr />
                      <p>
                        <strong>Bin Summary:</strong>
                      </p>
                      <ul>
                        {Object.entries(binSummary).map(([bin, count]) => (
                          <li key={bin}>
                            Bin {bin}: {count} dies (
                            {((count / totalDies) * 100).toFixed(1)}%)
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })()
              ) : (
                <p>No wafer selected.</p>
              )}
            </Tab>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default WaferCarouselBootstrap;
