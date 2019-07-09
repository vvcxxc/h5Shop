import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import "./index.styl";

interface Props {
  /**默认当前高亮的索引值 */
  defaultCurrent?: number;
  list: any;
  onChange: (number) => any;
}
export default class Tabs extends Component<Props> {
  constructor(props) {
    super(props);
    this.state.current = props.defaultCurrent || 0;
  }

  state = {
    current: 0
  };

  handlerTablChange(current, id, _this) {
    this.setState({ current });
    this.props.onChange(id);
  }
  render() {
    return (
      <View className="tab flex">
        {this.props.list.map((item, index) => (
          <View
            key={" "}
            className={
              "item flex center " +
              (this.state.current === index ? "active" : "")
            }
            onClick={this.handlerTablChange.bind(this, index,item.id)}
          >
            
            <View className="label">{item.name}</View>
          </View>
        ))}
      </View>
    );
  }
}
