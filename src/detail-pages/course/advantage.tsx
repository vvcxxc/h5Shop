import Taro, { Component, Config } from '@tarojs/taro'
import './index.styl'
import {
  Image, View
} from '@tarojs/components'

export default class Advantage extends Component {
  config: Config = {
    navigationBarTitleText: "商家入驻优势",
    // enablePullDownRefresh: true
  }
  state = {

  }

  render() {
    return (
      <View className='advantage-page'>
        <Image className='img1' src='http://oss.tdianyi.com/public/advantage/1.jpg'/>
        <Image className='img2' src='http://oss.tdianyi.com/public/advantage/2.jpg'/>
        <Image className='img3' src='http://oss.tdianyi.com/public/advantage/3.jpg'/>
        <Image className='img4' src='http://oss.tdianyi.com/public/advantage/5.jpg'/>
        <Image className='img5' src='http://oss.tdianyi.com/public/advantage/6.jpg'/>
        <Image className='img6' src='http://oss.tdianyi.com/public/advantage/7.jpg'/>
      </View>
    )
  }
}
