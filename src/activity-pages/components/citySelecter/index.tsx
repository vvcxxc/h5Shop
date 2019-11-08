
import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast, AtActionSheet, AtActionSheetItem } from "taro-ui"
import { View, Input, Textarea } from "@tarojs/components";
import "./index.scss";
import "taro-ui/dist/style/components/toast.scss";
import dataCity from "./dataCity2"

export default class CitySelecter extends Component {

    state = {
        dataList: [],
        shenvalue: '',
        shivalue: '',
        quvalue: '',
        shenindex: 0,
        shiindex: 0,
        quindex: 0,
        shenid: 0,
        shiid: 0,
        quid: 0,
        currentIndex: 0,//当前所在tab索引，0省1市2区
        selectorChecked: '',
    };


    componentDidMount() {
        let tempList: Array<any> = [];
        dataCity.cityData.map((item: any) => {
            tempList.push(item.value);
        })
        console.log(tempList)
        this.setState({ dataList: tempList });
    }



    onColumnChange = (type: number, e: any) => {
        this.setState({ currentIndex: type });
        if (type == 0) {

        } else if (type == 1) {

        } else if (type == 2) {

        }
    }

    onSelectItem = (e: any) => {
        if (this.state.currentIndex == 0) {

        } else if (this.state.currentIndex == 1) {

        } else if (this.state.currentIndex == 2) {

        }
    }

    render() {
        return (
            <View className="city-selecter">
                <View className="city-selecter-title-box">
                    <View className="city-selecter-title">所在地区</View>
                    <View className="at-icon at-icon-close"></View>
                </View>
                <View className="city-selecter-box">
                    <View className="city-selecter-box-selectInfo">
                        <View className="city-selecter-shentitle" onClick={this.onColumnChange.bind(this, 0)}>请选择</View>
                        <View className="city-selecter-shititle" onClick={this.onColumnChange.bind(this, 0)} >维吾尔族自治区</View>
                        <View className="city-selecter-qutitle" onClick={this.onColumnChange.bind(this, 0)} >请选择</View>
                    </View>
                    <View className="city-background-box">
                        <View className="city-notice">
                            <View className="city-notice-info"> 选择省/区域</View>
                        </View>
                        <View className="city-selecter-box-select-msgBox">
                            <View className="map-info">广东省</View>
                        </View>
                    </View>
                </View>
            </View>
        );
    }
}
