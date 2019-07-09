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
	cashCouponList: any;
}


/**商店 ITEM 组件 */
export default class CashCouponListComponent extends Component<Props> {

	state: {
		cashCouponList: [{//优惠券列表
			id: '',
			name: '',
			image: "",
			image_type: '',
			address: '',
			list_brief: '',
			brief: '',
			youhui_type: '1',
			begin_time: '',
			end_time: '',
			pay_money: "",
			expire_day: ""
		}],
		couponList_bull: false
	}
	componentDidMount() {
		// console.log(this.props.cashCouponList)
		this.setState({
			cashCouponList: this.props.cashCouponList
		})
	}
	handleClick = (_id, e) => {
		Taro.navigateTo({
			url: '../../business-pages/ticket-buy/index?id=' + _id
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
						backgroundColor: "#5D84E0",
						padding: "3px 5px",
						borderRadius: " 2px",
						marginRight: "10px"
					}}>券</Text>
					<Text className="fwb" style={{ fontWeight: "bold" }}>现金券</Text>
				</View>
				<View className="bcfff ticket" id="couponList_tiket" >
					{
						this.state.couponList_bull ? this.state.cashCouponList.map((item) => (
							<div>
								{/* <View className="merchant-details__tit" >
									<View style={{ height: "5px" }}></View>
									<Text className="mark bc5D84E0">券</Text>
									<Text className="fwb">{item.youhui_type == '1' ? '现金券' : '兑换卷'}</Text>
								</View> */}
								<View className="ticket-view flex center" style={{ position: 'relative' }} onClick={this.handleClick.bind(this, item.id)}>
									<View className="left" style={{ position: 'absolute', left: '30px' }}>
										<View className="money">{item.name}</View>
										<View className="desc">购买后{item.expire_day}天有效</View>
										<View className="sales">{item.brief}</View>
									</View>
									<View className="right" style={{ position: 'absolute', right: '20px' }}>
										<View className="money">￥<Text>{item.pay_money}</Text></View>
										<Button className="btn-buy" onClick={this.handleClick2.bind(this, item.id)} >立即购买</Button>
									</View>
								</View>
								<br />
							</div>
						)) : <div>
								{/* <View className="merchant-details__tit">
									<Text className="mark bc5D84E0">券</Text>
									<Text className="fwb">{this.state.cashCouponList[0].youhui_type == '1' ? '现金券' : '兑换卷'}</Text>
								</View> */}
								<View className="ticket-view flex center" style={{ position: 'relative' }} onClick={this.handleClick.bind(this, this.state.cashCouponList[0].id)}>
									<View className="left" style={{ position: 'absolute', left: '30px' }}>
										<View className="money">{this.state.cashCouponList[0].name}</View>
										<View className="desc">购买后{this.state.cashCouponList[0].expire_day}天有效</View>
										<View className="sales">{this.state.cashCouponList[0].brief}</View>
									</View>
									<View className="right" style={{ position: 'absolute', right: '20px' }}>
										<View className="money">￥<Text>{this.state.cashCouponList[0].pay_money}</Text></View>
										<Button className="btn-buy" onClick={this.handleClick2.bind(this, this.state.cashCouponList[0].id)} >立即购买</Button>
									</View>
								</View>
								<br /></div>}
					<View className="ft-more flex center"
						style={{ textAlign: "center", margin: "0", width: "100%", background: "#fff" }}
						onClick={() => { this.setState({ couponList_bull: !this.state.couponList_bull }) }} >{this.state.couponList_bull ? "收回" : "查看更多"}
						{this.state.couponList_bull ? <AtIcon value="chevron-up" color="#999" size="16px" /> : <AtIcon value="chevron-down" color="#999" size="16px" />}
					</View>
				</View>
				<View style={{ height: "10px" }}></View>
				<hr />
			</View>
		);
	}
}
