import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast, AtTabs, AtTabsPane } from "taro-ui";
import { View, Text, Image, ScrollView, Button } from "@tarojs/components";
import "./index.less";
import request from '../../services/request';
import { getBrowserType } from "@/utils/common";
import { getLocation } from "@/utils/getInfo";
import { Swiper, SwiperItem } from '@tarojs/components';
import ActivityItem from '@/components/activity-item';
import ApplyToTheStore from '@/components/applyToTheStore';
import TimeUp from '@/components/TimeUp';

export default class GroupActivity extends Component {
    config = {
        navigationBarTitleText: "拼团活动",
        enablePullDownRefresh: false
    };


    state = {
        bannerImgIndex: 0,
        imgs: [
            "http://oss.tdianyi.com/front/t4nspcwf3Dbb722DKrGHBaahDcXbJeMj.png",
            "http://oss.tdianyi.com/front/2tp2Gi5MjC47hd7mGBCjEGdsBiWt5Wec.png",
            "http://oss.tdianyi.com/front/t4nspcwf3Dbb722DKrGHBaahDcXbJeMj.png",
        ],
        list: [[1, 2], [3, 4], [5, 6], [7]],
        current: 0,
        ruleMore: false,

    };

    componentDidMount() {
        this.listAtb()
    }
    componentDidShow() {
        // Taro.showLoading({ title: 'loading' })
        console.log(getLocation())
        getLocation().then((res: any) => { }).catch((err) => { })
    }
    getGroupbuyings=()=>{
        
    }




