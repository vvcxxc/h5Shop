import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast } from "taro-ui"
import { View, Text, Image, ScrollView, Button } from "@tarojs/components";
import "./index.less";
import request from '../../services/request'
import { Swiper, SwiperItem } from '@tarojs/components'
import ActivityItem from '@/components/activity-item'
import ApplyToTheStore from '@/components/applyToTheStore'

export default class StoreDetail extends Component {
  config = {
    navigationBarTitleText: "",
    enablePullDownRefresh: false
  };


  state = {
    bannerImgIndex: 0,
    imgs: [
      "http://oss.tdianyi.com/front/t4nspcwf3Dbb722DKrGHBaahDcXbJeMj.png",
      "http://oss.tdianyi.com/front/2tp2Gi5MjC47hd7mGBCjEGdsBiWt5Wec.png",
      "http://oss.tdianyi.com/front/t4nspcwf3Dbb722DKrGHBaahDcXbJeMj.png",
    ]
  };


  render() {
    return (
      <View className="store-info-detail">
        <Swiper
          onChange={(e) => {
            this.setState({ bannerImgIndex: e.detail.current })
          }}
          className='store-banner'
          circular
          autoplay
        >
          {
            this.state.imgs ? this.state.imgs.map((item, index) => {
              return (
                <SwiperItem className="store-banner-swiperItem" key={item}>
                  <Image className="store-banner-img" src={item} />
                </SwiperItem>
              )
            }) : null
          }
        </Swiper>
        <View className="banner-number-box">
          <View className="banner-number">{Number(this.state.bannerImgIndex) + 1}</View>
          <View className="banner-number">{this.state.imgs.length}</View>
        </View>
        {/* <View className="collect-box">
                    <Image className="collect-img" src="http://oss.tdianyi.com/front/7mXMpkiaD24hiAEw3pEJMQxx6cnEbxdX.png" />
                </View>
                <View className="share-box">
                    <Image className="share-img" src="http://oss.tdianyi.com/front/Af5WfM7xaAjFHSWNeCtY4Hnn4t54i8me.png" />
                </View> */}
        <View className="store-content">
          <View className="store-info">
            <ApplyToTheStore
              isTitle={false}
              img={'http://oss.tdianyi.com/front/t4nspcwf3Dbb722DKrGHBaahDcXbJeMj.png'}
              name={'灰喉'}
              phone={'14255552222'}
              address={'球科技馆i2'}
              location={{ xpoint: 111, ypoint: 222 }}
            />
          </View>
        </View>
        <View className="activity-content">
          <View className="activity-box">
            <View className='apply-title-box'>
              <View className='apply-title-left'></View>
              <View className='apply-title'>适用店铺</View>
            </View>
            <View className="activity-item-padding">
              <ActivityItem
                imgIconType={'group'}
                img={'http://oss.tdianyi.com/front/t4nspcwf3Dbb722DKrGHBaahDcXbJeMj.png'}
                label={'2人团'}
                name={'2人拼团抢汽车美容一二三四五六'}
                brief={'有效期：7天有效'}
                oldPrice={'29.99'}
                newPrice={'99.99'}
                btnText={'拼团'}
                handleClick={() => { }}
              />
            </View>
            <View className="activity-item-padding">
              <ActivityItem
                imgIconType={'appre'}
                img={'http://oss.tdianyi.com/front/t4nspcwf3Dbb722DKrGHBaahDcXbJeMj.png'}
                label={'2人团'}
                name={'2人拼团抢汽车美容一二三四五六'}
                brief={'有效期：7天有效'}
                oldPrice={'29.99'}
                newPrice={'99.99'}
                btnText={'拼团'}
                handleClick={() => { }}
              />
            </View>
            <View className="activity-item-padding">
              <ActivityItem
                imgIconType={'goods'}
                img={'http://oss.tdianyi.com/front/t4nspcwf3Dbb722DKrGHBaahDcXbJeMj.png'}
                label={'2人团'}
                name={'2人拼团抢汽车美容一二三四五六'}
                brief={'有效期：7天有效'}
                oldPrice={'29.99'}
                newPrice={'99.99'}
                btnText={'拼团'}
                handleClick={() => { }}
              />
            </View>
            <View className="activity-item-padding">
              <ActivityItem
                imgIconType={'cash'}
                img={'http://oss.tdianyi.com/front/t4nspcwf3Dbb722DKrGHBaahDcXbJeMj.png'}
                longName={'2人拼团抢汽车美容一二三四五六'}
                brief={'有效期：7天有效'}
                oldPrice={'29.99'}
                newPrice={'99.99'}
                btnText={'抢购'}
                unBtnText={'已参与99'}
                handleClick={() => { }}
              />
            </View>

          </View>

        </View>

        <View className="other-store-content">
          <View className="other-store-box">
            <View className='apply-title-box'>
              <View className='apply-title-left'></View>
              <View className='apply-title'>附近推荐</View>
            </View>



            <View className="other-store-item">
              <View className="item-img-box">
                <Image className="item-img" src="http://oss.tdianyi.com/front/t4nspcwf3Dbb722DKrGHBaahDcXbJeMj.png" />
              </View>
              <View className="item-info">
                <View className="item-title">
                  <View className="item-long-name">汽车美容一家</View>

                </View>
                <View className="item-brief">o汽车美容</View>
                <View className="item-info-label">
                  <View className="labels-box">免费礼品</View>
                  <View className="labels-box">优秀商家</View>
                  <View className="labels-box">现金券</View>
                </View>
              </View>
              <View className="item-distance-box">
                <Image className="item-distance-icon" src="http://oss.tdianyi.com/front/D3ZdAXB2fKQpQeby2jb4WNA4M7FM2KQn.png" />
                <View className="item-distance-info">洛溪 923m</View>
              </View>
            </View>

            <View className="other-store-item">
              <View className="item-img-box">
                <Image className="item-img" src="http://oss.tdianyi.com/front/t4nspcwf3Dbb722DKrGHBaahDcXbJeMj.png" />
              </View>
              <View className="item-info">
                <View className="item-title">
                  <View className="item-long-name">汽车美容一家</View>

                </View>
                <View className="item-brief">o汽车美容</View>
                <View className="item-info-label">
                  <View className="labels-box">免费礼品</View>
                  <View className="labels-box">优秀商家</View>
                  <View className="labels-box">现金券</View>
                </View>
              </View>
              <View className="item-distance-box">
                <Image className="item-distance-icon" src="http://oss.tdianyi.com/front/D3ZdAXB2fKQpQeby2jb4WNA4M7FM2KQn.png" />
                <View className="item-distance-info">洛溪 923m</View>
              </View>
            </View>


          </View>
        </View>


      </View>
    );
  }
}
