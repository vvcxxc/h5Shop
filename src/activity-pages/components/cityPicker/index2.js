import Taro, { Component } from '@tarojs/taro'
import { AtIcon } from "taro-ui"
import { View, Text, Picker, Input } from '@tarojs/components'
import request from '../../../services/request'
import './index.scss'
import dataCity from "./dataCity2"
let shen = [];
let shi = [];
let qu = [];
let shenid = '';
let shiid = '';
let quid = '';

class PagePicker extends Component {
    state = {
        shenindex: 0,
        shiindex: 0,
        quindex: 0,
        selectorid: [shenid, shiid, quid],
        selector: [shen, shi, qu],
        selectorChecked: '',
        havechange: false
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.firstMsg && nextProps.firstMsg != "" && this.state.havechange == false) {
            this.setState({ selectorChecked: nextProps.firstMsg })
        }
    }

    componentDidMount() {
        shen = [];
        shi = [];
        qu = [];
        shenid = '';
        shiid = '';
        quid = '';
        dataCity.cityData.map(item => {
            shen.push(item.value);
        })
        dataCity.cityData[0].children.map(item => {
            shi.push(item.value);
        })
        dataCity.cityData[0].children[0].children.map(item => {
            qu.push(item.value);
        })
        shenid = dataCity.cityData[0].id;
        shiid = dataCity.cityData[0].children[0].id;
        quid = dataCity.cityData[0].children[0].children[0].id;
        let tempselectorid = [shenid, shiid, quid];
        let tempselector = [shen, shi, qu];
        this.setState({ selector: tempselector, selectorid: tempselectorid }, () => {
            console.log(tempselectorid, tempselector)
        })
    }


    onTabChange = () => {
        let tempselectorid = this.state.selectorid;
        let { shenindex, shiindex, quindex } = this.state;
        let shenName = dataCity.cityData[Number(shenindex)].value;
        let shiName = dataCity.cityData[Number(shenindex)].children[Number(shiindex)].value;
        let quName = dataCity.cityData[Number(shenindex)].children[Number(shiindex)].children[Number(quindex)].value;
        let selectorChecked = shenName + '-' + shiName + '-' + quName;
        this.setState({ selectorChecked: shenName + '-' + shiName + '-' + quName }, () => {
            this.props.getCity && this.props.getCity(tempselectorid)
        })
    }
    onColumnChange = e => {
        //第一列下标0
        if (e.detail.column == 0) {
            shi = [];
            qu = [];
            //index1为第一列的第n个,省下标
            let index1 = e.detail.value;
            //省id
            shenid = dataCity.cityData[index1].id;
            console.log('省：', dataCity.cityData[index1].value);
            console.log('市：', dataCity.cityData[index1].children[0].value);
            console.log('区：', dataCity.cityData[index1].children[0].children[0].value);
            dataCity.cityData[index1].children.map(item => {
                shi.push(item.value);
            });
            //市id归零
            shiid = dataCity.cityData[index1].children[0].id;
            dataCity.cityData[index1].children[0].children.map(item => {
                qu.push(item.value);
            });
            //区id归零
            quid = dataCity.cityData[index1].children[0].children[0].id;
            let tempselectorid = [shenid, shiid, quid];
            let tempselector = [shen, shi, qu];
            this.setState({ selector: tempselector, selectorid: tempselectorid, shenindex: index1, shiindex: 0, quindex: 0, havechange: true }, () => {
                this.onTabChange();
            })
        }
        else if (e.detail.column == 1) {
            qu = [];
            //index2为第二列的第n个，市下标
            let index1 = this.state.shenindex;
            let index2 = e.detail.value;
            //省id
            shenid = this.state.selectorid[0];
            //市id
            shiid = dataCity.cityData[index1].children[index2].id;
            console.log('省：', dataCity.cityData[index1].value);
            console.log('市：', dataCity.cityData[index1].children[index2].value);
            console.log('区：', dataCity.cityData[index1].children[index2].children[0].value);
            dataCity.cityData[index1].children[index2].children.map(item => {
                qu.push(item.value);
            });
            //区id归零
            quid = dataCity.cityData[index1].children[index2].children[0].id;
            let tempselectorid = [shenid, shiid, quid];
            let tempselector = [shen, shi, qu];
            this.setState({ selector: tempselector, selectorid: tempselectorid, shiindex: index2, quindex: 0, havechange: true }, () => {
                this.onTabChange();
            })
        } else if (e.detail.column == 2) {
            let index1 = this.state.shenindex;
            let index2 = this.state.shiindex;
            //index3为第三列的第n个，区下标
            let index3 = e.detail.value;
            shenid = this.state.selectorid[0];
            shiid = this.state.selectorid[1];
            quid = dataCity.cityData[index1].children[index2].children[index3].id;
            console.log('省：', dataCity.cityData[index1].value);
            console.log('市：', dataCity.cityData[index1].children[index2].value);
            console.log('区：', dataCity.cityData[index1].children[index2].children[index3].value);
            let tempselectorid = [shenid, shiid, quid];
            this.setState({ selectorid: tempselectorid, quindex: index3, havechange: true }, () => {
                this.onTabChange();
            })
        }
    }

    render() {
        return (
            <Picker mode='multiSelector' range={this.state.selector} onColumnChange={this.onColumnChange} value={[this.state.shenindex, this.state.shiindex, this.state.quindex]}>
                <View className="editor-box">
                    <View className="editor-box_left">所在区域:</View>
                    <View className="editor-box_input">{this.state.selectorChecked.toString()}</View>
                    <View className="editor-box_right">
                        <AtIcon className="editor-box_icon" value='chevron-right' color='#f2f2f2' />
                    </View>
                </View>
            </Picker>
        )
    }
}
export default PagePicker
