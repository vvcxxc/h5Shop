import Taro, { PureComponent } from '@tarojs/taro';
import { View } from '@tarojs/components';

import './index.scss';
import ListPage from '../components/list-page';
import List from './list';

class GroupBookingPage extends PureComponent {
	render() {
		return (
			<ListPage hasBg>
				<List list={[1, 2, 3, 4, 5, 6]} />
			</ListPage>
		);
	}
}
export default GroupBookingPage;
