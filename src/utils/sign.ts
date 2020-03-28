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
  let query = getUrlParams() || {}
  if (process.env.NODE_ENV == 'development') {
    Cookie.set('test_token_auth', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vdGVzdC5hcGkudGRpYW55aS5jb20vd2VjaGF0L3d4b2F1dGgiLCJpYXQiOjE1ODUyOTU1NTAsImV4cCI6MTU4NTY1NTU1MCwibmJmIjoxNTg1Mjk1NTUwLCJqdGkiOiJ3SDI5QUFMdmI5dXBrS0g3Iiwic3ViIjozNjc0MSwicHJ2IjoiZjZiNzE1NDlkYjhjMmM0MmI3NTgyN2FhNDRmMDJiN2VlNTI5ZDI0ZCJ9.dQzd5Jy0i4yKi9t22iT3xLjpjdiOPEKoQyt-0FosHqI')
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
