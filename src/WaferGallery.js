// import React, { useEffect, useState } from "react";

// const WaferGallery = () => {
//   const [wafers, setWafers] = useState([]);
//   const [selectedBin, setSelectedBin] = useState(null);
//   const [selectedLot, setSelectedLot] = useState(null);
//   const [selectedWaferID, setSelectedWaferID] = useState(null);
//   const [selectedDevice, setSelectedDevice] = useState(null);
//   const [selectedWaferIDs, setSelectedWaferIDs] = useState([]); // ✅ multi-wafer filter

//   useEffect(() => {
//     fetch("/waferData.json")
//       .then((res) => res.json())
//       .then((data) => setWafers(data))
//       .catch((err) => console.error("Error loading JSON:", err));
//   }, []);

//   const getBinColor = (bin) => {
//     switch (bin) {
//       case 1: return "#3f51b5";
//       case 2: return "#00bcd4";
//       case 3: return "#4caf50";
//       case 4: return "#ff9800";
//       case 5: return "#f44336";
//       default: return "#ccc";
//     }
//   };

//   const uniqueLots = [...new Set(wafers.map((w) => w.Lot))];
//   const uniqueDevices = [...new Set(wafers.map((w) => w.Device))];
//   const uniqueWaferIDs = [...new Set(wafers.map((w) => w.WaferID))];
//   const bins = [1, 2, 3, 4, 5];

//   const onRetrieve = () => {
//     setSelectedBin(null);
//     setSelectedLot(null);
//     setSelectedWaferID(null);
//     setSelectedDevice(null);
//     setSelectedWaferIDs([]);
//   };

//   // ✅ Dropdown filter component
//   const renderFilterDropdown = (label, values, selectedValue, setSelectedValue) => (
//     <div style={{ marginBottom: 20 }}>
//       <label htmlFor={label} style={{ fontWeight: "bold", marginBottom: 6, display: "block" }}>
//         {label}
//       </label>
//       <select
//         id={label}
//         value={selectedValue || ""}
//         onChange={(e) => setSelectedValue(e.target.value || null)}
//         style={{
//           width: "100%",
//           padding: 8,
//           borderRadius: 6,
//           border: "1px solid #ccc",
//           fontSize: 14,
//         }}
//       >
//         <option value="">All</option>
//         {values.map((val) => (
//           <option key={val} value={val}>{val}</option>
//         ))}
//       </select>
//       {selectedValue && (
//         <button
//           onClick={() => setSelectedValue(null)}
//           style={{
//             marginTop: 6,
//             padding: "6px 12px",
//             borderRadius: 6,
//             border: "1px solid #aaa",
//             backgroundColor: "#f5f5f5",
//             cursor: "pointer",
//             fontWeight: "bold",
//           }}
//         >
//           Clear
//         </button>
//       )}
//     </div>
//   );

//   // ✅ Multi-wafer selection checkboxes
//   const renderMultiSelectWafer = () => (
//     <div style={{ marginBottom: 20 }}>
//       <label style={{ fontWeight: "bold", marginBottom: 6, display: "block" }}>Select Wafers</label>
//       <div style={{ maxHeight: 120, overflowY: "auto", border: "1px solid #ccc", padding: 6, borderRadius: 6 }}>
//         {uniqueWaferIDs.map((id) => (
//           <div key={id}>
//             <label>
//               <input
//                 type="checkbox"
//                 value={id}
//                 checked={selectedWaferIDs.includes(id)}
//                 onChange={(e) => {
//                   if (e.target.checked) {
//                     setSelectedWaferIDs([...selectedWaferIDs, id]);
//                   } else {
//                     setSelectedWaferIDs(selectedWaferIDs.filter((w) => w !== id));
//                   }
//                 }}
//               />{" "}
//               Wafer {id}
//             </label>
//           </div>
//         ))}
//       </div>
//     </div>
//   );

