import Taro from "@tarojs/taro";
import { getCode } from "./getInfo";
import { getBrowserType } from './common';
const BASIC_API = process.env.BASIC_API;
/**
 * h5登录
 */
export const Login = () => {
  const from = window.location.href
  let type = getBrowserType();
  if (type == 'wechat'){
    let url =  BASIC_API + 'wechat/wxoauth?code_id=0&from='+from;
    url = encodeURIComponent(url);
    let urls = 'http://wxauth.tdianyi.com/index.html?appid=wxecdd282fde9a9dfd&redirect_uri='+url+'&response_type=code&scope=snsapi_userinfo&connect_redirect=1&state=STATE&state=STATE';
    return window.location.href = urls;
  }else{
    let url = BASIC_API +"ali/getZfbUserInfo";
    url = encodeURIComponent(url);
    window.location.href = BASIC_API +'/ali/zfbUserAuth?from='+from+'&code_id=0&url='+url;
  }

}
