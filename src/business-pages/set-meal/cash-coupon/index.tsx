import Taro, { Component, ComponentOptions } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";


import "./index.styl";

interface Props {
  _id: any, return_money: any, pay_money: any, youhui_type: any, timer: any, sname: any, list_brief: any, _image:any }

/**现金优惠券 */
export default class CashCoupon extends Component<Props> {
  state = {};

  static options: ComponentOptions = {
    addGlobalClass: true
  };
  handleClick = (id, e) => {
    Taro.navigateTo({
      url: '../set-meal/index?id=' + id
    })
  }
  render() {
    return (
      <View
        className="cash-coupon flex active"
        style={{
          backgroundImage: `url("http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/D3Ws4B7kH8PwEsDdJiDtzaNtZdtWcZBr.png")`
        }}
        onClick={this.handleClick.bind(this, this.props._id)}
      >
        <View className="secondary flex center" >
          <Image src={this.props._image} style={{width:"100%",height:"100%"}} />
        </View>
        {/* <Image
          className="middle-bg"
          mode="widthFix"
          src={{this.props.image}}
        /> */}
        <View className="item content">
          <View className="head flex">
            <View className="label flex center">{this.props.sname}</View>
          </View>
          <View className="date">{this.props.timer}</View>
          <View className="info">{this.props.list_brief}</View>
        </View>
      </View>
    );
  }
}
