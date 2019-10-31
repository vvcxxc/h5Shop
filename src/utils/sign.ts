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
  let type = getBrowserType();
  if(process.env.NODE_ENV == 'development'){
    console.log(1)
    if(Cookie.get('test_token_auth')){
      console.log('已登录')
      return
    }

    Cookie.set('test_token_auth', 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOi8vdGVzdC5hcGkudGRpYW55aS5jb20vd2VjaGF0L3d4b2F1dGgiLCJpYXQiOjE1NzI1MTE3NTYsImV4cCI6MTU3MjgxMTc1NiwibmJmIjoxNTcyNTExNzU2LCJqdGkiOiJUWTVubXFiRktsRk5MVm94Iiwic3ViIjo2ODQwLCJwcnYiOiJmNmI3MTU0OWRiOGMyYzQyYjc1ODI3YWE0NGYwMmI3ZWU1MjlkMjRkIn0.b9hSkFpcJG0f1idQYezIHCl8tDRWUscimG2RH21hsCg')
    // request({
		// 	url: 'api/wap/testLogin'
		// }).then((res: any) => {
    //   let token = res.data.token.split(' ')[1];
    //   Cookie.set('test_token_auth', token)
    // });

  }else{
    if (type == 'wechat'){
      console.log(2)
      let url =  BASIC_API + 'wechat/wxoauth?code_id=0&from='+from;
      if(process.env.NODE_ENV == 'test'){
        url = LOGIN_URL+'/wechat/wxoauth?code_id=0&from='+from
      }
      url = encodeURIComponent(url);
      let urls = 'http://wxauth.tdianyi.com/index.html?appid=wxecdd282fde9a9dfd&redirect_uri='+url+'&response_type=code&scope=snsapi_userinfo&connect_redirect=1&state=STATE&state=STATE';
      return window.location.href = urls;
    }else{
      console.log(2)
      let url = BASIC_API +"ali/getZfbUserInfo";
      from = encodeURIComponent(from);
      url = encodeURIComponent(url);
      window.location.href = BASIC_API +'ali/zfbUserAuth?from='+from+'&code_id=227&url='+url;
    }
  }


}
