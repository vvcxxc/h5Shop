import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast } from "taro-ui"
import { View, Text, Image, ScrollView, Button } from "@tarojs/components";
import "./index.less";

interface Props {
    title?: string;
    discArray?: string;
    onCancle: Function;
}


export default class RulesTips extends Component<Props> {

    componentWillUnmount() {
        console.log('componentWillUnmount')
    }

    closeMask = () => {
        console.log('577556')
        this.props.onCancle()
    }

    render() {
        return (
            <View className="arrayTips-mask" >
                <View className="arrayTips-content">
                    <View className="arrayTips-title">{this.props.title || '使用规则'}</View>
                    <View className="arrayTips-info">
                        {
                            this.props.discArray ? JSON.parse(this.props.discArray).map((item: any, index: any) => {
                                return (
                                    <View className="arrayTips-info-item">{item}</View>
                                )
                            }) : null
                        }
                    </View>
                    <View className="arrayTips-btn" onClick={this.closeMask.bind(this)}>确定</View>
                </View>
            </View>
        );
    }
}
