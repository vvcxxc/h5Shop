import Taro, { PureComponent, Component } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { AtIcon } from 'taro-ui'
import request from '../../services/request';
import './index.scss';

interface Props {
  onClick: (id1, id2, id3) => any;
  onscroll: (scroll) => any, //是否禁止滚动
  hidden: boolean
}
export default class filterTotal extends Component<Props> {

  state = {
    page_bottom: false,
    titleClick: 0,//点击的索引
    // selectData1: [{ name: '', id: '', type: '', choose: false, icon: '' }],
    selectData1: [
      {
        id: 0,
        label: "全部",
        name: "全部"
      }
    ],
    selectData2: [{ name: '', id: '', type: '', choose: false, icon: '' }],
    selectData3: [{ name: '', id: '', type: '', choose: false, icon: '' }],
    listClick: 333,
    click1: 1,
    click2: 1,
    click3: 1,
    list1: null,
    list2: null,
    list3: null,
    listId1: null,
    listId2: null,
    listId3: null,
    name1: '',
    name2: '',
    name3: '',
    red1: '',
    red2: '',
    red3: '',
    banScroll: false  //是否禁止滚动
  };

  constructor() {
    super(...arguments)
  }
  componentWillMount() {
    // 初始 得到三组数据
    this.clearClick0()
    this.getSelect1();
    this.getSelect2();
    this.getSelect3();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.hidden) this.onTouchMoveData()
  }

  // 回归初始状态
  clearClick0 = () => {
    this.setState({ click1: 1 })
    this.setState({ click2: 1 })
    this.setState({ click3: 1 })
  }

  titleClick1 = (index?, type?) => () => {
    this.setState({ click1: this.state.click1 + index }, () => {
      if (this.state.click1 % 2 !== 0) { //点击了两次
        this.clearClick0();  //清除所有
        this.setState({ page_bottom: false })
        this.props.onscroll(false)
      } else {
        this.props.onscroll(true)
        this.setState({ page_bottom: true })//开启遮挡层
        this.clearClick0()
        this.setState({ click1: 2 })
      }
    });
  }

  titleClick2 = (index) => () => {
    this.setState({ click2: this.state.click2 + index - 1 }, () => {
      if (this.state.click2 % 2 !== 0) { //点击了两次
        this.clearClick0();  //清除所有
        this.setState({ page_bottom: false })
        this.props.onscroll(false)
      } else {
        this.props.onscroll(true)
        this.setState({ page_bottom: true })
        this.clearClick0()
        this.setState({ click2: 2 })
      }
    });
  }

  titleClick3 = (index) => () => {
    this.setState({ click3: this.state.click3 + index - 2 }, () => {
      if (this.state.click3 % 2 !== 0) { //点击了两次
        this.props.onscroll(false)
        this.clearClick0();  //清除所有
        this.setState({ page_bottom: false })
      } else {
        this.props.onscroll(true)
        this.setState({ page_bottom: true })
        this.clearClick0()
        this.setState({ click3: 2 })
      }
    });
  }

  listClick1(index, id?, name?) {
    this.props.onscroll(false)
    this.clearClick0();  //清除所有
    this.setState({ page_bottom: false })//开启遮挡层
    if (this.state.listId1 === id) {
      this.setState({ red1: false })
      this.setState({ name1: null })
      this.setState({ list1: null })
      this.setState({ listId1: null }, () => {
        this.props.onClick(this.state.listId1, this.state.listId2, this.state.listId3)
      })
      return
    }
    this.setState({ red1: true })
    this.setState({ name1: name })
    this.setState({ listId1: id }, () => {
      this.props.onClick(this.state.listId1, this.state.listId2, this.state.listId3)
    })
    this.setState({ list1: index })
  }

  listClick2(index, id?, name?) {
    this.props.onscroll(false)
    this.clearClick0(); //让三个 全部隐藏
    this.setState({ page_bottom: false })//开启遮挡层
    if (this.state.listId2 === id) {
      this.setState({ red2: false })
      this.setState({ name2: null })
      this.setState({ list2: null })
      this.setState({ listId2: null }, () => {
        this.props.onClick(this.state.listId1, this.state.listId2, this.state.listId3)
      })
      return
    }
    this.setState({ red2: true })
    this.setState({ name2: name })
    this.setState({ listId2: id }, () => {
      this.props.onClick(this.state.listId1, this.state.listId2, this.state.listId3)
    })
    this.setState({ list2: index })
  }

  listClick3(index, id?, name?) {
    this.props.onscroll(false)
    this.clearClick0(); //让三个 全部隐藏
    this.setState({ page_bottom: false })
    if (this.state.listId3 === id) {
      this.setState({ red3: false })
      this.setState({ name3: null })
      this.setState({ list3: null })
      this.setState({ listId3: null }, () => {
        this.props.onClick(this.state.listId1, this.state.listId2, this.state.listId3)
      })
      return
    }
    this.setState({ red3: true })
    this.setState({ name3: name })
    this.setState({ listId3: id }, () => {
      this.props.onClick(this.state.listId1, this.state.listId2, this.state.listId3)
    })
    this.setState({ list3: index })
  }


  getSelect1 = () => {
    request({
      url: 'v3/select',
      data: { type: 1 }
    })
      .then((res: any) => {

        // this.setState({ selectData1: res.data })
        this.setState({
          selectData1: this.state.selectData1.concat(res.data)
        }, () => {
          console.log(this.state)
        })
      })
  }

  getSelect2 = () => {
    request({
      url: 'v3/select',
      data: { type: 2 }
    })
      .then((res: any) => {
        this.setState({ selectData2: res.data })
      })
  }

  getSelect3 = () => {
    request({
      url: 'v3/select',
      data: { type: 3 }
    })
      .then((res: any) => {
        this.setState({ selectData3: res.data })
      })
  }

  //点击遮挡层，然后下拉组件隐藏
  KeepOutClick = (e) => {
    this.clearClick0();
    this.setState({ page_bottom: false })
    this.props.onscroll(false)
    // Taro.hideNavigationBarLoading()
  }

  onTouchMoveData = () => {
    this.clearClick0();
    this.props.onscroll(false)
    this.setState({ page_bottom: false })
  }

  // this.props. hidden = () => {
  //   console.log('3233')
  // }

  render() {
    return <View>
      <View className="page">
        <View className="title" catchtouchmove="true">
          <View className={this.state.click1 % 2 === 0 || this.state.red1 ? 'line linRed' : " line linWat"}
            onClick={this.titleClick1(1)} >
            {this.state.name1 ? this.state.name1 : '分类'}
            <AtIcon value={this.state.click1 % 2 === 0 ? 'chevron-up' : 'chevron-down'} size='12'
              color={this.state.click1 % 2 === 0 || this.state.red1 ? '#fe7b70' : '#666666'}></AtIcon>
          </View>
          <View className={this.state.click2 % 2 === 0 || this.state.red2 ? 'line linRed' : " line linWat"} onClick={this.titleClick2(2)}>
            {this.state.name2 ? this.state.name2 : '附近'}
            <AtIcon value={this.state.click2 % 2 === 0 ? 'chevron-up' : 'chevron-down'} size='12'
              color={this.state.click2 % 2 === 0 || this.state.red2 ? '#fe7b70' : '#666666'}></AtIcon>
          </View>
          <View className={this.state.click3 % 2 === 0 || this.state.red3 ? 'line linRed' : " line linWat"} onClick={this.titleClick3(3)}>
            {this.state.name3 ? this.state.name3 : '智能排序'}
            <AtIcon value={this.state.click3 % 2 === 0 ? 'chevron-up' : 'chevron-down'} size='12'
              color={this.state.click3 % 2 === 0 || this.state.red3 ? '#fe7b70' : '#666666'}></AtIcon>
          </View>
        </View>
        <View
          className={("myPositing") + " " + (this.state.click1 % 2 !== 0 ? " falling" : "rising")}>
          {
            this.state.selectData1.map((item, index) => {
              const checked1 = index === this.state.list1;
              return <View className='lists'
                key={''}
                onClick={this.listClick1.bind(this, index, item.id, item.name)}
              >
                <View>{item.name}</View>
                <AtIcon value='check' size={(checked1 ? '12' : '0')} color='#fe7b70'></AtIcon>
              </View>
            })
          }
        </View>
        <View className={("myPositing") + " " + (this.state.click2 % 2 !== 0 ? " falling" : "rising")}>
          {
            this.state.selectData2.map((item, index) => {
              const checked2 = index === this.state.list2;
              return <View className='lists'
                key={''}
                onClick={this.listClick2.bind(this, index, item.id, item.name)}
              >
                <View>{item.name}</View>
                <AtIcon value='check' size={(checked2 ? '12' : '0')} color='#fe7b70'></AtIcon>
              </View>
            })
          }
        </View>
        <View className={("myPositing") + " " + (this.state.click3 % 2 !== 0 ? " falling" : "rising")}>
          {
            this.state.selectData3.map((item, index) => {
              const checked3 = index === this.state.list3;
              return <View className='lists' key={''} onClick={this.listClick3.bind(this, index, item.id, item.name)} >
                <View>{item.name}</View>
                <AtIcon value='check' size={(checked3 ? '12' : '0')} color='#fe7b70'></AtIcon>
              </View>
            })
          }
        </View>
      </View>
      <View className={this.state.page_bottom ? 'page_bottom' : ''} catchtouchmove={true} onClick={this.KeepOutClick.bind(this)}
        // onTouchStart={this.onTouchMoveData.bind(this)}
        onTouchMove={this.onTouchMoveData.bind(this)}
      ></View>
    </View>
  }
}
