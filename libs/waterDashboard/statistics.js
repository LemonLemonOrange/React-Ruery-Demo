import { useQuery } from '@tanstack/react-query';
import { wraApi } from './wraApi';

/** @typedef {import('./wraApi').QueryParams} QueryParams */

/**
 * @typedef {Object} DisasterFloodingStatistics
 * @property {string} [CityCode] - 縣市代碼
 * @property {number} [TownCount] - 目前鄉鎮數
 * @property {number} [RecededCount] - 已退水(處)
 * @property {number} [FloodingCount] - 未退水(處)
 * @property {number} [Total] - 合計災害數
 */

/**
 * @typedef {Object} DisasterWaterFacilityStatistics
 * @property {string} [CityCode] - 縣市代碼
 * @property {number} [RepairedCount] - 搶修險完成數量(處)
 * @property {number} [RepairingCount] - 搶修險中數量(處)
 * @property {number} [Total] - 受損總數量(處)
 */

/**
 * @typedef {Object} FloodDefenseMaterial
 * @property {string} [Name] - 防汛備料名稱
 * @property {number} [Total] - 總數
 */

/**
 * @typedef {Object} FloodDefenseOperator
 * @property {string} [OperatorName] - 河川局
 * @property {Array<FloodDefenseMaterial>} [Material] - 防汛備料
 */

/**
 * 淹水災情統計表 - 取得某次事件內的淹水災情統計
 * @param {string} eventNo - 事件代碼
 * @returns {Promise<Array<DisasterFloodingStatistics>>} 淹水災情統計陣列
 */
export const fetchStatisticsFlooding = (eventNo) => wraApi.get(`/v1/Statistics/Flooding/${eventNo}`).then(res => res.data);

/**
 * 水利設施災情統計表 - 取得某次事件內的水利設施統計
 * @param {string} eventNo - 事件代碼
 * @returns {Promise<Array<DisasterWaterFacilityStatistics>>} 水利設施災情統計陣列
 */
export const fetchStatisticsWaterFacility = (eventNo) => wraApi.get(`/v1/Statistics/WaterFacility/${eventNo}`).then(res => res.data);

/**
 * 防汛備料統計
 * @param {QueryParams} [params]
 * @returns {Promise<Array<FloodDefenseOperator>>} 防汛備料統計陣列
 */
export const fetchStatisticsFloodDefenseMaterial = (params) => wraApi.get('/v1/Statistics/FloodDefenseMaterial', { params }).then(res => res.data);

export const useStatisticsFlooding = (eventNo, options) => useQuery({ queryKey: ['wraStatisticsFlooding', eventNo], queryFn: () => fetchStatisticsFlooding(eventNo), enabled: !!eventNo, ...options });
export const useStatisticsWaterFacility = (eventNo, options) => useQuery({ queryKey: ['wraStatisticsWaterFacility', eventNo], queryFn: () => fetchStatisticsWaterFacility(eventNo), enabled: !!eventNo, ...options });
export const useStatisticsFloodDefenseMaterial = (params, options) => useQuery({ queryKey: ['wraStatisticsFloodDefenseMaterial', params], queryFn: () => fetchStatisticsFloodDefenseMaterial(params), ...options });
