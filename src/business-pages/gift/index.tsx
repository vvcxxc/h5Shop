import Taro, { Component } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import GiftItem from "./components/gift-item";
import GiftItemDetails from "./components/gift-item-details";
import "./index.styl";

export default class Gift extends Component {
  config = {
    navigationBarTitleText: "我的礼物"
  };

  state = {
    giftList: [],
    status: false,
    orderid: 0
  };

  componentWillMount() {
    this.setState({ giftList: [1, 1, 1, 1, 1, 1, 1, 1] });
  }
  componentDidMount() {}

  render() {
    return (
      <View>
        <ScrollView scrollY className="gift">
          {this.state.giftList.map((_) => (
            <View className="gift-item">
              <View className="head flex center">
                <AtIcon value="home" color="#666" />
                <View className="title item">杨大富的五金店</View>
                <AtIcon value="chevron-right" color="#999" />
              </View>
              <View className="body">
                <GiftItem />
                <GiftItem />
              </View>
            </View>
          ))}
        </ScrollView>
        {
          this.state.status?(<GiftItemDetails status={this.state.status} orderid={this.state.orderid} />):("")
        }
      </View>
    );
  }
}
