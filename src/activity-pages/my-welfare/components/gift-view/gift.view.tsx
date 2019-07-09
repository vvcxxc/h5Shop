import Taro, { Component } from "@tarojs/taro"
import { Block, View, Image } from "@tarojs/components"
import "./style.styl"
export default class GiftView extends Component<{ data: any; onAction: any }> {
  static defaultProps = {
    data: {},
    onAction: null
  }

  /**
   * 点击事件
   */
  handleClick(e) {
    const { action } = e.currentTarget.dataset
    const { onAction } = this.props
    onAction(action)
  }
  render() {
    const { data } = this.props
    return (
      <Block>
        <View className="gift-view">
          <View className="gift-wrapper">
            <View className="avatar">
              <Image className="icon" src={data.cover_image} />
            </View>
            <View className="description" style="display: inline-block;">
              <View className="text">本礼品为邮寄类型</View>
              <View className='text'>礼品: {data.title}</View>
              <View className="text">{`配送公司: (${data.express_company || "无"})`}</View>
              <View className="text">{`配送单号: (${data.express_no || "无"})`}</View>
            </View>
            <View className="close" data-action="close" onClick={this.handleClick}>
              <Image className="icon" src={require("../../../../static/images/ic_close.png")} />
            </View>
          </View>
        </View>
      </Block>
    )
  }
}
