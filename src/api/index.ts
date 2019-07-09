import http from "./http"

interface location {
  xpoint: number;
  ypoint: number;
}
/**
 * 活动中心数据
 */
export const getActivityCenter = (params: location) =>
  http({
    url: "api/wap/zero/index",
    data: params
  })

/**
 * 获取活动中心/增值页面券信息
 */
interface GetAppreciationinfo {
  youhui_log_id: string;
}
export const getAppreciationinfo = (params: GetAppreciationinfo) =>
  http({
    url: "api/wap/user/getApperciationUserYonhuiInfo",
    data: params
  })

/**
 * 获取订单(, 我的订单)
 */
interface GetOrder {
  use: number;
}
export const getOrder = (params: GetOrder) =>
  http({
    url: "api/wap/coupon/getUserYohuiList",
    data: params
  })

/**
 * 获取线下订单(, 我的订单)
 */
export const getOfflineOrder = () =>
  http({
    url: "api/wap/orderGift/list",
  })

/**
 * 获取礼品信息
 */
interface GetGiftinfo {
  activity_id: string;
  gift_id: string;
}
export const getGiftinfo = (params: GetGiftinfo) =>
  http({
    url: "api/wap/Integral/goodsDetail",
    method: "post",
    data: params
  })

/**
 * 获取优惠券(, 增值页面)
 * ps: 经|纬度
 */
interface GetCoupon {
  xpoint: number;
  ypoint: number;
}
export const getCoupon = (params: GetCoupon) =>
  http({
    url: "api/wap/user/appreciation/getYouhuiList",
    // method: "post",
    data: params
  })


/**
 * 获取增值用户(, 增值页面)
 */
interface GetParticipator {
  youhui_log_id: string;
}
export const getParticipator = (params: GetParticipator) =>
  http({
    url: "api/wap/user/getApperciationUserList",
    data: params
  })

/**
 * 获取优惠券信息(, 拼团页面)
 */
interface GetCouponinfoForGroup {
  group_id: string;
}
export const getCouponinforForGroup = (params: GetCouponinfoForGroup) =>
  http({
    url: "api/wap/user/getYonhuiActiveGroupInfo",
    data: params
  })

/**
 * 获取优惠券列表(, 拼团页面)
 */
export const getCouponForGroup = (params: GetCoupon) =>
  http({
    url: "api/wap/user/getYonhuiActiveGroupList",
    data: params
  })

/**
 * 获取券详情
 * @group_info_id -> 团购券
 * @youhui_id -> 增值券
 */
interface GetCouponDetail {
  group_info_id?: string;
  youhui_id?: string;
  url: string
}
export const getCouponDetail = (params: GetCouponDetail) => {
  const { url, ...rest } = params
  return http({
    url,
    data: rest
  })
}

/**
 * 获取优惠券列表(, 活动中心图标处, 和需要定位的有点不一样...)
 */
interface GetCouponList {
  method?: string;
  url: string;
  xpoint: number;
  ypoint: number;
}
export const getCouponList = (params: GetCouponList) => {
  const {
    url,
    method,
    ...rest
  } = params
  return http({
    url,
    method,
    data: rest
  })
}

/**
 * 获取参加活动(, 我的 -> 我参加的活动)
 */
interface GetActivity {
  url: string;
}
export const getActivity = (params: GetActivity) => {
  const { url } = params
  return http({
    url
  })
}

/**
 * 获取订单详情
 */
interface GetOrderDetail {
  id: string;
}
export const getOrderDetail = (params: GetOrderDetail) =>
  http({
    url: "api/wap/coupon/getYouhuiOrderInfo",
    data: params
  })

/**
 * 获取用户礼品(, 我的 -> 福利中心 -> 我的福利)
 */
export const getUserGift = () =>
  http({
    url: "api/wap/my_gifts"
  })

/**
 * 添加用户收货地址
 */
interface AddUserReceiveinfo {
  receiver_name: string;
  receiver_phone: string;
  receiver_address: string;
}
export const addUserReceiveinfo = (params: AddUserReceiveinfo) =>
  http({
    url: "api/wap/gift_receive_address",
    method: "post",
    data: params
  }).catch(err => Promise.reject(err))

/**
 * 用户点击增值
 */
interface GetAppreciation {
  youhui_log_id: string
}
export const getAppreciation = (params: GetAppreciation) =>
  http({
    url: "api/wap/user/appreciation/appreciation",
    method: "post",
    data: params
  })

/**
 * 获取支付签名: xcx(业务类型)| url(请求路径)
 * @ps 支付中心 type 1和5的请求路径不一样
 */
export interface GetPaymentSignture {
  url: string;
  open_id: string;
  unionid: string;
  xcx: number;
  type: number;
  youhui_id?: string;
  public_type_id?: string;
  number?: number;
  gift_id?: string;
  activity_id?: string;
}
export const getPaymentSignture = (params: GetPaymentSignture) => {
  const { url, ...rest } = params
  return http({
    url,
    method: "post",
    data: rest
  })
}

/**
 * 获取二维码(, 使用)
 */
interface QrcodeGroup {
  youhui_log_id: string;
}
export const getQrcode = (params: QrcodeGroup) =>
  http({
    url: "api/wap/user/showCode",
    data: params
  })

/**
 * 监听二维码(, 核销)
 */
export const listenQrcodeForGroup = (params: QrcodeGroup) =>
  http({
    url: "api/wap/user/isSweep",
    data: params
  })

export const getOrderQrcode = (id) => 
	http({
		url: "api/wap/orderGift/code",
		method: "get",
		data: {
			id:id
		}
	})