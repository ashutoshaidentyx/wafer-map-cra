// import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Carousel as BCarousel, Card, Spinner } from "react-bootstrap";
// import { LeftOutlined, RightOutlined } from "@ant-design/icons";

// const CompositeBinComponent = () => {
//   const [waferData, setWaferData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("/waferData.json")
//       .then((res) => res.json())
//       .then((data) => {
//         setWaferData(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error loading JSON:", err);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>;
//   if (!waferData) return <p>No data found.</p>;

//   const wafers = Array.isArray(waferData) ? waferData : [waferData];

//   // === Aggregate per-site per-bin counts ===
//   const siteBinAccum = {};
//   const aggregatedMap = {};

//   wafers.forEach((w) => {
//     (w.BinResult || []).forEach(({ SiteID, Bin, Count }) => {
//       const sid = Number(SiteID);
//       const binN = Number(Bin);
//       const c = Number(Count) || 0;

//       if (!siteBinAccum[sid]) siteBinAccum[sid] = { SiteID: sid, total: 0, bins: {} };
//       siteBinAccum[sid].bins[binN] = (siteBinAccum[sid].bins[binN] || 0) + c;
//       siteBinAccum[sid].total += c;

//       const key = `${sid}_${binN}`;
//       aggregatedMap[key] = (aggregatedMap[key] || 0) + c;
//     });
//   });

//   // Create combined wafer
//   const templateWafer = wafers[0] || { BinResult: [] };
//   const baseBinResult = Array.isArray(templateWafer.BinResult) ? templateWafer.BinResult : [];
//   const baseKeys = new Set(baseBinResult.map((b) => `${b.SiteID}_${b.Bin}`));

//   const finalBinResult = [
//     ...baseBinResult.map((b) => {
//       const key = `${b.SiteID}_${b.Bin}`;
//       return { SiteID: Number(b.SiteID), Bin: Number(b.Bin), Count: Number(b.Count) || 0, BinCoordinateRepeat: aggregatedMap[key] || 0 };
//     }),
//     ...Object.entries(aggregatedMap)
//       .filter(([key]) => !baseKeys.has(key))
//       .map(([key, repeat]) => {
//         const [sid, bin] = key.split("_");
//         return { SiteID: Number(sid), Bin: Number(bin), Count: 0, BinCoordinateRepeat: repeat };
//       }),
//   ];

//   const combinedWafer = { ...templateWafer, WaferID: "COMPOSITE", BinResult: finalBinResult };
//   console.log(combinedWafer,"combinedWafer")

//   // === Grid layout ===
//   const totalSites = finalBinResult.length;
//   const gridSize = Math.ceil(Math.sqrt(totalSites)); // square grid
//   const cardSize = 500;
//   const waferSize = 450;
//   const dieSize = waferSize / gridSize;
//   const center = waferSize / 2;

//   const siteIds = Array.from({ length: totalSites }, (_, i) => i + 1);
//   const siteLookup = Object.fromEntries(Object.values(siteBinAccum).map(s => [s.SiteID, { total: s.total, bins: s.bins }]));

//   const uniqueBins = Array.from(new Set(finalBinResult.map(b => b.Bin))).sort((a, b) => a - b);
//   const binToColor = {};
//   uniqueBins.forEach((bin, i) => {
//     const hue = Math.round((i / Math.max(1, uniqueBins.length - 1)) * 260);
//     binToColor[bin] = `hsl(${hue}deg 85% 55%)`;
//   });

//   const getDominantBin = (siteId) => {
//     const site = siteLookup[siteId];
//     if (!site) return null;
//     const entries = Object.entries(site.bins).map(([bin, repeat]) => ({ bin: Number(bin), repeat }));
//     entries.sort((a, b) => b.repeat - a.repeat);
//     return entries[0] || null;
//   };

//   return (
//     <div style={{ padding: 16 }}>
//       <BCarousel
//         controls={false}
//         indicators={false}
//         interval={null}
//         wrap
//         prevIcon={<LeftOutlined style={{ fontSize: 24, color: "#333" }} />}
//         nextIcon={<RightOutlined style={{ fontSize: 24, color: "#333" }} />}
//       >
//         <BCarousel.Item>
//           <div className="d-flex justify-content-center py-4">
//             <Card style={{ width: cardSize, borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
//               <Card.Body className="text-center">
//                 <Card.Title>Composite Wafer</Card.Title>

