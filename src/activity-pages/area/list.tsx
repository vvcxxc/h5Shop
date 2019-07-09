import Taro, { PureComponent } from "@tarojs/taro";
import { View } from "@tarojs/components";
import AreaItem from "./item";
import './style.scss'

interface Props {
  list: Array<any>;
}

class AreaList extends PureComponent<Props> {
  render() {
    const list = this.props.list.map(_ => (
      <View className="item-line">
        <AreaItem key={_.id} item={_} />
        <View className="line">
          <View className="content"></View>
        </View>
      </View>
    ));
    return <View>{list}</View>;
  }
}
export default AreaList;
