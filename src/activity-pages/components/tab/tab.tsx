import Taro, { Component } from "@tarojs/taro"
import { Block, View, ScrollView } from "@tarojs/components"
import "./style.tab.styl"
interface TabProp {
  data: any[];
  current?: string | number;
  onToggle?: any;
}
interface State {
  checked: string;
}
export default class Tab extends Component<TabProp> {
  static defaultProps: TabProp = {
    data: [
      {
        text: "待使用"
      },
      // {
      //   text: "全部"
      // },
      {
        text: "已使用"
      },
      {
        text: "已过期"
      }
    ],
    current: 0,
    // 小程序里面要添加默认值!!, 不添加不行啊 😢 --- 2019-1-7
    onToggle: null
  }
  state: State = {
    checked: ""
  }
  handleToggle = e => {
    const { index } = e.currentTarget.dataset
    this.setState({
      checked: index
    })
    this.props.onToggle(index)
  }
  render() {
    const { data } = this.props
    const { checked } = this.state
    return (
      <Block>
        <View className="tab">
          <ScrollView
            scrollX
            style="width: auto; border-bottom: 1px solid #E5E5E5;"
          >
            <View className="tab-wrapper">
              {
                data.map((item, index) => {
                  const checkedStyle = +checked === index ? "checked" : ""
                  return (
                    <View
                      className={`item ${checkedStyle}`}
                      key={index}
                      data-index={index}
                      onClick={this.handleToggle}
                    >
                      {item.text}
                      <View className="underline" />
                    </View>
                  )
                })
              }
            </View>
          </ScrollView>
        </View>
      </Block>
    )
  }
}
