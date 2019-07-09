import Taro, { PureComponent, Config } from '@tarojs/taro';
import { View, Swiper, SwiperItem, Image } from '@tarojs/components';

import './index.scss';

class GroupBookingDetail extends PureComponent {
	config: Config = {
		navigationBarTitleText: ''
	};

	componentDidMount() {
		Taro.setNavigationBarTitle({ title: '当前详情' });
	}

	render() {
		return (
			<View className="page flex column">
				<View className="item">
					<View className="head">
						<Swiper>
							<SwiperItem>
								<Image
									className="banner-img"
									mode="widthFix"
									src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/dHBc2GQi27cjhNpsYpAnQYxybxPdADHG.png"}
								/>
							</SwiperItem>
						</Swiper>
						<View className="purchase-tip flex center left">
							<Image src="" className="img" />
							杨温饱 拼团成功
						</View>
					</View>
					<View className="content">
						<View className="title">一颗红包起司蛋糕餐券</View>
						<View className="time">活动时间：2019.3.10-2019.4.10</View>
						<View className="labels">
							<View className="item">送价值3000元蓝牙耳机</View>
							<View className="item">3人团</View>
							<View className="item">24小时</View>
						</View>
						<View className="detail">
							<View className="title">商品详情</View>
							<View className="text">
								简介详情简介详情简介详情简介详情简介详情简介详情简介
								简介详情简介详情简介详情简介详情简介详情。
							</View>
							<View className="see-more flex center">
								查看更多
								<Image src={require('./arrow-down.png')} mode="widthFix" className="img" />
							</View>
						</View>
					</View>
					<View className="give">
						<View className="title flex bottom">
							<View className="item">赠送礼品</View>
							<View className="link">图文详情</View>
						</View>
						<View className="sub-title">价值3000元的耳机一副</View>
						<View className="label">运费8元</View>
						<Image className="img" src="" mode="widthFix" />
					</View>
					<View className="flow flex center">
						<Image className="showy" src={require('./01.png')} />
						<View className="text">开始 拼团</View>
						<Image className="arrow" src="" />
						<Image className="showy" src={require('./02.png')} />
						<View className="text">邀请 好友</View>
						<Image className="arrow" src="" />
						<Image className="showy" src={require('./03.png')} />
						<View className="text">使用 送礼</View>
					</View>
					{/* 拼团规则 */}
					<View className="regiment-rule">
						<View className="title flex center">
							<View className="item">拼团规则</View>
							<Image src="" className="help" />
						</View>
						<View className="flex rule">
							<View className="label">拼团人数：</View>
							<View className="item">3人团</View>
						</View>
						<View className="flex rule">
							<View className="label">时间限制：</View>
							<View className="item">24小时内</View>
						</View>
						<View className="flex rule">
							<View className="label">详情描述：</View>
							<View className="item">3人团</View>
						</View>
						<View className="see-more flex center">
							查看更多
							<Image src={require('./arrow-down.png')} mode="widthFix" className="img" />
						</View>
					</View>
				</View>

				<View className="footer flex">
					<View className="price item flex">
						<View className="current flex center">
							<View className="small">￥</View>100
						</View>
						<View className="old flex left center">
							<View className="strikethrough">¥300</View>（含8元运费）
						</View>
					</View>
					<View className="btn pay">立即购买</View>
					<View className="btn regiment">发起拼团</View>
				</View>
			</View>
		);
	}
}
export default GroupBookingDetail;
