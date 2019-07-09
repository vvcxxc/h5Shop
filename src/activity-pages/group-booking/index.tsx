import Taro, { PureComponent } from '@tarojs/taro';

import './index.scss';
import ListPage from '../components/list-page';
import List from './list';

class GroupBookingPage extends PureComponent {
	toDetail = item => {
		Taro.navigateTo({ url: '../appreciation/friend-help/index' });
	};
	render() {
		return (
			<ListPage hasBg>
				<List list={[1, 2, 3, 4, 5, 6]} onClick={this.toDetail} />
			</ListPage>
		);
	}
}
export default GroupBookingPage;
