import Taro, { Component, Config } from '@tarojs/taro'
import './index.styl'
import {
  Image, View
} from '@tarojs/components'

export default class MakeMoneyPlan extends Component {
  config: Config = {
    navigationBarTitleText: "赚钱计划",
    // enablePullDownRefresh: true
  }
  state = {

  }

  goto = () => {
    Taro.navigateTo({
      url: '/detail-pages/course/newbie'
    })
  }

  render() {
    return (
      <View className='makeMoneyPlan-page'>
        <Image className='img1' src='http://oss.tdianyi.com/public/make_money_plan/1.jpg'/>
        <Image className='img2' src='http://oss.tdianyi.com/public/make_money_plan/2.jpg'/>
        <Image className='img3' src='http://oss.tdianyi.com/public/make_money_plan/3.jpg'/>
        <Image className='img4' src='http://oss.tdianyi.com/public/make_money_plan/4.jpg'/>
        <Image className='img5' onClick={this.goto} src='http://oss.tdianyi.com/public/make_money_plan/5.jpg'/>
        <Image className='img6' src='http://oss.tdianyi.com/public/make_money_plan/6.jpg'/>
        <Image className='img7' src='http://oss.tdianyi.com/public/make_money_plan/7.jpg'/>
        <Image className='img8' src='http://oss.tdianyi.com/public/make_money_plan/8.jpg'/>
        <Image className='img9' src='http://oss.tdianyi.com/public/make_money_plan/9.jpg'/>
        <Image className='img10' src='http://oss.tdianyi.com/public/make_money_plan/10.jpg'/>
        <Image className='img11' src='http://oss.tdianyi.com/public/make_money_plan/11.jpg'/>
      </View>
    )
  }
}
