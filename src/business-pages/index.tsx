import Taro, { PureComponent, ComponentOptions } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";

import "./index.styl";

class GiftItem extends PureComponent {
  state = {};

  static options: ComponentOptions = {
    addGlobalClass: true
  };

  handlerClick() {
    Taro.showModal({
      title: "提示",
      content: "打开物流或者其他弹窗"
    });
  }

  render() {
    return (
      <View className="gift-item-scoped flex center">
        <Image
          className="image"
          src="http://wx3.sinaimg.cn/large/006Cmetyly1flfle1mivuj30d20d2aat.jpg"
        />
        <View className="item">
          <View className="title flex">
            <View className="item">礼品名称</View>
            <View className="status">待领取</View>
          </View>
          <View className="info info-first">社团活动获得</View>
          <View className="flex bottom">
            <View className="info item">2019.2.10 20:50</View>
            <View className="btn" onClick={this.handlerClick.bind(this)}>
              查看
            </View>
          </View>
        </View>
      </View>
    );
  }
}
export default GiftItem;
