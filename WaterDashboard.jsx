import React, { useState } from 'react';
import './WaterDashboard.css';
import ReservoirCard from './components/ReservoirCard';
import taiwanSvg from './taiwan-political-division.svg';

const reservoirs = [
  { name: '寶山水庫', volume: '506', percent: 100, bubble: { x: 33, y: 14 }, marker: { x: 44, y: 32 } },
  { name: '寶山第二水庫', volume: '3,382', percent: 99.93, bubble: { x: 14, y: 22 }, marker: { x: 44, y: 22 } },
  { name: '永和山水庫', volume: '2,987', percent: 99.77, bubble: { x: 28, y: 38 }, marker: { x: 44, y: 28 } },
  { name: '石門水庫', volume: '20,500', percent: 99.88, bubble: { x: 62, y: 12 }, marker: { x: 52, y: 22 } },
  { name: '翡翠水庫', volume: '33,815', percent: 91.40, bubble: { x: 80, y: 18 }, marker: { x: 56, y: 24 } },
  { name: '鯉魚潭水庫', volume: '11,456', percent: 99.18, bubble: { x: 68, y: 35 }, marker: { x: 56, y: 38 } },
  { name: '德基水庫', volume: '18,628', percent: 99.10, bubble: { x: 80, y: 40 }, marker: { x: 58, y: 40 } },
  { name: '南化水庫', volume: '8,905', percent: 99.83, bubble: { x: 15, y: 55 }, marker: { x: 48, y: 62 } },
  { name: '蘭潭水庫', volume: '914', percent: 99.13, bubble: { x: 65, y: 58 }, marker: { x: 54, y: 62 } },
  { name: '仁義潭水庫', volume: '2,454', percent: 99.53, bubble: { x: 80, y: 62 }, marker: { x: 58, y: 62 } },
  { name: '曾文水庫', volume: '50,966', percent: 100, bubble: { x: 28, y: 72 }, marker: { x: 46, y: 68 } },
  { name: '烏山頭水庫', volume: '7,612', percent: 97.01, bubble: { x: 15, y: 86 }, marker: { x: 44, y: 70 } },
];

const WaterDashboard = () => {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={{ padding: '20px' }}>
      <div className="dashboard-container">

        {/* Header Tabs (mockup of the image header) */}
        <div className="dashboard-header-tabs">
          <div className="header-tab active">水庫蓄水情形圖</div>
          {/* <div className="header-tab">水庫水情一覽表</div>
          <div className="header-tab">水庫水情資訊</div>
          <div className="header-tab">河川水情資訊</div> */}
        </div>

        <div className="dashboard-title">
          水庫蓄水情形 (113-11-20 17時)
        </div>

        {/* 台灣地圖 SVG */}
        <img
          src={taiwanSvg}
          alt="Taiwan Map"
          className="taiwan-map-img"
        />

        {/* 連接線 SVG Overlay */}
        <svg
          width="100%"
          height="100%"
          style={{ position: 'absolute', top: 0, left: 0, zIndex: 5, pointerEvents: 'none' }}
        >
          {reservoirs.map((res, idx) => (
            <line
              key={`line-${idx}`}
              x1={`${res.bubble.x}%`}
              y1={`${res.bubble.y}%`}
              x2={`${res.marker.x}%`}
              y2={`${res.marker.y}%`}
              stroke="#0abcce"
              strokeWidth={res.name === hovered ? 3 : 1.5}
              strokeDasharray={res.name === hovered ? "0" : "4 2"}
              opacity={res.name === hovered ? 1 : 0.6}
              style={{ transition: 'all 0.3s' }}
            />
          ))}
        </svg>

        {/* 水庫標記點 (黃色點) */}
        {reservoirs.map((res, idx) => (
          <div
            key={`marker-${idx}`}
            className={`map-marker ${res.name === hovered ? 'active' : ''}`}
            style={{ top: `${res.marker.y}%`, left: `${res.marker.x}%` }}
            onMouseEnter={() => setHovered(res.name)}
            onMouseLeave={() => setHovered(null)}
          />
        ))}

        {/* 水庫方格 (資訊卡) */}
        {reservoirs.map((res, idx) => (
          <div
            key={`card-wrapper-${idx}`}
            style={{
              position: 'absolute',
              top: `${res.bubble.y}%`,
              left: `${res.bubble.x}%`,
              zIndex: res.name === hovered ? 30 : 10
            }}
          >
            <ReservoirCard
              name={res.name}
              storage={res.volume}
              pct={res.percent}
              isHovered={res.name === hovered}
              onMouseEnter={() => setHovered(res.name)}
              onMouseLeave={() => setHovered(null)}
            />
          </div>
        ))}

        {/* 備註 */}
        <div style={{ position: 'absolute', bottom: 15, width: '100%', textAlign: 'center', color: '#fff', fontSize: '0.85rem', zIndex: 10, textShadow: '0 1px 3px rgba(0,0,0,0.8)' }}>
          <div>※蓄水量單位：萬立方公尺</div>
          <div>※本表未經人工完整檢驗，僅供參考</div>
        </div>
      </div>
    </div>
  );
};

export default WaterDashboard;
