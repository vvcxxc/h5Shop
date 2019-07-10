import Taro from "@tarojs/taro";
import { FETCH_OK } from "./constants";
import { getCode } from "./getInfo";

/**
 * 小程序登录
 */
interface Params {
  userInfo: {
    avatarUrl: string;
    nickName: string;
  },
  basicApi: string;
  encryptedData: string;
  iv: string;
}
interface SignResponse {
  message: string;
  err?: any;
}
export const miniProgramSign = (params: Params): Promise<SignResponse> => {
  return new Promise(async (resolve, reject) => {
    const {
      userInfo: { avatarUrl, nickName },
      basicApi,
      encryptedData,
      iv
    } = params;
    const joinApi = `${basicApi}wechat/jscode2session`
    Taro.showLoading({
      title: "授权中...",
    });
    const { code } = await getCode();
    Taro.request({
      url: joinApi,
      data: {
        avatar: avatarUrl,
        nickname: nickName,
        js_code: code,
        encrypted_data: encryptedData,
        iv
      },
      // @ts-ignore
      success(res) {
        const { statusCode, data: { openid, token, unionid } } = res;
        Taro.hideLoading();
        if (statusCode === FETCH_OK) {
          Taro.setStorageSync("openid", openid)
          Taro.setStorageSync("unionid", unionid)
          Taro.setStorageSync("token", `Bearer ${token}`)
          return resolve({
            message: "successful",
          });
        }
        resolve({
          message: "no data",
        });
      },
      fail(err) {
        Taro.hideLoading();
        return reject({
          message: "fail",
          err
        });
      }
    });
  });
}

/**
 * 跳转至登陆页面
 */
export const toMiniProgramSign = (basicApi: string): void => {
  const pages = Taro.getCurrentPages();
  const currentUrl = pages[0]["route"];
  const id = Taro.getStorageSync("authid") || "";
  Taro.redirectTo({
    url: `/pages/auth/auth?basicApi=${basicApi}&currentUrl=/${currentUrl}&id=${id}`
  });
}