//   return (
//     <div
//       style={{
//         fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
//         minHeight: "100vh",
//         padding: 20,
//         backgroundColor: "#f7f7f7",
//         display: "flex",
//         gap: 40,
//       }}
//     >
//       {/* Wafer Grid */}
//       <div
//         style={{
//           flexGrow: 1,
//           display: "grid",
//           gridTemplateColumns: "repeat(5, 1fr)", // 5 wafers per row
//           gap: 40,
//           justifyItems: "center",
//         }}
//       >
//         {wafers
//           .filter((wafer) => {
//             if (selectedWaferIDs.length > 0 && !selectedWaferIDs.includes(wafer.WaferID)) {
//               return false;
//             }
//             return (
//               (!selectedLot || wafer.Lot === selectedLot) &&
//               (!selectedWaferID || wafer.WaferID === selectedWaferID) &&
//               (!selectedDevice || wafer.Device === selectedDevice)
//             );
//           })
//           .map((wafer) => {
//             const gridSize = Math.sqrt(wafer.BinResult.length);
//             const containerSize = 160;
//             const cellSize = containerSize / gridSize;

//             // ✅ Build bin summary counts
//             const binCounts = {};
//             wafer.BinResult.forEach((site) => {
//               binCounts[site.Bin] = (binCounts[site.Bin] || 0) + 1;
//             });

//             // ✅ Tooltip text
//             const tooltip = `
//             Device: ${wafer.Device}
//             Lot: ${wafer.Lot}
//             Wafer: ${wafer.WaferID}
//             Bin Summary:
//             ${Object.entries(binCounts)
//                             .map(([bin, count]) => `Bin ${bin}: ${count}`)
//                             .join("\n")}
//                         `;

//             return (
//               <div key={wafer.WaferID} style={{ textAlign: "center", width: containerSize }}>
//                 <div
//                   title={tooltip} // ✅ Show full summary on hover
//                   style={{
//                     width: containerSize,
//                     height: containerSize,
//                     borderRadius: "50%",
//                     border: "2px solid #999",
//                     overflow: "hidden",
//                     display: "grid",
//                     gridTemplateColumns: `repeat(${gridSize}, ${cellSize}px)`,
//                     justifyContent: "center",
//                     alignContent: "center",
//                     backgroundColor: "#fff",
//                     margin: "0 auto",
//                       padding:"90px",
//                   }}
//                 >
//                   {wafer.BinResult.map((site, idx) => {
//                     const row = Math.floor(idx / gridSize);
//                     const col = idx % gridSize;
//                     const dx = col - gridSize / 2 + 0.5;
//                     const dy = row - gridSize / 2 + 0.5;
//                     const distance = Math.sqrt(dx * dx + dy * dy);

//                     if (distance > gridSize / 2) return <div key={site.SiteID} />;

//                     const binVisible = !selectedBin || site.Bin === Number(selectedBin);

//                     return (
//                       <div
//                         key={site.SiteID}
//                         style={{
//                           width: `${cellSize}px`,
//                           height: `${cellSize}px`,
//                           backgroundColor: getBinColor(site.Bin),
//                           opacity: binVisible ? 1 : 0.1,
//                           fontSize: Math.floor(cellSize / 2),
//                           color: "#fff",
//                           textAlign: "center",
//                           lineHeight: `${cellSize}px`,
//                           border: "0.3px solid #eee",
//                         }}
//                       >
//                         {site.Bin}
//                       </div>
//                     );
//                   })}
//                 </div>
//                 <div style={{ marginTop: 8, fontWeight: "bold" }}>
//                   Wafer {wafer.WaferID}
//                 </div>
//               </div>
//             );
//           })}
//       </div>