//                 <div style={{ position: "relative", width: waferSize, height: waferSize, borderRadius: "50%", border: "3px solid red", margin: "0 auto", background: "#fff", overflow: "hidden" }}>
//                   {/* Die Grid */}
//                   {finalBinResult.map((die, idx) => {
//                     const row = Math.floor(idx / gridSize);
//                     const col = idx % gridSize;
//                     const posX = col * dieSize;
//                     const posY = row * dieSize;

//                     const dominant = getDominantBin(die.SiteID);
//                     const bgColor = dominant ? binToColor[dominant.bin] : "#ddd";

//                     // check if die outside circular wafer
//                     const dx = posX + dieSize/2 - center;
//                     const dy = posY + dieSize/2 - center;
//                     if (Math.sqrt(dx*dx + dy*dy) > waferSize/2) return null;

//                     return (
//                       <div key={idx} title={`Site ${die.SiteID}`} style={{
//                         position: "absolute",
//                         left: posX,
//                         top: posY,
//                         width: dieSize,
//                         height: dieSize,
//                         border: "1px solid #999",
//                         backgroundColor: bgColor,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         fontSize: Math.max(10, dieSize * 0.3),
//                       }}>
//                         {dominant ? dominant.repeat : ""}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </Card.Body>
//             </Card>
//           </div>
//         </BCarousel.Item>
//       </BCarousel>
//     </div>
//   );
// };

// // export default CompositeBinComponent;
// import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Carousel as BCarousel, Card, Spinner } from "react-bootstrap";
// import { LeftOutlined, RightOutlined } from "@ant-design/icons";

// const CompositeBinComponent = () => {
//   const [waferData, setWaferData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("/waferDataDetail.json")
//       .then((res) => res.json())
//       .then((data) => {
//         setWaferData(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error loading JSON:", err);
//         setLoading(false);
//       });
//   }, []);

//   if (loading)
//     return (
//       <div className="text-center py-5">
//         <Spinner animation="border" />
//       </div>
//     );
//   if (!waferData) return <p>No data found.</p>;

//   const wafers = Array.isArray(waferData) ? waferData : [waferData];

//   // === Aggregate per-coordinate (x,y) per-bin counts ===
// const coordBinStack = {}; // key = `${x}_${y}_${Bin}`

// wafers.forEach(w => {
//   (w.BinResult || []).forEach(({ Bin, x, y }) => {
//     if (x === undefined || y === undefined || Bin === undefined) return;
//     const key = `${x}_${y}_${Bin}`;
//     coordBinStack[key] = (coordBinStack[key] || 0) + 1; // +1 per wafer
//   });
// });

// // Then convert to final array grouped by x,y
// const finalBinResult = [];
// const coordMap = {}; // key = `${x}_${y}`

// Object.entries(coordBinStack).forEach(([key, count]) => {
//   const [x, y, Bin] = key.split("_").map(Number);
//   const coordKey = `${x}_${y}`;

//   if (!coordMap[coordKey]) coordMap[coordKey] = { x, y, bins: {}, total: 0 };
//   coordMap[coordKey].bins[Bin] = count;
//   coordMap[coordKey].total += count;
// });

// const finalResult = Object.values(coordMap).map(coord => {
//   const entries = Object.entries(coord.bins).map(([bin, repeat]) => ({ bin: Number(bin), repeat }));
//   entries.sort((a, b) => b.repeat - a.repeat);
//   const dominant = entries[0] || null;

//   return {
//     x: coord.x,
//     y: coord.y,
//     total: coord.total,
//     dominantBin: dominant ? dominant.bin : null,
//     dominantRepeat: dominant ? dominant.repeat : 0,
//     bins: coord.bins,
//   };
// });

//   const combinedWafer = {
//     ...wafers[0],
//     WaferID: "COMPOSITE",
//     BinResult: finalBinResult,
//   };
//   console.log("combinedWafer", combinedWafer);

//   // === Grid / Wafer Layout ===
//   const cardSize = 500;
//   const waferSize = 450;
//   const dieSize = 20; // fixed die size for each die
//   const center = waferSize / 2;

