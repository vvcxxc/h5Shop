import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import { AtIcon, AtToast } from "taro-ui";

import request from '../../services/request'
import "./index.styl";

export default class ConfirmOrder extends Component {
  config = {
    navigationBarTitleText: "确认订单"
  };

  state = {
    amount: 1,
    pay_success: false,
    coupon: {
      id: "",
      pay_money: 0,
      brief: "",
      list_brief: "",
      description: "0",
      yname: ""
    },
    store: {
      id: "",
      sname: ""
    },
    pay_bull: false,
    pay_data: "支付成功"
  };
  componentWillMount() {
    Taro.showLoading({
      title: 'loading',
    })
    request({ url: '/v3/discount_coupons/' + this.$router.params.id })
      .then((res: any) => {
        this.setState({
          coupon: res.info.coupon,
          store: res.info.store
        })
        Taro.hideLoading()
      });

  }
  componentDidMount() {

  }
  cutnum() {
    if (this.state.amount > 1) {
      this.setState({ amount: Number(this.state.amount) - 1 })
    }

  }
  addnum() {
    if (this.state.amount < 10) {
      this.setState({ amount: Number(this.state.amount) + 1 })
    }
  }
  //login() {
  // Taro.showLoading({
  //   title: "授权中...",
  // });
  // Taro.login({
  //   success: function (res) {
  //     if (res.code) {
  //       let wcode = res.code;
  //       // 用户登录凭证（有效期五分钟）。开发者需要在开发者服务器后台调用 api，使用 code 换取 openid 和 session_key 等信息
  //       Taro.request({
  //         url: 'https://api.weixin.qq.com/sns/jscode2session',
  //         method: "GET",
  //         data: {
  //           app_id: "wx5f2271a7c946fef1",
  //           secret: "ca3f3056515e106637122db6a6ba8155",
  //           grant_type: "authorization_code",
  //           js_code: wcode || "",
  //         },
  //         success(res) {
  //           const { statusCode, data: { openid, token, unionid } } = res;
  //           Taro.hideLoading();
  //           if () {
  //             Taro.setStorageSync("openid", openid)
  //             Taro.setStorageSync("unionid", unionid)
  //             // Taro.setStorageSync("token", `Bearer ${token}`)
  //           }
  //         },
  //         fail(err) {
  //         }
  //       })
  //     } else {
  //     }
  //   }
  // })
  //}
  payMoney() {
    Taro.showLoading({
      title: 'loading',
    })
    //请求支付属性
    request({
      url: 'api/wap/coupon/wxWechatPay',
      method: "POST",
      // header:{
      //   Authorization:"Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL3Rlc3QuYXBpLnRkaWFueWkuY29tL3dlY2hhdC9qc2NvZGUyc2Vzc2lvbiIsImlhdCI6MTU2MjA2MDA5MCwiZXhwIjoxNTYyMzYwMDkwLCJuYmYiOjE1NjIwNjAwOTAsImp0aSI6IkFaMHNlcmtSb29jY2Rwa2MiLCJzdWIiOjMwMzEsInBydiI6ImY2YjcxNTQ5ZGI4YzJjNDJiNzU4MjdhYTQ0ZjAyYjdlZTUyOWQyNGQifQ.BKuDc9LWnwK30cVTRwVksMySuuAvPwNnHd0y9RHyBYY",
      // },
      data: {
        youhui_id: this.state.coupon.id,
        store_id: this.state.store.id,
        youhui_number: this.state.amount,
        type: "1",  //1 微信 2支付宝			
        openid: Taro.getStorageSync("openid"), //登录时获取设置本地缓存
        // open_id: "oCRAS0aZJrVnuK3K-pw0b1AZslzM"
        // alipay_user_id: ""
      }
    })
      .then((res: any) => {
        Taro.hideLoading();
        // 发起支付
        Taro.requestPayment({
          timeStamp: res.timeStamp,
          nonceStr: res.nonceStr,
          package: res.package,
          signType: res.signType,
          paySign: res.paySign,
          success(res) {

            console.log("支付成功");
            () => {
              this.setState({
                pay_bull: "支付成功",
                pay_data: true
              })
            }

          },
          fail(err) {

            console.log("支付失败");
            () => {
              this.setState({
                pay_bull: "支付失败",
                pay_data: true
              })
            }
          },
          complete() {
            // Taro.navigateTo({
            //   url: ""
            // })
          }
        })
      });
  }
  render() {
    return (
      <View className="confirm-order" >
        {

          this.state.pay_bull ? <AtToast isOpened text={this.state.pay_data} duration={2000} ></AtToast> : ""
        }
        <View className="content">
          <View className="flex center">
            <View className="item label">{this.state.coupon.yname}</View>
            <View>{this.state.coupon.pay_money}元</View>
          </View>
          <View className="flex center">
            <View className="item label">数量</View>
            <View className="flex center">
              <AtIcon value="subtract-circle" color={this.state.amount > 1 ? "#FF6654" : "#999"} onClick={this.cutnum.bind(this)} />
              <View className="amount" >{this.state.amount}</View>
              <AtIcon value="add-circle" color={this.state.amount < 10 ? "#FF6654" : "#999"} onClick={this.addnum.bind(this)} />
            </View>
          </View>
        </View>
        <View className="content">
          <View className="flex center">
            <View className="item label">金额</View>
            <View className="price">
              {this.state.coupon.pay_money * this.state.amount}元
            </View>
          </View>
        </View>
        <View className="btn-wrap">
          <View className="submit-btn flex center"
            onClick={this.payMoney.bind(this)}
          >
            ￥ {this.state.coupon.pay_money * this.state.amount} 去支付
          </View>
        </View>
      </View>
    );
  }
}
