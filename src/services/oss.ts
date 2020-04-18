import Taro, { RequestParams } from "@tarojs/taro";
import axios, { AxiosRequestConfig } from 'axios';

interface Options extends AxiosRequestConfig {
  /**替换的主机域名 */
  host?: string;
}

/**随机数 */
const randomString = (len: any) => {
    len = len || 32;
    const chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
    const maxPos = chars.length;
    let pwd = '';
    for (let i = 0; i < len; i++) {
        pwd += chars.charAt(Math.floor(Math.random() * maxPos));
    }
    return pwd;
}
const host = 'https://oss.tdianyi.com';
export default async function upload( files: any) {
    console.log(files)
    let options:any = { method: 'post' }

    const imgUrl = files.originalFileObj;
    const length = 14680064;
    if (imgUrl.size > length) {
        Taro.showToast({ title: '上传失败，请上传小于10M的图片', icon: 'none' })
        return new Promise(() => { });
    } else {
        if (!Taro.getStorageSync("oss_data")) {
            Taro.hideLoading()
            Taro.showToast({ title: '上传失败，请重新上传', icon: 'none' })
            /**获取oss */
            Taro.request(
                {
                    url: 'http://api.supplier.tdianyi.com/api/v2/up',
                    method: "GET",
                }
            ).then(res => {
                console.log('res', res)

                let { data } = res.data;
                console.log(5345345)
                let oss_data = {
                    policy: data.policy,
                    OSSAccessKeyId: data.accessid,
                    success_action_status: 200, //让服务端返回200,不然，默认会返回204
                    signature: data.signature,
                    callback: data.callback,
                    host: data.host,
                    key: data.dir
                };
                Taro.setStorageSync("oss_data", JSON.stringify(oss_data))

            })



        }
        let oss_data = JSON.parse(Taro.getStorageSync("oss_data") || '');
        let key = oss_data.key + randomString(32) + '.jpg'
        console.log('32432', key, imgUrl)
        const formData = new FormData();
        // const file = new File(imgUrl, imgUrl)
        // console.log(file,'file')
        formData.append('OSSAccessKeyId', oss_data.OSSAccessKeyId);
        formData.append('callback', oss_data.callback);
        formData.append('host', oss_data.host);
        formData.append('policy', oss_data.policy);
        formData.append('signature', oss_data.signature);
        formData.append('success_action_status', '200');
        formData.append('key', oss_data.key + randomString(32) + '.png');
        formData.append('file', imgUrl);

        options.headers = { ...options.headers, 'Content-Type': 'multipart/form-data' };
        options.url = host;
        options.data = formData;
        return axios(options)
          .then(res => {
            console.log(res)
            return res.data
          })
          .catch(err => { });

        // return Taro.request({
        //   url: host,
        //   method: 'POST',
        //   header: {
        //     'Content-Type': 'multipart/form-data'
        //   },
        //   data: formData
        // }).then (res => {
        //   console.log(res)
        // })
        console.log(imgUrl)

        // return Taro.uploadFile({
        //     url: host,
        //     filePath: imgUrl,
        //     name: 'file',
        //     formData: {
        //       'content-type': 'multipart/form-data',
        //         key: key,
        //         policy: oss_data.policy,
        //         OSSAccessKeyId: oss_data.OSSAccessKeyId,
        //         signature: oss_data.signature,
        //         success_action_status: '200',
        //         callback: oss_data.callback,
        //         file: imgUrl
        //     },
        //     success: (res) => {

        //     }
        // })
    }

}