//       {/* Filter Panel */}
//       <div
//         style={{
//           width: 260,
//           padding: 20,
//           borderRadius: 12,
//           backgroundColor: "#fff",
//           boxShadow: "0 0 10px rgba(0,0,0,0.1)",
//         }}
//       >
//         <h2 style={{ marginBottom: 20 }}>Filters</h2>
//         {renderFilterDropdown("Device", uniqueDevices, selectedDevice, setSelectedDevice)}
//         {renderFilterDropdown("Lot", uniqueLots, selectedLot, setSelectedLot)}
//         {renderFilterDropdown("Wafer", uniqueWaferIDs, selectedWaferID, setSelectedWaferID)}
//         {renderFilterDropdown(
//           "Bin",
//           bins.map(String),
//           selectedBin ? String(selectedBin) : null,
//           (val) => setSelectedBin(val ? Number(val) : null)
//         )}
//         {renderMultiSelectWafer()}
//         <button
//           onClick={onRetrieve}
//           style={{
//             marginTop: 20,
//             padding: "10px",
//             backgroundColor: "#007bff",
//             color: "#fff",
//             border: "none",
//             borderRadius: 8,
//             fontWeight: "bold",
//             cursor: "pointer",
//             width: "100%",
//           }}
//         >
//           Clear All Filters
//         </button>
//       </div>
//     </div>
//   );
// };

// export default WaferGallery;
import React, { useEffect, useState } from "react";

/**
 * WaferGallery
 *
 * - Keeps your full filter panel (Device, Lot, Wafer, Bin, multi-select).
 * - "Grid Size (NxN)" in your original code is ambiguous: here it's used as
 *   "wafersPerRow" (how many wafer circles per row in the gallery).
 * - Each wafer's internal die-grid is computed from wafer.BinResult.length
 *   (internalGrid = round(sqrt(length))). That guarantees the die grid fits
 *   inside the circular wafer and scales correctly.
 *
 * Key fixes:
 * - Removed excessive padding that caused clipping.
 * - Calculated internal cellSize per-wafer: cellSize = waferDiameter / internalGrid.
 * - Render placeholder cells for consistent grid layout; cells outside the circle
 *   are rendered transparent (keeps grid positions intact).
 */

