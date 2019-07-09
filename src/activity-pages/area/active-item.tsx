import Taro, { PureComponent } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";

import "./style.scss";

class AreaActiveItem extends PureComponent {
  state = {};

  render() {
    return (
      <View className="active-item flex center">
        <Image src={require("./7.png")} className="check-icon" />
        <View className="item">
          <View className="flex title">
            <View>杨大富</View>
            <View className="phone">15628954784</View>
            <View className="tag">默认</View>
          </View>
          <View className="area-detail">
            北京市东城区长安街00001号门头沟拐弯 三岔路头子口
          </View>
        </View>
        <Image className="edit-icon" src={require("./8.png")} />
      </View>
    );
  }
}
export default AreaActiveItem;
