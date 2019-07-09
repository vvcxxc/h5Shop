import Taro from "@tarojs/taro"

/**
 * 小程序支付
 * @param {Object} signature 微信签名
 */
export interface Signature {
  timeStamp: string;
  nonceStr: string;
  package: string;
  signType: string;
  paySign: string;
}
export const payment = (signature: Signature): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!Object.keys(signature).length) return reject("--- 签名为空 ---")
    Taro.requestPayment({
      ...signature,
      // @ts-ignore
      success(res) {
        return resolve(res)
      },
      fail(err) {
        return reject(err)
      }
    })
  })
}
