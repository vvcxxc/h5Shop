import request from '@/services/request';

/**
*  增值活动信息
*/
export const discountCoupons = (id: number | string, data: object) =>
    request({
        url: 'v3/discount_coupons/' + id,
        method: "GET",
        data
    })

