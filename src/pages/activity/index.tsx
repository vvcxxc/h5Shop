import Taro, { Component, Config } from '@tarojs/taro'
import {
  ScrollView, View, Block,
  Image, Text
} from '@tarojs/components'
import { AtIcon, AtActivityIndicator, AtDivider } from 'taro-ui';
import carousel from "@/static/images/img_carousel.png"
import logo from "@/assets/logo.png";
import "./activity.styl"
<<<<<<< HEAD

import request from '../../services/request';

export default class Activity extends Component {
  constructor() {
    super(...arguments)
=======
import Coupon from "@/components/coupon/coupon"
import { ACTION_JUMP } from "@/utils/constants"
// import { getLocation } from "@/utils/getInfo"
import { getLocation } from '@/utils/getInfo'

// import { connect } from "@tarojs/redux"

interface State {
  banner?: any[];
  recommend: any[];
  seckill?: any[];
  menu: number;
}
interface ActivityProps {
  handleChange: any;
}
// const mapStateToProps = (state, ownProps) => {
//   return {
//     isTest: state.test === ownProps.test
//   }
// }
// const mapDispatchToProps = (dispatch, ownProps) => {
//   return {
//     handleChange() {
//       dispatch({
//         type: "CHANGE"
//       })
//     }
//   }
// }
// @connect(mapStateToProps, mapDispatchToProps)
export default class Activity extends Component<ActivityProps> {
  state: State = {
    recommend: [],
    menu: 0,
>>>>>>> d14432e058c9b835aff0d26ab3a151c125cadd29
  }

  config: Config = {
    navigationBarTitleText: "活动中心",
    // enablePullDownRefresh: true
  }

  state = {
    indexGroup: [],
    tabDistanceTop: 0,
    tabHeight: 0,
    // tab标题
    titleList: [],
    current: 0,
    // tab每个标题对应的数据
    storeList: [],
    checkBoxList: [
      { name: '拼团', id: 0 },
      { name: '增值', id: 1 },
      { name: '500米以内', id: 2 },
      { name: '1000米以内', id: 3 },
      { name: '2000米以内', id: 4 },
    ],

    reloadHeight: 0, // 刷新的高度
    dargStyle: {//下拉框的样式
      top: 0 + 'px',
      height: '100vh'
    },
    downDragStyle: {//下拉图标的样式
      height: 0 + 'px'
    },
    downText: '下拉刷新',
    start_p: {},
    scrollY: true,
    dargState: 0//刷新状态 0不做操作 1刷新 -1加载更多

  }

<<<<<<< HEAD
  componentDidMount = () => {
    this.requestTab()
=======
  /**
   * 用户动作
   */
  handleAction(action: string, data: any) {
    switch (action) {
      case ACTION_JUMP:
        const { type, id, gift_id, activity_id } = data
        if (type == 1) {
          Taro.navigateTo({
            url: '/pages/activity/appreciation/index?id=' + id + '&type=1&gift_id=' + gift_id + '&activity_id=' + activity_id
            // url: `/pages/activity/pages/detail/detail?id=${id}&type=${type}&activity_id=${activity_id}&gift_id=${gift_id}`
          })
        } else {
          Taro.navigateTo({
            url: `/pages/activity/pages/detail/detail?id=${id}&type=${type}&activity_id=${activity_id}&gift_id=${gift_id}`
          })
        }
        break
      default:
        console.log("no action~")
    }
>>>>>>> d14432e058c9b835aff0d26ab3a151c125cadd29
  }

  // 获取标题列表
  requestTab = () => {
    this.setState({
      titleList: [
        { name: '全部', id: 'all' },
        { name: '关注', id: 'guanzhu' },
        { name: '丽人', id: 'liren' },
        { name: '餐饮', id: 'canyin' },
        { name: '休闲', id: 'xiuxian' },
        { name: '服饰', id: 'fushi' },
        { name: '体育', id: 'tiyu' },
      ]
    })
  }

  handlerTablChange(current, id, _this) {
    this.setState({
      current,
      indexGroup: []
    });
    // 根据current值来获取对应的商店数据然后存到storeList中
    console.log(current)
  }


  onScrollToLower = () => {
    console.log('aaa')
  }

  onScroll = (e) => {
    let scrollView = document.getElementById('scrollView');
    let tab = document.getElementById('tab');
    let showData = document.getElementById('showData');
    let tabVal = this.refs.tab.vnode.dom.offsetTop;
    let activity = document.getElementById('activity');
    let whiteSpace = document.getElementById('whiteSpace');


    if(scrollView.scrollTop >= tabVal) {
      tab.style.cssText = "position: fixed; top: 0; z-Index: 99;";
      showData.style.marginTop = this.refs.tab.vnode.dom.scrollHeight + 'px';
    }

    if(scrollView.scrollTop < activity.offsetHeight + whiteSpace.offsetHeight ) {
      tab.style.cssText = "position: static";
      showData.style.marginTop = '0px';
    }
  }

  reduction() {//还原初始设置
    const time = 0.5;
    this.setState({
      upDragStyle: {//上拉图标样式
        height: 0 + 'px',
        transition: `all ${time}s`
      },
      dargState: 0,
      dargStyle: {
        top: 0 + 'px',
        transition: `all ${time}s`,
        height: '100vh'
      },
      downDragStyle: {
        height: 0 + 'px',
        transition: `all ${time}s`
      },
      scrollY: true
    })
    setTimeout(() => {
      this.setState({
        dargStyle: {
          height: '100vh',
          top: 0 + 'px',
        },
        downText: '下拉刷新'
      })
    }, time * 1000);
  }
  touchStart(e) {
    this.setState({
      start_p: e.touches[0]
    })
  }
  touchMove(e) {
    console.log('111')
    let that = this
    let move_p = e.touches[0],//移动时的位置
      deviationX = 0.30,//左右偏移量(超过这个偏移量不执行下拉操作)
      deviationY = 70,//拉动长度（低于这个值的时候不执行）
      maxY = 100;//拉动的最大高度
    let start_x = this.state.start_p.clientX,
      start_y = this.state.start_p.clientY,
      move_x = move_p.clientX,
      move_y = move_p.clientY;
    console.log(start_x,start_y,move_x,move_y)
    //得到偏移数值
    let dev = Math.abs(move_x - start_x) / Math.abs(move_y - start_y);
    if (dev < deviationX) {//当偏移数值大于设置的偏移数值时则不执行操作
      let pY = Math.abs(move_y - start_y) / 3.5;//拖动倍率（使拖动的时候有粘滞的感觉--试了很多次 这个倍率刚好）
      if (move_y - start_y > 0) {//下拉操作
        if (pY >= deviationY) {
          this.setState({ dargState: 1, downText: '释放刷新' })
        } else {
          this.setState({ dargState: 0, downText: '下拉刷新' })
        }
        if (pY >= maxY) {
          pY = maxY
        }
        this.setState({
          dargStyle: {
            height: '100vh',
            top: pY + 'px',
          },
          downDragStyle: {
            height: pY + 'px'
          },
          scrollY: false//拖动的时候禁用
        })
      }
    }

    let q = this.refs.downDragBox.boundingClientRect();
    q.exec(res => {
      this.setState({
        reloadHeight: res[0].height
      })
    })
  }
  touchEnd(e) {
    if (this.state.dargState === 1) {
      this.down()
    }
    this.reduction()

    // 放手后重置为0
    this.setState({
      reloadHeight: 0
    })
  }
  down() {//下拉
    Taro.showToast({
      icon: 'loading',
      title: 'loading',
      mask: true
    })
    console.log('下拉')
  }

  /**
   * 搜索
   */
  handleSearch = () => {
    Taro.navigateTo({ url: '../index/search/index' });
  }

  /**
   * 切换选中checkbox
   */
  handleSelected = (id) => {
    if (this.state.indexGroup.includes(id)) {
      this.state.indexGroup.forEach((item, index) => {
        if (item == id) {
          this.state.indexGroup.splice(index, 1)
          this.setState({
            indexGroup: this.state.indexGroup
          })
        }
      })
    } else {
      this.setState({
        indexGroup: [
          ...this.state.indexGroup,
          id
        ]
      })
    }

  }

  render() {
    const scrollTop = 0
    const Threshold = 20
    let dargStyle = this.state.dargStyle;
    // let downDragStyle = this.state.downDragStyle;
    return (
      <Block>
        {/* <View className='downDragBox' ref="downDragBox" style={downDragStyle}>
          <View style={{ width: "100%", textAlign: "center", display: "flex", justifyContent: "center", height: "100%", lineHeight: this.state.reloadHeight + 'px', position: 'relative' }}>
            <AtActivityIndicator mode='center'></AtActivityIndicator>
          </View>
        </View> */}
        <ScrollView
          className='scrollview'
          id="scrollView"
          scrollY
          scrollWithAnimation
          scrollTop={scrollTop}
          style={dargStyle}
          lowerThreshold={Threshold}
          upperThreshold={Threshold}
          onScrollToLower={this.onScrollToLower.bind(this)}
          onScroll={this.onScroll.bind(this)}
          // onTouchStart={this.touchStart.bind(this)}  
          // onTouchMove={this.touchMove.bind(this)}
          // onTouchEnd={this.touchEnd.bind(this)}
        >
          <View className="activity" id="activity">
            <View className="head" id="head">
              <View className="search">
                <View className="flex center container">
                  <View className="long-string" style="margin-right:15px;" />
                  <AtIcon className="search-icon" value="search" color="#666666" size={14} />
                  <View className="item search-input" onClick={this.handleSearch}>
                    请输入商家/分类或商圈
							    </View>
                </View>
              </View>
            </View>
            <Image background-size="cover" src={carousel} className="area-banner" id="a" />
          </View>

          <View className="white-space" id="whiteSpace"></View>

          <View ref="tab" className="tab flex" id="tab">
            {this.state.titleList.map((item: any, index) => (
              <View
                key={" "}
                className={
                  "item flex center " +
                  (this.state.current === index ? "active" : "")
                }
                onClick={this.handlerTablChange.bind(this, index, item.id)}
              >
                <View className="label" style="margin-right:30px;">{item.name}</View>
              </View>
            ))}
          </View>

          <View className="show_data" id="showData">

            <View className="checkBox_bar">
              {
                this.state.checkBoxList.map(item => (
                  <View className="checkBox_wrap" key={item.id} style={this.state.indexGroup.indexOf(item.id) != -1 ? { border: '1px solid #fe7d70', color: "#fe7d70" } : { border: '1px solid #ccc', color: '#ccc' }} onClick={this.handleSelected.bind(this, item.id)}>
                    <Text className="checkBox_text" style={this.state.indexGroup.indexOf(item.id) != -1 ? { color: "#fe7d70" } : { color: "#7b7b7b" }}>
                      {item.name}
                    </Text>
                    <View className={this.state.indexGroup.indexOf(item.id) != -1 ? "checkBox_isCheck" : ""}></View>
                    {
                      this.state.indexGroup.indexOf(item.id) != -1 ? (
                        <View className="checkBox_cancel">x</View>
                      ) : null
                    }
                  </View>
                ))
              }
            </View>
<<<<<<< HEAD

            <View className="store_item">
              <View className="store_img">
                <Image background-size="cover" src={carousel} className="store_img_show" />
              </View>
              <View className="store_info">
                <View className="store_desc">
                  <Text className="store_name">拼团活动拼团活动拼团活动拼团活动拼团活动拼团活动拼团活动拼团活动</Text>
                  <View className="store_tips">
                    <Text className="store_tips_item">5人团</Text>
                    <Text className="store_tips_item">送3000元耳机</Text>
                  </View>
                </View>
                <View className="store_msg">
                  <View className="store_price">
                    <Text className="store_price_new">￥100</Text>
                    <Text className="store_price_old">￥300</Text>
                  </View>
                  <View className="store_other_info">
                    <View className="store_any">
                      <Text className="store_follow">关注的店 - </Text>
                      <Text className="store_follow_name">杨大富的五金店</Text>
=======
          </View> */}
          <View className="area-activity-list">
            <View
              // className="weui-grids"
              style={{ border: " 0 none", display: "flex", height: "200px", flexWrap: "wrap" }}>
              {
                activitys.map((item, index) => {
                  return (
                    <View
                      key={index}
                      onClick={this.goTo.bind(this, item.path)}
                      // className="weui-grid"
                      // hoverClass="weui-grid_active"
                      style={{ border: "none", flex: "25%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}
                    >
                      <Image className="weui-grid__icon" src={item.src} />
                      <View className="weui-grid__label">{item.text}</View>
>>>>>>> d14432e058c9b835aff0d26ab3a151c125cadd29
                    </View>
                    <View className="store_distance">
                      <Text className="store_distance_num">3.5km</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>


            <View className="store_item">
              <View className="store_img">
                <Image background-size="cover" src={carousel} className="store_img_show" />
              </View>
              <View className="store_info">
                <View className="store_desc">
                  <Text className="store_name">拼团活动拼团活动拼团活动拼团活动拼团活动拼团活动拼团活动拼团活动</Text>
                  <View className="store_tips">
                    <Text className="store_tips_item">5人团</Text>
                    <Text className="store_tips_item">送3000元耳机</Text>
                  </View>
                </View>
                <View className="store_msg">
                  <View className="store_price">
                    <Text className="store_price_new">￥100</Text>
                    <Text className="store_price_old">￥300</Text>
                  </View>
                  <View className="store_other_info">
                    <View className="store_any">
                      <Text className="store_follow">关注的店 - </Text>
                      <Text className="store_follow_name">杨大富的五金店</Text>
                    </View>
                    <View className="store_distance">
                      <Text className="store_distance_num">3.5km</Text>
                    </View>
                  </View>
                </View>
              </View>
            </View>

          </View>


          <AtDivider className="divider">
            <Image background-size="cover" src={logo} style={{ width: "150px", height: "50px" }} />
          </AtDivider>


          <View className="no_store">
            <Text>暂时没有活动，看看其他吧</Text>
          </View>

          <View className="nearby_store">
            <View className="search_nearby">搜索附近</View>

            <View className="nearby_store_item">
              <View className="nearby_store_img">
                <Image background-size="cover" src={carousel} className="nearby_store_img_show" />
              </View>
              <View className="nearby_store_info">
                <View className="nearby_store_desc">
                  <Text className="nearby_store_name">华润万家(广州东晓南121号店)</Text>
                  <View className="nearby_store_msg">
                    <View className="nearby_store_type">便利店</View>
                    <View className="nearby_store_distance">660m</View>
                  </View>
                </View>
                <View className="nearby_store_sign">
                  <Text className="group_gift">拼团送礼</Text>
                  <Text className="appreciation_gift">增值送礼</Text>
                  <Text className="auth_user">认证用户</Text>
                </View>
              </View>
            </View>
            <View className="nearby_store_item">
              <View className="nearby_store_img">
                <Image background-size="cover" src={carousel} className="nearby_store_img_show" />
              </View>
              <View className="nearby_store_info">
                <View className="nearby_store_desc">
                  <Text className="nearby_store_name">华润万家(广州东晓南121号店)</Text>
                  <View className="nearby_store_msg">
                    <View className="nearby_store_type">便利店</View>
                    <View className="nearby_store_distance">660m</View>
                  </View>
                </View>
                <View className="nearby_store_sign">
                  <Text className="group_gift">拼团送礼</Text>
                  <Text className="appreciation_gift">增值送礼</Text>
                  <Text className="auth_user">认证用户</Text>
                </View>
              </View>
            </View>
            <View className="nearby_store_item">
              <View className="nearby_store_img">
                <Image background-size="cover" src={carousel} className="nearby_store_img_show" />
              </View>
              <View className="nearby_store_info">
                <View className="nearby_store_desc">
                  <Text className="nearby_store_name">华润万家(广州东晓南121号店)</Text>
                  <View className="nearby_store_msg">
                    <View className="nearby_store_type">便利店</View>
                    <View className="nearby_store_distance">660m</View>
                  </View>
                </View>
                <View className="nearby_store_sign">
                  <Text className="group_gift">拼团送礼</Text>
                  <Text className="appreciation_gift">增值送礼</Text>
                  <Text className="auth_user">认证用户</Text>
                </View>
              </View>
            </View>

          </View>


        </ScrollView>

      </Block>

    )
  }
}