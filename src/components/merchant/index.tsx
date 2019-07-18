import Taro, { Component, ComponentOptions } from '@tarojs/taro';
import { View, Text, Image } from '@tarojs/components';
import { AtIcon } from "taro-ui";
import './index.scss';

interface Props {
	merchant: any;
	onClick: (id: number | string) => any;
	type?: string;
}


/**商店 ITEM 组件 */
export default class Merchant extends Component<Props> {
	static options: ComponentOptions = {
		addGlobalClass: true
	};
	state: {
		showLine: false,
		num: 1
	}
	componentDidMount() {
	}

	heightChange = () => {
		this.setState({ showLine: !this.state.showLine }, () => {
		})
	}

	styleControl = () => {
		const that = this.props.merchant
		if (this.props.merchant) {
			if (
				that.exchange_coupon_name === null &&
				that.gift_coupon_name === null &&
				that.gift_name === null) {
				return false
			}
			return true
		}
	}


	handleClick = (_id, e) => {
		Taro.navigateTo({
			url: '/pages/business/index?id=' + _id
		})
	};

	judgeData = (value1) => {
		return typeof (value1) === 'string' ? (value1.length > 1 ? '' : 'none') : 'none'
	}
	controlPicture = (gift, coupon) => { // 控制图片显示
		if (!coupon && !gift) return false //两个图片都没有 显示门头照preview
		if (!gift) return 1 //礼品图不存在 只显示一张coupon
		return 2 //两张都显示
	}

	twoActivity = (value1, value2, value3) => {
		if (this.judgeActivity(value1) && this.judgeActivity(value2) && this.judgeActivity(value3)) return true
		if (this.judgeActivity(value1) && this.judgeActivity(value2)) return 'preferential'
		if (this.judgeActivity(value1) && this.judgeActivity(value3)) return 'coupons'
		if (this.judgeActivity(value2) && this.judgeActivity(value3)) return 'gift'
		return false
	}
	// 判断活动信息
	judgeActivity = (data) => {
		if (!data) return false
		if (data) {
			if (typeof (data) === 'string' && data.length >= 1) return true
			return false
		}
	}

	render() {
		const that = this.props.merchant
		this.styleControl()
		return (
			<View className={('merchant') + ' ' + (this.styleControl() ? '' : 'update-inset')}>
				<View style={{ height: '7px', backgroundColor: '#F6F6F6' }}></View>
				<View className="content flex"
					style={{ paddingBottom: '10px' }}
					onClick={this.handleClick.bind(this, this.props.merchant.id)}>
					{this.props.type !== 'activity' && <Image className="img" src={that.preview} />}
					<View className="item" style="padding-top:15px">
          <View className="flex">
              <View className="title item ellipsis-one" style="width:50px">{that.name}</View>
              <AtIcon value="chevron-right" color="#999" size="16px" />
            </View>
						<View className="flex " style="position:relative">
							{
								that.label.map((item1: any, index1: any) => {
									return <View className="tag" style="background-color:#fff; border: 1px solid rgba(255, 102, 84, 1);">{item1}</View>
								})
							}
							<View style="position:absolute; right:0px; line-height:1; bottom:2px;font-size:12px;" >{that.distance}
							</View>
						</View>
					</View>
				</View>
				<View className="content_box" onClick={this.handleClick.bind(this, that.id)}
					style="padding-top:0px"
				>
					<View className='content_img'	>
						<Image src={this.controlPicture(that.gift_pic, that.coupon_image_url) === false ? that.preview : that.coupon_image_url} />
					</View>
					<View className={this.controlPicture(that.gift_pic, that.coupon_image_url) === 2 ?
						'content_img' : 'hidden_content_img'} style="position:relative;  padding-left:2px; margin-left:5px; ">
						<Image src={require("./border.png")} style="position:absolute; top:0px;left:0px; z-index:2" />
						<Image src={require("./qiu.png")} style="position:absolute; top:-4px;left:41%; width:25px;height:25px;z-index:2" />
						<Image src={that.gift_pic} />
					</View>
				</View>
				<View></View>
				<View style={{ display: this.judgeActivity(that.gift_name) ? '' : 'none' }}>
					<View className={this.judgeActivity(that.gift_name) ? 'flex give center' : ' hidden'}>
						<View className="icon">礼</View>
						<View className="title item ellipsis-one">
							<Text >{that.gift_name}</Text>
						</View>
					</View>
					<View
						className='flex give center'
						style={{ display: this.judgeActivity(that.cash_coupon_name) && this.state.showLine ? '' : 'none' }}>
						<View className="icon" style="background: #5d84e0">券</View>
						<View className="title item">
							<Text>{that.cash_coupon_name}</Text>
						</View>
					</View>
					<View
						className='flex give center'
						style={{ display: this.judgeActivity(that.exchange_coupon_name) && this.state.showLine ? '' : 'none' }}>
						<View className="icon" style="background: #5dd8a5">惠</View>
						<View className="title item ellipsis-one">
							{that.exchange_coupon_name}
						</View>
					</View>
					<View className="more flex center" onClick={this.heightChange} style={
						{
							display: this.twoActivity(that.gift_name, that.cash_coupon_name, that.exchange_coupon_name) !== false
								? '' : 'none'
						}}>
						<View style="color:#939393;margin-right:3px; font-size: 12px;">{this.state.showLine ? '收起' : '更多活动'}</View>
						<AtIcon value={this.state.showLine ? 'chevron-up' : 'chevron-down'} size='12' color='#939393'></AtIcon>
					</View>
				</View>

				<View style={{
					display: !this.judgeActivity(that.gift_name) && this.judgeActivity(that.cash_coupon_name) ? '' : 'none'
				}}>
					<View
						className='flex give center'
						style={{ display: this.judgeActivity(that.cash_coupon_name)  ? '' : 'none' }}>
						<View className="icon" style="background: #5d84e0">券</View>
						<View className="title item">
							<Text>{that.cash_coupon_name}</Text>
						</View>
					</View>
					<View
						className='flex give center'
						style={{ display: this.judgeActivity(that.exchange_coupon_name) && this.state.showLine ? '' : 'none' }}>
						<View className="icon" style="background: #5dd8a5">惠</View>
						<View className="title item ellipsis-one">
							{that.exchange_coupon_name}
						</View>
					</View>
					<View className="more flex center" onClick={this.heightChange} style={
						{
							display: this.twoActivity(that.gift_name, that.cash_coupon_name, that.exchange_coupon_name) !== false
								? '' : 'none'
						}}>
						<View style="color:#939393;margin-right:3px; font-size: 12px;"
						>{this.state.showLine ? '收起' : '更多活动'}</View>
						<AtIcon value={this.state.showLine ? 'chevron-up' : 'chevron-down'} size='12' color='#939393'></AtIcon>
					</View>
				</View>

				<View style={{
					display: !this.judgeActivity(that.gift_name) && !this.judgeActivity(that.cash_coupon_name) ? '' : 'none'
				}}>

					<View
						className='flex give center'
						style={{
							display: !this.judgeActivity(that.exchange_coupon_name) &&
								!this.judgeActivity(that.gift_name) &&
								this.judgeActivity(that.exchange_coupon_name) ? '' : 'none'
						}}>
						<View className="icon" style="background: #5dd8a5">惠</View>
						<View className="title item ellipsis-one">
							{that.exchange_coupon_name}
						</View>
					</View>
				</View>
			</View>
		);
	}
}
