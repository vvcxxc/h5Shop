import Taro, { PureComponent } from '@tarojs/taro';
import { View } from '@tarojs/components';

import './index.scss';
import Item from './item';

class List extends PureComponent<any> {
	defaultProps = {
		list: []
	};
	render() {
		const list = this.props.list.map(_ => <Item key={_} item={_} />);
		return <View>{list}</View>;
	}
}
export default List;
