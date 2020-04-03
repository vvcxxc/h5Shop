import Taro from "@tarojs/taro";
import Cookie from 'js-cookie'
import request from '@/services/request';
import { getUrlParams } from './common'
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
  let query = getUrlParams() || {}
  if(process.env.NODE_ENV == 'development'){
    Cookie.set('test_token_auth', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3JlbGVhc2UudXNlcmNlbnRlci50ZGlhbnlpLmNvbS92MS91c2VyL2F1dGgvYXV0aF9oNSIsImlhdCI6MTU4NTc5MDc3NCwiZXhwIjoxNTg1ODgwNzc0LCJuYmYiOjE1ODU3OTA3NzQsImp0aSI6IjhqNnU3R29QNFNjQ3ZMMmIiLCJzdWIiOjY4MzksInBydiI6IjU4N2VkNGViNGZmNmIwYjJkODk2YTliN2I3MTA0ZTcwYTViN2EwMDAifQ.MtfWxnJoo6UJrsmJ7t2MGhIr9zL6Wu1_GNJtWg8y5kk')

  }else{
    if (type == 'wechat'){
      // let url =  BASIC_API + 'wechat/wxoauth?code_id=0&from='+from;
      encodeURIComponent(from);
      let url = USER_API + 'v1/user/auth/auth_h5?code_id=0&from=' + from
      if (query.invitation_user_id) {
        url = USER_API + 'v1/user/auth/auth_h5?code_id=0&invitation_user_id=' + query.invitation_user_id + '&from=' + from
      }
      url = encodeURIComponent(url);
      let urls = AUTH_LOGIN_URL + 'index_xcx.html?appid=' + WX_APPID + '&redirect_uri=' + url + '&response_type=code&scope=snsapi_base&connect_redirect=1&state=STATE&state=STATE';
      return window.location.href = urls;
    } else {
      from = encodeURIComponent(from); // 当前页面
      let url = USER_API + 'v1/user/auth/auth_ali?code_id=227&from=' + from
      if (query.invitation_user_id) {
        url = USER_API + 'v1/user/auth/auth_ali?code_id=227&invitation_user_id=' + query.invitation_user_id + '&from=' + from
      }
      url = encodeURIComponent(url);
      let urls = AUTH_LOGIN_URL + 'ali.html?appid=' + ALI_APPID + '&redirect_uri=' + url + '&scope=auth_base&state=STATE'
      return window.location.href = urls;
    }
  }

}
