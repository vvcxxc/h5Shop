import http from "../http"
import request from '@/services/request';

/**
*  增值海报
*/
export const geValueAddedPoster = (data?: object) =>
  request({
    url: 'v3/get_appreciation_poster',
    method: "GET",
    data
  })

/**
*  拼团海报
*/
export const getGroupPoster = (data: object) =>
  request({
    url: 'v3/get_group_poster',
    method: "GET",
    data
  })

/**
*  现金券海报
*/
export const moneyPoster = (data) =>
  request({
    url: 'v3/get_cash_poster',
    method: "GET",
    data
  })

/**
*  兑换券海报
*/
export const shopPoster = (data) =>
  request({
    url: 'v3/get_goods_poster',
    method: "GET",
    data
  })
