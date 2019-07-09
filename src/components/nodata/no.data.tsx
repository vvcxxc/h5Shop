import Taro, { Component } from "@tarojs/taro"
import { View, Text } from "@tarojs/components"
import "./style.styl"

export default class NoData extends Component {
  render() {
    return (
      <View className="no-data">
        <Text className="text">暂无数据~</Text>
      </View>
    )
  }
}
