import Taro, { PureComponent } from '@tarojs/taro';
import { View } from '@tarojs/components';

import './index.scss';

interface Props {
	min: number;
	max: number;
	current: number;
}

class ProgressBar extends PureComponent<Props> {
	render() {
		const { current, min, max } = this.props;
		const scale = ((current - min) / max) * 100;
		return (
			<View className="progress">
				<View className="bar">
					<View className="tip" style={{ left: scale + '%' }}>
						¥{current}
					</View>
					<View className="bar-bg">
						<View className="bar-line" style={{ width: scale + '%' }} />
					</View>
				</View>
				<View className="flex info">
					<View className="item">起始增值¥{min}</View>
					<View className="item">最高增值¥{max}</View>
				</View>
			</View>
		);
	}
}
export default ProgressBar;
