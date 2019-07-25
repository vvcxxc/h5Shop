import Taro, { Component } from '@tarojs/taro';
import { View, Image, Text } from '@tarojs/components';
import './index.styl'
interface Props {
  list?:any
}
export default class VersionTwo extends Component<Props>{
  handleClick = (id: any) => {
    Taro.navigateTo({
      url: '/pages/business/index?id=' + id
    })
  }
  render() {
    let that = this.props.list
    return (
      <View className="version_two">
        < View className="show_box" onClick={this.handleClick.bind(this, that.id)}>

          <View className="title_top" >
            <Text>{that.name}</Text>
            <View className="into">
              <Image src={require('../../../assets/back.png')}/>
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
            <View className="activity_two">{that.distance}</View>
          </View >

          <View className="img_box">
            <Image src={that.preview || that.store_img_one || that.store_img_two} />
            <Image className="img" src={that.store_img_one || that.preview || that.store_img_two} />
            <Image src={that.store_img_two || that.preview || that.store_img_one} />
          </View>
        </View>
      </View>
    )
  }
}
