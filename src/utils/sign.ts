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
    Cookie.set('test_token_auth', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vdGVzdC51c2VyY2VudGVyLnRkaWFueWkuY29tL3YxL3VzZXIvYXV0aC9hdXRoX2g1IiwiaWF0IjoxNTgzNTYxMzkzLCJleHAiOjE1ODM2NTEzOTMsIm5iZiI6MTU4MzU2MTM5MywianRpIjoiVWFqWkNnV0ZPWFZ6VnlOUyIsInN1YiI6NzYwNSwicHJ2IjoiNTg3ZWQ0ZWI0ZmY2YjBiMmQ4OTZhOWI3YjcxMDRlNzBhNWI3YTAwMCJ9.cpGGUuxm6XXq_FLSXR9UvrhkaaG2NUqZ6LWAgRU9lIU')

  }else{
    if (type == 'wechat'){
      console.log(from,'from')
      let url =  BASIC_API + 'wechat/wxoauth?code_id=0&from='+from;
      if(process.env.NODE_ENV == 'test'){
        url = LOGIN_URL+'/wechat/wxoauth?code_id=0&from='+from
      }
      url = encodeURIComponent(url);
      let urls = 'http://wxauth.tdianyi.com/index.html?appid=wxecdd282fde9a9dfd&redirect_uri='+url+'&response_type=code&scope=snsapi_base&connect_redirect=1&state=STATE&state=STATE';
      return window.location.href = urls;
    }else{
      let url = BASIC_API +"ali/getZfbUserInfo";
      from = encodeURIComponent(from);
      url = encodeURIComponent(url);
      window.location.href = BASIC_API +'ali/zfbUserAuth?from='+from+'&code_id=227&url='+url;
    }
  }

}
