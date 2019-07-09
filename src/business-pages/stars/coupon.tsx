import Taro, { Component, ComponentOptions } from "@tarojs/taro";
import { View, ScrollView } from "@tarojs/components";
import { AtIcon } from "taro-ui";
import CashCoupon from "../../components/cash-coupon";
import "./coupon.styl";

interface Props {
  list: Array<any>;
}

/**收藏-优惠券列表 */
class Merchant extends Component<Props> {
  componentWillReceiveProps(props) {
  }

  static options: ComponentOptions = {
    addGlobalClass: true
  };

  state = {};

  render() {
    return (
      <ScrollView scrollY className="coupon">
        {this.props.list.map((_) => (
          <View className="coupon-item">
            <View className="head flex center">
              <AtIcon value="home" color="#666" />
              <View className="title item">杨大富的五金店</View>
              <AtIcon value="chevron-right" color="#999" />
            </View>
            <View className="coupon-component-wrap">
              <CashCoupon />
            </View>
            <View className="coupon-component-wrap">
              <CashCoupon />
            </View>
          </View>
        ))}
      </ScrollView>
    );
  }
}
export default Merchant;
