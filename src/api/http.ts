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
console.log(Cookie.get(token_name))
let token = Cookie.get(token_name):
if( token == undefined ){
  token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vdGVzdC5hcGkudGRpYW55aS5jb20vd2VjaGF0L3d4b2F1dGgiLCJpYXQiOjE1NjI2NzQxNTksImV4cCI6MTU2Mjk3NDE1OSwibmJmIjoxNTYyNjc0MTU5LCJqdGkiOiJoSzZtcmJXem83TEt5c0FOIiwic3ViIjozMDE0LCJwcnYiOiJmNmI3MTU0OWRiOGMyYzQyYjc1ODI3YWE0NGYwMmI3ZWU1MjlkMjRkIn0.f65y-zLVG4BK3fBqtCKTA3o1kDVO4oK0F1-04daVa1E'
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
        Authorization: `Bearer ${token}`,
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
            Login();
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
        const { status, data } = error;
        console.log(41234123)
        console.log(status)
        switch (status) {
          case SERVER_ERROR:
            Taro.showToast({
              title: 'server error :d',
              icon: 'none'
            })
            break
          case FETCH_BAD:
            console.log(FETCH_BAD)
            Taro.showToast({
              title: data.message || "bad request",
              icon: "none"
            })
            break
          case NOT_SIGN:
            console.log('没有登录')
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
    })
  })
};

export default http;
