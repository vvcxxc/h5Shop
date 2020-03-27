import request from '@/services/request';

/**
*  拼团活动信息
*/
export const discount_coupons = (id: number | string) =>
    request({
        url: 'v3/discount_coupons/' + id,
        method: "GET",
    })

/**
*  拼团活动购买
*/
export const wxWechatPay = (data: object) =>
    request({
        url: 'api/wap/coupon/wxWechatPay',
        method: "POST",
        header: {
            "Content-Type": "application/json"
        },
        data: JSON.stringify(data)
    })

/**
*  地址查询
*/
export const defaultAddress = () =>
    request({
        url: 'v3/address/defaultAddress',
        method: "GET"
    })

/**
*  默认地址查询
*/
export const getAddress = (id) =>
    request({
        url: 'v3/address/' + id,
        method: "GET"
    })
