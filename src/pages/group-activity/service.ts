import request from '@/services/request';

/**
*  拼团活动信息
*/
export const getGroupYouhuiInfo = (data: object) =>
    request({
        url: 'api/wap/user/getGroupYouhuiInfo',
        method: "GET",
        data
    })
    
/**
*  拼团活动拼团列表信息
*/
export const getGroupbuyings = (data: object) =>
    request({
        url:'api/wap/user/getGroupbuyings',
        method: "GET",
        data
    })

    /**
*  微信配置
*/
export const getShareSign = (data: object) =>
request({
    url: 'http://api.supplier.tdianyi.com/wechat/getShareSign',
    method: "GET",
    data
})


/**
*  请求支付属性
*/
export const toWxPay = (data: object) =>
    request({
        url: 'payCentre/toWxPay',
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        data
    })

/**
 *  开团查询团id
 */
export const getUserYouhuiGroupId = (data: object) =>
    request({
        url: 'api/wap/user/getUserYouhuiGroupId',
        method: "GET",
        data
    })
