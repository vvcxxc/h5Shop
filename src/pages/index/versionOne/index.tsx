import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import './index.styl'
interface Props {
  list?: any;
  // onClick: (id: any) => any;
}
export default class VersionOne extends Component<Props> {

  state = {
    listData: []
  }
  componentWillMount() {
  }
  componentDidMount() {
  }

  handleClick = (id: any) => {
    Taro.navigateTo({
      url: '/pages/business/index?id=' + id
    })
  }

  judgeData = (value1) => {
    return typeof (value1) === 'string' ? (value1.length > 1 ? '' : 'none') : 'none'
  }

  controlPicture = (gift, coupon, preview?) => { // 控制图片显示
    if (!coupon && !gift) return false //两个图片都没有 显示门头照preview
    if (!gift) return 1 //礼品图不存在 只显示一张coupon
    return 2 //两张都显示
  }

  render() {
    let that = this.props.list
    return (
      <View>
        < View className="show_box_one" onClick={this.handleClick.bind(this, that.id)} >
          <View className="title_top" >
            <Text>{that.name} </Text>
            <View className="into">
              <Image src={require('../../../assets/back.png')} />
            </View>
          </View>
          <View className="distance_activity">
            <View className="distance_list">
              {
                that.label.map((item:any, index:number) => {
                  return <View className="distance">{item}</View>
                })
              }
            </View>
            <View className="activity">{that.distance}</View>
          </View >
          <View className="show_img_box">
            <View className="img_left">
              <Image src={
                this.controlPicture(that.gift_pic, that.coupon_image_url) === false ||
                  this.controlPicture(that.gift_pic, that.coupon_image_url) === 1 ?
                  that.preview : that.coupon_image_url} />
            </View>
            <View className="img_right">
              <Image className="img" src={that.gift_pic}></Image>
              <Image className="lin_img" src={require('./lin.png')} ></Image>
              <Image className="lin_two_img" src={require('./qiu.png')} ></Image>
            </View>
          </View>
          <View className="coupons" style={{ display: this.judgeData(that.gift_name) }}>
            <View className="gift_title center">礼</View>
              <View className="content ellipsis-one">
              {that.gift_name}
              </View>
            </View>
          <View className="coupons" style={{ display: this.judgeData(that.cash_coupon_name) }}>
              <View className="vouchers center">券</View>
              <View className="content ellipsis-one">
              {that.cash_coupon_name}
              </View>
            </View>
          <View className="coupons no_border" style={{ display: this.judgeData(that.exchange_coupon_name) }}>
              <View className="preferential center">惠</View>
              <View className="content ellipsis-one">
              {that.exchange_coupon_name}
              </View>
            </View>
          </View>
      </View>
    )
  }
}
