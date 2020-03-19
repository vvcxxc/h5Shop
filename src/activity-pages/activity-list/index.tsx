import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast } from "taro-ui"
import { View, Text, Image, ScrollView, Button } from "@tarojs/components";
import "./index.less";
import request from '../../services/request'
import ActivityItem from '@/components/activity-item'




export default class ActivityList extends Component {
    config = {
        navigationBarTitleText: "",
        enablePullDownRefresh: false
    };


    state = {

    };

    componentDidShow() {
        Taro.setNavigationBarTitle({ title: '团购活动列表' })
    }



    render() {
        return (
            <View className="activity-list">
                <View className="activity-banner">
                    {/* <Image className="activity-banner-img" src="http://oss.tdianyi.com/front/t4nspcwf3Dbb722DKrGHBaahDcXbJeMj.png" /> */}
                    <Image className="activity-banner-img" src="http://oss.tdianyi.com/front/2tp2Gi5MjC47hd7mGBCjEGdsBiWt5Wec.png" />
                </View>
                <View className="activity-content">

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
                            longName={'2人拼团抢汽车美容一二三四五六'}
                            brief={'有效期：7天有效'}
                            oldPrice={'19.99'}
                            newPrice={'49.99'}
                            btnText={'抢购'}
                            unBtnText={'已参与99'}
                            handleClick={() => { }}
                        />
                    </View>
                </View>
            </View>
        );
    }
}
