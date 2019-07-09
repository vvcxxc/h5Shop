import Taro, { Component } from "@tarojs/taro"
import { Block, View, Text, Image, Button } from "@tarojs/components"
import "./style.activity.group.styl"
import { TYPE_GROUP } from "@/utils/constants"
import "@/styles/iconfont.styl"
interface ActivityGroupProp {
  data: any;
  onAction: any;
}
export default class ActivityGroup extends Component<ActivityGroupProp> {
  static defaultProps = {
    data: {},
    onAction: null
  }

  /**
   * 点击处理
   */
  handleClick(e) {
    const { action } = e.currentTarget.dataset
    const {
      onAction,
      data: { id }
    } = this.props
    onAction(action, {
      type: TYPE_GROUP,
      id
    })
  }
  render() {
    const {
      data: { participation_number, number, ...data }
    } = this.props
    const isGroupFinish = participation_number === number
    const desc = isGroupFinish
      ? "拼团完成"
      : "邀请好友参团"
    return (
      <Block>
        <View className="activity-item">
          <View className="area-time">
            <View className="start">{data.created_at}</View>
            <View>剩余时间:
              <Text className="surplus-time">{data.active_end_time}</Text>
            </View>
          </View>
          <View
            className="area-info"
            data-action="jump"
            onClick={this.handleClick}
          >
            <View className="avatar">
              <Image className="icon" src={data.image} />
            </View>
            <View className="description">
              <View className="item">{data.name}</View>
              <View className="item participator-wrapper">
                {
                  data.head_list.map((item, index) => {
                    return (
                      <Image
                        className="participator"
                        key={index}
                        src={item}
                      />
                    )
                  })
                }
              </View>
              <View className="item group">
                <Text className="number">{`${number}人团:`}</Text>
                <Text className="amount">{data.participation_money}</Text>
              </View>
            </View>
          </View>
          <View className="area-bottom">
            <View className="desc">
              <Text className="iconfont">&#xe601;</Text>
              <Text className="text">
                {
                  isGroupFinish
                    ? ` ${desc}!`
                    : ` 还剩${number - participation_number}人成团`
                }
              </Text>
            </View>
            {
              isGroupFinish
                ? <Button className="action">{desc}</Button>
                : <Button
                    className="action"
                    openType="share"
                    data-id={data.id}
                    data-image={data.image}
                    data-title={data.name}
                  >
                    {desc}
                  </Button>
            }
          </View>
        </View>
      </Block>
    )
  }
}
