import Taro, { PureComponent } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtIcon } from 'taro-ui'
import './index.scss';

interface Props {
  merchant?: any;
  // onClick: (id: number | string) => any;
  type?: string;
  updateData: ( show: null, id?: string, name?: string, type?: string) => any;
}

class LiftList extends PureComponent<Props> {

  state = {
    current: 0,
    open: false,
    data:[{id:'',name:'',value:'',label:''}]
  };

  constructor() {
    super(...arguments)
 
  }
  componentWillMount() {
  
  }
  componentDidMount() {
  }
  
  handleClick = (index, id,name) => () => {
    this.setState({ current: index})
    // this.props.updateData({null,id,name})
  };
 
  render() {
<<<<<<< HEAD
    console.log(this.state.data,'data')
=======
>>>>>>> 5b85fbcf174a2fc70aee9af5a175757a982f1e69
    const tabsEle = this.props.merchant.map((item, index,_) => {
      const checked = index === this.state.current;
      return (
        <View className='line' key={''}>
          <View className={(checked ? 'click-line' : '')}
            onClick={this.handleClick(index,item.id,item.name)}
            style="width:100%"
          >{item.name}</View>
          <AtIcon  value='check' size={(checked ? '12' : '0')} color='#fe7b70'></AtIcon>
        </View>
      );
    });
    return <View className="over" style="padding:0px 10px; overflow:hidden;background-color:#fff;">{tabsEle}</View>;
  }
}
export default LiftList;
