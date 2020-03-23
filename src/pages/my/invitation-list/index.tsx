import Taro, { Component } from "@tarojs/taro";
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import "./index.less";
import { userRelationShip } from './service'


export default class AppreActivity extends Component {
    config = {
        navigationBarTitleText: "我的邀请列表",
        enablePullDownRefresh: false
    };

    state = {
        page: 1,
        total: 0,
        last_page: 0,
        list: [

        ]
    };

    /** 
    *第一次请求,替代
    */
    componentDidShow() {
        userRelationShip({ page: 1 }).then((res: any) => {
            if (res.status_code == 200) {
                this.setState({ list: res.data.list, total: res.data.total, last_page: res.data.last_page, page: this.state.page + 1 })
            } else {
                Taro.showToast({ title: res.message, icon: 'none' })
            }
        }).catch(err => {
            Taro.showToast({ title: '请求失败', icon: 'none' })
        })
    }


    /** 
    *加载更多，衔接
    */
    onReachBottom() {
        let that = this;
        if (this.state.page <= this.state.last_page) {
            userRelationShip({ page: that.state.page }).then((res: any) => {
                if (res.status_code == 200) {
                    that.setState({ list: that.state.list.concat(res.data.list), total: res.data.total, last_page: res.data.last_page, page: that.state.page + 1 })
                } else {
                    Taro.showToast({ title: res.message, icon: 'none' })
                }
            }).catch(err => {
                Taro.showToast({ title: '请求失败', icon: 'none' })
            })
        }

    }

    render() {
        return (
            <View className="invitation-list">
                <View className="invitation-list-nav">
                    <View className="invitation-title">邀请的用户数量</View>
                    <View className="invitation-num">{this.state.total}</View>
                </View>
                <View className='invitation-title-left-box'>
                    <View className='invitation-title-left'></View>
                    <View className='invitation-title'>赠送礼品</View>
                </View>
                    {
                        this.state.list.length ?
                            <View className='item-content'>
                                {
                                    this.state.list.map((item: any, index: any) => {
                                        return (
                                            <View className='invitation-item' key={item}>
                                                <View className='invitation-item-uesr'>
                                                    <View className='invitation-photo'>
                                                        <Image className="invitation-img" src={item.avatar} />
                                                    </View>
                                                    <View className='invitation-name'>{item.name}</View>
                                                </View>
                                                <View className='invitation-item-time'>{item.created_at}</View>
                                            </View>
                                        )
                                    })
                                }
                            </View> : null
                    }
                    {
                        !this.state.list.length ?
                            <View className='list-no-data'>
                                <View className='no-data-box'>
                                    <Image className='no-data-img' src={require('@/assets/index/no-data.png')} />
                                    <View>暂时没有活动，看看其他吧</View>
                                </View>
                            </View>
                            : null
                    }
                </View>

        );
    }
}
