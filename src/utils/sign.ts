import Taro from "@tarojs/taro";
import Cookie from 'js-cookie'
import request from '@/services/request';
import {getUrlParams} from './common'
import { getBrowserType } from './common';
const BASIC_API = process.env.BASIC_API;
const LOGIN_URL = process.env.LOGIN_URL
const AUTH_LOGIN_URL = process.env.AUTH_LOGIN_URL
const USER_API = process.env.USER_API
const WX_APPID = process.env.WX_APPID
const ALI_APPID = process.env.ALI_APPID
/**
 * h5登录
 */
export const Login = () => {
  let from = window.location.href
  if (from.indexOf('&from') > -1) {
    let arr = from.split('&from')
    from = arr[0]
  }
  let type = getBrowserType();
  let query = getUrlParams()
  if (process.env.NODE_ENV == 'development') {
    Cookie.set('test_token_auth', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vdGVzdC51c2VyY2VudGVyLnRkaWFueWkuY29tL3YxL3VzZXIvYXV0aC9hdXRoX2g1IiwiaWF0IjoxNTg0OTI3MDMzLCJleHAiOjE1ODUwMTcwMzMsIm5iZiI6MTU4NDkyNzAzMywianRpIjoiRDJNUnIyeVJCOGxvRGNvbSIsInN1YiI6Nzc0OSwicHJ2IjoiNTg3ZWQ0ZWI0ZmY2YjBiMmQ4OTZhOWI3YjcxMDRlNzBhNWI3YTAwMCJ9.E3OJBXuJFq2y32TNssaYusPfY9GYr3z-6nyrPM0SkjU')
  } else {
    if (type == 'wechat') {
      encodeURIComponent(from);
      let url = USER_API + 'v1/user/auth/auth_h5?code_id=0&from=' + from
      if(query.invitation_user_id){
        url = USER_API + 'v1/user/auth/auth_h5?code_id=0&invitation_user_id='+ query.invitation_user_id +'&from=' + from
      }
      url = encodeURIComponent(url);
      let urls = AUTH_LOGIN_URL + 'index_xcx.html?appid=' + WX_APPID + '&redirect_uri=' + url + '&response_type=code&scope=snsapi_base&connect_redirect=1&state=STATE&state=STATE';
      return window.location.href = urls;
    } else {
      from = encodeURIComponent(from); // 当前页面
      let url = USER_API + 'v1/user/auth/auth_ali?code_id=227&from=' + from
      if(query.invitation_user_id){
        url = USER_API + 'v1/user/auth/auth_ali?code_id=227&invitation_user_id='+ query.invitation_user_id +'&from=' + from
      }
      url = encodeURIComponent(url);
      let urls = AUTH_LOGIN_URL + 'ali.html?appid=' + ALI_APPID + '&redirect_uri=' + url + '&scope=auth_base&state=STATE'
      return window.location.href = urls;
    }
  }

}
