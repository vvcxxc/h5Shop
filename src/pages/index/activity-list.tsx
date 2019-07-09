import Taro, { PureComponent } from '@tarojs/taro';
import { View } from '@tarojs/components';
import Merchant from 'src/components/merchant';
interface Props {
	list: any[];
	onClick: (number) => any;
}

class ActivityList extends PureComponent<Props> {
	render() {
		const list = this.props.list.map(_ => (
			<Merchant type="activity" merchant={_} key={_} onClick={this.props.onClick} />
		));
		return <View>{list}</View>;
	}
}
export default ActivityList;
