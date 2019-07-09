import Taro, { Component, ComponentOptions } from "@tarojs/taro";
import { View, Image, ScrollView } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import "./merchant.styl";

interface Props {
  list: Array<any>;
}

/**收藏-商家列表 */
class Merchant extends Component<Props> {
  componentWillReceiveProps(props) {
  }

  static options: ComponentOptions = {
    addGlobalClass: true
  };

  state = {};

  render() {
    return (
      <ScrollView scrollY className="merchant">
        {this.props.list.map((_, index) => (
          <View className="merchant-item flex">
            <Image
              className="img"
              src="http://wx3.sinaimg.cn/large/006Cmetyly1flfle1mivuj30d20d2aat.jpg"
            />
            <View className="item">
              <View className="flex center title">
                <View className="item">华润万家（广州东晓南121号店）</View>
                <View className="icon">
                  <AtIcon value="chevron-right" color="#999" />
                </View>
              </View>
              <View className="info flex center">
                <View className="info-type item">便利店</View>
                <View className="info-distance">660m</View>
              </View>
              <View className="labels flex">
                <View className="label">优秀商家</View>
                <View className="label">现金券</View>
              </View>
              <View className="btn-box flex right">
                <View className="btn">取消收藏</View>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  }
}
export default Merchant;
