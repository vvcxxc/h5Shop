import Taro, { Component, Config } from '@tarojs/taro'
import './index.styl'
import {
  Image, View
} from '@tarojs/components'

export default class GroupStrategy extends Component {
  config: Config = {
    navigationBarTitleText: "建群攻略",
    // enablePullDownRefresh: true
  }
  state = {

  }

  render() {
    return (
      <View className='group-strategy-page'>
        <Image className='img1' src='http://oss.tdianyi.com/public/group_strategy/1.jpg'/>
        <Image className='img2' src='http://oss.tdianyi.com/public/group_strategy/2.jpg'/>
        <Image className='img3' src='http://oss.tdianyi.com/public/group_strategy/3.jpg'/>
        <Image className='img4' src='http://oss.tdianyi.com/public/group_strategy/4.jpg'/>
        <Image className='img5' src='http://oss.tdianyi.com/public/group_strategy/5.jpg'/>
        <Image className='img6' src='http://oss.tdianyi.com/public/group_strategy/6.jpg'/>
        <Image className='img7' src='http://oss.tdianyi.com/public/group_strategy/7.jpg'/>
        <Image className='img8' src='http://oss.tdianyi.com/public/group_strategy/8.jpg'/>
      </View>
    )
  }
}
