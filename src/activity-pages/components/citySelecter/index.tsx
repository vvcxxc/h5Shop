
import Taro, { Component } from "@tarojs/taro";
import { View, Input, Textarea } from "@tarojs/components";
import "./index.scss";
import "taro-ui/dist/style/components/toast.scss";
import dataCity from "./dataCity2"

interface Props {
    getCity: (any) => any;
    onclose: () => any;
}

export default class CitySelecter extends Component<Props> {

    state = {
        dataList: [],
        shenvalue: '请选择',
        shivalue: '请选择',
        quvalue: '请选择',
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
        let shen: Array<any> = [];
        dataCity.cityData.map((item: any) => {
            shen.push(item);
        })
        this.setState({
            dataList: shen,
            shenvalue: '请选择',
            shivalue: '请选择',
            quvalue: '请选择',
            shenindex: 0,
            shiindex: 0,
            quindex: 0,
            shenid: 0,
            shiid: 0,
            quid: 0,
            currentIndex: 0,//当前所在tab索引，0省1市2区
            selectorChecked: '',
        })
    }

    onTabChange = () => {
        let tempselectorid = [this.state.shenindex, this.state.shiindex, this.state.quindex];
        let query = { tempselectorid, selectorChecked: this.state.selectorChecked }
        this.props.getCity && this.props.getCity(query);
    }
    oncloseItem = () => { this.props.onclose && this.props.onclose() }
    onColumnChange = (type: number, e: any) => {
        this.setState({ currentIndex: type });
        if (type == 0) {
            let shen: Array<any> = [];
            dataCity.cityData.map((item: any) => {
                shen.push(item);
            })
            this.setState({
                dataList: shen,
                shenvalue: '请选择',
                shivalue: '请选择',
                quvalue: '请选择',
                shenindex: 0,
                shiindex: 0,
                quindex: 0,
                shenid: 0,
                shiid: 0,
                quid: 0,
                currentIndex: type,//当前所在tab索引，0省1市2区
                selectorChecked: '',
            })
        } else if (type == 1) {
            let index1 = this.state.shenindex;
            let shi: Array<any> = [];
            let shenvalue = dataCity.cityData[index1].value;
            let shenid = dataCity.cityData[index1].id;
            let shiid = dataCity.cityData[index1].children[0].id;
            let quid = dataCity.cityData[index1].children[0].children[0].id;
            dataCity.cityData[index1].children.map(item => {
                shi.push(item);
            });
            this.setState({
                dataList: shi,
                shenvalue: shenvalue,
                shivalue: '请选择',
                quvalue: '请选择',
                shenindex: index1,
                shiindex: 0,
                quindex: 0,
                shenid: shenid,
                shiid: shiid,
                quid: quid,
                currentIndex: 1,//当前所在tab索引，0省1市2区
                selectorChecked: shenvalue,
            })
        }
    }

    onSelectItem = (index: number, e: any) => {
        if (this.state.currentIndex == 0) {
            let index1 = index;
            let shi: Array<any> = [];
            let shenvalue = dataCity.cityData[index1].value;
            let shenid = dataCity.cityData[index1].id;
            let shiid = dataCity.cityData[index1].children[0].id;
            let quid = dataCity.cityData[index1].children[0].children[0].id;
            dataCity.cityData[index1].children.map(item => {
                shi.push(item);
            });
            this.setState({
                dataList: shi,
                shenvalue: shenvalue,
                shivalue: '请选择',
                quvalue: '请选择',
                shenindex: index1,
                shiindex: 0,
                quindex: 0,
                shenid: shenid,
                shiid: shiid,
                quid: quid,
                currentIndex: 1,//当前所在tab索引，0省1市2区
                selectorChecked: shenvalue,
            })
        } else if (this.state.currentIndex == 1) {
            let index1 = this.state.shenindex;
            let index2 = index;
            let qu: Array<any> = [];
            let shenvalue = dataCity.cityData[index1].value;
            let shivalue = dataCity.cityData[index1].children[index2].value;
            let shiid = dataCity.cityData[index1].children[index2].id;
            let quid = dataCity.cityData[index1].children[index2].children[0].id;
            dataCity.cityData[index1].children[index2].children.map(item => {
                qu.push(item);
            });
            this.setState({
                dataList: qu,
                shivalue: shivalue,
                quvalue: '请选择',
                shiindex: index2,
                quindex: 0,
                shiid: shiid,
                quid: quid,
                currentIndex: 2,//当前所在tab索引，0省1市2区
                selectorChecked: shenvalue + '-' + shivalue,
            })
        } else if (this.state.currentIndex == 2) {
            let index1 = this.state.shenindex;
            let index2 = this.state.shiindex;
            let index3 = index;
            let shenvalue = dataCity.cityData[index1].value;
            let shivalue = dataCity.cityData[index1].children[index2].value;
            let quvalue = dataCity.cityData[index1].children[index2].children[index3].value;
            let quid = dataCity.cityData[index1].children[index2].children[index3].id;
            this.setState({
                quvalue: quvalue,
                quindex: 0,
                quid: quid,
                selectorChecked: shenvalue + '-' + shivalue + '-' + quvalue,
            }, () => {
                console.log(this.state.selectorChecked)
                console.log(this.state.shenid, this.state.shiid, this.state.quid);
                this.onTabChange();
            })
        }
    }

    render() {
        return (
            <View className="city-selecter">
                <View className="city-selecter-title-box">
                    <View className="city-selecter-title">所在地区</View>
                    <View className="at-icon at-icon-close" onClick={this.oncloseItem}></View>
                </View>
                <View className="city-selecter-box">
                    <View className="city-selecter-box-selectInfo">

                        <View className="city-selecter-shentitle" onClick={this.onColumnChange.bind(this, 0)}>{this.state.shenvalue}</View>
                        {
                            this.state.currentIndex == 1 || this.state.currentIndex == 2 ? <View className="city-selecter-shititle" onClick={this.onColumnChange.bind(this, 1)} >{this.state.shivalue}</View> : null
                        }
                        {
                            this.state.currentIndex == 2 ? <View className="city-selecter-qutitle"  >{this.state.quvalue}</View> : null
                        }
                    </View>
                    <View className="city-background-box">
                        <View className="city-notice">
                            {
                                this.state.currentIndex == 0 ? <View className="city-notice-info"> 选择省/区域</View> : (
                                    this.state.currentIndex == 1 ? <View className="city-notice-info"> 选择市</View> :
                                        <View className="city-notice-info"> 选择区</View>
                                )
                            }

                        </View>
                        <View className="city-selecter-box-select-msgBox">
                            {
                                this.state.dataList.map((item: any, index: any) => {
                                    return (
                                        <View className="map-info" key={item.id} onClick={this.onSelectItem.bind(this, index)}>{item.value}</View>
                                    )
                                })
                            }

                        </View>
                    </View>
                </View>
            </View>
        );
    }
}