const WaferGallery = () => {
  const [wafers, setWafers] = useState([]);
  const [selectedBin, setSelectedBin] = useState(null);
  const [selectedLot, setSelectedLot] = useState(null);
  const [selectedWaferID, setSelectedWaferID] = useState(null);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [selectedWaferIDs, setSelectedWaferIDs] = useState([]);
  const [wafersPerRow, setWafersPerRow] = useState(5); // how many wafer circles per row

  useEffect(() => {
    fetch("/waferData.json")
      .then((res) => res.json())
      .then((data) => setWafers(data || []))
      .catch((err) => console.error("Error loading JSON:", err));
  }, []);

  const getBinColor = (bin) => {
    switch (Number(bin)) {
      case 1: return "#3f51b5";
      case 2: return "#00bcd4";
      case 3: return "#4caf50";
      case 4: return "#ff9800";
      case 5: return "#f44336";
      default: return "#ccc";
    }
  };

  const uniqueLots = [...new Set(wafers.map((w) => w.Lot).filter(Boolean))];
  const uniqueDevices = [...new Set(wafers.map((w) => w.Device).filter(Boolean))];
  const uniqueWaferIDs = [...new Set(wafers.map((w) => w.WaferID).filter(Boolean))];
  const bins = [1, 2, 3, 4, 5];

  const onRetrieve = () => {
    setSelectedBin(null);
    setSelectedLot(null);
    setSelectedWaferID(null);
    setSelectedDevice(null);
    setSelectedWaferIDs([]);
    setWafersPerRow(5);
  };

  const renderFilterDropdown = (label, values, selectedValue, setSelectedValue) => (
    <div style={{ marginBottom: 20 }}>
      <label htmlFor={label} style={{ fontWeight: "bold", marginBottom: 6, display: "block" }}>
        {label}
      </label>
      <select
        id={label}
        value={selectedValue ?? ""}
        onChange={(e) => setSelectedValue(e.target.value || null)}
        style={{
          width: "100%",
          padding: 8,
          borderRadius: 6,
          border: "1px solid #ccc",
          fontSize: 14,
        }}
      >
        <option value="">All</option>
        {values.map((val) => (
          <option key={val} value={val}>{val}</option>
        ))}
      </select>
      {selectedValue && (
        <button
          onClick={() => setSelectedValue(null)}
          style={{
            marginTop: 6,
            padding: "6px 12px",
            borderRadius: 6,
            border: "1px solid #aaa",
            backgroundColor: "#f5f5f5",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Clear
        </button>
      )}
    </div>
  );

  const renderMultiSelectWafer = () => (
    <div style={{ marginBottom: 20 }}>
      <label style={{ fontWeight: "bold", marginBottom: 6, display: "block" }}>Select Wafers</label>
      <div style={{ maxHeight: 120, overflowY: "auto", border: "1px solid #ccc", padding: 6, borderRadius: 6 }}>
        {uniqueWaferIDs.map((id) => (
          <div key={id}>
            <label>
              <input
                type="checkbox"
                value={id}
                checked={selectedWaferIDs.includes(id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedWaferIDs([...selectedWaferIDs, id]);
                  } else {
                    setSelectedWaferIDs(selectedWaferIDs.filter((w) => w !== id));
                  }
                }}
              />{" "}
              Wafer {id}
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  // wafer visual constants
  const waferDiameter = 240; // px - change if you want bigger/smaller wafer icons

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        minHeight: "100vh",
        padding: 20,
        backgroundColor: "#f7f7f7",
        display: "flex",
        gap: 24,
      }}
    >
      {/* Wafer Grid */}
      <div
        style={{
          flexGrow: 1,
          display: "grid",
          gridTemplateColumns: `repeat(${Math.max(1, wafersPerRow)}, minmax(0, 1fr))`,
          gap: 32,
          justifyItems: "center",
          alignContent: "start",
        }}
      >
        {wafers
          .filter((wafer) => {
            if (selectedWaferIDs.length > 0 && !selectedWaferIDs.includes(wafer.WaferID)) return false;
            if (selectedLot && wafer.Lot !== selectedLot) return false;
            if (selectedWaferID && wafer.WaferID !== selectedWaferID) return false;
            if (selectedDevice && wafer.Device !== selectedDevice) return false;
            return true;
          })
          .map((wafer) => {
            // internal grid for the wafer's die layout (derived from BinResult length)
            const internalGrid = Math.max(1, Math.round(Math.sqrt((wafer.BinResult || []).length || 1)));
            const totalCells = internalGrid * internalGrid;
            const cellSize = Math.floor(waferDiameter / internalGrid);

            // make a bin summary for tooltip
            const binCounts = {};
            (wafer.BinResult || []).forEach((site) => {
              binCounts[site.Bin] = (binCounts[site.Bin] || 0) + 1;
            });
            const tooltip = `
Device: ${wafer.Device ?? ""}
Lot: ${wafer.Lot ?? ""}
Wafer: ${wafer.WaferID ?? ""}
Bin Summary:
${Object.entries(binCounts).map(([bin, count]) => `Bin ${bin}: ${count}`).join("\n")}
`.trim();

            return (
              <div key={wafer.WaferID} style={{ textAlign: "center", width: waferDiameter }}>
                {/* wafer circle wrapper */}
                <div
                  title={tooltip}
                  style={{
                    width: 200,
                    height: 200,
                    borderRadius: "50%",
                    border: "2px solid #999",
                    overflow: "hidden",
                    backgroundColor: "#fff",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxSizing: "border-box",
                    mrgin:"50px"
                  }}
                >
                  {/* inner grid: use placeholders for consistent layout so circle mask keeps shape */}
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: `repeat(${internalGrid}, ${cellSize}px)`,
                      gridTemplateRows: `repeat(${internalGrid}, ${cellSize}px)`,
                      width: waferDiameter,
                      height: waferDiameter,
                     
                    }}
                  >
                    {Array.from({ length: totalCells }).map((_, idx) => {
                      const row = Math.floor(idx / internalGrid);
                      const col = idx % internalGrid;

                      // distance test (centered grid coordinates) to decide if cell is inside circle
                      const dx = col - internalGrid / 2 + 0.5;
                      const dy = row - internalGrid / 2 + 0.5;
                      const distance = Math.sqrt(dx * dx + dy * dy);
                      const outsideCircle = distance > internalGrid / 2;

                      // site at that index (if BinResult length == totalCells then index matches)
                      const site = (wafer.BinResult && wafer.BinResult[idx]) || null;

                      // If no site data, render an empty placeholder cell (keeps layout)
                      if (!site) {
                        return (
                          <div
                            key={idx}
                            style={{
                              width: cellSize,
                              height: cellSize,
                              boxSizing: "border-box",
                              border: "0.3px solid rgba(0,0,0,0.05)",
                              background: outsideCircle ? "transparent" : "#fafafa",
                            }}
                          />
                        );
                      }

                      const binVisible = !selectedBin || Number(selectedBin) === Number(site.Bin);

                      return (
                        <div
                          key={idx}
                          style={{
                            width: cellSize,
                            height: cellSize,
                            boxSizing: "border-box",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "0.3px solid rgba(0,0,0,0.06)",
                            background: outsideCircle ? "transparent" : getBinColor(site.Bin),
                            color: outsideCircle ? "transparent" : "#fff",
                            fontSize: Math.max(10, Math.floor(cellSize / 2.6)),
                            opacity: binVisible ? 1 : 0.15,
                            userSelect: "none",
                          }}
                        >
                          {/* only show bin number if inside circle */}
                          {!outsideCircle ? site.Bin : null}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ marginTop: 8, fontWeight: "bold" }}>Wafer {wafer.WaferID}</div>
              </div>
            );
          })}
      </div>

      {/* Filter Panel */}
      <div
        style={{
          width: 300,
          padding: 20,
          borderRadius: 12,
          backgroundColor: "#fff",
          boxShadow: "0 0 10px rgba(0,0,0,0.08)",
          height: "fit-content",
        }}
      >
        <h2 style={{ marginBottom: 18 }}>Filters</h2>

        {renderFilterDropdown("Device", uniqueDevices, selectedDevice, setSelectedDevice)}
        {renderFilterDropdown("Lot", uniqueLots, selectedLot, setSelectedLot)}
        {renderFilterDropdown("Wafer", uniqueWaferIDs, selectedWaferID, setSelectedWaferID)}
        {renderFilterDropdown(
          "Bin",
          bins.map(String),
          selectedBin ? String(selectedBin) : null,
          (val) => setSelectedBin(val ? Number(val) : null)
        )}

        {renderMultiSelectWafer()}

        {/* Wafers-per-row selector (was your Grid Size) */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontWeight: "bold", marginBottom: 6, display: "block" }}>Wafers per row</label>
          <input
            type="number"
            min={1}
            max={10}
            value={wafersPerRow}
            onChange={(e) => {
              const v = Number(e.target.value || 1);
              setWafersPerRow(Math.min(10, Math.max(1, Math.floor(v))));
            }}
            style={{ width: "100%", padding: 8, borderRadius: 6, border: "1px solid #ccc" }}
          />
          <div style={{ fontSize: 12, color: "#666", marginTop: 6 }}>
            Controls how many wafer circles appear per row (e.g. 3 → 3xN layout).
          </div>
        </div>

        <button
          onClick={onRetrieve}
          style={{
            marginTop: 10,
            padding: "10px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: 8,
            fontWeight: "bold",
            cursor: "pointer",
            width: "100%",
          }}
        >
          Clear All Filters
        </button>
      </div>
    </div>
  );
};

export default WaferGallery;
