import Taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";
import Tabs from "../../components/tabs";
import Merchant from "./merchant";
import Coupon from "./coupon";
import "./index.styl";

export default class Stars extends Component {
  config = {
    navigationBarTitleText: "我的收藏"
  };

  state = {
    current: 0,
    merchantList: [, , , , , ,],
    couponList: [, , , , , ,]
  };
  handerTabChange(current) {
    Taro.pageScrollTo({ scrollTop: 0 });
    this.setState({ current });
    this.getData(current);
  }
  getData(current) {
    Taro.showLoading();
    setTimeout(() => {
      // this.setState({ merchantList: [1, 1, 1, 1, 1, 1] });
      Taro.hideLoading();
    }, 1000);
  }
  render() {
    const list = ["商家", "优惠券"];
    return (
      <View className="stars flex column">
        <Tabs list={list} onChange={this.handerTabChange.bind(this)} />
        <View className="item">
          {this.state.current === 0 && (
            <Merchant list={this.state.merchantList} />
          )}
          {this.state.current === 1 && <Coupon list={this.state.couponList} />}
        </View>
      </View>
    );
  }
}
