import Taro, { PureComponent } from '@tarojs/taro';
import { View, Image } from '@tarojs/components';

import './index.scss';

export default class Item extends PureComponent<any> {
	render() {
		return (
			<View className="friend-item flex center">
				<Image src="" className="user-logo" />
				<View className="name">杨大幅</View>
				<View className="info item">帮增值10元</View>
				<View className="time">2019.3.4 12:33</View>
			</View>
		);
	}
}
