import Taro, { Component, Config } from '@tarojs/taro';
import { View, Image, Swiper, SwiperItem, Text } from '@tarojs/components';
import './index.styl';

export default class Announcement extends Component<any> {

    state = {
        reportCurrent: 0
    }
    // handleChange(e) {
    //     setTimeout(() => {
    //         console.log('009', e.detail.current)
    //         this.setState({ reportCurrent: e.detail.current })
    //     }, 5000)
    // }
    render() {
        return (
            <View className='bulletin-box'>
                <View className='bulletin-text'>
                    <Image src={require('@/assets/index/bulletin.png')} className='bulletin-img' /> |
                </View>
                <Swiper
                    className='bulletin swiper-no-swiping'
                    indicatorColor='#999'
                    indicatorActiveColor='#333'
                    circular
                    vertical
                    interval={5000}
                    autoplay
                    // key={this.state.reportCurrent}
                    // onChange={this.handleChange.bind(this)}
                >
                    <SwiperItem>
                        <View className='bulletin-item'>小熊敬礼进驻江门新会商圈!!!<Image className='right-icon' src={require('@/assets/index/right-icon.png')} /></View>
                    </SwiperItem>
                    <SwiperItem>
                        <View className='bulletin-item'>商家免费进驻，获取海量流量!!!<Image className='right-icon' src={require('@/assets/index/right-icon.png')} /></View>
                    </SwiperItem>
                </Swiper>
            </View>
        )
    }

}
