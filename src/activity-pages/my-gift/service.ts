import request from '@/services/request';
import userRequest from '@/services/userRequest';

/**
*  列表信息
*/
export const groupListInfo = (data: object) =>
    request({
        url: 'v3/orderGift',
        method: "GET",
        data
    })
/**
*  列表信息
*/
export const groupLogisticsInfo = (data: object) =>
    request({
        url: 'v3/wuliu',
        method: "GET",
        data
    })