//   // Color map for bins
//   const uniqueBins = Array.from(
//     new Set(finalBinResult.map((b) => b.dominantBin).filter((v) => v !== null))
//   ).sort((a, b) => a - b);
//   const binToColor = {};
//   uniqueBins.forEach((bin, i) => {
//     const hue = Math.round((i / Math.max(1, uniqueBins.length - 1)) * 260);
//     binToColor[bin] = `hsl(${hue}deg 85% 55%)`;
//   });

//   return (
//     <div style={{ padding: 16 }}>
//       <BCarousel
//         controls={false}
//         indicators={false}
//         interval={null}
//         wrap
//         prevIcon={<LeftOutlined style={{ fontSize: 24, color: "#333" }} />}
//         nextIcon={<RightOutlined style={{ fontSize: 24, color: "#333" }} />}
//       >
//         <BCarousel.Item>
//           <div className="d-flex justify-content-center py-4">
//             <Card
//               style={{
//                 width: cardSize,
//                 borderRadius: 12,
//                 boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//               }}
//             >
//               <Card.Body className="text-center">
//                 <Card.Title>Composite Wafer</Card.Title>

//                 <div
//                   style={{
//                     position: "relative",
//                     width: waferSize,
//                     height: waferSize,
//                     borderRadius: "50%",
//                     border: "3px solid red",
//                     margin: "0 auto",
//                     background: "#fff",
//                     overflow: "hidden",
//                   }}
//                 >
//                   {/* Draw Dies */}
//                   {finalBinResult.map((die, idx) => {
//                     const posX = center + die.x * dieSize;
//                     const posY = center - die.y * dieSize; // invert Y

//                     const bgColor = die.dominantBin
//                       ? binToColor[die.dominantBin]
//                       : "#ddd";

//                     // mask circular wafer
//                     const dx = posX - center;
//                     const dy = posY - center;
//                     if (Math.sqrt(dx * dx + dy * dy) > waferSize / 2) return null;

//                     return (
//                       <div
//                         key={idx}
//                         title={`x:${die.x}, y:${die.y}, Total:${die.total}, Dominant Bin:${die.dominantBin} (${die.dominantRepeat})`}
//                         style={{
//                           position: "absolute",
//                           left: posX,
//                           top: posY,
//                           width: dieSize,
//                           height: dieSize,
//                           border: "1px solid #999",
//                           backgroundColor: bgColor,
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           fontSize: 10,
//                           transform: "translate(-50%, -50%)",
//                         }}
//                       >
//                         {die.dominantRepeat?die.dominantRepeat:0}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </Card.Body>
//             </Card>
//           </div>
//         </BCarousel.Item>
//       </BCarousel>
//     </div>
//   );
// };

// export default CompositeBinComponent;

// import React, { useEffect, useState } from "react";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Carousel as BCarousel, Card, Spinner } from "react-bootstrap";
// import { LeftOutlined, RightOutlined } from "@ant-design/icons";

// const CompositeBinComponent = () => {
//   const [waferData, setWaferData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetch("/waferDataDetail.json")
//       .then((res) => res.json())
//       .then((data) => {
//         console.log(data,"waferDataDetail.json")
//         setWaferData(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error loading JSON:", err);
//         setLoading(false);
//       });
//   }, []);

//   if (loading)
//     return (
//       <div className="text-center py-5">
//         <Spinner animation="border" />
//       </div>
//     );

//   if (!waferData) return <p>No data found.</p>;

//   const wafers = Array.isArray(waferData) ? waferData : [waferData];

//   // === Aggregate per-coordinate (x,y) per-bin counts ===
//   const coordBinStack = {}; // key = `${x}_${y}_${Bin}`
  
//   wafers.forEach((w) => {
//       (w.BinResult || []).forEach(({ Bin, x, y }) => {
//           if (x === undefined || y === undefined || Bin === undefined) return;
//           const key = `${x}_${y}_${Bin}`;
//           coordBinStack[key] = (coordBinStack[key] || 0) + 1; // count per wafer
//         });
//     });
    
