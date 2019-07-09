import Taro, { Component } from "@tarojs/taro"
import {
  Block,
  View,
  Text,
  Image,
  ScrollView,
  Button
} from "@tarojs/components"
import "./style.detail.appreciation.styl"
import "@/styles/iconfont.styl"
import { DetailProp } from "../detail"

export default class DetailAppreciation extends Component<DetailProp> {
  static defaultProps: DetailProp = {
    data: {},
    giftinfo: null,
    isChecked: false,
    isFreePostage: false,
    onAction() {},
    showButton: 1,
  }

  /**
   * 点击处理
   */
  handleClick(e) {
    const { action } = e.currentTarget.dataset
    const { onAction } = this.props
    onAction(action, null)
  }
  render() {
    const { data, giftinfo, isChecked, isFreePostage } = this.props
    const checkedStyle = isChecked
      ? "active-get-gift"
      : ""
    return (
      <Block>
        <View className="detail">
          <View className="container">
            <View className="area-block area-play">
              <View className="title" style="font-weight: normal;">
                增值玩法
              </View>
              <View className="content steps">
                <View className="item">
                  <View className="number">
                    1<View className="line" />
                  </View>
                  <View className="text">支付购买得券</View>
                </View>
                <View className="item">
                  <View className="number">
                    2<View className="line" />
                  </View>
                  <View className="text">邀请好友增值</View>
                </View>
                <View className="item">
                  <View className="number">3</View>
                  <View className="text">增值中也可消费</View>
                </View>
              </View>
            </View>
            <View className="area-coupon-info">
              <View className="title">
                <Text className="icon iconfont">&#xe605;</Text>
                <Text className="text">券信息</Text>
              </View>
              <View className="content">
                <View className="item supplier">
                  <Text className="iconfont icon-shangjia" />
                  {data.location_name || "暂无"}
                </View>
                <View className="item name">{data.name || "暂无"}</View>
                <View className="item brief">
                  {data.list_brief || "暂无"}
                </View>
                <Image className="item image" src={data.image} />
              </View>
            </View>
            <View className="area-attention">
              <View className="title">
                <Text className="icon iconfont">&#xe84c;</Text>
                <Text className="text">温馨提示</Text>
              </View>
              <View className="content">
                <View className="item">
                  <Text className="name">使用开始时间: </Text>
                  <Text className="text">
                    {`${data.begin_time || "未开始"} - ${data.end_time || "未开始"}`}
                  </Text>
                </View>
                <View className="item">
                  <Text className="name">使用规则:</Text>
                  <View className="content-sub">
                    {
                      data.description.map((item, index) => {
                        return (
                          <View className="item-sub" key={index}>
                            {item}
                          </View>
                        )
                      })
                    }
                  </View>
                </View>
              </View>
            </View>
            <View className="area-supplier-info">
              <View className="title">
                <Text className="icon iconfont">&#xe654;</Text>
                <Text className="text">商家介绍</Text>
              </View>
              <View className="content">
                <View className="avatar">
                  <Image className="icon" src={data.preview} />
                </View>
                <View className="description">
                  <View className="item">
                    {data.location_name || "暂无"}
                  </View>
                  <View className="item">{data.address || "暂无"}</View>
                </View>
              </View>
            </View>
            {
              giftinfo && (
                <View className="area-gift">
                  <View className="container">
                    <View className="title">
                      <Text className="icon iconfont">&#xe634;</Text>
                      <Text className="text">赠送礼品</Text>
                    </View>
                    <View className="content">
                      <View className="name">
                        <Text className="iconfont icon-lipin" />
                        {giftinfo.gift_title}
                      </View>
                      <ScrollView scrollX style="width: auto;">
                        <View
                          className="image-wrapper"
                          style="white-space: nowrap;"
                        >
                          {
                            giftinfo.image_details.map((item, index) => {
                              return <Image className="item" key={index} src={item} />
                            })
                          }
                        </View>
                      </ScrollView>
                    </View>
                  </View>
                  <View
                    className="view-detail"
                    data-action="view"
                    onClick={this.handleClick}
                  >
                    查看详情
                  </View>
                  <View
                    className="distribution"
                    data-action="checked"
                    onClick={this.handleClick}
                  >
                    <Text className={`iconfont ${checkedStyle}`}>&#xe77c;</Text>
                    {
                      isFreePostage
                        ? <Text>{`(免邮) ${giftinfo.gift_title}`}</Text>
                        : <Text>{`${giftinfo.gift_title} ${`(邮费${giftinfo.postage}元)`}`}</Text>
                    }
                  </View>
                </View>
              )
            }
            {
              this.props.showButton !== 1 &&
              <View className="area-buy">
                <View className="price">
                  <View className="text">
                    {`¥${data.pay_money || "0.00"}`}
                    {isChecked && giftinfo.postage ? ` + ${giftinfo.postage || ""}` : '' }
                  </View>
                  <View className="text">
                    {`起始金额 ￥${data.init_money || "0.00"} 最高增值 ¥${data.return_money || "0.00"}`}
                  </View>
                </View>
                <Button
                  className="action-buy"
                  data-action="get"
                  onClick={this.handleClick}
                >
                  立即购买
                </Button>
              </View>
            }
          </View>
        </View>
      </Block>
    )
  }
}
