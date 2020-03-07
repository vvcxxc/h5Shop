import Taro from "@tarojs/taro";
import Cookie from 'js-cookie'
import request from '@/services/request';
import { getBrowserType } from './common';
const BASIC_API = process.env.BASIC_API;
const LOGIN_URL = process.env.LOGIN_URL
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
    Cookie.set('test_token_auth', 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vdGVzdC51c2VyY2VudGVyLnRkaWFueWkuY29tL3YxL3VzZXIvYXV0aC9hdXRoX2g1IiwiaWF0IjoxNTgzNTYwOTg4LCJleHAiOjE1ODM2NTA5ODgsIm5iZiI6MTU4MzU2MDk4OCwianRpIjoibklrSXF6aExEaGZYZ1ljbiIsInN1YiI6NzYwNSwicHJ2IjoiNTg3ZWQ0ZWI0ZmY2YjBiMmQ4OTZhOWI3YjcxMDRlNzBhNWI3YTAwMCJ9.vV_tJXa45ixM89314PE25s7rso0UZUEeA-1NNk0FtDo')

  }else{
    if (type == 'wechat'){
      console.log(from,'from')
      // let url =  BASIC_API + 'wechat/wxoauth?code_id=0&from='+from;
      let url = 'http://test.usercenter.tdianyi.com/v1/user/auth/auth_h5?code_id=0&from='+from
      // if(process.env.NODE_ENV == 'test'){
      //   url = LOGIN_URL+'/wechat/wxoauth?code_id=0&from='+from
      //   // url = 'http://test.usercenter.tdianyi.com/v1/user/auth/auth_h5?code_id=0&from='+from
      // }
      url = encodeURIComponent(url);
      let urls = 'http://test.wxauth.tdianyi.com/index_xcx.html?appid=wxfe816c3a5440ce7a&redirect_uri='+url+'&response_type=code&scope=snsapi_base&connect_redirect=1&state=STATE&state=STATE';
      // let urls = 'http://wxauth.tdianyi.com/index.html?appid=wxecdd282fde9a9dfd&redirect_uri='+url+'&response_type=code&scope=snsapi_base&connect_redirect=1&state=STATE&state=STATE';
      return window.location.href = urls;
    }else{
      // let url = BASIC_API +"ali/getZfbUserInfo"; // 后台接口
      from = encodeURIComponent(from); // 当前页面
      // url = encodeURIComponent(url);

      // window.location.href = BASIC_API +'ali/zfbUserAuth?from='+from+'&code_id=227&url='+url;

      // 新版授权
      // let url = process.env.ALIPAY_LOGIN_URL + 'v1/user/auth/auth_ali?code_id=227&from='+ from
      let url = process.env.ALIPAY_LOGIN_URL + 'v1/user/auth/get_ali_user_info?code_id=227&from='+ from
      url = encodeURIComponent(url);
      let urls = 'http://test.wxauth.tdianyi.com/ali.html?appid=2018080960968490&redirect_uri='+url+'&scope=auth_user&state=STATE'
      return window.location.href = urls;
    }
  }

}
