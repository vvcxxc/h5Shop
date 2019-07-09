import Taro, { Component } from "@tarojs/taro"
import { Block, View, Image } from "@tarojs/components"

import "./style.styl"
export default class Used extends Component {
  render() {
    return (
      <Block>
        <View className="abnormal used">
        <Image
          className="icon"
          src={require("../../../../static/images/ic_used.png")}
        />
        </View>
      </Block>
    )
  }
}
