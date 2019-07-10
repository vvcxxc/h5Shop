import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast } from "taro-ui"
import { View, Text, Image, ScrollView, Button } from "@tarojs/components";

import request from '../../services/request'
import MobileImg from '../../assets/dianhua.png'
// import starImg from '../../assets/starcollect.png'
import AddressImg from '../../assets/address.png'
import "taro-ui/dist/style/components/toast.scss";
// import "taro-ui/dist/style/components/icon.scss";
// import 'taro-ui/dist/style/index.scss'
import "./index.scss";

interface Props {
    activity_appre: any;
}


/**商店 ITEM 组件 */
export default class ActivityAppreComponent extends Component<Props> {

    state: {
        activity_appre: [{
            //增值活动
            name: "",
            activity_brief: '',
            image_url: "",
            pay_money: '',
            return_money: '',
            market_price: '',
            init_money: '',
            gift_pic: ""
        }],
        activity_appre_bull: false,
    }
    componentDidMount() {
        // console.log(this.props.activity_appre)
        this.setState({
            activity_appre: this.props.activity_appre
        })
    }
    gotoAppreciation(_id) {
      console.log(_id)
      Taro.navigateTo({
        url: '/pages/activity/pages/detail/detail?id='+_id+'&type=1'
      })
    }

    render() {
        return (
            <View>
                <View style={{ height: "10px" }}></View>
                <View className="merchant-details__tit" style={{ fontSize: "19px", paddingLeft: "20px" }}>
                    <Text className="mark" style={{
                        fontSize: " 10px",
                        color: "#fff",
                        backgroundColor: "#C71D0B",
                        padding: "3px 5px",
                        borderRadius: " 2px",
                        marginRight: "10px"
                    }}>增</Text>
                    <Text className="fwb" style={{ fontWeight: "bold" }}>增值低价买</Text>
                </View>
                {/* 增值活动 */}
                {
                    this.state.activity_appre_bull ? this.state.activity_appre.map((item) => (
                        <View className="group-purchase bcfff" key={item.name}>
                            <View style={{ height: "5px" }}></View>
                            <View className="hd">
                                {/* <View className="merchant-details__tit">
                                    <Text className="mark">增</Text>
                                    <Text className="fwb">增值低价买</Text>
                                </View> */}
                                <View className="flex center">
                                    <View className="item desc">{item.name}</View>
                                </View>
                            </View>
                            <View className="image-list" style={{ position: "relative", marginBottom: "5px" }}>
                                <Image className="backg-image" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/andhNY3XKEWrW8nYBK5pyAptaJWeJz68.png"} />
                                <View className="img" style={{ width: "100%" }}   >
                                    <View className="box_left">
                                        <View className="box_left_price">￥{item.return_money}</View>
                                        <View className="box_left_return">最高可抵{item.return_money}元</View>
                                    </View>
                                    <View className="box_center">
                                        <View className="present">{item.activity_brief}</View>
                                        {/* <View className="present_recommend">送价值3000元耳机</View> */}
                                    </View>
                                    <View className="box_right" style={{ overflow: "hidden" }}>
                                        <Image className="image" src={item.image_url} style={{ width: "100%", height: "100%" }} />
                                    </View>
                                </View>
                            </View>
                            <View className="ft ">
                                <View className="flex center">
                                    <View className="item">
                                        <Text className="money">￥{item.pay_money}</Text>
                                        <Text className="count">{item.activity_brief}</Text>
                                    </View>
                                    <Button className="btn-go" onClick={this.gotoAppreciation.bind(this,item.youhui_id)}>立刻增值</Button>
                                </View>
                            </View>
                        </View>
                    )) : <View className="group-purchase bcfff">
                            <View className="hd">
                                {/* <View className="merchant-details__tit">
                                    <Text className="mark">增</Text>
                                    <Text className="fwb">增值低价买</Text>
                                </View> */}
                                <View className="flex center">
                                    <View className="item desc">{this.state.activity_appre[0].name}</View>
                                </View>
                            </View>
                            <View className="image-list" style={{ position: "relative", marginBottom: "5px" }}>
                                <Image className="backg-image" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/andhNY3XKEWrW8nYBK5pyAptaJWeJz68.png"} />
                                <View className="img" style={{ width: "100%" }}   >
                                    <View className="box_left">
                                        <View className="box_left_price">￥{this.state.activity_appre[0].return_money}</View>
                                        <View className="box_left_return">最高可抵{this.state.activity_appre[0].return_money}元</View>
                                    </View>
                                    <View className="box_center">
                                        <View className="present">{this.state.activity_appre[0].activity_brief}</View>
                                        {/* <View className="present_recommend">送价值3000元耳机</View> */}
                                    </View>

                                    <View className="box_right" style={{ overflow: "hidden" }}>
                                        <Image className="image" src={this.state.activity_appre[0].image_url} style={{ width: "100%", height: "100%" }} />
                                    </View>
                                </View>
                            </View>
                            <View className="ft ">
                                <View className="flex center">
                                    <View className="item">
                                        <Text className="money">￥{this.state.activity_appre[0].pay_money}</Text>
                                        <Text className="count">{this.state.activity_appre[0].activity_brief}</Text>
                                    </View>
                                    <Button className="btn-go" onClick={this.gotoAppreciation.bind(this,this.state.activity_appre[0].youhui_id)}>立刻增值</Button>
                                </View>
                            </View>
                        </View>
                }

                {
                    this.state.activity_appre.length != 1 ?
                        <View className="ft-more flex center"
                            style={{ textAlign: "center", margin: "0", width: "100%", background: "#fff" }}
                            onClick={() => { this.setState({ activity_appre_bull: !this.state.activity_appre_bull }) }}
                        >{this.state.activity_appre_bull ? "收回" : "查看更多"}
                            {this.state.activity_appre_bull ? <AtIcon value="chevron-up" color="#999" size="16px" /> : <AtIcon value="chevron-down" color="#999" size="16px" />}
                        </View>
                        : ""
                }
                <View style={{ height: "10px" }}></View>
                <hr />
            </View>
        );
    }
}
