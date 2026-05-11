import axios from 'axios';

export const wraApi = axios.create({
  // 透過 Vite proxy (/WraApi → https://fhy.wra.gov.tw/WraApi) 避免 CORS
  baseURL: '/WraApi',
});

/**
 * 共用查詢參數
 * @typedef {Object} QueryParams
 * @property {string} [$filter] - 過濾
 * @property {string} [$select] - 挑選
 * @property {string} [$orderby] - 排序
 * @property {number} [$top] - 取前幾筆 (預設30)
 * @property {number} [$skip] - 跳過前幾筆
 */
