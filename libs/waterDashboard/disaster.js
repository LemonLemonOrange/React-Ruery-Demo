import { useQuery } from '@tanstack/react-query';
import { wraApi } from './wraApi';

/** @typedef {import('./wraApi').QueryParams} QueryParams */

/**
 * @typedef {Object} DisasterFlooding
 * @property {number} DisasterFloodingID - 災情序號
 * @property {string} Time - 通報時間(格式:yyyy-MM-dd HH:mm)
 * @property {string} SourceCode - 災情來源 = ['1: 經濟部水利署', '2: EMIC', '3: 電視媒體', '4: 防汛護水志工', '5: 消防署', '6: CHT', '7: CCTV', '8: 其他']
 * @property {string} [SourceRemarks] - 來源說明
 * @property {string} [SourceNo] - 資料來源序號
 * @property {string} [OperatorName] - 災點分區
 * @property {string} [CityCode] - 縣市代碼
 * @property {string} [TownCode] - 鄉鎮代碼
 * @property {string} [Situation] - 災情描述
 * @property {string} [Location] - 災害地點
 * @property {number} [Depth] - 淹水深度
 * @property {string} [Treatment] - 災情處置情形
 * @property {boolean} [IsReceded] - 是否退水
 * @property {string} [RecededDate] - 退水時間(格式:yyyy-MM-dd HH:mm)
 * @property {number} [Latitude] - 緯度(WGS84)
 * @property {number} [Longitude] - 經度(WGS84)
 * @property {string} [Type] - 災害種類 = ['0: 住戶', '1: 工(商)業區', '2: 農田/漁塭', '3: 道路', '4: 其他(請說明)', '5: 待查']
 */

/**
 * @typedef {Object} DisasterWaterFacility
 * @property {number} WaterFacilityID - 災情序號
 * @property {string} Time - 通報時間(格式:yyyy-MM-dd HH:mm)
 * @property {string} [OperatorName] - 災點分區
 * @property {string} [CityCode] - 縣市代碼
 * @property {string} [TownCode] - 鄉鎮代碼
 * @property {string} [Situation] - 情況說明
 * @property {string} [Treatment] - 處理說明
 * @property {number} [Latitude] - 緯度(WGS84)
 * @property {number} [Longitude] - 經度(WGS84)
 * @property {string} [Type] - 災害類別 = ['1: 河堤', '2: 海堤', '3: 排水', '4: 水庫', '5: 水門', '6: 抽水站', '7: 其他']
 */

/**
 * 淹水災情 - 取得某次事件內的淹水災情
 * @param {string} eventNo - 事件代碼
 * @param {QueryParams} [params]
 * @returns {Promise<Array<DisasterFlooding>>} 淹水災情陣列
 */
export const fetchDisasterFlooding = (eventNo, params) => wraApi.get(`/v1/Disaster/Flooding/${eventNo}`, { params }).then(res => res.data);

/**
 * 水利設施災情 - 取得某次事件內的水利設施災情
 * @param {string} eventNo - 事件代碼
 * @param {QueryParams} [params]
 * @returns {Promise<Array<DisasterWaterFacility>>} 水利設施災情陣列
 */
export const fetchDisasterWaterFacility = (eventNo, params) => wraApi.get(`/v1/Disaster/WaterFacility/${eventNo}`, { params }).then(res => res.data);

export const useDisasterFlooding = (eventNo, params, options) => useQuery({ queryKey: ['wraDisasterFlooding', eventNo, params], queryFn: () => fetchDisasterFlooding(eventNo, params), enabled: !!eventNo, ...options });
export const useDisasterWaterFacility = (eventNo, params, options) => useQuery({ queryKey: ['wraDisasterWaterFacility', eventNo, params], queryFn: () => fetchDisasterWaterFacility(eventNo, params), enabled: !!eventNo, ...options });
