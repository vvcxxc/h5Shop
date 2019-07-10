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
		this.setState({ showLine: !this.state.showLine })
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
			url: '/detail-pages/business/index?id=' + _id
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
	render() {
		const that = this.props.merchant
		this.styleControl()
		return (
			<View className={('merchant') + ' ' + (this.styleControl() ? '' : 'update-inset')}>
				<View className="content flex"
					style={{ paddingBottom: this.controlPicture(that.gift_pic, that.coupon_image_url) === false ? '10px' : ' 0px'}}
					onClick={this.handleClick.bind(this, this.props.merchant.id)}>
					{this.props.type !== 'activity' && <Image className="img" src={that.preview} />}
					{/* shop_door_header_img */}
					<View className="item" style="padding-top:15px">
						<View className="flex">
							<View className="title item">{that.name}</View>
							<AtIcon value="chevron-right" color="#999" size="16px" />
						</View>
						<View className="flex " style="position:relative">
							{
								that.label.map((item1: any, index1: any) => {
									return <View className="tag" style="background-color:#fff">{item1}</View>
								})
							}
							<View style="position:absolute; right:0px; line-height:1; bottom:2px;font-size:12px;" >{that.distance}
							</View> 
						</View>
					</View>
				</View>
				<View className="content_box" onClick={this.handleClick.bind(this, that.id)} style={{ display: this.controlPicture(that.gift_pic, that.coupon_image_url)===false? 'none':''}}>
					<View className='content_img'	>
						<Image src={that.coupon_image_url} />
					</View>
					<View className={this.controlPicture(that.gift_pic, that.coupon_image_url) === 2 ?
						'content_img' : 'hidden_content_img'}>
						<Image src={that.gift_pic} />
					</View>
				</View>
				<View>
					<View className="give flex center" style={{ display: this.judgeData(that.gift_name) }}>
						<View className="icon">礼</View>
						<View className="title item ellipsis-one">
							<Text className="strong">{that.gift_name}</Text>
						</View>
					</View>
					<View className="give flex center"
						style={{ display: typeof (that.gift_coupon_name) === 'string' && this.state.showLine ? '' : 'none' }}>
						<View className="icon" style="background: #5d84e0">卷</View>
						<View className="title item">
							<Text className="strong">{that.gift_coupon_name}</Text>
						</View>
					</View>
					<View className="give flex center"
						style={{
							display: typeof (that.exchange_coupon_name) === 'string' && this.state.showLine ? '' : 'none'
						}}>
						<View className="icon" style="background: #5dd8a5">惠</View>
						<View className="title item ellipsis-one">
							{that.exchange_coupon_name}

						</View>
					</View>
					<View className="more flex center" onClick={this.heightChange} style={
						{
							display: this.styleControl() ? '' : 'none'
						}}>
						<View style="color:#939393;margin-right:3px;">{this.state.showLine ? '收起' : '更多活动'}</View>
						<AtIcon value={this.state.showLine ? 'chevron-up' : 'chevron-down'} size='12' color='#939393'></AtIcon>
					</View>
					<View style={{ height: '10px', backgroundColor: '#ededed' }}></View>
				</View>
			</View>
		);
	}
}
