import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView, Input } from "@tarojs/components";
import "./index.styl";
import { AtIcon } from "taro-ui";


export default class PaySuccess extends Component {
  config = {
    navigationBarTitleText: "搜索"
  };

  state = {
  };

  componentWillMount() {
  }
  componentDidMount() {
  }

  render() {
    return (
        <View className="daily-recommend">
          <View className="flex search-input bcfff" >
              <Input value="华润万家" className="item"/>
          </View>
          <View className="sort-view bcfff flex">
              <View className="sort-text ">美食<Text className="triangle"></Text></View>
              <View className="sort-text ">附近<Text className="triangle"></Text></View>
              <View className="sort-text active">智能排序<Text className="triangle"></Text></View>
          </View>

          <ScrollView scrollY className="scroll-view">
            <View className="shop-cell">
              <View className="flex center shop-cell__bd">
                <Image className="image" src="http://www.w3school.com.cn/i/eg_tulip.jpg"/>
                <View className="item content ">
                  <View className="flex center mb10">  
                    <Text className="item">华润万家（广州东晓南121号店）</Text>
                    <AtIcon value="chevron-right" color="#999" size="16px"/>
                  </View>
                  <View className="flex center fs24 c666 mb10">
                    <Text>便利店</Text>
                    <Text>660m</Text>
                  </View>
                  <ScrollView scrollX>
                    <View className='scroll-flex'>
                      <Text className="tag-view active">免费礼品</Text>
                      <Text className="tag-view">优秀商家</Text>
                      <Text className="tag-view">现金券</Text>
                    </View>
                  </ScrollView>
                </View>
              </View>
              <View className="adv-cells">
                <Image className="image" src="http://www.w3school.com.cn/i/eg_tulip.jpg"/>
                <Image className="image" src="http://www.w3school.com.cn/i/eg_tulip.jpg"/>
              </View>
              <View className="present flex">
                <View className="label flex center">券</View>
                <View className="desc item">拼西西咖啡店(珞喻路)餐券<Text className="cc71d0b">送价值3000元</Text>耳机...</View>
                <View className="count">1.4万已领</View>
              </View>
            </View>
          </ScrollView>
        </View>
    );
  }
}
