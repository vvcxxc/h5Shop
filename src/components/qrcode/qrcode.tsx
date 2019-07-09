import Taro, { Component } from "@tarojs/taro"
import { Block, View, Image } from "@tarojs/components"
import "./style.styl"

export default class QRcode extends Component<{data: any; onAction: any}> {

  /**
   * 阻止冒泡?
   */
  handlePrevent(e) {
    e.stopPropagation()
  }
  render() {
    const { onAction, data } = this.props
    return (
      <Block>
        <View className="qrcode" data-action="close" onClick={onAction}>
          <View className="container" onClick={this.handlePrevent}>
            <View className="title">商家扫描券码即可消费</View>
            <Image className="image" src={data}></Image>
            <Image
              className="close"
              src={require("../../static/images/ic_close.png")}
              data-action="close"
              onClick={onAction}
            />
          </View>
        </View>
      </Block>
    )
  }
}
