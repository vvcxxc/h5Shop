import request from '@/services/request';

/**
*  拼团活动信息
*/
export const groupOrderInfo = (data: object) =>
    request({
        url: 'api/wap/user/groupOrderInfo',
        method: "GET",
        data
    })

/**
*  拼团活动购买
*/
export const toWxPay = (data: object) =>
    request({
        url: 'payCentre/toWxPay',
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify(data)
    })

/**
*  发团查团id
*/
export const getUserYouhuiGroupId = (data: object) =>
    request({
        url: 'api/wap/user/getUserYouhuiGroupId',
        method: "GET",
        data
    })
