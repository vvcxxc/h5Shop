import Taro, { Component, Config } from "@tarojs/taro"
// import { View } from "@tarojs/components";
import { AtIcon, AtToast, AtActionSheet, AtActionSheetItem } from "taro-ui"
import { Block, View, Image, Text, Navigator, Picker, Input } from "@tarojs/components"
import request from '@/services/request'
import "./index.less"
import { url } from "inspector"
import CitySelecter from "../../components/citySelecter/index"
import Citypicker from "../../components/citySelecter/index2.js"

export default class PersonalInformation extends Component {

    config: Config = {
        navigationBarTitleText: "修改我的信息"
    }
    state = {
        avatar: '',
        selector: ['男', '女'],
        selectorNum: 0,
        selectorChecked: '男',
        dateSel: '',
        maskShow: false,
        name: '',
        sumbitName: '',
        cityIndex: []
    }
    componentDidMount() {
        Taro.showLoading();
        request({
            url: 'v1/user/user/user_info',
            method: "GET",
        })
            .then((res: any) => {
                Taro.hideLoading();
                let { status_code, data } = res;
                if (status_code == 200) {
                    this.setState({
                        avatar: data.avatar,
                        name: data.user_name

                        // ?????
                    })
                } else {
                    Taro.showToast({ title: '加载失败', icon: 'none' })
                }

            }).catch(err => {
                Taro.hideLoading();
                Taro.showToast({ title: '加载失败', icon: 'none' })
            })
    }
    onSexChange = e => {
        this.setState({
            selectorNum: e.detail.value,
            selectorChecked: this.state.selector[e.detail.value]
        }, () => { this.sumbitInfo() })
    }
    onDateChange = (e: any) => {
        console.log(e.detail.value)
        this.setState({
            dateSel: e.detail.value
        }, () => { this.sumbitInfo() })
    }
    getCityArea(query) {
        this.setState({ cityIndex: query }, () => { this.sumbitInfo() })
    }
    changeName = (e: any) => {
        this.setState({ name: e.detail.value })
    }
    sumbitName = (e: any) => {
        this.setState({ sumbitName: this.state.name }, () => { this.sumbitInfo() })
    }
    sumbitInfo = () => {
        Taro.showLoading();
        request({
            url: 'v1/user/user/upload_user_detail',
            method: "GET",
            data: {
                byear: this.state.dateSel.split('-')[0],
                bmonth: this.state.dateSel.split('-')[1],
                bday: this.state.dateSel.split('-')[2],
                sex: this.state.selectorChecked == '男' ? 1 : 2,
                province_id: this.state.cityIndex[0],
                city_id: this.state.cityIndex[1],
                district_id: this.state.cityIndex[2],
            }
        })
            .then((res: any) => {
                Taro.hideLoading();
                console.log(res)
                if (res.status_code == 200) {
                    Taro.showToast({ title: '修改成功', icon: 'none' })
                } else {
                    Taro.showToast({ title: '修改失败', icon: 'none' })
                }
            }).catch(err => {
                Taro.hideLoading();
                Taro.showToast({ title: '修改失败', icon: 'none' })
            })

    }
    render() {
        return (
            <View className='personalInformation'>
                <View className='informationTitle'>基本信息</View>
                <View className='informationBox'>

                    <View className='informationItem'>
                        <View className='itemLeft'>头像</View>
                        <View className='itemRight'>
                            <View className='itemImage'>
                                <Image className='userImage' src={this.state.avatar} />
                            </View>
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
                    <Citypicker Division=" - " getCity={this.getCityArea} sumbit={true}></Citypicker>

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
                                    <Input className='pickerInput' onInput={this.changeName.bind(this)} />
                                </View>
                            </View>
                        </View>
                    </View> : null
                }
            </View>
        )
    }
}
