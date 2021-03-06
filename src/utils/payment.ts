import Taro from "@tarojs/taro"
import { getBrowserType } from '@/utils/common'

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
  let type = getBrowserType()
  if(type == 'wechat'){
    return new Promise((resolve, reject) => {
      if (!Object.keys(signature).length) return reject("--- 签名为空 ---")
      // Taro.requestPayment({
      //   ...signature,
      //   // @ts-ignore
      //   success(res) {
      //     return resolve(res)
      //   },
      //   fail(err) {
      //     return reject(err)
      //   }
      // })
      // resolve(signature)
      window.WeixinJSBridge.invoke(
        'getBrandWCPayRequest', {
        "appId":signature.appId,
        "timeStamp":signature.timeStamp,
        "nonceStr":signature.nonceStr,
        "package":signature.package,
        "signType":signature.signType,
        "paySign":signature.paySign
        },
        function(res){
        if(res.err_msg == "get_brand_wcpay_request:ok" ){
         return resolve(res)
        }
        }
        );
    })
  }else{

  }

}
