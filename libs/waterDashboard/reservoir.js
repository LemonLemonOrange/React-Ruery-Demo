import { useQuery } from '@tanstack/react-query';
import { wraApi } from './wraApi';

/** @typedef {import('./wraApi').QueryParams} QueryParams */

/**
 * @typedef {Object} ReservoirStation
 * @property {string} CityCode - 縣市代碼
 * @property {number} [EffectiveCapacity] - 有效容量(萬立方公尺)
 * @property {number} [FullWaterHeight] - 滿水位標高(公尺)
 * @property {number} [DeadWaterHeight] - 呆水位標高(公尺)(底床高)
 * @property {number} [Latitude] - 緯度(WGS84)
 * @property {number} [Longitude] - 經度(WGS84)
 * @property {number} Storage - 總蓄水量(萬立方公尺)
 * @property {number} ProtectionFlood - 是否涉及防洪(0:否;1:是)
 * @property {number} HydraulicConstruction - 水工結構物種類(1:水庫and壩;2:攔河堰)
 * @property {number} Importance - 水庫堰壩之重要性(1:主要;0:其他)
 * @property {string} StationNo - 測站代碼
 * @property {string} StationName - 測站中文名稱
 * @property {string} BasinNo - 流域代碼
 * @property {string} BasinName - 流域名稱
 */

/**
 * @typedef {Object} ReservoirRealTimeInfo
 * @property {string} StationNo - 測站代碼
 * @property {string} Time - 水情時間(格式:yyyy-MM-dd HH:mm)
 * @property {number} [AccumulatedRainfall] - 本日集水區累積降雨量(mm)
 * @property {number} WaterHeight - 水位高(公尺)
 * @property {number} [EffectiveCapacity] - 有效容量(萬立方公尺)
 * @property {number} [EffectiveStorage] - 有效蓄水量（萬立方公尺）
 * @property {number} [PercentageOfStorage] - 蓄水百分比
 * @property {number} [OperationalStorage] - 取用水量
 * @property {number} [Inflow] - 進流量(cms)
 * @property {number} [Outflow] - 水庫出流量(cms)
 * @property {string} [Status] - 水庫放水狀態代碼 = ['0: 預計放水', '1: 放水中', '-1: 未放水']
 * @property {string} [NextSpillTime] - 預計洩洪或洩洪時間(格式:yyyy-MM-dd HH:mm)
 * @property {number} [Discharge] - 放流量(cms)
 * @property {number} [DischargeOfProtectionFlood] - 防洪排放流量(cms)
 * @property {number} [DischargeOfEscapeSand] - 排砂道放流量(cms)
 * @property {number} [DischargeOfHydroelectric] - 發電放流量(cms)
 * @property {number} [DischargeOfOthers] - 其他放流量(cms)
 */

/**
 * @typedef {Object} ReservoirDaily
 * @property {string} StationNo - 測站代碼
 * @property {string} Time - 水情時間(格式:yyyy-MM-dd HH:mm)
 * @property {number} [EffectiveCapacity] - 有效容量(萬立方公尺)
 * @property {number} [DeadWaterHeight] - 呆水位標高(公尺)(底床高)
 * @property {number} [FullWaterHeight] - 滿水位標高(公尺)
 * @property {number} [AccumulatedRainfall] - 集水區本日降雨量(mm)
 * @property {number} [InflowTotal] - 本日總進水量(萬立方公尺)
 * @property {number} [OutflowTotal] - 本日總出水量(萬立方公尺)
 */

/**
 * @typedef {Object} ReservoirWarning
 * @property {string} StationNo - 測站代碼
 * @property {string} [CityCode] - 縣市代碼
 * @property {string} [TownCode] - 鄉鎮代碼
 * @property {string} Time - 水情時間(格式:yyyy-MM-dd HH:mm)
 * @property {number} [WaterHeight] - 水位高(公尺)
 * @property {number} [DischargeOfProtectionFlood] - 防洪排放流量(cms)
 * @property {string} [NextSpillTime] - 預計放水或放水時間(格式:yyyy-MM-dd HH:mm)
 * @property {number} [Discharge] - 放流量
 * @property {string} Status - 水庫放水狀態代碼 = ['0: 預計放水', '1: 放水中', '-1: 未放水']
 */

/**
 * @typedef {Object} ReservoirAffectedArea
 * @property {string} StationNo - 水庫代碼
 * @property {string} CityCode - 縣市代碼
 * @property {string} TownCode - 鄉鎮代碼
 */

/**
 * 水庫基本資料 - 取得水庫基本資料
 * @param {QueryParams} [params]
 * @returns {Promise<Array<ReservoirStation>>} 水庫基本資料陣列
 */
export const fetchReservoirStation = (params) => wraApi.get('/v1/Reservoir/Station', { params }).then(res => res.data);

/**
 * 水庫即時資料 - 取得水庫即時資料
 * @param {QueryParams} [params]
 * @returns {Promise<Array<ReservoirRealTimeInfo>>} 水庫即時資料陣列
 */
export const fetchReservoirRealTimeInfo = (params) => wraApi.get('/v1/Reservoir/RealTimeInfo', { params }).then(res => res.data);

/**
 * 水庫統計資料 - 取得水庫統計資料
 * @param {QueryParams} [params]
 * @returns {Promise<Array<ReservoirDaily>>} 水庫統計資料陣列
 */
export const fetchReservoirDaily = (params) => wraApi.get('/v1/Reservoir/Daily', { params }).then(res => res.data);

/**
 * 水庫警示資料 - 取得水庫警示資料
 * @param {QueryParams} [params]
 * @returns {Promise<Array<ReservoirWarning>>} 水庫警示資料陣列
 */
export const fetchReservoirWarning = (params) => wraApi.get('/v1/Reservoir/Warning', { params }).then(res => res.data);

/**
 * 水庫警戒範圍 - 取得水庫警戒範圍
 * @param {QueryParams} [params]
 * @returns {Promise<Array<ReservoirAffectedArea>>} 水庫警戒範圍陣列
 */
export const fetchReservoirAffectedArea = (params) => wraApi.get('/v1/Reservoir/AffectedArea', { params }).then(res => res.data);

export const useReservoirStation = (params, options) => useQuery({ queryKey: ['wraReservoirStation', params], queryFn: () => fetchReservoirStation(params), ...options });
export const useReservoirRealTimeInfo = (params, options) => useQuery({ queryKey: ['wraReservoirRealTimeInfo', params], queryFn: () => fetchReservoirRealTimeInfo(params), ...options });
export const useReservoirDaily = (params, options) => useQuery({ queryKey: ['wraReservoirDaily', params], queryFn: () => fetchReservoirDaily(params), ...options });
export const useReservoirWarning = (params, options) => useQuery({ queryKey: ['wraReservoirWarning', params], queryFn: () => fetchReservoirWarning(params), ...options });
export const useReservoirAffectedArea = (params, options) => useQuery({ queryKey: ['wraReservoirAffectedArea', params], queryFn: () => fetchReservoirAffectedArea(params), ...options });
