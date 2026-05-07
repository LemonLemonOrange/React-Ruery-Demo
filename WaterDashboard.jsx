import React, { useState, useMemo } from 'react';
import './WaterDashboard.css';
import ReservoirCard from './components/ReservoirCard';
import taiwanSvg from './taiwan-political-division.svg';
import { useReservoirStation, useReservoirRealTimeInfo } from '../../libs/waterDashboard';

const reservoirMapData = [
  { name: '寶山水庫', bubble: { x: 33, y: 14 }, marker: { x: 44, y: 32 } },
  { name: '寶山第二水庫', bubble: { x: 14, y: 22 }, marker: { x: 44, y: 22 } },
  { name: '永和山水庫', bubble: { x: 28, y: 38 }, marker: { x: 44, y: 28 } },
  { name: '石門水庫', bubble: { x: 62, y: 12 }, marker: { x: 52, y: 22 } },
  { name: '翡翠水庫', bubble: { x: 80, y: 18 }, marker: { x: 56, y: 24 } },
  { name: '鯉魚潭水庫', bubble: { x: 68, y: 35 }, marker: { x: 56, y: 38 } },
  { name: '德基水庫', bubble: { x: 80, y: 40 }, marker: { x: 58, y: 40 } },
  { name: '南化水庫', bubble: { x: 15, y: 55 }, marker: { x: 48, y: 62 } },
  { name: '蘭潭水庫', bubble: { x: 65, y: 58 }, marker: { x: 54, y: 62 } },
  { name: '仁義潭水庫', bubble: { x: 80, y: 62 }, marker: { x: 58, y: 62 } },
  { name: '曾文水庫', bubble: { x: 28, y: 72 }, marker: { x: 46, y: 68 } },
  { name: '烏山頭水庫', bubble: { x: 15, y: 86 }, marker: { x: 44, y: 70 } },
];

const WaterDashboard = () => {
  const [hovered, setHovered] = useState(null);

  const { data: stations, isLoading: isStationsLoading } = useReservoirStation();
  const { data: realTimeInfos, isLoading: isRealTimeLoading } = useReservoirRealTimeInfo();

  const reservoirs = useMemo(() => {
    if (!stations || !realTimeInfos) return [];

    return reservoirMapData.map(mapData => {
      const station = stations.find(s => s.StationName === mapData.name);
      if (!station) return { ...mapData, volume: '-', percent: 0 };

      const realTime = realTimeInfos.find(r => r.StationNo === station.StationNo);
      
      const volume = realTime?.EffectiveStorage != null 
        ? Math.round(realTime.EffectiveStorage).toLocaleString() 
        : '-';
      
      const percent = realTime?.PercentageOfStorage != null 
        ? Number(realTime.PercentageOfStorage.toFixed(2)) 
        : 0;

      return {
        ...mapData,
        volume,
        percent
      };
    });
  }, [stations, realTimeInfos]);

  const updateTime = useMemo(() => {
    if (!realTimeInfos || realTimeInfos.length === 0) return '';
    const timeStr = realTimeInfos[0].Time;
    const date = new Date(timeStr);
    if (isNaN(date.getTime())) return '';
    const twYear = date.getFullYear() - 1911;
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    return `${twYear}-${month}-${day} ${hours}時`;
  }, [realTimeInfos]);

  if (isStationsLoading || isRealTimeLoading) {
    return (
      <div style={{ padding: '20px', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <h2 style={{ color: '#0abcce' }}>資料載入中...</h2>
      </div>
    );
  }

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
          水庫蓄水情形 {updateTime ? `(${updateTime})` : ''}
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
