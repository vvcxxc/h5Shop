import Taro, { PureComponent } from '@tarojs/taro';
import { View } from '@tarojs/components';

import './index.scss';
import { AtIcon } from 'taro-ui';
import request from '../../services/request';

interface Props {
	type: any;
	onChange: (number) => any;
}
class FilterTab extends PureComponent<Props> {
	state = {
		current: null,
		open: false,
		titleList: [
			
			// '美食',
			// '附近',
			// '智能排序'
		],
		updateTitle:[]
	};
	constructor() {
		super(...arguments)
	}

	componentWillMount() {
		this.getData();
	}

	// this.props.type

	handleClick = current => () => {
		console.log(current, 'current')
	
		// this.setState({ titleList:[]})
		if (this.state.current === current) {
			this.setState({ current: null })
			this.props.onChange(null);
			return
		}
		this.setState({ current: current })
		this.props.onChange(current); // 点击传参
	};

	getData() {
		request({
			url: 'v3/select',
			data:{type:1}
		})
			.then((res: any) => {
				console.log(res,'defienres')
			})
			.catch(() => {
			})
	}

	identifyData() {
		
	}

	render() {
		// const tabs = ['美食', '附近', '智能排序'];
		const tabsEle = this.state.titleList.map((_, index) => {
			const checked = index === this.state.current;
			return (
				<View
					style="background-color:#fff;"
					key={_}
					className={(checked ? 'checked' : '') + ' item flex center'}
					onClick={this.handleClick(index)}
				>
					<View className="title">{_}</View>
					<AtIcon value={(checked ?  'chevron-up':'chevron-down')} color={checked ? '#FF6654' : '#999'} size={12} />
				</View>
			);
		});

		return <View className="filter flex">{tabsEle}</View>;
	}
}
export default FilterTab;
