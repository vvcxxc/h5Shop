import Taro, { PureComponent } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';

import './index.scss';

interface Props {
	item: any;
	onClick: (any) => any;
}

class ActivityItem extends PureComponent<Props> {
	handleClick = () => this.props.onClick && this.props.onClick(this.props.item);

	render() {
		return (
			<View className="component" onClick={this.handleClick}>
				<View className="flex">
					<View className="item">拼团活动名称拼团活动名称拼团...</View>
					<View className="head-btn">3人团</View>
				</View>
				<View className="flex label-wrap">
					<View className="store-btn">
						<Image className="merchant-icon" src={require('./merchant.png')} />
						杨大富的五金店
					</View>
				</View>
				<View className="line" />
				<View className="flex hot-img">
					<View className="item">
						<Image mode="widthFix" className="img" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/dHBc2GQi27cjhNpsYpAnQYxybxPdADHG.png"} />
					</View>
					<View className="item">
						<Image mode="widthFix" className="img" src={"http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/dHBc2GQi27cjhNpsYpAnQYxybxPdADHG.png"} />
					</View>
				</View>
				<View className="flex bottom">
					<View className="price">¥100</View>
					<View className="info item">已拼2000件</View>
					<View className="check-btn">立即拼团</View>
				</View>
			</View>
		);
	}
}
export default ActivityItem;
