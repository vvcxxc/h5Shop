import Taro, { Component } from "@tarojs/taro"
import { Block } from "@tarojs/components"
import CouponAppreciation from "./types/appreciation"
import CouponGroup from "./types/group"
import { TYPE_APPRECIATION } from "../../utils/constants"

export interface CouponProp {
  data: any;
  onAction: any;
  progress?: string;
}

export default class Coupon extends Component<CouponProp> {
  static defaultProps: CouponProp = {
    data: {
      type: -1,
    },
    onAction: null
  }

  /**
   * 计算: 进度条
   * @param user_count 不记得是啥了😢
   * @param total_num 也不记得了😢, 鬼懂啥意思
   */
  handleCalculate(user_count: number, total_num: number): string {
    const receive = user_count - total_num
    if (!receive) return "0%"
    return (receive / user_count * 100).toFixed(0) + "%"
  }

  /**
   * 点击集中处理(这里会做下处理, 这些接口返回的数据都tm不一样, 做个屁, 我吃柠檬, 如: list页面用的是id(券id), 有些又用youhui_id)
   */
  handleClick = (e: any) => {
    const { action, type } = e.currentTarget.dataset
    const {
      data: { youhui_id, id, activity_id, gift_id }
    } = this.props
    this.handleAction(action, {
      type,
      id: youhui_id || id,
      gift_id,
      activity_id
    })
  }

  /**
   * coupon组件动作处理
   */
  handleAction<T, U>(action: T, data: U) {
    const { onAction } = this.props
    onAction(action, data)
  }

  render() {
    const {
      data: { type, ...params }
    } = this.props
    const isAppreciation = type === TYPE_APPRECIATION
    return (
      <Block>
        {
          isAppreciation
            ? <CouponAppreciation
                data={params}
                onAction={this.handleClick}
                progress={this.handleCalculate(params.user_count, params.total_num)}
              />
            : <CouponGroup data={params} onAction={this.handleClick} />
        }
      </Block>
    )
  }
}
