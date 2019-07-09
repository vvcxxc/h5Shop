import Taro from "@tarojs/taro"
const SERVER_API = "https://api.weixin.qq.com/sns/jscode2session"

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
 * 获取用户信息
 */
export const getUserInfo = (): Promise<any> => {
  return new Promise((resolve, reject) => {
    Taro.getUserInfo({
      withCredentials: true,
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
 * 获取open_id
 */
interface MiniProgramConfig {
  appid: string;
  secret: string;
  grant_type: string;
  js_code: string | undefined;
}
export const getOpenid = (code: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    const miniProgramConfig: MiniProgramConfig = {
      appid: "wx5f2271a7c946fef1",
      secret: "ca3f3056515e106637122db6a6ba8155",
      grant_type: "authorization_code",
      js_code: code || "",
    };
    Taro.request({
      url: SERVER_API,
      data: {
        ...miniProgramConfig
      },
      success(res) {
        return resolve(res)
      },
      fail (err) {
        return reject(err)
      }
    })
  })
}

/**
 * 获取定位信息
 * longitude: 经度,
 * latitude: 纬度,
 * ...
 */
interface Location {
  longitude: number;
  latitude: number;
}
export const getLocation = (): Promise<Location> => {
  return new Promise((resolve, reject) => {
    const location = Taro.getStorageSync("location")
    if (location) return resolve(location)
    Taro.getSetting({
      success({ authSetting }) {
        const flagLocation = authSetting["scope.userLocation"]
        if (flagLocation) {
          Taro.getLocation({
            type: "wgs84",
            success(res) {
              Taro.setStorageSync("location", res)
              return resolve(res)
            },
            fail(err) {
              return reject(err)
            }
          })
        } else if (flagLocation === false) {
          const errMsg = "user refused to location authorization, try authorization again please."
          return reject(errMsg)
        } else {
          Taro.getLocation({
            type: "wgs84",
            // @ts-ignore
            success(res) {
              Taro.setStorageSync("location", res)
              return resolve(res)
            },
            fail(err) {
              return reject(err)
            }
          })
        }
      }
    })
  })
}
