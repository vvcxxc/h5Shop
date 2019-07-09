import Taro, { Component } from "@tarojs/taro"
import { View, Image, Text, Button } from "@tarojs/components"
import "./style.group.styl"
import { CouponProp } from "../coupon"
import { TYPE_GROUP } from "@/utils/constants"

export default class CouponGroup extends Component<CouponProp> {
  static defaultProps: CouponProp = {
    data: {},
    onAction() {}
  }

  render() {
    const { data, onAction } = this.props
    return (
      <View className="coupon">
        <View className="avatar">
          <Image className="image" src={data.image} />
          <View className="classify">团购券</View>
        </View>
        <View className="description">
          <View className="item name">
            {data.name || "优惠券名称"}
          </View>
          <View className="item brief">
            {data.supplier_location_name || data.sname || "暂无店铺"}
          </View>
          {
            data.gift_name && (
              <View className="item gift">
              <Text className="text">{`赠 ${data.gift_name}` || "暂无"}</Text>
            </View>
            )
          }
          <View className="item price">
            <Text className="text money">
              {data.participation_money || "price"}
            </Text>
            <Text className="text money-before">
              {(data.pay_money || "0.00") + "元"}
            </Text>
          </View>
        </View>
        <View className="status-wrapper">
          <View className="status">
            <View className="text">已参与{data.participate_number || '0'}</View>
            <View className="group-number">{data.number || '0'}人团</View>
          </View>
          <Button className="buy" data-action="jump" data-type={TYPE_GROUP} onClick={onAction}>去开团</Button>
        </View>
      </View>
    )
  }
}
