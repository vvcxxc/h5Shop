import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import { AtIcon } from 'taro-ui';
import './index.styl'
interface Props {
  list?: any,
  data?:any
}
export default class VersionThree extends Component<Props>{

  state = {

  }

  render() {
    let that = this.props.list
    let then = this.props.data
    console.log(this.props.data)
    return (
      <View className="version_three">
        < View className="show_box" >

          <View className="title_top" >
            <Text>{that.name}</Text>
            <View className="into">
              <Image src={require('../../../assets/back.png')} />
            </View>
          </View>

          <View className="distance_activity">
            <View className="distance_list">
              {
                that.label.map((item: any, index: number) => {
                  return <View className="distance">{item}</View>
                })
              }
            </View>
            <View className="activity">{that.distance}</View>
          </View >

          <View className="img_box">
            <View>
              <View className="img_list" >
                <View className="money">
                  <View className="pice">￥</View>
                  <View className="return_money">{then[0].return_money}</View>
                </View>
                <View className="full">满{then[0].total_fee}可用</View>
                <View className="ellipsis_text ellipsis-one" >{then.name}</View>
              </View>

            </View>

            <View className="img_list" style="margin:0px 10px;" >
              <View className="money">
                <View className="pice">￥</View>
                <View className="return_money">{then[1].return_money}</View>
              </View>
              <View className="full">满{then[1].total_fee}可用</View>
            </View>

            <View>
              <Image src={that.image} />
              <View className="ellipsis_text ellipsis-one" >50元rjkrkjwii优jiouoiuiuio惠券</View>
            </View> 

          </View>
        </View>
      </View>
    )
  }
}
