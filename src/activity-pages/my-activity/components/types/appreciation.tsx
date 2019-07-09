import Taro, { Component } from "@tarojs/taro"
import { Block, View, Text, Button } from "@tarojs/components"
import "./style.styl"
import { OrderProp } from "../order.component"
import Used from "../abnormal/used"
import OverDue from "../abnormal/over.due"

interface OrderAppreciationProp extends OrderProp {
  progress: string;
  isUsed: boolean;
  isOverDue: boolean;
}
export default class OrderAppreciation extends Component<OrderAppreciationProp> {
  static defaultProps = {
    data: null,
    onAction: null
  }

  render() {
    const { data, progress, isUsed, onAction, isOverDue } = this.props
    return (
      <Block>
        <View className="order">
          <View className="avatar gradient-orange">
            <View className="circle top" />
            <View className="circle bottom" />
            <View className="price">
              <Text className="now">{data.init_money || "0"}元</Text>
            </View>
            <View className="desc">
              可增值到{data.return_money || "0"}元
            </View>
            <View className="progress">
              <View
                className="progress-in"
                style={`width: ${progress}`}
              />
            </View>
          </View>
          <View className="description">
            <Text className="item name">{`${data.name}(${data.suppliername})` || "暂无"}</Text>
            <Text className="item brief">{data.location_address || "暂无"}</Text>
            <Text className="item brief">{`订单号：${data.youhui_sn}` || "暂无"}</Text>
            <Text className="item remark">{data.end_time || "暂无"}</Text>
          </View>
          <View className="actions">
            <Button className="item appreciation" data-action="jump" onClick={onAction}>增值</Button>
          </View>
          <View className="classify">
            <Text className="text">可增值券</Text>
          </View>
          { isUsed && <Used /> }
          { isOverDue && <OverDue /> }
        </View>
      </Block>
    )
  }
}
