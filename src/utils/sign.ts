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
    Cookie.set('test_token_auth', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vdGVzdC5hcGkudGRpYW55aS5jb20vd2VjaGF0L3d4b2F1dGgiLCJpYXQiOjE1ODMzNzYzMzIsImV4cCI6MTU4MzczNjMzMiwibmJmIjoxNTgzMzc2MzMyLCJqdGkiOiIxU1p3MzRsQkliTWR1ZHl0Iiwic3ViIjo2ODQwLCJwcnYiOiJmNmI3MTU0OWRiOGMyYzQyYjc1ODI3YWE0NGYwMmI3ZWU1MjlkMjRkIn0.aVAAYJRH5wZNagPDad9NPIBWY4iWhRPHxXyoi7Iesrk')

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
      let url = process.env.ALIPAY_LOGIN_URL + '?code_id=227&from='+ from
      url = encodeURIComponent(url);
      let urls = 'http://test.wxauth.tdianyi.com/ali.html?appid=2016091200492078&redirect_uri='+url+'&scope=auth_user&state=STATE'
      return window.location.href = urls;
    }
  }

}
