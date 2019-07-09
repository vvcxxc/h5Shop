import * as types from "../constants/payment"
import { getPaymentSignture, GetPaymentSignture } from "@/api"
import { payment, Signature as paymentSignature } from "@/utils/payment"
import { FETCH_OK } from "@/utils/constants"
/**
 * 获取支付签名
 */
export const getSignature = (params: GetPaymentSignture) =>
  async dispatch => {
    dispatch({
      type: types.GET_SIGNATRUE
    })
    const { data, code, message } = await getPaymentSignture(params).catch(err => {
      console.log(err)
      dispatch({
        type: types.GET_SIGNATRUE_ERROR,
        payload: err
      })
    })
    if (code === FETCH_OK) {
      dispatch({
        type: types.GET_SIGNATRUE_SUCCESS,
        payload: data
      })
    } else {
      dispatch({
        type: types.GET_SIGNATRUE_ERROR,
        payload: message
      })
    }
  }

/**
 * 调起支付
 */
export const triggerPayment = (params: paymentSignature) =>
  async dispatch => {
    dispatch({
      type: types.GET_SIGNATRUE,
    })
    await payment(params).catch(err => {
      dispatch({
        type: types.PAYMENT_ERROR,
        payload: err
      })
      // throw Error("--- 支付失败 ---")
    })
    dispatch({
      type: types.PAYMENT_SUCCESS
    })
  }