//     console.log(coordBinStack,"coordBinStack")
//   // Convert to final array grouped by x,y
//   const coordMap = {}; // key = `${x}_${y}`
//   Object.entries(coordBinStack).forEach(([key, repeat]) => {
//     const [x, y, Bin] = key.split("_").map(Number);
//     const coordKey = `${x}_${y}`;
//     if (!coordMap[coordKey]) coordMap[coordKey] = { x, y, bins: {}, total: 0 };
//     coordMap[coordKey].bins[Bin] = repeat;
//     coordMap[coordKey].total += repeat;
//   });

//   const finalBinResult = Object.values(coordMap).map((coord) => {
//     const entries = Object.entries(coord.bins)
//       .map(([bin, repeat]) => ({ bin: Number(bin), repeat }))
//       .sort((a, b) => b.repeat - a.repeat);
//     const dominant = entries[0] || null;

//     return {
//       x: coord.x,
//       y: coord.y,
//       total: coord.total,
//       dominantBin: dominant ? dominant.bin : null,
//       dominantRepeat: dominant ? dominant.repeat : 0,
//       bins: coord.bins,
//     };
//   });

//   const combinedWafer = {
//     ...wafers[0],
//     WaferID: "COMPOSITE",
//     BinResult: finalBinResult,
//   };
//   console.log("combinedWafer", combinedWafer);

//   // === Grid / Wafer Layout ===
//   const cardSize = 500;
//   const waferSize = 450;
//   const dieSize = 20;
//   const center = waferSize / 2;

//   // Color map for bins
//   const uniqueBins = Array.from(
//     new Set(finalBinResult.map((b) => b.dominantBin).filter((v) => v !== null))
//   ).sort((a, b) => a - b);

//   const binToColor = {};
//   uniqueBins.forEach((bin, i) => {
//     const hue = Math.round((i / Math.max(1, uniqueBins.length - 1)) * 260);
//     binToColor[bin] = `hsl(${hue}deg 85% 55%)`;
//   });

//   return (
//     <div style={{ padding: 16 }}>
//       <BCarousel
//         controls={false}
//         indicators={false}
//         interval={null}
//         wrap
//         prevIcon={<LeftOutlined style={{ fontSize: 24, color: "#333" }} />}
//         nextIcon={<RightOutlined style={{ fontSize: 24, color: "#333" }} />}
//       >
//         <BCarousel.Item>
//           <div className="d-flex justify-content-center py-4">
//             <Card
//               style={{
//                 width: cardSize,
//                 borderRadius: 12,
//                 boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
//               }}
//             >
//               <Card.Body className="text-center">
//                 <Card.Title>Composite Wafer</Card.Title>
//                 <div
//                   style={{
//                     position: "relative",
//                     width: waferSize,
//                     height: waferSize,
//                     borderRadius: "50%",
//                     border: "3px solid red",
//                     margin: "0 auto",
//                     background: "#fff",
//                     overflow: "hidden",
//                   }}
//                 >
//                   {finalBinResult.map((die, idx) => {
//                     const posX = center + die.x * dieSize;
//                     const posY = center - die.y * dieSize; // invert Y

//                     const bgColor = die.dominantBin
//                       ? binToColor[die.dominantBin]
//                       : "#ddd";

//                     // mask circular wafer
//                     const dx = posX - center;
//                     const dy = posY - center;
//                     if (Math.sqrt(dx * dx + dy * dy) > waferSize / 2) return null;

//                     return (
//                       <div
//                         key={idx}
//                         title={`x:${die.x}, y:${die.y}, Total:${die.total}, Dominant Bin:${die.dominantBin} (${die.dominantRepeat})`}
//                         style={{
//                           position: "absolute",
//                           left: posX,
//                           top: posY,
//                           width: dieSize,
//                           height: dieSize,
//                           border: "1px solid #999",
//                           backgroundColor: bgColor,
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           fontSize: 10,
//                           transform: "translate(-50%, -50%)",
//                         }}
//                       >
//                         {die.dominantRepeat || 0}
//                       </div>
//                     );
//                   })}
//                 </div>
//               </Card.Body>
//             </Card>
//           </div>
//         </BCarousel.Item>
//       </BCarousel>
//     </div>
//   );
// };

// // export default CompositeBinComponent;
// import React, { useEffect, useState } from "react";

