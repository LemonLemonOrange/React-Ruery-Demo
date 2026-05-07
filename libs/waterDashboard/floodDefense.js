import { useQuery } from '@tanstack/react-query';
import { wraApi } from './wraApi';

/** @typedef {import('./wraApi').QueryParams} QueryParams */

/**
 * @typedef {Object} MaterialLocation
 * @property {string} OperatorName - 河川局
 * @property {string} [CityCode] - 縣市代碼
 * @property {string} Type - 防汛備料場所類型 = ['1: 防汛倉庫', '2: 防汛堆置廠']
 * @property {string} [Watershed] - 水系
 * @property {string} [River] - 河川
 * @property {string} [Remarks] - 備註
 * @property {string} [SrcUpdateTime] - 來源資料更新時間
 */

/**
 * 防汛備料場所
 * @param {QueryParams} [params]
 * @returns {Promise<Array<MaterialLocation>>} 防汛備料場所陣列
 */
export const fetchFloodDefenseMaterialLocation = (params) => wraApi.get('/v1/FloodDefense/MaterialLocation', { params }).then(res => res.data);

export const useFloodDefenseMaterialLocation = (params, options) => useQuery({ queryKey: ['wraFloodDefenseMaterialLocation', params], queryFn: () => fetchFloodDefenseMaterialLocation(params), ...options });
