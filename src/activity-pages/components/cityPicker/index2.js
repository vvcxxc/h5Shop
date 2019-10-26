import Taro, { Component } from '@tarojs/taro'
import { AtIcon } from "taro-ui"
import { View, Text, Picker, Input } from '@tarojs/components'
import request from '../../../services/request'
import './index.scss'

let shen = []
let shi = []
let qu = []
let shenid = ''
let shiid = ''
let quid = ''


class PagePicker extends Component {
    state = {
        dataList: [],
        shenindex: '0',
        shiindex: '0',
        quindex: '0',
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
        shen = []
        shi = []
        qu = []
        shenid = ''
        shiid = ''
        quid = ''
        request({
            url: 'v3/district',
            method: "GET",
            data: { model_type: 1 }
        })
            .then((res) => {
                // 省
                res.data.map(item => {
                    shen.push(item.value);
                })
                res.data[0].children.map(item => {
                    shi.push(item.value);
                })
                res.data[0].children[0].children.map(item => {
                    qu.push(item.value);
                })
                shenid = res.data[0].id;
                shiid = res.data[0].children[0].id;
                quid = res.data[0].children[0].children[0].id;
                let tempselectorid = [shenid, shiid, quid];
                let tempselector = [shen, shi, qu];
                this.setState({ dataList: res.data, selector: tempselector, selectorid: tempselectorid }, () => {
                    console.log(tempselectorid)
                })
            })
    }
    onTabChange = () => {
        let tempselectorid = this.state.selectorid;
        let { shenindex, shiindex, quindex } = this.state;
        let shenName = this.state.dataList[Number(shenindex)].value;
        let shiName = this.state.dataList[Number(shenindex)].children[Number(shiindex)].value;
        let quName = this.state.dataList[Number(shenindex)].children[Number(shiindex)].children[Number(quindex)].value;
        let selectorChecked = shenName + '-' + shiName + '-' + quName;
        this.setState({ selectorChecked: shenName + '-' + shiName + '-' + quName }, () => {
            this.props.getCity && this.props.getCity(tempselectorid)
        })
    }
    onColumnChange = e => {
        console.log(e)
        //第一列下标0
        if (e.detail.column == 0) {
            shi = [];
            qu = [];
            //index1为第一列的第n个,省下标
            let index1 = e.detail.value;
            //省id
            shenid = this.state.dataList[index1].id;
            this.state.dataList[index1].children.map(item => {
                shi.push(item.value);
            });
            //市id归零
            shiid = this.state.dataList[index1].children[0].id;
            this.state.dataList[index1].children[0].children.map(item => {
                qu.push(item.value);
            });
            //区id归零
            quid = this.state.dataList[index1].children[0].children[0].id;
            let tempselectorid = [shenid, shiid, quid];
            let tempselector = [shen, shi, qu];
            this.setState({ selector: tempselector, selectorid: tempselectorid, shenindex: index1, havechange: true }, () => {
                // console.log(tempselectorid);
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
            shiid = this.state.dataList[index1].children[index2].id;
            this.state.dataList[index1].children[index2].children.map(item => {
                qu.push(item.value);
            });
            //区id归零
            quid = this.state.dataList[index1].children[index2].children[0].id;
            let tempselectorid = [shenid, shiid, quid];
            let tempselector = [shen, shi, qu];
            this.setState({ selector: tempselector, selectorid: tempselectorid, shiindex: index2, havechange: true }, () => {
                // console.log(tempselectorid);
                this.onTabChange();
            })
        } else if (e.detail.column == 2) {
            let index1 = this.state.shenindex;
            let index2 = this.state.shiindex;
            //index3为第三列的第n个，区下标
            let index3 = e.detail.value;
            shenid = this.state.selectorid[0];
            shiid = this.state.selectorid[1];
            quid = this.state.dataList[index1].children[index2].children[index3].id;
            let tempselectorid = [shenid, shiid, quid];
            this.setState({ selectorid: tempselectorid, quindex: index3, havechange: true }, () => {
                // console.log(tempselectorid);
                this.onTabChange();
            })
        }
    }

    render() {
        return (
            <Picker mode='multiSelector' range={this.state.selector} onColumnChange={this.onColumnChange} >
                <View className="editor-box">
                    <View className="editor-box_left">所在区域:</View>
                    <Input className="editor-box_input" value={this.state.selectorChecked.toString()} disabled />
                    <View className="editor-box_right">
                        <AtIcon className="editor-box_icon" value='chevron-right' color='#f2f2f2' />
                    </View>
                </View>
            </Picker>
        )
    }
}
export default PagePicker