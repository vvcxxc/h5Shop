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
  bg_img_type: any,
  type: any,
  expiration: any
}

//type: 0为空白，1再来一单
// bg_img_type: 0为灰色，1为蓝色,2为灰色已使用

/**现金优惠券 */
export default class CashCoupon extends Component<Props> {
  state = {};

  static options: ComponentOptions = {
    addGlobalClass: true
  };
  handleClick = (_id, e) => {
    Taro.navigateTo({
      // url: '/pages/orderdetail/index?couponType="1"&ticketColor='+this.props.bg_img_type+'&ticketUsed=' + this.props.bg_img_type
      url: '/detail-pages/orderdetail/index?id=' + _id

    })
  }
  buyMore = (_id, expiration, e) => {

    let arr1 = expiration.toString().split(" ");
    let data1 = arr1[0].toString().split("-");
    let data2 = arr1[1].toString().split(":");
    var expirationDate = new Date(data1[0], data1[1], data1[2], data2[0], data2[1], data2[2]);
    let nowDate = new Date();
    if (expirationDate >= nowDate) {
      Taro.navigateTo({
        url: '/business-pages/ticket-buy/index?id=' + _id
      })
    }else{
      Taro.showToast({ title:'活动已过期',icon:'none' })
    }


    e.stopPropagation();
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
            {
              this.props.type == 1 ? <View className="buymore" onClick={this.buyMore.bind(this, this.props._id, this.props.expiration)}>再来一单</View> : ""
            }
          </View>
        </View>
      </View>
    );
  }
}
