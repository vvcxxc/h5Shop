import Taro, { Component } from "@tarojs/taro"
import { View, Image, Text, Button } from "@tarojs/components"
import "./index.styl";

interface Props {
  data: any;
}
interface DataType {
  money: string;
  limit_money: string
}
export default class AppreCoupon extends Component<Props> {
  state = {
    item: {
      gift_pic: '1',
      return_money: '2',
      pay_money: '11'
    }
  }
  render() {
    const { money, limit_money, gift_image } = this.props.data
    return (
      <View>
            <View>
              <View className="image-list" style={{ position: "relative", marginBottom: "5px" }}>
                {
                  gift_image == "" || undefined ? <Image className="backg-image" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/bMGJKGX2JcKWbs8JEypeiB7CAbd4wAz4.png"} /> :
                    <Image className="backg-image" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/andhNY3XKEWrW8nYBK5pyAptaJWeJz68.png"} />
                }
                <View className="img" style={{ width: "100%" }}   >
                  <View className="box_left">
                    <View className='max_text'>最高可抵</View>
                    <View>
                      <Text style={{ fontSize: '14px', color: '#EE3131', fontWeight: 600 }}>￥</Text>
                      <Text style={{ fontSize: '22px', color: '#EE3131', lineHeight: 1 }}>{money}</Text>
                    </View>
                  </View>
                  <View className="box_center">
                    <View className='box_center_main'>
                      <View className='coupon_label'>全场通用</View>
                      <View className='coupon_tips'>满{limit_money}元可用</View>
                    </View>
                  </View>
                  <View className="box_right" style={{ overflow: "hidden" }}>
                    <Image className="image" src={gift_image} style={{ width: "100%", height: "100%" }} />
                  </View>
                </View>
              </View>
            </View>
      </View>
    )
  }
}
