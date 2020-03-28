import Taro, { Component } from '@tarojs/taro';
import './index.styl';
import { View, Image, Text } from '@tarojs/components';
import { accSubtr } from '@/utils/common'
interface Props {
  item: object
  onAction: any;
}
export default class CouponBox extends Component<Props> {
  state = {

  }
  componentDidMount() {
  }
  handleClick(item) {
    this.props.onAction(item)
  }

  couponType(item) {
    const { is_share } = item
    let type = ''
    if(is_share == 1) {
        // 增值
        type = '增值券'
    }else if(is_share == 4){
      // 现金券兑换券
      if(item.youhui_type){
        // 现金券
        type = '现金券'
      }else{
        // 兑换券
        type = '兑换券'
      }
    }else if(is_share == 5){
       // 拼团
       type = '拼团券'
    }
    return type
  }

  render() {
    const { item } = this.props
    return (
      <View className='coupon-box' onClick={this.handleClick.bind(this,item)}>
        <Image className='coupon-img' src={'http://oss.tdianyi.com/' + item.icon} />
        <View className='coupon-detail'>
          <View className='coupon-title'>
            <View className='coupon-type'>{this.couponType(item)}</View>
            <Text>
              {item.name}
            </Text>
          </View>
          <View className='coupon-validity'>有效期：{item.expire_day}天有效</View>
          <View className='coupon-label'>立减￥{ item.is_share == 5 ? accSubtr(item.pay_money,item.participation_money) : accSubtr(item.return_money, item.pay_money)}</View>
          <View className='coupon-money'>
            优惠价￥
            <Text className='new-money'>{item.is_share == 5 ? item.participation_money : item.pay_money}</Text>
            <Text className='old-money'>￥{item.is_share == 5 ? item.pay_money : item.return_money}</Text>
          </View>
          <View className='coupon-button'>抢购</View>
        </View>
      </View>
    )
  }
}
