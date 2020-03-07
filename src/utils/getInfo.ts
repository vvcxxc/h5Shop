import Taro from "@tarojs/taro"
const SERVER_API = "https://api.weixin.qq.com/sns/jscode2session"
import { getBrowserType } from './common';
import wx from 'weixin-js-sdk';
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
      fail(err) {
        return reject(err)
      }
    })
  })
}

export const getLocation = () => {
  let type = getBrowserType();
  if (type == 'wechat') {
    // return new Promise((resolve) => {
    //   resolve({
    //     "latitude" : 123,
    //     "longitude" : 212
    //   })
    // })
    let userAgent = navigator.userAgent;
    let isIos = userAgent.indexOf('iPhone') > -1;
    let url: any;
    if (isIos) {
      url = sessionStorage.getItem('url');
    } else {
      url = location.href;
    }
    Taro.request({
      url: 'http://api.supplier.tdianyi.com/wechat/getShareSign',
      method: 'GET',
      data: {
        url
      }
    }).then(res => {
      let { data } = res;
      wx.config({
        debug: false,
        appId: data.appId,
        timestamp: data.timestamp,
        nonceStr: data.nonceStr,
        signature: data.signature,
        jsApiList: [
          "getLocation",
          "openLocation",
          'updateAppMessageShareData'
        ]
      });
    })
    return new Promise((resolve, reject) => {
      // const location = Taro.getStorageSync("location");
      const location: any = JSON.parse(sessionStorage.getItem('location'))
      if (location) return resolve(location)
      wx.ready(() => {
        wx.getLocation({
          type: 'gcj02',
          success: function (res: any) {
            let latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
            let longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
            // Taro.setStorageSync("location", {
            //   latitude,
            //   longitude
            // });
            sessionStorage.setItem('location', JSON.stringify({ latitude, longitude }))
            resolve({
              latitude,
              longitude
            })
          },
          fail: function () {
            console.log('定位失败啦')
            reject({
              latitude: '',
              longitude: ''
            })
          }
        });
      }),
        wx.error(() => {
          console.log('error')
        })
    })
  } else {
    var map = new AMap.Map('', {
      resizeEnable: true
    });
    return new Promise((resolve, reject) => {
      const location = Taro.getStorageSync("location");
      if (location) return resolve(location)
      AMap.plugin('AMap.Geolocation', function () {
        var geolocation = new AMap.Geolocation({
          enableHighAccuracy: true,
          timeout: 1000,
          buttonPosition: 'RB',
          buttonOffset: new AMap.Pixel(10, 20),
          zoomToAccuracy: true,
        });
        map.addControl(geolocation);
        geolocation.getCurrentPosition(function (status, result) {
          if (status == 'complete') {
            let res = {
              latitude: result.position.lat,
              longitude: result.position.lng
            }
            Taro.setStorageSync("location", res);
            resolve({
              latitude: result.position.lat,
              longitude: result.position.lng
            })
          } else {
            reject({
              msg: result.message
            })
          }
        });
      });
    })
  }

}

const AUTH_LOGIN_URL = process.env.AUTH_LOGIN_URL
const USER_API = process.env.USER_API

export const getUserInfo = () => {
  let from = window.location.href
  if(from.indexOf('&from') > -1){
    let arr = from.split('&from')
    from = arr[0]
  }
  let type = getBrowserType();
  if (type == 'wechat'){
    let url = USER_API + 'v1/user/auth/auth_h5?code_id=0&from='+from
    url = encodeURIComponent(url);
    let urls = AUTH_LOGIN_URL + 'index_xcx.html?appid=wxfe816c3a5440ce7a&redirect_uri='+url+'&response_type=code&scope=snsapi_base&connect_redirect=1&state=STATE&state=STATE';
    return window.location.href = urls;
  }else{
    from = encodeURIComponent(from); // 当前页面
    let url = USER_API + 'v1/user/auth/get_ali_user_info?code_id=227&from='+ from
    url = encodeURIComponent(url);
    let urls = AUTH_LOGIN_URL + 'ali.html?appid=2018080960968490&redirect_uri='+url+'&scope=auth_user&state=STATE'
    return window.location.href = urls;
  }
}
