import request from '@/services/request';

/**
*  增值活动信息
*/
export const getYouhuiAppreciationInfo = (data: object) =>
    request({
        url: 'api/wap/user/appreciation/getYouhuiAppreciationInfo',
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
export const wxXcxuWechatPay = (data: object) =>
    request({
        url: 'v1/youhui/wxXcxuWechatPay',
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        data
    })

/**
 *  查询用户最后一次购买的增值活动id
 */
export const getUserLastYouhuiId = (data: object) =>
    request({
        url: 'v1/youhui/getUserLastYouhuiId',
        method: "GET",
        data
    })
