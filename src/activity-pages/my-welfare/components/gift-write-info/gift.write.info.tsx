import Taro, { Component } from "@tarojs/taro"
import { Block, Image, Button, View, Text, Input } from "@tarojs/components"
import "./style.styl"

export default class GiftWriteInfo extends Component<{data: any; onWrite: any; onAction: any}> {
  static defaultProps = {
    data: null,
    onWrite: null,
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
    const { data, onWrite } = this.props
    return (
      <Block>
        <View className="gift-write-info">
          <View className="container">
            <View className="avatar" style={`background-image: url(${require("../../../../static/images/img_gift.png")})`}>
              <Image className="icon" src={data.cover_image} />
              <Text className="text">本礼品为邮寄类型</Text>
              <Text className="text">请认真填写您的收货地址</Text>
            </View>
            <View className="area-write">
              <Input type="text" onInput={onWrite} data-type="receiver_name" value="" placeholder="请输入您的姓名" className="item" />
              <Input type="text" onInput={onWrite} data-type="receiver_phone" value="" placeholder="请输入您的联系方式" className="item" />
              <Input type="text" onInput={onWrite} data-type="receiver_address" value="" placeholder="请输入您的详细地址" className="item" />
            </View>
            <Button className="action" data-action="submit" onClick={this.handleClick}>确认提交</Button>
            <View className="close" data-action="close" onClick={this.handleClick}>
              <Image className="icon" src={require("../../../../static/images/ic_close_2.png")}></Image>
            </View>
          </View>
        </View>
      </Block>
    )
  }
}
