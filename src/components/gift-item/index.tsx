import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast } from "taro-ui"
import { View, Text, Image, ScrollView, Button } from "@tarojs/components";
import RulesTips from '@/components/rulesTips'
import "./index.less";

interface Props {
    label?: string;
    title: string;
    desc: string;
    rules: string;
    price: string | number;
    btn?: string | number;
    itemImg: string;
}


export default class GiftItem extends Component<Props> {

    state = {
        current: 0,
        rulesShow: false
    }

    closeTips = (e: any) => {
        this.setState({ rulesShow: false });
    }

    render() {
        return (
            <View className="gift_info" >
                <View className="gift_msg_area" onClick={() => { this.setState({ rulesShow: true }) }}>
                    <View className="gift_msg" >
                        <Image className="gift_img" src={this.props.itemImg} />
                        <View className="gift_detail">
                            <View className="gift_detail_info">
                                <View className="gift_title">
                                    <View className="gift_type">
                                        <View className="text">{this.props.label || '平台礼品'}</View>
                                    </View>
                                    <View className="gift_cash">{this.props.title}</View>
                                </View>
                                <View className="gift_desc">{this.props.desc}</View>
                            </View>
                            <View className="gift_money">
                                <View className="gift_new_money_icon">￥</View>
                                <View className="gift_new_money">{this.props.price}</View>
                            </View>
                        </View>
                    </View>
                    <View className="gift_btn">
                        <View className="text">{this.props.btn}份</View>
                    </View>
                </View>
                {
                    this.state.rulesShow ? <RulesTips discArray={this.props.rules} onCancle={this.closeTips.bind(this)} /> : null
                }
            </View>
        );
    }
}
