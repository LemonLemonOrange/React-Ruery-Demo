import { useQuery } from '@tanstack/react-query';
import { wraApi } from './wraApi';

/** @typedef {import('./wraApi').QueryParams} QueryParams */

/**
 * @typedef {Object} WaterStation
 * @property {string} [Address] - 水位站所在地址
 * @property {string} CityCode - 縣市代碼
 * @property {number} [WarningLevel1] - 一級警戒值(公尺)
 * @property {number} [WarningLevel2] - 二級警戒值(公尺)
 * @property {number} [WarningLevel3] - 三級警戒值(公尺)
 * @property {number} [TopLevel] - 水位堤頂高(公尺)
 * @property {number} [Latitude] - 緯度(WGS84)
 * @property {number} [Longitude] - 經度(WGS84)
 * @property {number} [PlanFloodLevel] - 計畫洪水位(公尺)
 * @property {string} StationNo - 測站代碼
 * @property {string} StationName - 測站中文名稱
 * @property {string} BasinNo - 流域代碼
 * @property {string} BasinName - 流域名稱
 */

/**
 * @typedef {Object} WaterRealTimeInfo
 * @property {string} StationNo - 水位站站碼
 * @property {string} Time - 水情時間(格式:yyyy-MM-dd HH:mm)
 * @property {number} WaterLevel - 水位高(公尺)
 */

/**
 * @typedef {Object} WaterWarning
 * @property {string} StationNo - 測站代碼
 * @property {string} CityCode - 縣市代碼
 * @property {string} TownCode - 鄉鎮代碼
 * @property {string} Time - 水情時間(格式:yyyy-MM-dd HH:mm)
 * @property {number} WaterLevel - 水位高(公尺)
 * @property {number} WarningLevel - 警戒級別
 */

/**
 * 水位基本資料 - 取得水位站基本資料
 * @param {QueryParams} [params]
 * @returns {Promise<Array<WaterStation>>} 水位站基本資料陣列
 */
export const fetchWaterStation = (params) => wraApi.get('/v1/Water/Station', { params }).then(res => res.data);

/**
 * 水位即時資料 - 取得水位即時資料
 * @param {QueryParams} [params]
 * @returns {Promise<Array<WaterRealTimeInfo>>} 水位即時資料陣列
 */
export const fetchWaterRealTimeInfo = (params) => wraApi.get('/v1/Water/RealTimeInfo', { params }).then(res => res.data);

/**
 * 水位警示資料 - 取得水位警示資料
 * @param {QueryParams} [params]
 * @returns {Promise<Array<WaterWarning>>} 水位警示資料陣列
 */
export const fetchWaterWarning = (params) => wraApi.get('/v1/Water/Warning', { params }).then(res => res.data);

export const useWaterStation = (params, options) => useQuery({ queryKey: ['wraWaterStation', params], queryFn: () => fetchWaterStation(params), ...options });
export const useWaterRealTimeInfo = (params, options) => useQuery({ queryKey: ['wraWaterRealTimeInfo', params], queryFn: () => fetchWaterRealTimeInfo(params), ...options });
export const useWaterWarning = (params, options) => useQuery({ queryKey: ['wraWaterWarning', params], queryFn: () => fetchWaterWarning(params), ...options });
