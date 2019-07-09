import Taro, { Component } from "@tarojs/taro"
import { Block, View, Text, Button } from "@tarojs/components"
import { OrderProp } from "../order.component"
import "./style.styl"
import Used from "../abnormal/used"
import OverDue from "../abnormal/over.due"

interface OrderNormalProp extends OrderProp {
  isUsed: boolean;
  isOverDue: boolean;
}
export default class OrderNormal extends Component<OrderNormalProp> {
  render() {
    const { data, onAction, isUsed, isOverDue } = this.props
    return (
      <Block>
        <View className="order">
          <View className="avatar gradient-green">
            <View className="circle top" />
            <View className="circle bottom" />
            <View className="price text-ellipsis">
              <Text className="now">
                {`${data.pay_money}元`}
              </Text>
            </View>
            <View className="desc">
              {`满${data.return_money || "0"}元使用`}
            </View>
          </View>
          <View className="description">
            <Text className="item name">{`${data.name}(${data.suppliername})`  || "暂无"}</Text>
            <Text className="item brief">{data.location_address || "暂无"}</Text>
            <Text className="item brief">{`订单号：${data.youhui_sn}` || "暂无"}</Text>
            <Text className="item remark">{data.end_time || "暂无"}</Text>
          </View>
          <View className="actions">
            <Button className="item use" data-action="use" onClick={onAction}>使用</Button>
          </View>
          { isUsed && <Used /> }
          { isOverDue && <OverDue /> }
        </View>
      </Block>
    )
  }
}
