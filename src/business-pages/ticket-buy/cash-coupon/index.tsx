import Taro, { Component, ComponentOptions } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
// import secondaryActiveBg from "./secondary-avitve-bg.png";
import quan from '../../../assets/quan.png';
import "./index.styl";

interface Props {
  _id: any, return_money: any, pay_money: any, youhui_type: any, timer: any, yname: any, sname: any, list_brief: any, expire_day: any, total_fee: any
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
            <View className="money-wrap">
              <Text className="money">￥{this.props.return_money}</Text>
              <View className="info">满{this.props.total_fee}可用</View>
            </View>
          </View>
          {/* <Image
          className="middle-bg"
          mode="widthFix"
          src={require("./middle-bg.png")}
        /> */}
          <View className="item content" style={{ position: "relative" }}>
            <View className="head flex">
              <View className="flex center" >
                <Image src={quan} style={{ height: "100%", width: "40px" }} />
              </View>
              <View style={{ width: "135px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{this.props.sname}</View>
            </View>
            {/* <View className="date">{this.props.timer}</View> */}
            <View className="info" >购买后{this.props.expire_day}日内有效</View>
            <View className="_free" >￥{this.props.pay_money}</View>
          </View>
        </View>
      </View>
    );
  }
}
