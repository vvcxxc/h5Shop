import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast } from "taro-ui"
import { View, Text, Image, ScrollView, Button } from "@tarojs/components";
import "./index.less";

interface Props {
    tabList: Array<Object>;
    onAtion: Function;
}


export default class ActivityTab extends Component<Props> {

    state = {
        current: 0
    }

    changeAtion = (index: any, propsCurrent: any) => {
        this.setState({ current: index })
        this.props.onAtion(propsCurrent)
    }

    render() {
        return (
            <View className="activity-tab" >
                {
                    this.props.tabList.length ? <View className="activity-tab-area" >
                        {
                            this.props.tabList.map((item: any, index: any) => {
                                return (
                                    <View className={this.state.current == index ? "activity-tab-item-select" : "activity-tab-item"} onClick={this.changeAtion.bind(this, index, item.index)}>
                                        <View className={this.state.current == index ? "tab-word-select" : "tab-word"} >{item.key}</View>
                                        {this.state.current == index ? <View className="tab-word-border" ></View> : null}
                                    </View>
                                )
                            })
                        }
                    </View> : null
                }
            </View>
        );
    }
}
