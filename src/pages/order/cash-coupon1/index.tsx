import Taro, { Component, ComponentOptions } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";


import "./index.styl";

interface Props {
  _id: any,
  _logid: any,
  return_money: any,
  youhui_type: any,
  timer: any,
  confirm_time: any,
  sname: any,
  list_brief: any,
  _image: any,
  type: any,
  bg_img_type: any,
  clickcode: any

}
//type: 0为空白，1立即使用，2再来一单
// bg_img_type: 0为正常，1为已使用

/**现金优惠券 */
export default class CashCoupon extends Component<Props> {
  state = {
  };

  static options: ComponentOptions = {
    addGlobalClass: true
  };
  handleClick = (_id, e) => {
    // console.log(this.$router.path)
    if (this.$router.path.indexOf("orderdetail") < 0) {
      Taro.navigateTo({
        // url: '/detail-pages/orderdetail/index?id=' + _id
        url: '/detail-pages/orderdetail/index?id=' + _id
      })
    }
  }
  useNow = (_logid, e) => {
    // console.log("儿子" + _id)
    this.props.clickcode(this.props._logid);
    e.stopPropagation();
  }
  buyMore = (_id, e) => {
    console.log(2)
    // console.log("buymore"+_id)
    Taro.navigateTo({
      // url: '/business-pages/confirm-order/index?id=' + _id
      url: '/business-pages/set-meal/index?id=' + _id
    })
    e.stopPropagation();
  }
  render() {
    return (
      <View
        className="cash-coupon flex active"
        style={{
          backgroundImage: this.props.bg_img_type == 0 ? `url("http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/D3Ws4B7kH8PwEsDdJiDtzaNtZdtWcZBr.png")` : `url("http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/by5b6PKpQ5QYREYfdMZhSPD5rBYRefyR.png")`
        }}
        onClick={this.handleClick.bind(this, this.props._logid)}
      >
        <View className="secondary flex center" >
          <Image src={this.props._image} style={{ width: "100%", height: "100%" }} />
        </View>

        <View className="item content" style={{ position: "relative" }}>
          <View className="head2 flex" style={{ background: "transparent", alignItems: "center" }}>
            <View className="labels flex center" >
              <Image className="labelimg" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/s3YhfNZ8NH3as4DZ7p45nPiQKdiRKTwi.png" />
            </View>
            <View style={{ width: "135px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", height: "100%",display:"inline-block",lineHeight:1}}>{this.props.sname}</View>
          </View>

          <View className="date">{this.props.list_brief}</View>
          {this.props.type == 2 ? "" : <View className="info">{this.props.timer}</View>}
          {this.props.type == 2 ? <View className="info">免预约</View> : ""}
          {this.props.bg_img_type == 1 ? <View className="info" style={{ marginTop: "10px" }}>使用日期： {this.props.confirm_time}</View> : ""}

          {
            this.props.type == 1 ? <View className="usenow" onClick={this.useNow.bind(this, this.props._logid)}>
              <Image className="usenowimg"  src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/yfJ6M8WSptFzZpxYtbyBiJtBXFSsznrH.png" />
            </View> : null
          }

        </View>
      </View>
    );
  }
}
