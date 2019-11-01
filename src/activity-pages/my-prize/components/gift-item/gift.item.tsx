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
  handleClick =(e)=> {
    const { action } = e.currentTarget.dataset
    const { data, onAction } = this.props
    onAction(action, data)
  }
  render() {
    console.log('111',this.props);
    const { data } = this.props
    return (
      <Block>
        <View className="gift-item">
          <View className="avatar">
            <Image className="icon" src={data.avatar} />
          </View>
          <View className="description">
            <Text className="item name">{data.prize_name}</Text>
            <Text className="item brief">{data.user_name}</Text>
            <Text className="item remark">{data.exceed_at}</Text>
          </View>
          <View className="actions" >
            <View className="item" >
             <Button className="item view" data-action="view" onClick={this.handleClick} style={{background:'linear-gradient(90deg,#FE7450,#FF2614)',color:"#fff"}} >查看二维码</Button>
            </View>
          </View>
        </View>
      </Block>
    )
  }
}