// const binToColor = {
//   1: "red",
//   2: "yellow",
//   3: "limegreen",
//   4: "skyblue",
//   5: "purple",
//   6: "orange",
// };

// const waferSize = 200; // diameter of wafer circle
// const dieSize = 6; // size of individual die
// const waferPadding = 10; // space between wafer edge and die plot

// const CompositeBinGallery = () => {
//   const [binGroups, setBinGroups] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [globalScale, setGlobalScale] = useState(null);

//   useEffect(() => {
//     fetch("/waferDataDetail.json")
//       .then((res) => res.json())
//       .then((data) => {
//         const wafers = Array.isArray(data) ? data : [data];

//         const bins = {};
//         let minX = Infinity,
//           maxX = -Infinity,
//           minY = Infinity,
//           maxY = -Infinity;

//         wafers.forEach((wafer) => {
//           (wafer.BinResult || []).forEach((die) => {
//             if (!bins[die.Bin]) bins[die.Bin] = [];
//             bins[die.Bin].push(die);

//             // update global min/max
//             if (die.x < minX) minX = die.x;
//             if (die.x > maxX) maxX = die.x;
//             if (die.y < minY) minY = die.y;
//             if (die.y > maxY) maxY = die.y;
//           });
//         });

//         setBinGroups(bins);
//         setGlobalScale({ minX, maxX, minY, maxY });
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error("Error loading JSON:", err);
//         setLoading(false);
//       });
//   }, []);

//   if (loading) return <p>Loading…</p>;
//   if (!binGroups || Object.keys(binGroups).length === 0)
//     return <p>No data found</p>;
//   if (!globalScale) return null;

//   const { minX, maxX, minY, maxY } = globalScale;
//   const rangeX = maxX - minX || 1;
//   const rangeY = maxY - minY || 1;

//   const margin = waferSize - 2 * waferPadding;
//   const center = waferSize / 2;

//   const scaleX = (val) => ((val - minX) / rangeX) * margin + waferPadding;
//   const scaleY = (val) => ((maxY - val) / rangeY) * margin + waferPadding;

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Defect Analysis - Bin Wise Wafers</h2>

//       <div
//         style={{
//           display: "flex",
//           flexWrap: "wrap",
//           gap: "20px",
//         }}
//       >
//         {Object.entries(binGroups).map(([bin, dies]) => {
//           const color = binToColor[bin] || "gray";

//           return (
//             <div key={bin} style={{ textAlign: "center" }}>
//               {/* Wafer Circle */}
//               <div
//                 style={{
//                   width: waferSize,
//                   height: waferSize,
//                   borderRadius: "50%",
//                   border: "2px solid red",
//                   position: "relative",
//                   margin: "0 auto",
//                   background: "white",
//                 }}
//               >
//                 {dies.map((die, i) => {
//                   const posX = scaleX(die.x);
//                   const posY = scaleY(die.y);

//                   // Clip dies outside the circle
//                   const dx = posX - center;
//                   const dy = posY - center;
//                   if (Math.sqrt(dx * dx + dy * dy) > waferSize / 2 - waferPadding)
//                     return null;

//                   return (
//                     <div
//                       key={i}
//                       style={{
//                         position: "absolute",
//                         left: posX,
//                         top: posY,
//                         width: dieSize,
//                         height: dieSize,
//                         backgroundColor: color,
//                         transform: "translate(-50%, -50%)",
                     
//                       }}
//                     />
//                   );
//                 })}
//               </div>

//               {/* Bin Label */}
//               <div
//                 style={{
//                   marginTop: "6px",
//                   display: "flex",
//                   justifyContent: "center",
//                   alignItems: "center",
//                   gap: "6px",
//                   fontSize: "14px",
//                 }}
//               >
//                 <div
//                   style={{
//                     width: 14,
//                     height: 14,
//                     backgroundColor: color,
//                     borderRadius: "2px",
//                   }}
//                 />
//                 <span>Bin {bin}</span>
//               </div>
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default CompositeBinGallery;
import React, { useEffect, useState } from "react";

const binToColor = {
  1: "red",
  2: "yellow",
  3: "limegreen",
  4: "skyblue",
  5: "purple",
  6: "orange",
};

