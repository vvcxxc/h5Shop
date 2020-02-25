import Taro, { Component, Config } from "@tarojs/taro"
// import { View } from "@tarojs/components";
import { AtIcon, AtToast, AtActionSheet, AtActionSheetItem } from "taro-ui"
import { Block, View, Image, Text, Navigator, Picker, Input } from "@tarojs/components"
import request from '@/services/request'
import "./index.less"
import { url } from "inspector"
import CitySelecter from "../../components/citySelecter/index"
import Citypicker  from "../../components/citySelecter/index2.js"

export default class PersonalInformation extends Component {

    config: Config = {
        navigationBarTitleText: "修改我的信息"
    }
    state = {
        selector: ['男', '女'],
        selectorNum: 0,
        selectorChecked: '男',
        dateSel: '',
        actionsheetShow: false,
        tempCityInfo: '',
        maskShow: false
    }
    componentDidMount() { }
    onSexChange = e => {
        this.setState({
            selectorNum: e.detail.value,
            selectorChecked: this.state.selector[e.detail.value]
        })
    }
    onDateChange = (e: any) => {
        console.log(e.detail.value)
        this.setState({
            dateSel: e.detail.value
        })
    }
    // 所在区域
    cityEnd = (query) => {
        console.log(query)
        this.setState({ cityValue: query.tempselectorid, tempCityInfo: query.selectorChecked, actionsheetShow: false })
    }
    getCity(region) {
        // 参数region为选择的省市区
        console.log('2:',region);
    }

    render() {
        return (
            <View className='personalInformation'>
                <View className='informationTitle'>基本信息</View>
                <View className='informationBox'>

                    <View className='informationItem'>
                        <View className='itemLeft'>头像</View>
                        <View className='itemRight'>
                            <View className='itemImage'></View>
                            <View className='itemIcon'> </View>
                        </View>
                    </View>
                    <View className='informationItem' onClick={() => { this.setState({ maskShow: true }) }}>
                        <View className='itemLeft'>昵称</View>
                        <View className='itemRight'>
                            <View className='itemWords'>小小熊</View>
                            <View className='itemIcon'></View>
                        </View>
                    </View>
                    <Picker mode='selector' range={this.state.selector} onChange={this.onSexChange} value={this.state.selectorNum}>
                        <View className='informationItem'>
                            <View className='itemLeft'>性别</View>
                            <View className='itemRight'>
                                <View className='itemWords'>{this.state.selectorChecked}</View>
                                <View className='itemIcon'> </View>
                            </View>
                        </View>
                    </Picker>


                    <Picker mode='date' onChange={this.onDateChange.bind(this)} value={this.state.dateSel}
                        end={new Date().getFullYear() + '-' + (new Date().getMonth() + 1) + '-' + new Date().getDate()}
                    >
                        <View className='informationItem'>
                            <View className='itemLeft'>生日</View>
                            <View className='itemRight'>
                                <View className='itemWords'>{this.state.dateSel}</View>
                                <View className='itemIcon'> </View>
                            </View>
                        </View>
                    </Picker>


                    {/* <View className='informationItem' onClick={(e) => { this.setState({ actionsheetShow: true }); e.stopPropagation(); }}>
                        <View className='itemLeft'>地区</View>
                        <View className='itemRight'>
                            <View className='itemWords'>{this.state.tempCityInfo}</View>
                            <View className='itemIcon'></View>
                        </View>
                    </View> */}
                    <Citypicker Division=" - " getCity={this.getCity.bind(this)}></Citypicker>

                </View>


                {
                    this.state.maskShow ? <View className='personalInformationMask'>
                        <View className='personalInformationMaskContent'>
                            <View className='contentTitle'>
                                <View className='titleWords'>修改昵称</View>
                                <View className='contentTitleCancle' onClick={() => { this.setState({ maskShow: false }) }}>取消</View>
                                <View className='contentTitleSubmit' onClick={() => { this.setState({ maskShow: false }) }}>确定</View>
                            </View>
                            <View className='pickerBox'>
                                <View className='inputBox'>
                                    <Input className='pickerInput' />
                                </View>
                            </View>
                        </View>
                    </View> : null
                }

                <AtActionSheet isOpened={this.state.actionsheetShow ? true : false} onCancel={(e) => { this.setState({ actionsheetShow: false }) }} onClose={(e) => { this.setState({ actionsheetShow: false }) }}>
                    <View className="AtActionSheetBox">
                        <CitySelecter getCity={this.cityEnd} onclose={() => { this.setState({ actionsheetShow: false }) }} />
                    </View>
                </AtActionSheet>
            </View>
        )
    }
}
