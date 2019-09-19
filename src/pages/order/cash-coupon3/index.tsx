import Taro, { Component, ComponentOptions } from "@tarojs/taro";
import { View, Text, Image } from "@tarojs/components";
import "./index.styl";
import { AtProgress } from 'taro-ui'
import quan from '../../../assets/quan.png';
import quan2 from '../../../assets/quan2.png';
import daijin from '../../../assets/daijinquan.png';
import daijin_hui from '../../../assets/daijinquan_hui.png';
interface Props {
  bg_img_type: any
  init_money: string
  money: any
  appreciation_money: any
  expire_day: any
  total_fee: any
  type: any
}
export default class CashCoupon3 extends Component<Props> {
  state = {

  }
  render (){
    console.log(this.props)
    const percent = (this.props.appreciation_money *1)/(this.props.money *1) * 100
    console.log(this.props.type)
    return (
      <View className='cash_coupon3'>
        {
          this.props.bg_img_type == 1 ?
            <Image className="image" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/zHRrZb4ZZMBrEwJrzTEz2k72atPBhFYQ.png"} /> : (
              this.props.bg_img_type == 2 ?
                <Image className="image" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/QcNcyiiYiTCBEz5MWrHwjsXi2ZsJzdfh.png"} /> :
                <Image className="image" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/pizeGkAz22hwdckpCsHZkwW4RWZnFCAN.png"} />)
        }
        <View className='coupon3_box'>
          <View className='left_coupon3'>
            <View className='left_label'>
              {/* 全场通用 */}
              {
                this.props.type == 0 ? '品类券' : '全场通用'
              }
            </View>
            <View className='left_text'>
              <View className='text_title'>最高可抵</View>
              <View className='text_money'>
                <Text className='text_span'>￥</Text>
                {this.props.money}
              </View>
            </View>
          </View>
          <View className='right_coupon3'>
            <View className='right_one'>
              {/* <Image src={daijin} style={{ height: "100%", width: "40px", paddingRight: 4 }}/> */}
              {
                this.props.bg_img_type == 1 ?
                  this.props.type == 1 ?
                  <Image src={quan} style={{ height: "100%", width: "40px", paddingRight: 4 }}/>
                  :
                  <Image src={daijin} style={{ height: "100%", width: "40px", paddingRight: 4 }}/>
                  :
                this.props.bg_img_type == 2 ?
                  this.props.type == 2 ?
                  <Image src={quan2} style={{ height: "100%", width: "40px", paddingRight: 4 }}/>
                  :
                  <Image src={daijin_hui} style={{ height: "100%", width: "40px", paddingRight: 4 }}/> : null
              }
              <View style={{fontWeight: 'bold'}}>满{this.props.total_fee}元可用</View>
            </View>
            <View className='right_two'>
              领券内{this.props.expire_day}天有效
            </View>
            <View className='right_three'>
              {/* <View className='right_sign' style={{left: `${percent}%`}}>￥{this.props.appreciation_money}</View> */}
              <AtProgress percent={percent} isHidePercent={true} color='#ff3a10'/>
              <View className='right_money'>
                <Text>起始￥{this.props.init_money}</Text>
                <Text style={{color: '#ff3411'}}>已增值至￥{this.props.appreciation_money}</Text>
                <Text>封顶￥{this.props.money}</Text>
              </View>
            </View>
          </View>
        </View>

      </View>
    )
  }
}
