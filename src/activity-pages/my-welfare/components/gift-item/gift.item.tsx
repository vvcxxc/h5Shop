import Taro, { Component } from "@tarojs/taro"
import { Block, View, Image, Text, Button } from "@tarojs/components"
import "./style.styl"
export default class GiftItem extends Component<{ data: any; onAction: any }> {

  static defaultProps = {
    data: {},
    onAction: null
  }

  /**
   * 点击事件
   */
  handleClick(e) {
    const { action } = e.currentTarget.dataset
    const { data, onAction } = this.props
    onAction(action, data)
  }
  render() {
    const { data } = this.props
    const isGet = !data.receiver_address || !data.receiver_name || !data.receiver_phone
    return (
      <Block>
        <View className="gift-item">
          <View className="avatar">
            <Image className="icon" src={data.cover_image} />
          </View>
          <View className="description">
            <Text className="item name">{data.title}</Text>
            <Text className="item brief">类型: 实物</Text>
            <Text className="item remark">{data.created_at}</Text>
          </View>
          <View className="actions">
            <View className="item">
            {
              isGet
                ? <Button className="item get active" data-action="get" onClick={this.handleClick}>领取</Button>
                : <Button className="item view" data-action="view" onClick={this.handleClick}>查看</Button>
            }
            </View>
          </View>
        </View>
      </Block>
    )
  }
}
