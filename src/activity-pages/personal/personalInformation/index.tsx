import Taro, { Component, Config } from "@tarojs/taro"
// import { View } from "@tarojs/components";
import { AtIcon, AtToast, AtActionSheet, AtActionSheetItem } from "taro-ui"
import { Block, View, Image, Text, Navigator, Picker, Input } from "@tarojs/components"
import userRequest from '@/services/userRequest'
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
        sex: 0,
        selector: ['男', '女'],
        selectorNum: 0,
        selectorChecked: '男',
        byear: 0,
        bmonth: 0,
        bday: 0,
        dateSel: '',
        address: '',
        quName: '',
        maskShow: false,
        name: '',
        sumbitName: '',
        cityIndex: []
    }
    componentDidMount() {
        Taro.showLoading();
        userRequest({
            url: 'v1/user/user/user_info',
            method: "GET",
        })
            .then((res: any) => {
                Taro.hideLoading();
                let { status_code, data, message } = res;
                if (status_code == 200) {
                    this.setState({
                        avatar: data.avatar,
                        name: data.user_name,
                        byear: data.byear,
                        bmonth: data.bmonth,
                        bday: data.bday,
                        dateSel: data.byear ? data.byear + '-' + data.bmonth + '-' + data.bday : '无',
                        sex: data.sex,
                        selectorChecked: data.sex == 1 ? '男' : (data.sex == 2 ? '女' : '无'),
                        cityIndex: [data.province_id, data.city_id, data.district_id],
                        quName: data.address_detail,
                        address: data.province + '-' + data.city + '-' + data.address_detail,
                    })
                } else {
                    Taro.showToast({ title: message, icon: 'none' })
                }
            }).catch(err => {
                Taro.hideLoading();
                Taro.showToast({ title: '加载失败', icon: 'none' })
            })
    }
    onSexChange = e => {
        console.log(this.state.selectorNum)
        this.setState({
            selectorNum: e.detail.value,
            selectorChecked: this.state.selector[e.detail.value],
            sex: e.detail.value == 0 ? 1 : 2
        }, () => {
            console.log(this.state.selectorNum)
            this.sumbitInfo()
        })
    }
    onDateChange = (e: any) => {
        this.setState({
            dateSel: e.detail.value,
            byear: Number(e.detail.value.split("-")[0]),
            bmonth: Number(e.detail.value.split("-")[1]),
            bday: Number(e.detail.value.split("-")[2])
        }, () => { this.sumbitInfo() })
    }
    getCityArea = (query) => {
        console.log(query);
        console.log('query');
        this.setState({ cityIndex: query.tempselectorid, quName: query.quName, address: query.selectorChecked }, () => { console.log('query2'); this.sumbitInfo() })
    }
    changeName = (e: any) => {
        this.setState({ name: e.detail.value })
    }
    sumbitName = (e: any) => {
        this.setState({ sumbitName: this.state.name, maskShow: false }, () => { this.changeNameInfo() })
    }
    sumbitInfo = () => {
        Taro.showLoading();
        userRequest({
            url: 'v1/user/user/upload_user_detail',
            method: "PUT",
            data: {
                byear: this.state.byear,
                bmonth: this.state.bmonth,
                bday: this.state.bday,
                sex: this.state.sex,
                province_id: this.state.cityIndex[0],
                city_id: this.state.cityIndex[1],
                address_detail: this.state.quName,
            }
        })
            .then((res: any) => {
                Taro.hideLoading();
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
    changeNameInfo = () => {
        Taro.showLoading();
        userRequest({
            url: 'v1/user/user/upload_user_info',
            method: "PUT",
            data: {
                head: this.state.avatar,
                name: this.state.name
            }
        })
            .then((res: any) => {
                Taro.hideLoading();
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
                            <View className='itemWords'>{this.state.name}</View>
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
                    {
                        this.state.address ? <Citypicker Division=" - " getCity={this.getCityArea} tempCityInfo={this.state.address}></Citypicker>
                            :
                            <Citypicker Division=" - " getCity={this.getCityArea}  ></Citypicker>
                    }
                </View>


                {
                    this.state.maskShow ? <View className='personalInformationMask'>
                        <View className='personalInformationMaskContent'>
                            <View className='contentTitle'>
                                <View className='titleWords'>修改昵称</View>
                                <View className='contentTitleCancle' onClick={() => { this.setState({ maskShow: false }) }}>取消</View>
                                <View className='contentTitleSubmit' onClick={this.sumbitName.bind(this)}>确定</View>
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
