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

// helper to interpolate between white and bin color
function interpolateColor(color1, color2, factor) {
  const c1 = parseInt(color1.slice(1), 16);
  const c2 = parseInt(color2.slice(1), 16);

  const r1 = (c1 >> 16) & 255,
    g1 = (c1 >> 8) & 255,
    b1 = c1 & 255;
  const r2 = (c2 >> 16) & 255,
    g2 = (c2 >> 8) & 255,
    b2 = c2 & 255;

  const r = Math.round(r1 + (r2 - r1) * factor);
  const g = Math.round(g1 + (g2 - g1) * factor);
  const b = Math.round(b1 + (b2 - b1) * factor);

  return `rgb(${r},${g},${b})`;
}

const CompositBinPercantage = () => {
  const [binGroups, setBinGroups] = useState({});
  const [coordMap, setCoordMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [globalScale, setGlobalScale] = useState(null);
  const [totalWafers, setTotalWafers] = useState(0);

  const coordinateSpacing = 5; // grid spacing multiplier

  useEffect(() => {
    fetch("/waferDataDetail.json")
      .then((res) => res.json())
      .then((data) => {
        const wafers = Array.isArray(data) ? data : [data];
        setTotalWafers(wafers.length); // total wafers dynamically

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

  // Dynamic die size
  const dieSize = Math.min(
    16,
    (margin / Math.max(rangeX, rangeY)) * coordinateSpacing * 0.9
  );

  return (
    <div style={{ padding: "20px" }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {Object.entries(binGroups).map(([bin, dies]) => {
          const baseColor = binToColor[bin] || "gray";

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
                  if (
                    Math.sqrt(dx * dx + dy * dy) >
                    waferSize / 2 - waferPadding
                  )
                    return null;

                  const coordKey = `${die.x}_${die.y}`;
                  const count = coordMap[coordKey][bin] || 0;

                  // density across wafers
                  const density = totalWafers
                    ? count / totalWafers
                    : 0;
                  const percentage = (density * 100).toFixed(1);

                  // gradient fill
                  const fillColor = interpolateColor("#ffffff", baseColor, density);

                  return (
                    <div
                      key={i}
                      style={{
                        position: "absolute",
                        left: posX,
                        top: posY,
                        width: dieSize,
                        height: dieSize,
                        backgroundColor: fillColor,
                        color: "#000",
                        fontSize: dieSize * 0.45,
                        fontWeight: "bold",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        transform: "translate(-50%, -50%)",
                        borderRadius: "2px",
                        border: "1px solid #000",
                      }}
                      title={`Bin ${bin} - ${count}/${totalWafers} wafers = ${percentage}%`}
                    >
                      {percentage}
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
                    backgroundColor: baseColor,
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

export default CompositBinPercantage;
