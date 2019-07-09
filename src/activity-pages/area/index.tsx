import Taro , { PureComponent } from '@tarojs/taro';
import { View, Text , Button} from '@tarojs/components';
import AreaActiveItem from './active-item';
import './style.scss'
import AreaList from './list';

class AreaPage extends PureComponent {

   config = {
       navigationBarTitleText: '地址'
  }

  state={}

  componentWillMount () {}

  render() {
    return (
      <View className="page">
        <View className="head">
          <AreaActiveItem></AreaActiveItem>
        </View>
        <View className="list">
          <AreaList list={[{id: 1}, {id: 2}]}></AreaList>
        </View>
      </View>
    );
  }
}
export default AreaPage;
