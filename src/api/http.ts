<<<<<<< HEAD
import Taro from "@tarojs/taro";
import {
  FETCH_BAD,
  FETCH_OK,
  SERVER_ERROR,
  NOT_FIND,
  NOT_SIGN
} from "@/utils/constants";
import { toMiniProgramSign } from "@/utils/sign";

const BASIC_API = process.env.BASIC_API;
interface Params {
  url: string;
  method?: string;
  data?: any;
  options?: any;
}
const http = (params: Params): Promise<any> => {
  const {
    url,
    method = "get",
    data,
    options
  } = params;
  Taro.showLoading({
    title: ""
  });
  return new Promise((resolve, reject) => {
    const mergeConfig = Object.assign({}, {
      url: `${BASIC_API}${url}`,
      header: {
        Accept: "application/json",
        Authorization: Taro.getStorageSync("token") || "",
        "Content-Type" : "application/json" 
      },
      data,
      method
    }, options);
    Taro.request({
      ...mergeConfig,
      success(res) {
        Taro.hideLoading()
        const { statusCode, data } = res;
        switch (statusCode) {
          case SERVER_ERROR:
            Taro.showToast({
              title: 'server error :d',
              icon: 'none'
            })
            break
          case FETCH_OK:
            return resolve(data);
          case FETCH_BAD:
            Taro.showToast({
              title: data.message || "bad request",
              icon: "none"
            })
            break
          case NOT_SIGN:
            toMiniProgramSign(BASIC_API)
            return reject(new Error('--- no sign ---'))
          case NOT_FIND:
            Taro.showToast({
              title: "not find",
              icon: "none"
            })
            break
          default:
            Taro.showToast({
              title: "unknow error",
              icon: "none"
            })
            break
        }
      },
      fail(error) {
        console.log(error)
        Taro.hideLoading();
      }
    })
  })
};

export default http;
=======
import Taro from "@tarojs/taro";
import {
  FETCH_BAD,
  FETCH_OK,
  SERVER_ERROR,
  NOT_FIND,
  NOT_SIGN
} from "@/utils/constants";
// import { toMiniProgramSign } from "@/utils/sign";
import {Login} from '@/utils/sign';
import Cookie from 'js-cookie';
const BASIC_API = process.env.BASIC_API;
interface Params {
  url: string;
  method?: string;
  data?: any;
  options?: any;
}
const token_name = process.env.TOKEN;
const http = (params: Params): Promise<any> => {
  const {
    url,
    method = "get",
    data,
    options
  } = params;
  Taro.showLoading({
    title: ""
  });
  return new Promise((resolve, reject) => {
    const mergeConfig = Object.assign({}, {
      url: `${BASIC_API}${url}`,
      header: {
        Accept: "application/json",
        Authorization: `Bearer ${Cookie.get(token_name)}` || "",
        'Content-Type': 'application/json'
      },
      data,
      method
    }, options);
    Taro.request({
      ...mergeConfig,
      success(res) {
        Taro.hideLoading()
        const { statusCode, data } = res;
        switch (statusCode) {
          case SERVER_ERROR:
            Taro.showToast({
              title: 'server error :d',
              icon: 'none'
            })
            break
          case FETCH_OK:
            return resolve(data);
          case FETCH_BAD:
            Taro.showToast({
              title: data.message || "bad request",
              icon: "none"
            })
            break
          case NOT_SIGN:
            Login()
            return reject(new Error('--- no sign ---'))
          case NOT_FIND:
            Taro.showToast({
              title: "not find",
              icon: "none"
            })
            break
          default:
            Taro.showToast({
              title: "unknow error",
              icon: "none"
            })
            break
        }
      },
      fail(error) {
        console.log(error)
        Taro.hideLoading();
      }
    })
  })
};

export default http;
>>>>>>> dd7b8ffea9fa06251148193e4d6e3a0c0ff51f8a
