import Taro from "@tarojs/taro"

/**
 * 获取codeid
 */
export const getCode = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    Taro.login({
      success(res) {
        return resolve(res)
      },
      fail(err) {
        return reject(err)
      }
    })
  })
}

/**
 * 判断移动端类型
 */
export const getBrowserType = () => {
   switch (true) {
    case navigator.userAgent.toLowerCase().indexOf('micromessenger') > 0:
      return 'wechat'
    case navigator.userAgent.toLowerCase().indexOf('alipay') > 0:
      return 'alipay'
    default:
      return 'alipay'
  }
}