const waferSize = 400; // wafer diameter
const waferPadding = 20; // padding from edge

const CompositeBinGallery = () => {
  const [binGroups, setBinGroups] = useState({});
  const [coordMap, setCoordMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [globalScale, setGlobalScale] = useState(null);

  const coordinateSpacing = 5; // grid spacing multiplier

  useEffect(() => {
    fetch("/waferDataDetail.json")
      .then((res) => res.json())
      .then((data) => {
        const wafers = Array.isArray(data) ? data : [data];

        const bins = {};
        const coordSummary = {};
        let minX = Infinity,
          maxX = -Infinity,
          minY = Infinity,
          maxY = -Infinity;

        wafers.forEach((wafer) => {
          (wafer.BinResult || []).forEach((die) => {
            const bin = die.Bin;
            const key = `${die.x}_${die.y}`;

            // group by bin
            if (!bins[bin]) bins[bin] = [];
            bins[bin].push(die);

            // coordinate summary
            if (!coordSummary[key]) coordSummary[key] = {};
            coordSummary[key][bin] = (coordSummary[key][bin] || 0) + 1;

            // global min/max
            if (die.x < minX) minX = die.x;
            if (die.x > maxX) maxX = die.x;
            if (die.y < minY) minY = die.y;
            if (die.y > maxY) maxY = die.y;
          });
        });

        setBinGroups(bins);
        setCoordMap(coordSummary);
        setGlobalScale({ minX, maxX, minY, maxY });
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading JSON:", err);
        setLoading(false);
      });
  }, []);
  console.log(binGroups)

  if (loading) return <p>Loading…</p>;
  if (!binGroups || Object.keys(binGroups).length === 0)
    return <p>No data found</p>;
  if (!globalScale) return null;

  const { minX, maxX, minY, maxY } = globalScale;

  // Expand coordinate range by the spacing factor
  const rangeX = (maxX - minX + 1) * coordinateSpacing;
  const rangeY = (maxY - minY + 1) * coordinateSpacing;

  const margin = waferSize - 2 * waferPadding;
  const center = waferSize / 2;

  const scaleX = (val) =>
    ((val - minX + 0.1) * coordinateSpacing / rangeX) * margin + waferPadding;
  const scaleY = (val) =>
    ((maxY - val + 0.1) * coordinateSpacing / rangeY) * margin + waferPadding;

  // Dynamic die size based on grid
  const dieSize = Math.min(16, margin / Math.max(rangeX, rangeY) * coordinateSpacing * 0.9);

  return (
    <div style={{ padding: "20px" }}>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {Object.entries(binGroups).map(([bin, dies]) => {
          const color = binToColor[bin] || "gray";

          return (
            <div key={bin} style={{ textAlign: "center" }}>
              {/* Wafer Circle */}
              <div
                style={{
                  width: waferSize,
                  height: waferSize,
                  borderRadius: "50%",
                  border: "2px solid red",
                  position: "relative",
                  margin: "0 auto",
                  background: "white",
                }}
              >
                {dies.map((die, i) => {
                  const posX = scaleX(die.x);
                  const posY = scaleY(die.y);

                  const dx = posX - center;
                  const dy = posY - center;

                  // Clip dies outside wafer circle
                  if (Math.sqrt(dx * dx + dy * dy) > waferSize / 2 - waferPadding)
                    return null;

                  const coordKey = `${die.x}_${die.y}`;
                  const count = coordMap[coordKey][bin] || 1;

                  return (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        left: posX,
                        top: posY,
                        width: dieSize,
                        height: dieSize,
                        backgroundColor: color,
                        color: "#000",
                        fontSize: dieSize * 0.5,
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        transform: "translate(-50%, -50%)",
                        borderRadius: "2px",
                        border: "1px solid #000",
                      }}
                    >
                      {count}
                    </div>
                  );
                })}
              </div>

              {/* Bin Label */}
              <div
                style={{
                  marginTop: "6px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  gap: "6px",
                  fontSize: "14px",
                }}
              >
                <div
                  style={{
                    width: 14,
                    height: 14,
                    backgroundColor: color,
                    borderRadius: "2px",
                  }}
                />
                <span>Bin {bin}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CompositeBinGallery;
