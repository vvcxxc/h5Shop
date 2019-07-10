import Taro, { Component } from "@tarojs/taro"
import { Block, View, Image, Text } from "@tarojs/components"
import { getGiftinfo } from "@/api"
import "./style.styl"

interface GiftProp {
  data: any;
}
interface State {
  giftBasicInfo: any;
}
export default class Gift extends Component<GiftProp> {
  config = {
    navigationBarTitleText: "礼品详情"
  }
  static defaultProps: GiftProp = {
    data: null
  }

  state: State = {
    giftBasicInfo: {}
  }

  componentDidMount() {
    Taro.showShareMenu()

    const { gift_id = "", activity_id = "" } = this.$router.params
    this.fetchGiftinfo(activity_id, gift_id)
  }
  /**
   * 获取礼品信息
   */
  async fetchGiftinfo(activity_id: string, gift_id: string) {
    const params = {
      activity_id,
      gift_id
    }
    const { data } = await getGiftinfo(params)
    this.setState({
      giftBasicInfo: data
    })
  }
  render() {
    const { giftBasicInfo: data } = this.state
    return (
      <Block>
        <View className="gift">
          <View className="area-basic">
            <Image src={data.cover_image} className="image" />
            <View className="content description">
              <View className="name">{ data.gift_title }</View>
              <View className="score">
                <Text>{ data.integral }</Text>积分
              </View>
              <View className="status">
                <View className="item">{ `快递: ￥${data.postage}` }</View>
                <View className="item">{ `销量: ${data.sales}` }</View>
                <View className="item">{ `阅读数: ${data.view_count}` }</View>
              </View>
            </View>
          </View>
          <View className="split" />
          <View className="area-image">
            <View className="title">商品详情</View>
            <View className="content">
              {
                data.image_details.map((item, index) => {
                  return <Image className="item image" key={index} src={item} />
                })
              }
            </View>
          </View>
          <View className="split" />

        </View>
      </Block>
    )
  }
}
