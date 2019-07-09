import Taro, { Component } from "@tarojs/taro"
import { Block } from "@tarojs/components"
import { TYPE_APPRECIATION } from "@/utils/constants"
import OrderAppreciation from "./types/appreciation"
import OrderNormal from "./types/normal"

export interface OrderProp {
  data: any;
  onAction: any;
}
export default class OrderComponent extends Component<OrderProp> {

  static defaultProps = {
    data: {},
    onAction: null
  }

  /**
   * 点击集中处理
   */
  handleClick = (e: any) => {
    const { action } = e.currentTarget.dataset
    const { onAction, data: { type, id } } = this.props
    onAction(action, {
      type,
      id
    })
  }

  /**
   * 计算进度条
   */
  handleCalculateProgress(): string {
    const {
      init_money: initMoney,
      return_money: maxMoney,
      appreciation_money
    } = this.props.data
    return ((+initMoney + +appreciation_money) / maxMoney * 100).toFixed(0) + "%"
  }

  /**
   * 使用情况
   * type_status = 2 为已使用
   */
  handleCalculateUsed(type_status: string): boolean {
    return +type_status === 2
  }

  /**
   * 过期情况
   * type_status = 3 为已过期
   */
  handleCalculateOverDue(type_status: string): boolean {
    return +type_status === 3
  }
  render() {
    const {
      data: { type, type_status, ...rest }
    } = this.props
    const isUsed = this.handleCalculateUsed(type_status)
    const isOverDue = this.handleCalculateOverDue(type_status)
    return (
      <Block>
        {
          type === TYPE_APPRECIATION
            ? <OrderAppreciation
                data={rest}
                progress={this.handleCalculateProgress()}
                isUsed={isUsed}
                isOverDue={isOverDue}
                onAction={this.handleClick}
              />
            : <OrderNormal
                data={rest}
                isUsed={isUsed}
                isOverDue={isOverDue}
                onAction={this.handleClick}
              />
        }
      </Block>
    )
  }
}
