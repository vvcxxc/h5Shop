import Taro, { Component, ComponentOptions } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
// import secondaryActiveBg from "./secondary-avitve-bg.png";

import "./index.styl";

interface Props {
  _id: any, return_money: any, pay_money: any, youhui_type: any, timer: any, sname: any, list_brief: any
}

/**现金优惠券 */
export default class CashCoupon extends Component<Props> {
  state = {};

  static options: ComponentOptions = {
    addGlobalClass: true
  };
  handleClick = (_id, e) => {
    console.log(_id);
    console.log(e);
    Taro.navigateTo({
      url: '../ticket-buy/index?id=' + _id
    })
  }
  render() {
    return (
      <View className="cash-coupon-box">
        <Image className="image" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/kG4tMT5SerAGN44WsKpbE5dNsYAp5dhC.png"} />
        <View
          className="cash-coupon flex active"
          // style={{ backgroundImage: `url("http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/kG4tMT5SerAGN44WsKpbE5dNsYAp5dhC.png")` }}
          onClick={this.handleClick.bind(this, this.props._id)}
        >

          <View
            className="secondary flex center"
          // style={{ backgroundImage: `url(${secondaryActiveBg})` }}
          >
            <View className="money-wrap" style={{ paddingTop: '20px' }}>
              ￥<Text className="money">{this.props.return_money}</Text>
              <View className="info">满{this.props.pay_money}可用</View>
            </View>
          </View>
          {/* <Image
          className="middle-bg"
          mode="widthFix"
          src={require("./middle-bg.png")}
        /> */}
          <View className="item content" style={{ position: "relative" }}>
            <View className="head flex">
              <View className="label flex center">{this.props.youhui_type == "0" ? "兑换券" : "现金券"}</View>{this.props.sname}
            </View>
            <View className="date">{this.props.timer}</View>
            <View className="info" >{this.props.list_brief}</View>
          </View>
        </View>
      </View>
    );
  }
}
