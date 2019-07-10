import Taro, { PureComponent } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtSearchBar } from 'taro-ui';

import './index.scss';
// import FilterTab from 'src/components/filter-tab';

interface Props {
	hasBg?: boolean;
}

class ListPage extends PureComponent<Props> {
	state = {
		searchStr: ''
	};

	handleSearchBarChange = value => this.setState({ searchStr: value });

	handleSearch = () => {
		// let res = global2
	};

	render() {
		return (
			<View className="flex column component">
				<AtSearchBar
					placeholder="请输入城市名/拼音"
					value={this.state.searchStr}
					onChange={this.handleSearchBarChange}
					onConfirm={this.handleSearch}
				/>
				<View className={this.props.hasBg ? 'bg' : ''}>
					{/* <FilterTab onChange={this.handleSearch}/> */}
				</View>
				<View className="item">{this.props.children}</View>
			</View>
		);
	}
}
export default ListPage;
