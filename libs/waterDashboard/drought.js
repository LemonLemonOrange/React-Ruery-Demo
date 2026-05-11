import { useQuery } from '@tanstack/react-query';
import { XMLParser } from 'fast-xml-parser';
import axios from 'axios';

/**
 * NCDR 民生示警公開資料平台 - 枯旱預警
 * 這組 API 使用 CAP (Common Alerting Protocol) 格式，
 * 與水利署 OpenAPI 是不同的系統。
 *
 * AlertType=2099 直接過濾只回傳「枯旱預警」，不需要再手動過濾。
 * 一般公開端點：https://alerts.ncdr.nat.gov.tw/JSONAtomFeeds.ashx
 * 枯旱專用端點：https://alerts.ncdr.nat.gov.tw/webapi/JSONAtomFeed.ashx?AlertType=2099
 */
const NCDR_DROUGHT_URL = '/ncdr/webapi/JSONAtomFeed.ashx?AlertType=2099';

const xmlParser = new XMLParser({ ignoreAttributes: false, attributeNamePrefix: '@' });

/**
 * @typedef {Object} DroughtArea
 * @property {string} areaDesc - 受影響縣市名稱 (例如：新竹縣、台中市)
 */

/**
 * @typedef {Object} DroughtInfo
 * @property {string} severity - 燈號嚴重程度
 *   - "Minor"    → 綠燈：水情提醒
 *   - "Moderate" → 黃燈：減壓供水
 *   - "Severe"   → 橙燈：減量供水
 *   - "Extreme"  → 紅燈：分區供水或定點供水
 * @property {string} headline - 標題 (例如：115年4月27日供水情勢（枯旱預警）通報)
 * @property {string} description - 詳細說明
 * @property {string} effective - 生效時間
 * @property {string} expires - 到期時間
 * @property {DroughtArea[]} area - 受影響地區列表
 */

/**
 * @typedef {Object} DroughtAlert
 * @property {string} identifier - 唯一識別碼 (例如：WRA_Drought_20260427193326)
 * @property {string} sent - 發送時間
 * @property {string} status - 狀態 (Actual / Test)
 * @property {DroughtInfo} info - 警示詳細內容 (含 severity 與 area)
 */

/**
 * 從 NCDR 原子訂閱取得最新枯旱預警的 CAP .cap 檔案連結，
 * 並解析 XML 取得完整結構化資料（含 severity 與受影響縣市）。
 *
 * @returns {Promise<DroughtAlert | null>} 最新一筆枯旱預警，若無則回傳 null
 */
export const fetchDroughtAlert = async () => {
  // 1. 取得枯旱預警清單（AlertType=2099 已過濾只有枯旱預警）
  const feedRes = await axios.get(NCDR_DROUGHT_URL);
  console.log('feedRes', feedRes);
  const entries = feedRes.data?.entry || [];
  if (entries.length === 0) return null;

  // 2. 取最新一筆（依 updated 排序）
  const sorted = [...entries].sort((a, b) => new Date(b.updated) - new Date(a.updated));
  const latest = sorted[0];

  // 3. 取得 .cap XML 檔案（經由 proxy 走 /ncdr 以避免 CORS）
  const capUrl = latest.link?.['@href'];
  if (!capUrl) return null;
  const proxyCapUrl = capUrl.replace('https://alerts.ncdr.nat.gov.tw', '/ncdr');

  const capRes = await axios.get(proxyCapUrl);
  const parsed = xmlParser.parse(capRes.data);
  const alert = parsed.alert;
  if (!alert) return null;

  // 4. area 可能是物件（單一地區）或陣列（多地區），統一處理
  const rawArea = alert.info?.area;
  const areas = rawArea ? (Array.isArray(rawArea) ? rawArea : [rawArea]) : [];

  return {
    identifier: alert.identifier,
    sent: alert.sent,
    status: alert.status,
    info: {
      severity: alert.info?.severity,
      headline: alert.info?.headline,
      description: alert.info?.description,
      effective: alert.info?.effective,
      expires: alert.info?.expires,
      area: areas.map(a => ({ areaDesc: a.areaDesc })),
    },
  };
};

/**
 * React Query Hook - 取得最新枯旱預警（含燈號與受影響縣市）
 * 每 10 分鐘重新取得（枯旱預警不會頻繁更新）
 *
 * @param {object} [options] - React Query 額外選項
 * @returns React Query 結果，data 為 DroughtAlert | null
 */
export const useDroughtAlert = (options) =>
  useQuery({
    queryKey: ['ncdrDroughtAlert'],
    queryFn: fetchDroughtAlert,
    staleTime: 1000 * 60 * 10,
    ...options,
  });
