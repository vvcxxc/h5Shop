import Taro, { Component, ComponentOptions } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
// import secondaryActiveBg from "./secondary-avitve-bg.png";

import "./index.styl";

interface Props {
  _id: any,
  return_money: any,
  _total_fee: any,
  youhui_type: any,
  timer: any,
  sname: any,
  list_brief: any,
  bg_img_type: any
}

/**现金优惠券 */
export default class CashCoupon extends Component<Props> {
  state = {};

  static options: ComponentOptions = {
    addGlobalClass: true
  };
  handleClick = (_id, e) => {
    Taro.navigateTo({
      // url: '/pages/orderdetail/index?couponType="1"&ticketColor='+this.props.bg_img_type+'&ticketUsed=' + this.props.bg_img_type
      url: '/pages/orderdetail/index?id='+_id

    })
  }
  render() {
    return (
      <View className="cash-coupon-box">
        {
          this.props.bg_img_type == 1 ?
            <Image className="image" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/kG4tMT5SerAGN44WsKpbE5dNsYAp5dhC.png"} /> : (
              this.props.bg_img_type == 2 ?
                <Image className="image" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/HB4K8yy3R88B6sw3xhjpTQCKPQTyBCG3.png"} /> :
                <Image className="image" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/HEJnbDiTa3ShmHbCd6WsRGMaXR55zMrF.png"} />)
        }
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
              <View className="info">满{this.props._total_fee}可用</View>
            </View>
          </View>
          {/* <Image
          className="middle-bg"
          mode="widthFix"
          src={require("./middle-bg.png")}
        /> */}
          <View className="item content" style={{ position: "relative" }}>
            <View className="head flex">
              {
                this.props.bg_img_type == 1 ?
                  <View className="label flex center" style={{ background: "#5d84e0" }}>{this.props.youhui_type == "0" ? "兑换券" : "现金券"}</View> :
                  <View className="label flex center" style={{ background: "#cccccc" }}>{this.props.youhui_type == "0" ? "兑换券" : "现金券"}</View>
              }
              {this.props.sname}
            </View>
            {/* <View className="date">{this.props.timer}</View> */}
            <View className="info" style={{ position: "absolute", bottom: "20px", padding: "0" }}>{this.props.list_brief}</View>
          </View>
        </View>
      </View>
    );
  }
}
