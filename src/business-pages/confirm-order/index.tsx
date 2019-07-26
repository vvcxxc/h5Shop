import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";
import { AtIcon, AtToast } from "taro-ui";
import { getBrowserType } from "@/utils/common";
import Cookie from 'js-cookie'
import request from '../../services/request'
import "./index.styl";
import addimg from '../../assets/add.png';
import addimg2 from '../../assets/add2.png';
import cutimg from '../../assets/cut.png';
import cutimg2 from '../../assets/cut2.png';

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

    request({ url: 'v3/discount_coupons/' + this.$router.params.id })
      .then((res: any) => {
        // console.log(res);
        this.setState({
          coupon: res.data.info.coupon,
          store: res.data.info.store
        })
        Taro.hideLoading()


      })
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
    let _type;
    let browserType = getBrowserType();
    if (browserType == 'wechat') {
      _type = 1;
    } else if (browserType == 'alipay') {
      _type = 2;
    } else {
      Taro.showToast({
        title: "支付出错",
        icon: "none"
      });
    }
    let datas = {}
    if (_type == 1) {
      datas = {
        youhui_id: this.state.coupon.id,
        store_id: this.state.store.id,
        youhui_number: this.state.amount,
        type: _type,  //1 微信 2支付宝
        xcx: 0,
        open_id: Cookie.get(process.env.OPEN_ID),
      }
    } else {
      datas = {
        youhui_id: this.state.coupon.id,
        store_id: this.state.store.id,
        youhui_number: this.state.amount,
        type: _type,  //1 微信 2支付宝
        xcx: 0,
        alipay_user_id: Cookie.get(process.env.ALIPAY_USER_ID),
      }
    }

    //请求支付属性
    request({
      url: 'api/wap/coupon/wxWechatPay',
      method: "POST",
      header: {
        "Content-Type": "application/json"
      },
      data: JSON.stringify(datas)
    })
      .then((res: any) => {
        Taro.hideLoading();
        if (_type == 1) {
          //微信
          window.WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
              "appId": res.data.appId,
              "timeStamp": res.data.timeStamp,
              "nonceStr": res.data.nonceStr,
              "package": res.data.package,
              "signType": res.data.signType,
              "paySign": res.data.paySign
            },
            function (res) {
              if (res.err_msg == "get_brand_wcpay_request:ok") {
                //微信成功
                Taro.switchTab({
                  url: '/pages/order/index',
                  success: function (e) {
                    let page = Taro.getCurrentPages().pop();
                    if (page == undefined || page == null) return;
                    page.onShow();
                  }
                })
              } else {
                //微信失败
              }
            }
          );
        } else if (_type == 2) {
          //支付宝
          window.AlipayJSBridge.call('tradePay', {
            tradeNO: res.data.alipayOrderSn, // 必传，此使用方式下该字段必传
            // bizType:"xxx",                          // 非必传，默认为 “trade”
            // bizSubType:"",                          // 非必传，默认为 “”
            // bizContext:""                           // 非必传，默认为H5启动选项(safePayContext)
          }, res => {
            if (res.status == "200") {
              //支付宝成功
              Taro.switchTab({
                url: '/pages/order/index',
                success: function (e) {
                  let page = Taro.getCurrentPages().pop();
                  if (page == undefined || page == null) return;
                  page.onShow();

                }
              })
            } else {
              //支付宝失败
            }
          })
        } else {
          console.log(_type)
        }
      })
  }


  render() {
    return (
      <View className="confirm-order" >
        {

          this.state.pay_bull ? <AtToast isOpened text={this.state.pay_data} duration={2000} ></AtToast> : ""
        }
        <View className="content">
          <View className="flex center">
            <View className="item label">{this.state.store.sname}{this.state.coupon.yname}</View>
            <View>{this.state.coupon.pay_money}元</View>
          </View>
          <View className="flex center">
            <View className="item label">数量</View>
            <View className="flex center">
              {/* <AtIcon value="subtract-circle" color={this.state.amount > 1 ? "#FF6654" : "#999"} onClick={this.cutnum.bind(this)} /> */}
              <View className="subimg" style={{ width: "22px", height: "22px" }} onClick={this.cutnum.bind(this)}>
                <Image className="image" style={{ width: "100%", height: "100%" }} src={this.state.amount > 1 ? cutimg : cutimg2} />
              </View>
              <View className="amount" >{this.state.amount}</View>
              {/* <AtIcon value="add-circle" color={this.state.amount < 10 ? "#FF6654" : "#999"} onClick={this.addnum.bind(this)} /> */}
              <View className="addimg" style={{ width: "22px", height: "22px" }} onClick={this.addnum.bind(this)}>
                <Image className="image" style={{ width: "100%", height: "100%" }} src={this.state.amount < 10 ? addimg : addimg2} />
              </View>
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



// Taro.switchTab({
//   url: '/pages/order/index',
//   success: () => {
//     var page = Taro.getCurrentPages().pop();
//     if (page == undefined || page == null) return;
//     page.onLoad();
//   }
// })
