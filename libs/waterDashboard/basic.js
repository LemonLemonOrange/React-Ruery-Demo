import { useQuery } from '@tanstack/react-query';
import { wraApi } from './wraApi';

/** @typedef {import('./wraApi').QueryParams} QueryParams */

/**
 * @typedef {Object} City
 * @property {string} CityCode - 縣市代碼
 * @property {string} CityName_Ch - 縣市名稱
 * @property {string} CityName_En - 縣市名稱
 */

/**
 * @typedef {Object} Town
 * @property {string} TownCode - 鄉鎮代碼
 * @property {string} TownName - 鄉鎮名稱
 */

/**
 * 取得所有縣市資料
 * @param {QueryParams} [params]
 * @returns {Promise<Array<City>>} 包含各縣市資料的陣列
 */
export const fetchCity = (params) => wraApi.get('/v1/Basic/City', { params }).then(res => res.data);

/**
 * 取得該縣市鄉鎮資料
 * @param {string} city - 縣市名稱 (例如: 新北市)
 * @param {QueryParams} [params]
 * @returns {Promise<Array<Town>>} 包含該縣市鄉鎮資料的陣列
 */
export const fetchTown = (city, params) => wraApi.get(`/v1/Basic/${city}/Town`, { params }).then(res => res.data);

export const useCity = (params, options) => useQuery({ queryKey: ['wraCity', params], queryFn: () => fetchCity(params), ...options });
export const useTown = (city, params, options) => useQuery({ queryKey: ['wraTown', city, params], queryFn: () => fetchTown(city, params), enabled: !!city, ...options });
