import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast } from "taro-ui"
import { View, Text, Image, ScrollView, Button } from "@tarojs/components";
import "./index.styl";
import request from '../../services/request'
import MobileImg from '../../assets/dianhua.png'
// import starImg from '../../assets/starcollect.png'
import AddressImg from '../../assets/address.png'
import "taro-ui/dist/style/components/toast.scss";
// import "taro-ui/dist/style/components/icon.scss";
// import 'taro-ui/dist/style/index.scss'



interface Props {
    exchangeCouponList: any;
}


/**商店 ITEM 组件 */
export default class ExchangeCouponComponent extends Component<Props> {

    state: {
        exchangeCouponList: [
            {
                begin_time: "",
                brief: "",
                end_time: "",
                id: 1590,
                image: "",
                list_brief: "",
                name: "",
                youhui_type: 0,
                pay_money: ""
            }
        ],
        exchangeCouponList_bull: false
    }
    componentDidMount() {
        this.setState({
            exchangeCouponList: this.props.exchangeCouponList
        })
    }
    handleClick = (_id, e) => {
        Taro.navigateTo({
            url: '../../business-pages/set-meal/index?id=' + _id
        })
    }
    handleClick2 = (id, e) => {
        Taro.navigateTo({
            url: '../../business-pages/confirm-order/index?id=' + id
        })
    }
    render() {
        return (
            <View >
                <View className="merchant-details__tit" style={{ fontSize: "19px", paddingLeft: "20px" }}>
                    <Text className="mark" style={{
                        fontSize: " 10px",
                        color: "#fff",
                        backgroundColor: "#5DD8A5",
                        padding: "3px 5px",
                        borderRadius: " 2px",
                        marginRight: "10px"
                    }}>惠</Text>
                    <Text className="fwb" style={{ fontWeight: "bold" }}>优惠信息</Text>
                </View>
                <View className="discounts-view bcfff" >
                    {
                        this.state.exchangeCouponList_bull ? this.state.exchangeCouponList.map((item) => (
                            <div key={item.id}>
                                {/* <View className="merchant-details__tit">
                                    <View style={{ height: "10px" }}></View>
                                    <Text className="mark bc5D84E0" style={{ background: "#58bc58" }}>惠</Text>
                                    <Text className="fwb">优惠信息</Text>
                                </View> */}
                                <View className="discounts-cells" onClick={this.handleClick.bind(this, item.id)}>
                                    <View className="discounts-cell flex center">
                                        <Image className="image" src={item.image} />
                                        <View className="discounts-cell__bd item">
                                            <View className="tit">{item.name}</View>
                                            <View className="desc">{item.brief}</View>
                                            <View className="flex center" style={{ position: "relative" }}>
                                                <View className="money" style={{ position: 'absolute', left: '0' }}>￥{item.pay_money}</View>
                                                <Button className="btn-buy" onClick={this.handleClick2.bind(this, item.id)} style={{ position: 'absolute', right: '20px' }}>立即购买</Button>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </div>)) :
                            <div >
                                {/* <View className="merchant-details__tit">
                                    <View style={{ height: "10px" }}></View>
                                    <Text className="mark bc5D84E0" style={{ background: "#58bc58" }}>惠</Text>
                                    <Text className="fwb">优惠信息</Text>
                                </View> */}
                                <View className="discounts-cells" onClick={this.handleClick.bind(this, this.state.exchangeCouponList[0].id)}>
                                    <View className="discounts-cell flex center">
                                        <Image className="image" src={this.state.exchangeCouponList[0].image} />
                                        <View className="discounts-cell__bd item">
                                            <View className="tit">{this.state.exchangeCouponList[0].name}</View>
                                            <View className="desc">{this.state.exchangeCouponList[0].brief}</View>
                                            <View className="flex center" style={{ position: "relative" }}>
                                                <View className="money" style={{ position: 'absolute', left: '20px' }}>￥{this.state.exchangeCouponList[0].pay_money}</View>
                                                <Button className="btn-buy" onClick={this.handleClick2.bind(this, this.state.exchangeCouponList[0].id)} style={{ position: 'absolute', right: '20px' }}>立即购买</Button>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            </div>
                    }

                    {
                        this.state.exchangeCouponList.length != 1 ?
                            <View className="ft-more flex center"
                                style={{ textAlign: "center", margin: "0", width: "100%", background: "#fff" }}
                                onClick={() => { this.setState({ exchangeCouponList_bull: !this.state.exchangeCouponList_bull }) }} >{this.state.exchangeCouponList_bull ? "收回" : "查看更多"}
                                {this.state.exchangeCouponList_bull ? <AtIcon value="chevron-up" color="#999" size="16px" /> : <AtIcon value="chevron-down" color="#999" size="16px" />}
                            </View> : ""
                    }
                    <View style={{ height: "10px" }}></View>
                </View>
            </View>
        );
    }
}
