import Taro, { PureComponent, Config } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';

import './index.scss';
import ProgressBar from './progress-bar';
import List from './list';

class FriendHelp extends PureComponent {
	config: Config = {
		navigationBarTitleText: '增值'
	};

	render() {
		return (
			<View className="page">
				<View className="shop">
					<View className="head flex center">
						<Image className="merchant-icon" src={require('./share.png')} />
						<View className="title item">杨大富的五金店</View>
						<View className="share-btn flex center">
							<Image className="share-icon" src={require('./share1.png')} />
							分享
						</View>
					</View>
					<View className="coupon">
						<Image className="img" mode="widthFix" src={require('./crad.png')} />
					</View>
					<View className="time">活动时间：2019.3.10-2019.4.10</View>
				</View>
				<ProgressBar min={0} max={100} current={65} />
				<View className="invite-btn">邀请好友增值</View>
				<View className="content">
					<View className="title">已帮增值好友</View>
					<List list={[1, 2, 3, 4, 5, 6]} />
				</View>
			</View>
		);
	}
}

export default FriendHelp;
