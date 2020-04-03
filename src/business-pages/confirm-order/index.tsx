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
import { accAdd, accSub } from '@/components/acc-num'

export default class ConfirmOrder extends Component {
  config = {
    navigationBarTitleText: "确认订单"
  };

  state = {
    tempNum: 0,
    amount: 1,
    pay_success: false,
    coupon: {
      id: "",
      pay_money: 0,
      brief: "",
      list_brief: "",
      description: "0",
      yname: "",
      total_num: 0,
      limit_purchase_quantity: 0,//限购数量
      user_youhu_log_sum: 0// 已购数量
    },
    store: {
      id: "",
      sname: ""
    },
    tipsMessage: ''
  };
  componentWillMount() {

    request({ url: 'v3/discount_coupons/' + this.$router.params.id })
      .then((res: any) => {
        this.setState({
          coupon: res.data.info.coupon,
          store: res.data.info.store
        }, () => {
          this.accMul();
        })
        Taro.hideLoading()


      })
  }
  componentDidMount() {

  }
  cutnum() {
    if (this.state.amount > 1) {
      let cut = accSub(this.state.amount, 1);
      this.setState({ amount: cut }, () => {
        this.accMul();
      })
    }

  }
  addnum() {
    if (this.state.amount < 10 && this.state.amount < this.state.coupon.total_num && (
      (!this.state.coupon.limit_purchase_quantity || (this.state.coupon.limit_purchase_quantity && accAdd(this.state.amount, this.state.coupon.user_youhu_log_sum)) <= this.state.coupon.limit_purchase_quantity)
    )) {
      let add = accAdd(this.state.amount, 1);
      this.setState({ amount: add }, () => {
        this.accMul();
      })
    }
  }
  payMoney() {
    if (this.state.coupon.limit_purchase_quantity && (accAdd(this.state.amount, this.state.coupon.user_youhu_log_sum)) > this.state.coupon.limit_purchase_quantity) {
      this.setState({ tipsMessage: '本优惠已达购买上限，无法购买。' })
      return;
    }
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
        if (res.code == 200) {
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
                  Taro.showToast({ title: '支付成功', icon: 'none' })

                  Taro.switchTab({
                    url: '/pages/order/index',
                    success: (e) => {
                      let page = Taro.getCurrentPages().pop();
                      if (page == undefined || page == null) return;
                      page.onShow();
                    }
                  })
                } else {
                  Taro.showToast({ title: '支付失败', icon: 'none' })
                }
              }
            );
          }
          else if (_type == 2) {
            //支付宝
            window.AlipayJSBridge.call('tradePay', {
              tradeNO: res.data.alipayOrderSn, // 必传，此使用方式下该字段必传
              // bizType:"xxx",                          // 非必传，默认为 “trade”
              // bizSubType:"",                          // 非必传，默认为 “”
              // bizContext:""                           // 非必传，默认为H5启动选项(safePayContext)
            }, res => {
              if (res.resultCode === "9000") {
                Taro.showToast({ title: '支付成功', icon: 'none' })

                //支付宝成功
                Taro.switchTab({
                  url: '/pages/order/index',
                  success: (e) => {
                    let page = Taro.getCurrentPages().pop();
                    if (page == undefined || page == null) return;
                    page.onShow();

                  }
                })
              } else {
                Taro.showToast({ title: '支付失败', icon: 'none' })
              }
            })
          } else {
            console.log(_type)
          }
        } else {
          this.setState({ tipsMessage: res.message })
          // Taro.showToast({ title: res.message, icon: 'none' })
        }
      })
  }

  accMul = () => {
    let arg1 = this.state.coupon.pay_money;
    let arg2 = this.state.amount;
    var m = 0, s1 = arg1.toString(),
      s2 = arg2.toString();
    try {
      m += s1.split(".")[1].length
    } catch (e) { }
    try {
      m += s2.split(".")[1].length
    } catch (e) { }
    let tempNum = Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
    this.setState({ tempNum: tempNum })
  }

  render() {
    return (
      <View className="confirm-order" >
        <View className="content">
          <View className="flex center snameBox">
            <View className="item label sname">{this.state.store.sname}{this.state.coupon.yname}</View>
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
                <Image className="image" style={{ width: "100%", height: "100%" }} src={this.state.amount < 10 && this.state.amount < this.state.coupon.total_num ? addimg : addimg2} />
              </View>
            </View>
          </View>
        </View>
        <View className="content">
          <View className="flex center">
            <View className="item label">金额</View>
            <View className="price">
              ￥{this.state.tempNum}
            </View>
          </View>
        </View>
        <View className="btn-wrap">
          <View className="submit-btn flex center"
            onClick={this.payMoney.bind(this)}
          >
            ￥{this.state.tempNum} 去支付
          </View>
        </View>

        {
          this.state.tipsMessage ? <View className="tips-mask">
            <View className="tips-content">
              <View className="tips-title">购买失败</View>
              <View className="tips-info">{this.state.tipsMessage}</View>
              <View className="tips-btn" onClick={() => { this.setState({ tipsMessage: '' }) }}>确定</View>
            </View>
          </View> : null
        }
      </View>
    );
  }
}
