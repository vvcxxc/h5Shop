import Taro, { PureComponent } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";

import "./style.scss";

class AreaItem extends PureComponent<any> {
  state = {};

  render() {
    return (
      <View className="active-item flex center">
        <View className="item">
          <View className="flex title">
            <View>杨大富</View>
            <View className="phone">15628954784</View>
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
export default AreaItem;
