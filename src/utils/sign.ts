import Taro from "@tarojs/taro";
import Cookie from 'js-cookie'
import request from '@/services/request';
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
  if(from.indexOf('&from') > -1){
    let arr = from.split('&from')
    from = arr[0]
  }
  let type = getBrowserType();
  if(process.env.NODE_ENV == 'development'){
    Cookie.set('test_token_auth', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vdGVzdC51c2VyY2VudGVyLnRkaWFueWkuY29tL3YxL3VzZXIvYXV0aC9hdXRoX2g1IiwiaWF0IjoxNTgzNzM4Mjg3LCJleHAiOjE1ODM4MjgyODcsIm5iZiI6MTU4MzczODI4NywianRpIjoiMFhGdDdueENuWmt1VmNDWSIsInN1YiI6NzYzNCwicHJ2IjoiNTg3ZWQ0ZWI0ZmY2YjBiMmQ4OTZhOWI3YjcxMDRlNzBhNWI3YTAwMCJ9.Kh3xkZP7bJhKW3ksl3e93ORaWlxbxAoxVTzSG70jBHI')

  }else{
    if (type == 'wechat'){
      console.log(from,'from')
      // let url =  BASIC_API + 'wechat/wxoauth?code_id=0&from='+from;
      encodeURIComponent(from);
      let url = USER_API + 'v1/user/auth/auth_h5?code_id=0&from='+from
      // if(process.env.NODE_ENV == 'test'){
      //   url = LOGIN_URL+'/wechat/wxoauth?code_id=0&from='+from
      //   // url = 'http://test.usercenter.tdianyi.com/v1/user/auth/auth_h5?code_id=0&from='+from
      // }
      url = encodeURIComponent(url);
      let urls = AUTH_LOGIN_URL + 'index_xcx.html?appid='+ WX_APPID +'&redirect_uri='+url+'&response_type=code&scope=snsapi_base&connect_redirect=1&state=STATE&state=STATE';
      // let urls = 'http://wxauth.tdianyi.com/index.html?appid=wxecdd282fde9a9dfd&redirect_uri='+url+'&response_type=code&scope=snsapi_base&connect_redirect=1&state=STATE&state=STATE';
      return window.location.href = urls;
    }else{
      // let url = BASIC_API +"ali/getZfbUserInfo"; // 后台接口
      from = encodeURIComponent(from); // 当前页面
      // url = encodeURIComponent(url);

      // window.location.href = BASIC_API +'ali/zfbUserAuth?from='+from+'&code_id=227&url='+url;

      // 新版授权
      // let url = process.env.ALIPAY_LOGIN_URL + 'v1/user/auth/auth_ali?code_id=227&from='+ from
      let url = USER_API + 'v1/user/auth/auth_ali?code_id=227&from='+ from
      url = encodeURIComponent(url);
      let urls = AUTH_LOGIN_URL + 'ali.html?appid='+ ALI_APPID +'&redirect_uri='+url+'&scope=auth_base&state=STATE'
      return window.location.href = urls;
    }
  }

}
