import Taro, { Component } from "@tarojs/taro"
import { View, Image, Text, Button } from "@tarojs/components"
import "./style.appreciation.styl"
import { CouponProp } from "../coupon"
import { TYPE_APPRECIATION } from "@/utils/constants"
export default class Appreciation extends Component<CouponProp> {
  static defaultProps: CouponProp = {
    data: {
      user_count: 0,
      total_num: 0
    },
    progress: "",
    onAction() {}
  }

  render() {
    const {
      data: { user_count, total_num, ...data },
      onAction,
      progress
    } = this.props
    return (
      <View className="coupon">
        <View className="avatar">
          <Image className="image" src={data.image} />
          <View className="classify">可增值券</View>
        </View>
        <View className="description">
          <View className="item name">
            {data.name || "优惠券名称"}
          </View>
          <View className="item brief">
            {/* 卵蛋, 还什么字段统一 */}
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
              {data.pay_money || "price"}
            </Text>
            <Text className="text max">
              {"可增至" + (data.return_money || "0.00") + "元"}
            </Text>
          </View>
        </View>
        <View className="status-wrapper">
          <View className="status">
            <View className="text">{"已抢" + progress}</View>
            <View className="process">
              <View className="process-in" style={"width: " + progress} />
            </View>
          </View>
          <Button className="buy" data-action="jump" data-type={TYPE_APPRECIATION} onClick={onAction}>立即抢购</Button>
        </View>
      </View>
    )
  }
}
