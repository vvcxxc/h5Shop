import Taro, { Component } from "@tarojs/taro"
import { Block, View, Image } from "@tarojs/components"

import "./style.styl"
export default class OverDue extends Component {
  render() {
    return (
      <Block>
        <View className="abnormal overdue">
        <Image
          className="icon"
          src={require("../../../../static/images/ic_pass_due.png")}
        />
        </View>
      </Block>
    )
  }
}
