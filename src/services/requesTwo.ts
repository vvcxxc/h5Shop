import Taro, { RequestParams } from "@tarojs/taro";

interface Options extends RequestParams {
  /**替换的主机域名 */
  host?: string;
}
const host = "http://test.api.supplier.tdianyi.com/";
export default function questTwo(options: Options) {
  const token = Taro.getStorageSync("token");
  options.header = { ...options.header, Authorization: token };
  return new Promise((resolve, reject) => {
    /**拼接接口地址 */
    options.url = options.host
      ? options.host + options.url
      : host + options.url;
    /**统一请求 */
    options.success = (res) => resolve(res.data.data);
    options.fail = (res) => reject(res);
    Taro.request(options);
  });
}