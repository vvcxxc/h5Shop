import Taro, { RequestParams } from "@tarojs/taro";
import {
  FETCH_BAD,
  FETCH_OK,
  SERVER_ERROR,
  NOT_FIND,
  NOT_SIGN,
} from "@/utils/constants";
import Cookie from 'js-cookie';
import { Login } from '@/utils/sign';


interface Options extends RequestParams {
  /**替换的主机域名 */
  host?: string;
}

const host = process.env.USER_API;
const token_name = process.env.TOKEN;
export default function request(options: Options) {
  const token = Cookie.get(token_name) || '';
  options.header = { ...options.header, Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
  return new Promise((resolve, reject) => {
    /**拼接接口地址 */
    options.url = options.host
      ? options.host + options.url
      : host + options.url;
    /**统一请求 */
    // options.success = (res) => resolve(res.data.data);
    // options.fail = (res) => reject(res);
    Taro.request({
      ...options,
      success(res) {
        const { statusCode, data } = res;
        switch (statusCode) {
          case SERVER_ERROR:
            Taro.showToast({
              title: 'server error :d',
              icon: 'none'
            })
            return reject(res)
            break
          case FETCH_OK:
            return resolve(res.data)
          case FETCH_BAD:
            Taro.showToast({
              title: data.message || "bad request",
              icon: "none"
            })
            return reject(res)
            break
          case NOT_SIGN:
            Login();
            return reject(new Error('--- no Sign ---'))
          case NOT_FIND:
            Taro.showToast({
              title: "not find",
              icon: "none"
            })
            return reject(res)
            break
          default:
            Taro.showToast({
              title: "unknow error",
              icon: "none"
            })
            return reject(res)
            break
        }
      },
      async fail(err) {
        let aa = err.json()
        let a = await Promise.resolve(aa)
        const { status_code, message } = a;

        switch (status_code) {
          case SERVER_ERROR:
            Taro.showToast({
              title: 'server error :d',
              icon: 'none'
            })
            break
          case FETCH_BAD:
            Taro.showToast({
              title: message,
              icon: "none"
            })
            return reject(a)
            break
          case NOT_SIGN:
            Login();
            return reject(new Error('--- no Sign ---'))
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
      }
    });
  });
}