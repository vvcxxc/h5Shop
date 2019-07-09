import Taro, { Component } from "@tarojs/taro"
import {
  Block,
  View,
  Text,
  Image,
  ScrollView,
  Button
} from "@tarojs/components"
import "./style.detail.group.styl"
import "@/styles/iconfont.styl"

import { DetailProp } from "../detail"
export default class DetailAppreciation extends Component<DetailProp> {
  static defaultProps: DetailProp = {
    data: null,
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
                拼团玩法
              </View>
              <View className="content steps">
                <View className="item">
                  <Text className="icon iconfont">&#xe600;</Text>
                  支付开团或参团
                </View>
                <View className="item">
                  <Text className="icon iconfont">&#xe600;</Text>
                  邀请好友参团
                </View>
                <View className="item">
                  <Text className="icon iconfont">&#xe600;</Text>
                  到达拼团人数
                </View>
                <View className="item">拼团成功得券</View>
              </View>
            </View>
            <View className="area-coupon-info">
              <View className="title">
                <Text className="icon iconfont">&#xe605;</Text>
                <Text className="text">券信息</Text>
              </View>
              <View className="content">
                <View className="item supplier">
                  {data.name || "暂无"}
                </View>
                <View className="item name">{data.youhui_name || "暂无"}</View>
                <View className="item brief">
                  <Text className="classify">{`${data.number}人团`}</Text>
                  <Text className="text">{data.list_brief || "暂无"}</Text>
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
                    {`${data.begin_time}-${data.end_time}`}
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
                    {data.name || "暂无"}
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
                        : <Text>{`(邮费 ${giftinfo.postage} 元) ${giftinfo.gift_title}`}</Text>
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
                  {`¥${data.participation_money}`}
                  {!isFreePostage && isChecked && giftinfo.postage && (<Block>{` + ${giftinfo.postage || ''}`}</Block>)}
                </View>
                <View className="text">原价{data.pay_money || "0.00"}元</View>
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
