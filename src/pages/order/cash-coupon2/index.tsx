import Taro, { Component, ComponentOptions } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
// import secondaryActiveBg from "./secondary-avitve-bg.png";
import quan from '../../../assets/quan.png';
import quan2 from '../../../assets/quan2.png';
import "./index.styl";

interface Props {
  _id: any,
  _logid: any,
  return_money: any,
  _total_fee: any,
  youhui_type: any,
  timer: any,
  confirm_time: any,
  sname: any,
  list_brief: any,
  bg_img_type: any,
  type: any,
  expiration: any
}

//type: 0为空白，1再来一单
// bg_img_type: 0为灰色，1为蓝色,2为灰色已使用

/**核销券 */
export default class CashCoupon extends Component<Props> {
  state = {};

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
  buyMore = (_id, e) => {
    Taro.navigateTo({
      url: '/business-pages/ticket-buy/index?id=' + _id
    })
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
          onClick={this.handleClick.bind(this, this.props._logid)}
        >

          <View
            className="secondary flex center"
          >
            <View className="money-wrap">
              ￥<Text className="money">{this.props.return_money}</Text>
              <View className="info">满{this.props._total_fee}可用</View>
            </View>
          </View>
          <View className="item content" style={{ position: "relative" }}>
            <View className="heads flex">
            {
                this.props.bg_img_type == 1 ?
                  <View className="labels flex center" >
                    <Image src={quan} style={{ height: "100%", width: "40px" }} />
                  </View> :
                  <View className="labels flex center">
                    <Image src={quan2} style={{ height: "100%", width: "40px" }} />
                  </View>
              }
              <View style={{width:"135px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace: "nowrap",lineHeight:1.2}}>{this.props.sname}</View>
            </View>
            {/* <View className="date" >{this.props.list_brief}</View> */}
            <View className="info" >{this.props.timer}</View>
            <View className="info" >免预约/全部商品可用</View>

            {this.props.bg_img_type == 2 ? <View className="info" style={{ marginTop: "10px" }}>使用日期： {this.props.confirm_time}</View> : ""}
            {/* {
              this.props.type == 1 ? <View className="buymore" onClick={this.buyMore.bind(this, this.props._id)}>再来一单</View> : ""
            } */}
          </View>
        </View>
      </View>
    );
  }
}
