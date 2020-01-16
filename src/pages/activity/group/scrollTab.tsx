import Taro, { Component } from "@tarojs/taro";
import { AtTabs, AtTabsPane } from 'taro-ui'
import { View, Image, Swiper, SwiperItem, ScrollView } from "@tarojs/components";
import './scrollTab.scss';
import TimeUp from './TimeUp';

interface Props {
    tabList: Array<any>;
    storeName?: any;
}
let timer;
let timeout;
export default class Scrolltab extends Component<Props>{

    componentDidMount() {
        timer = setInterval(() => {
            let tempPage = this.state.current == this.props.tabList.length - 1 ? 0 : this.state.current + 1;
            this.setState({ current: tempPage })
        }, 5000)
    }

    componentDidShow() {
        clearInterval(timer);
        this.setState({ current: 0 })
        timer = setInterval(() => {
            let tempPage = this.state.current == this.props.tabList.length - 1 ? 0 : this.state.current + 1;
            this.setState({ current: tempPage })
        }, 5000)
    }
    componentWillUnmount() {
        clearInterval(timer);
    }
    state = {
        current: 0,
        Ypoint: 0
    }
    handleClick(value) {
        this.setState({
            current: value
        })
    }
    goToaConfirmAddGroup = (_id, e) => {
        clearInterval(timer);
        //轮播列表参团,路由params带过来的id为活动id, 接口传过来的id为团id
        Taro.navigateTo({
            url: '/activity-pages/confirm-address/index?activityType=55&id=' + this.$router.params.id + '&groupId=' + _id + '&storeName=' + encodeURIComponent(this.props.storeName)
        })
    }
    touchStart = (e) => {
        // console.log(e.changedTouches[0].clientY)
        this.setState({ Ypoint: e.changedTouches[0].clientY })
    }
    touchMove = (e) => {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            // console.log(e.changedTouches[0].clientY)
            if (e.changedTouches[0].clientY > this.state.Ypoint) {
                this.setState({ current: this.state.current - 1 })
            } else if (this.state.current < this.props.tabList.length - 1) {
                this.setState({ current: this.state.current + 1 })
            }
        }, 3000);
    }
    render() {
        return (
            <div className="scrolltab" onTouchStart={this.touchStart.bind(this)} onTouchMove={this.touchMove.bind(this)}>
                <AtTabs
                    current={this.state.current}
                    scroll
                    height='200px'
                    tabDirection='vertical'
                    tabList={[]}
                    onClick={() => { }}>
                    {
                        this.props.tabList.map((item: any, index) => {
                            return (
                                <AtTabsPane tabDirection='vertical' current={this.state.current} index={index}>
                                    <View >
                                        <View className="group_list" >
                                            <View className="group_list_img" >
                                                <Image className="listImg" src={item[0].avatar} />
                                            </View>
                                            <View className="group_list_name" >{item[0].real_name}</View>
                                            <View className="group_list_btnbox" >
                                                {
                                                    item[0].is_team ? <View className="group_list_btn" style={{ background: '#999999' }}  >您已参团</View> :
                                                        <View className="group_list_btn" onClick={this.goToaConfirmAddGroup.bind(this, item[0].id)} >立即参团</View>
                                                }
                                            </View>
                                            <View className="group_list_timesbox" >
                                                <View className="group_list_lack" >
                                                    <View className="group_list_lackredblack1" >还差</View>
                                                    <View className="group_list_lackred" >{item[0].number - item[0].participation_number}人</View>
                                                    <View className="group_list_lackredblack2" >拼成</View>
                                                </View>
                                                <View className="group_list_times" >
                                                    <TimeUp itemtime={item[0].end_at} />
                                                </View>
                                            </View>
                                        </View>
                                        {
                                            item[1] ? <View className="group_list" >
                                                <View className="group_list_img" >
                                                    <Image className="listImg" src={item[1].avatar} />
                                                </View>
                                                <View className="group_list_name" >{item[1].real_name}</View>
                                                <View className="group_list_btnbox" >
                                                    {
                                                        item[1]&&item[1].is_team ? <View className="group_list_btn" style={{ background: '#999999' }} >您已参团</View> :
                                                            <View className="group_list_btn" onClick={this.goToaConfirmAddGroup.bind(this, item[1].id)}  >立即参团</View>
                                                    }
                                                </View>
                                                <View className="group_list_timesbox" >
                                                    <View className="group_list_lack" >
                                                        <View className="group_list_lackredblack1" >还差</View>
                                                        <View className="group_list_lackred" >{item[1].number - item[1].participation_number}人</View>
                                                        <View className="group_list_lackredblack2" >拼成</View>
                                                    </View>
                                                    <View className="group_list_times" >
                                                        <TimeUp itemtime={item[1].end_at} />
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
            </div>
        );
    }
}