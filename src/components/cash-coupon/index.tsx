import Taro, { Component, ComponentOptions } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";

// import secondaryActiveBg from "./secondary-avitve-bg.png";

import "./index.styl";

interface Props {
  cuoPonsId?:number
  handerClickCb ?:Function
}

/**现金优惠券 */
export default class CashCoupon extends Component<Props> {
  state = {};

  static options: ComponentOptions = {
    addGlobalClass: true
  };
  handerClick(){
    const { handerClickCb } = this.props
    handerClickCb && handerClickCb()
  }
  render() {
    return (
      <View
        onClick = {this.handerClick.bind(this)}
        className="cash-coupon flex active"
        style={{ backgroundImage: `url(${require("./active-bg.png")})` }}
      >
        <View
          className="secondary flex center"
          // style={{ backgroundImage: `url(${secondaryActiveBg})` }}
        >
          <View className="money-wrap">
            ￥<Text className="money">50</Text>
            <View className="info">满199可用</View>
          </View>
        </View>
        {/* <Image
          className="middle-bg"
          mode="widthFix"
          src={require("./middle-bg.png")}
        /> */}
        <View className="item content">
          <View className="head flex">
            <View className="label flex center">现金券</View>洛溪路店
          </View>
          <View className="date">2019.4.20-2019.4.30</View>
          <View className="info">极速退/免预约/全部商品可用</View>
        </View>
      </View>
    );
  }
}
