import { useQuery } from '@tanstack/react-query';
import { wraApi } from './wraApi';

/** @typedef {import('./wraApi').QueryParams} QueryParams */

/**
 * @typedef {Object} Event
 * @property {string} EventNo - 事件代碼
 * @property {string} EventName - 事件名稱
 * @property {string} BeginTime - 起始時間
 * @property {string} [EndTime] - 結束時間
 * @property {number} IsActive - 是否成立
 */

/**
 * 取得年度的成立列表 - 取得年度經濟部水利署成立大雨、豪雨、颱風資料
 * @param {number} year - 輸入西元年
 * @param {QueryParams} [params]
 * @returns {Promise<Array<Event>>} 年度事件列表陣列
 */
export const fetchEventByYear = (year, params) => wraApi.get(`/v1/Event/Year/${year}`, { params }).then(res => res.data);

export const useEventByYear = (year, params, options) => useQuery({ queryKey: ['wraEvent', year, params], queryFn: () => fetchEventByYear(year, params), enabled: !!year, ...options });
