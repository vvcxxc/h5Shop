import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView, Button } from "@tarojs/components";
import "./index.styl";
import { AtIcon } from "taro-ui";

import MobileImg from '../../assets/dianhua.png'
import AddressImg from '../../assets/address.png'


export default class PaySuccess extends Component {
  config = {
    navigationBarTitleText: "支付结果"
  };

  state = {
    image: [0,0,0,0],
    recommend: [0,0,0,0],
    recommendMore: [0,0,0,0]
  };

  componentWillMount() {
  }
  componentDidMount() {
  }

  render() {
    return (
        <View className="merchant-details">
            <View className="shop bcfff">
              <View className="flex center top-view">
                <View className="item">
                  <View className="name">店铺的名称</View>
                  <View className="money">人均：￥62</View>
                </View>
                <Image className="image" src={MobileImg}/>
              </View>
              <ScrollView scrollX className="scroll-view">
                <View className="flex">
                  {
                    this.state.image.map((_) => (<Image className="image" src="http://www.w3school.com.cn/i/eg_tulip.jpg"/>))
                  }
                </View>
              </ScrollView>
              <View className="address flex center">
                  <Image className="address-img" src={AddressImg}/>
                  <View className="text item">海珠区瑞宝南路东晓胜汇里商业步行街（东晓南地铁站B出口对面）</View>
                  <Image className="mobile-img" src={MobileImg}/>
              </View>
            </View>
            <View className="group-purchase bcfff">
              <View className="hd">
                <View className="merchant-details__tit">
                  <Text className="mark">礼</Text>
                  <Text className="fwb">拼团送好礼</Text>
                </View>
                <View className="flex center">
                  <View className="item desc">拼团活动名称拼团活动名称拼团</View>
                  <View className="count">3人团</View>
                </View>
              </View>
              <View className="image-list">
                <Image className="image" src="http://www.w3school.com.cn/i/eg_tulip.jpg"/>
                <Image className="image" src="http://www.w3school.com.cn/i/eg_tulip.jpg"/>
              </View>
              <View className="ft ">
                <View className="flex center">
                  <View className="item">
                    <Text className="money">￥100</Text>
                    <Text className="count">已拼2000件</Text>
                  </View>
                  <Button className="btn-go">去开团</Button>
                </View>
                <View className="ft-more flex center">查看更多<AtIcon value="chevron-right" color="#999" size="16px"/></View>
              </View>
            </View>
            <View className="bcfff ticket">
                <View className="merchant-details__tit">
                  <Text className="mark bc5D84E0">券</Text>
                  <Text className="fwb">现金券</Text>
                </View>
                <View className="ticket-view flex center">
                  <View className="left">
                    <View className="money">¥50 满199可用</View>
                    <View className="desc">购买后6天内有效/法定节假日不可用/可叠加</View>
                    <View className="sales">本年销量 6万+</View>
                  </View>
                  <View className="right">
                    <View className="money">￥<Text>10</Text></View>
                    <Button className="btn-buy">立即购买</Button>
                  </View>
                </View>
                <View className="ft-more flex center">查看更多<AtIcon value="chevron-right" color="#999" size="16px"/></View>
            </View>
            <View className="discounts-view bcfff">
                <View className="merchant-details__tit">
                  <Text className="mark bc5D84E0">惠</Text>
                  <Text className="fwb">优惠信息</Text>
                </View>
                <View className="discounts-cells">
                  <View className="discounts-cell flex center">
                    <Image className="image" src="http://www.w3school.com.cn/i/eg_tulip.jpg" />
                    <View className="discounts-cell__bd item">
                      <View className="tit">xxxx爽肤套装</View>
                      <View className="desc">券的相关介绍券的相关介绍相关介绍...</View>
                      <View className="flex center">
                        <View className="money">￥126</View>
                        <View className="count">本年销量 6万+</View>
                        <Button className="btn-buy">立即购买</Button>
                      </View>
                    </View>
                  </View>
                </View>
                <View className="ft-more flex center">查看更多<AtIcon value="chevron-right" color="#999" size="16px"/></View>
            </View>
            <View className="recommend-view bcfff">
                <View className="merchant-details__tit">
                  <Text className="fwb">附近推荐</Text>
                </View>
                <View className="recommend-cells">
                  {
                    this.state.recommend.map((_) => (
                      <View className="recommend-cell flex center">
                    <Image className="image" src="http://www.w3school.com.cn/i/eg_tulip.jpg" />
                    <View className="recommend-cell__bd item">
                      <View className="tit">xxxx爽肤套装</View>
                      <View className="flex center mb33">
                        <Text>券的介绍内容区域</Text>
                        <Text>洛溪 923m</Text>
                      </View>
                      <View className="flex center">
                        <Text>￥72.0</Text>
                        <Text>已售123</Text>
                      </View>
                    </View>
                  </View>
                    ))
                  }
                </View>
            </View>
            <View className="recommend-view bcfff" style="margin-top: 0;">
                <View className="merchant-details__tit">
                  <Text className="fwb">附近推荐</Text>
                </View>
                <View className="recommend-cells">
                  {
                    this.state.recommendMore.map((_) => (
                      <View className="recommend-cell flex center">
                    <Image className="image" src="http://www.w3school.com.cn/i/eg_tulip.jpg" />
                    <View className="recommend-cell__bd item">
                      <View className="tit">xxxx爽肤套装</View>
                      <View className="flex center mb33">
                        <Text>券的介绍内容区域</Text>
                        <Text>洛溪 923m</Text>
                      </View>
                      <View className="flex center">
                        <Text>￥72.0</Text>
                        <Text>已售123</Text>
                      </View>
                    </View>
                  </View>
                    ))
                  }
                </View>
            </View>
        </View>
    );
  }
}