    listAtb = () => {
        let timer = setTimeout(() => {
            clearTimeout(timer);
            let tempPage = this.state.current == this.state.list.length - 1 ? 0 : this.state.current + 1;
            this.setState({ current: tempPage }, () => { this.listAtb() })
        }, 3000)
    }
    render() {
        return (
            <View className="group-activity-detail">
                <Swiper
                    onChange={(e) => {
                        this.setState({ bannerImgIndex: e.detail.current })
                    }}
                    className='group-banner'
                    circular
                    autoplay
                >
                    {
                        this.state.imgs ? this.state.imgs.map((item, index) => {
                            return (
                                <SwiperItem className="group-banner-swiperItem" key={item}>
                                    <Image className="group-banner-img" src={item} />
                                </SwiperItem>
                            )
                        }) : null
                    }
                </Swiper>
                <View className="banner-number-box">
                    <View className="banner-number">{Number(this.state.bannerImgIndex) + 1}</View>
                    <View className="banner-number">{this.state.imgs.length}</View>
                </View>
                <View className="collect-box">
                    <Image className="collect-img" src="http://oss.tdianyi.com/front/7mXMpkiaD24hiAEw3pEJMQxx6cnEbxdX.png" />
                </View>
                <View className="share-box">
                    <Image className="share-img" src="http://oss.tdianyi.com/front/Af5WfM7xaAjFHSWNeCtY4Hnn4t54i8me.png" />
                </View>

                <View className="group-info-content">
                    <View className="group-info-title">
                        <View className="group-info-title-label">拼团券</View>
                        <View className="group-info-title-text">购买此券可以到店兑换一个草莓蛋糕草莓蛋糕</View>
                    </View>
                    <View className="group-info-price">
                        <View className="group-price-info">
                            <View className="group-price-info-text">优惠价￥</View>
                            <View className="group-price-info-new">29.99</View>
                            <View className="group-price-info-old">￥99.99</View>
                        </View>
                        <View className="group-price-discounts">已优惠￥100.00</View>
                    </View>
                    <View className="group-info-label">
                        <View className="group-info-label-item">3人团</View>
                        <View className="group-info-label-item">送扫地其机器人</View>
                    </View>
                </View>
                <Image className="group-banner-img" src="http://oss.tdianyi.com/front/AY8XDHGntwa8dWN3fJe4hTWkK4zFG7F3.png" />

                <View className="group-group-num">
                    <View className='apply-title-box'>
                        <View className='apply-title-left'></View>
                        <View className='apply-title'>4人正在拼</View>
                    </View>
                    <View className='apply-title-right'>正在拼团</View>
                </View>

                <AtTabs
                    current={this.state.current}
                    scroll
                    className="swiper-group-list"
                    tabDirection='vertical'
                    height={'34.6vw'}
                    tabList={[]}
                    onClick={() => { }}>
                    {
                        this.state.list.map((item: any, index) => {
                            return (
                                <AtTabsPane tabDirection='vertical' current={this.state.current} index={index} key={index} className="swiper-group-list-atTabsPane">
                                    <View className="swiper-group-list-item">
                                        <View className="swiper-item" onClick={() => { console.log(item[0]) }}>
                                            <View className="group-user" >
                                                <View className="group-list-img" >
                                                    <Image className="listImg" src={"http://oss.tdianyi.com/front/2tp2Gi5MjC47hd7mGBCjEGdsBiWt5Wec.png"} />
                                                </View>
                                                <View className="group-list-name" >{item[0]}~1测试测试测试测试</View>
                                            </View>

                                            <View className="group-info" >
                                                <View className="group-list-timesbox" >
                                                    <View className="group-list-lack" >
                                                        <View className="group-list-lackredblack1" >还差</View>
                                                        <View className="group-list-lackred" >33人</View>
                                                        <View className="group-list-lackredblack2" >拼成</View>
                                                    </View>
                                                    <View className="group-list-times" >
                                                        <TimeUp itemtime={'2020-6-8'} />
                                                    </View>
                                                </View>
                                                <View className="group-list-btnbox" >
                                                    <View className="group-list-btn" >参团</View>
                                                </View>
                                            </View>
                                        </View>
                                        {
                                            item[1] ? <View className="swiper-item" onClick={() => { console.log(item[1]) }}>

                                                <View className="group-user" >
                                                    <View className="group-list-img" >
                                                        <Image className="listImg" src={"http://oss.tdianyi.com/front/2tp2Gi5MjC47hd7mGBCjEGdsBiWt5Wec.png"} />
                                                    </View>
                                                    <View className="group-list-name" >{item[1]}~2测试测试测试测试</View>
                                                </View>

                                                <View className="group-info" >
                                                    <View className="group-list-timesbox" >
                                                        <View className="group-list-lack" >
                                                            <View className="group-list-lackredblack1" >还差</View>
                                                            <View className="group-list-lackred" >33人</View>
                                                            <View className="group-list-lackredblack2" >拼成</View>
                                                        </View>
                                                        <View className="group-list-times" >
                                                            <TimeUp itemtime={'2020-6-8'} />
                                                        </View>
                                                    </View>
                                                    <View className="group-list-btnbox" >
                                                        <View className="group-list-btn" >参团</View>
                                                    </View>
                                                </View>

                                            </View> : null
                                        }
                                    </View>
                                </AtTabsPane>
                            )
                        })
                    }
                </AtTabs>


                {/* <Swiper
                    onChange={(e) => {
                        // console.log(this.state.current, e.detail.current)
                        // if (this.state.current == this.state.list.length - 2) {
                        //     this.setState({ current: 0 })
                        // }
                        // else {
                        //     this.setState({ current: e.detail.current })
                        // };
                    }}
                    className='swiper-group-list'
                    autoplay
                    // circular
                    displayMultipleItems={2}
                    vertical
                >
                    {
                        this.state.list.map((item, index) => {
                            return (
                                <SwiperItem key={item} >
                                    <View className="swiper-item" onClick={() => { console.log(item) }}>

                                        <View className="group-user" >
                                            <View className="group-list-img" >
                                                <Image className="listImg" src={"http://oss.tdianyi.com/front/2tp2Gi5MjC47hd7mGBCjEGdsBiWt5Wec.png"} />
                                            </View>
                                            <View className="group-list-name" >{index}测试测试测试测试</View>
                                        </View>

                                        <View className="group-info" >
                                            <View className="group-list-timesbox" >
                                                <View className="group-list-lack" >
                                                    <View className="group-list-lackredblack1" >还差</View>
                                                    <View className="group-list-lackred" >33人</View>
                                                    <View className="group-list-lackredblack2" >拼成</View>
                                                </View>
                                                <View className="group-list-times" >
                                                    <TimeUp itemtime={'2020-6-8'} />
                                                </View>
                                            </View>
                                            <View className="group-list-btnbox" >
                                                <View className="group-list-btn" >参团</View>
                                            </View>
                                        </View>

                                    </View>
                                </SwiperItem>
                            )
                        })
                    }
                </Swiper> */}
                <View className="group-group-bottom"></View>
                <View className="group-store-info">
                    <ApplyToTheStore
                        isTitle={false}
                        img={'http://oss.tdianyi.com/front/t4nspcwf3Dbb722DKrGHBaahDcXbJeMj.png'}
                        name={'灰喉'}
                        phone={'14255552222'}
                        address={'球科技馆i2'}
                        location={{ xpoint: 111, ypoint: 222 }}
                    />
                </View>


                <View className="group-gift">
                    <View className="group-title-box">
                        <View className='group-title-left-box'>
                            <View className='group-title-left'></View>
                            <View className='group-title'>赠送礼品</View>
                        </View>
                        <View className='group-title-right'>
                            <View className='group-title-right-info'>查看详情</View>
                            <Image className="group-title-right-icon" src={"http://oss.tdianyi.com/front/SpKtBHYnYMDGks85zyxGHrHc43K5cxRE.png"} />
                        </View>
                    </View>
                    <View className='group-gift-brief'>一台很好用的扫地机器人</View>
                    <View className='group-gift-label-box'>
                        <View className='group-gift-label'>运费10元</View>
                        <View className='group-gift-label'>运费10元</View>
                    </View>
                    <Image className="group-gift-img" src={"http://oss.tdianyi.com/front/2tp2Gi5MjC47hd7mGBCjEGdsBiWt5Wec.png"} mode={'widthFix'} />
                    <Image className="group-gift-img" src={"http://oss.tdianyi.com/front/2tp2Gi5MjC47hd7mGBCjEGdsBiWt5Wec.png"} mode={'widthFix'} />
                </View>



                <View className="group-rules">
                    <View className="group-title-box">
                        <View className='group-title-left'></View>
                        <View className='group-title'>使用说明</View>
                    </View>
                    <View className="group-rules-item" >
                        <View className="rules-key">拼团人数：</View>
                        <View className="rules-words">3人成团</View>
                    </View>
                    <View className="group-rules-item" >
                        <View className="rules-key"> 拼团时限：</View>
                        <View className="rules-words">需24小时内成团</View>
                    </View>
                    <View className="group-rules-item" >
                        <View className="rules-key">有效期：</View>
                        <View className="rules-words">成团后7日内可用</View>
                    </View>
                    <View className="group-rules-list-title" >使用规则：</View>
                    <View className="group-rules-list-text" >-包间不可用 </View>
                    <View className="group-rules-list-text" >-不可打包 </View>
                    <View className="group-rules-list-text" >-消费高峰期需等待</View>
                    <View className="group-rules-list-text" >-每次只可以使用一张</View>
                    <View className="group-more" >
                        <Image className="group-more-icon" src={"http://oss.tdianyi.com/front/GQr5D7QZwJczZ6RTwDapaYXj8nMbkenx.png"} />
                        <View className="group-more-text" >查看更多</View>
                    </View>
                    {/* <View className="group-more" >
                        <Image className="group-more-icon" src={"http://oss.tdianyi.com/front/EhJAKdDjiD2N4D4MjJ2wWsdkHDf6bMkw.png"} />
                        <View className="group-more-text" >收起</View>
                    </View> */}
                </View>
                <View className="group-buy-box" >
                    <View className="group-buy-price-box" >
                        <View className="group-buy-price-icon" >￥</View>
                        <View className="group-buy-price-num" >2266.99</View>
                    </View>
                    <View className="group-buy-btn-box" >
                        <View className="group-buy-btn-left" >分享活动</View>
                        <View className="group-buy-btn-right" >
                            <View className="group-buy-btn-group" >立即开团</View>
                            <View className="group-buy-btn-groupnum" >3人成团</View>
                        </View>
                    </View>
                </View>


            </View>
        );
    }
}
