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
  payMoney() {
    Taro.showLoading({
      title: 'loading',
    })
    //请求支付属性
    request({
      url: 'api/wap/coupon/wxWechatPay',
      method: "POST",
      data: {
        youhui_id: this.state.coupon.id,
        store_id: this.state.store.id,
        youhui_number: this.state.amount,
        type: "1",  //1 微信 2支付宝
        open_id: Taro.getStorageSync("openid"), //登录时获取设置本地缓存
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
            () => {
              this.setState({
                pay_bull: "支付成功",
                pay_data: true
              })
            }

          },
          fail(err) {
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
