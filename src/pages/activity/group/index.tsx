import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtNoticebar, AtCountdown } from 'taro-ui';
import { View, Image, Swiper, SwiperItem, ScrollView } from "@tarojs/components";
import request from '../../../services/request';
import { getBrowserType } from "@/utils/common";
import TimeUp from './TimeUp';
import wx from 'weixin-js-sdk';
import Cookie from 'js-cookie';
import { getLocation } from "@/utils/getInfo";
import AddressImg from '../../../assets/address.png';
import MobileImg from '../../../assets/dianhua.png';
import Zoom from '../../../components/zoom/index';
import './index.scss';
import { getTime } from '@/utils/common';
import dayjs from 'dayjs'

interface Props {
  id: any;
}
const share_url = process.env.GROUP_Details_URL;
let interval;
export default class Group extends Component<Props>{
  state = {
    ruleMore: false,
    imgZoom: false,
    imgZoomSrc: '',
    xPoint: 0,
    yPoint: 0,
    imagesCurrent: 0,
    data: {
      activity_begin_time: "",
      activity_end_time: "",
      activity_id: 0,
      activity_time_status: 0,
      address: "",
      begin_time: "",
      description: [],
      distances: "",
      end_time: "",
      gift: { title: "", price: "", postage: "", mail_mode: 2, cover_image: '' },
      gift_id: 0,
      icon: "",
      id: 0,//店id
      image: "",
      images: [],
      is_show_button: 0,
      list_brief: "",
      locate_match_row: "",
      name: "",//店名
      number: 0,
      participate_number: 0,
      participation_money: "",
      pay_money: "",
      preview: '',
      route: "",
      succeed_participate_number: 0,
      supplier_id: 0,
      team_set_end_time:'',
      tel: "",
      xpoint: '',
      youhui_id: 0,//活动id
      youhui_name: "",//活动名
      ypoint: ""
    },
    data2: {
      data: [],
      page: 1,
      pageRow: 2,
      total: 0,
    },
    newGroupList: [],
    isPostage: true,
    isShare: false,
    isFromShare: false,
    groupListShow: false,
    groupListPages: 1,
    currentPage: 0
  };
  componentDidShow() {
    this.toShare();
  }
  clearTimeOut = () => {
    console.log('清除计时器');
    var end = setTimeout(function () { }, 1);
    var start = (end - 100) > 0 ? end - 100 : 0;
    for (var i = start; i <= end; i++) {
      clearTimeout(i);
    }
  }
  componentWillUnmount() {
    this.clearTimeOut();
  }

  componentDidMount = () => {
    console.log('params:', this.$router.params);
    let arrs = Taro.getCurrentPages()
    if (arrs.length <= 1) {
      this.setState({
        isFromShare: true
      })
    }
    Taro.showLoading({
      title: 'loading',
    })
    getLocation().then((res: any) => {
      this.setState({
        yPoint: res.latitude || '',
        xPoint: res.longitude || ''
      }, () => {
        request({
          url: 'api/wap/user/getGroupbuyings',
          method: "GET",
          data: {
            group_info_id: this.$router.params.id,
            page: 1
          }
        })
          .then((res: any) => {
            let newGroupList = this.chunk(res.data.data, 2);
            this.setState({ data2: res.data, newGroupList: newGroupList });
          });
        request({
          url: 'api/wap/user/getGroupYouhuiInfo',
          method: "GET",
          data: {
            group_info_id: this.$router.params.id,
            is_xcx: 0,
            xpoint: this.state.xPoint,
            ypoint: this.state.yPoint
          }
        })
          .then((res: any) => {
            if (res.code == 200) {
              if (res.data.gift_id) {
                if (res.data.gift.mail_mode == 2) {
                  this.setState({ isPostage: true })
                }
              } else {
                this.setState({ isPostage: false })
              }
              this.setState({ data: res.data }, () => {
                this.toShare();
              });
              Taro.hideLoading()
            }
          }).catch(err => {
            console.log(err);
          })
      })
    }).catch(err => {
      this.setState({
        yPoint: '',
        xPoint: ''
      }, () => {
        request({
          url: 'api/wap/user/getGroupbuyings',
          method: "GET",
          data: {
            group_info_id: this.$router.params.id,
            page: 1
          }
        })
          .then((res: any) => {
            let newGroupList = this.chunk(res.data.data, 2);
            this.setState({ data2: res.data, newGroupList: newGroupList });
          });
        request({
          url: 'api/wap/user/getGroupYouhuiInfo',
          method: "GET",
          data: {
            group_info_id: this.$router.params.id,
            is_xcx: 0,
            xpoint: this.state.xPoint,
            ypoint: this.state.yPoint
          }
        })
          .then((res: any) => {
            if (res.code == 200) {
              if (res.data.gift_id) {
                if (res.data.gift.mail_mode == 2) {
                  this.setState({ isPostage: true })
                }
              } else {
                this.setState({ isPostage: false })
              }
              this.setState({ data: res.data }, () => {
                this.toShare();
              });
              Taro.hideLoading()
            } else {
              Taro.showToast({
                title: res.data,
                icon: 'none',
                duration: 2000
              })
              setTimeout(() => {
                Taro.navigateBack()
              }, 2000)
            }
          }).catch(err => {
            console.log(err);
          })
      })
    })
  };


  toShare = () => {
    let url = window.location.href;
    let titleMsg = this.state.data.gift_id ? '在吗？现只需' + this.state.data.participation_money + '元疯抢价值' + this.state.data.pay_money + '元套餐，并送价值' + this.state.data.gift.price + '元大礼，快戳！' : '在吗？现只需' + this.state.data.participation_money + '元疯抢价值 ' + this.state.data.pay_money + '元套餐，快戳';
    let descMsg = this.state.data.gift_id ? '重磅！你！就是你！已被' + this.state.data.name + '选为幸运用户，现拼团成功可获得价值' + this.state.data.gift.price + '元的精美礼品！' : '花最低的价格买超值套餐，团购让你嗨翻天！';
    Taro.request({
      url: 'http://api.supplier.tdianyi.com/wechat/getShareSign',
      method: 'GET',
      data: {
        url
      }
    })
      .then(res => {
        let { data } = res;
        wx.config({
          debug: false,
          appId: data.appId,
          timestamp: data.timestamp,
          nonceStr: data.nonceStr,
          signature: data.signature,
          jsApiList: ['updateAppMessageShareData', 'updateTimelineShareData']
        })
        wx.ready(() => {
          wx.updateAppMessageShareData({
            title: titleMsg,
            desc: descMsg,
            link: share_url + 'id=' + this.$router.params.id + '&type=1&gift_id=' + this.$router.params.gift_id + '&activity_id=' + this.$router.params.activity_id,
            imgUrl: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM6UL4r7LnqyAVDKia7l4GlOnibryHQUJXiakS1MhZLicicMWicg/0',
            success: function () {
              //成功后触发
              console.log("分享成功")
            }
          })
        })
      })
  }
  buttonToShare = () => {
    this.setState({ isShare: true });
  }
  closeShare = () => {
    this.setState({ isShare: false });
  }

  chunk = (arr, size) => {
    var arr1 = new Array();
    for (var i = 0; i < Math.ceil(arr.length / size); i++) {
      arr1[i] = new Array();
    }
    var j = 0;
    var x = 0;
    for (var i = 0; i < arr.length; i++) {
      if (!((i % size == 0) && (i != 0))) {
        arr1[j][x] = arr[i];
        x++;
      } else {
        j++;
        x = 0;
        arr1[j][x] = arr[i];
        x++;
      }
    }
    return arr1;
  }


  //去图文详情
  toImgList = () => {
    this.clearTimeOut();
    Taro.navigateTo({
      url: '/detail-pages/gift/gift?gift_id=' + this.$router.params.gift_id + '&activity_id=' + this.$router.params.activity_id
    })
  }
  //去商店
  handleClick2 = (e) => {
    this.clearTimeOut();
    Taro.navigateTo({
      // url: '/detail-pages/business/index?id=' + _id
      url: '/pages/business/index?id=' + this.state.data.id
    })
  };
  //打电话
  makePhoneCall = (e) => {
    Taro.makePhoneCall({
      phoneNumber: this.state.data.tel
    })
      .then((res: any) => {
        console.log(res)
      });
    e.stopPropagation();
  }

  //地图
  routePlanning = (e) => {
    let browserType = getBrowserType();
    if (browserType == 'wechat') {
      let longitude = parseFloat(this.state.data.xpoint);
      let latitude = parseFloat(this.state.data.ypoint);
      let url = window.location.href;
      Taro.request({
        url: 'http://api.supplier.tdianyi.com/wechat/getShareSign',
        method: 'GET',
        data: {
          url
        }
      })
        .then(res => {
          let { data } = res;
          wx.config({
            debug: false,
            appId: data.appId,
            timestamp: data.timestamp,
            nonceStr: data.nonceStr,
            signature: data.signature,
            jsApiList: [
              "getLocation",
              "openLocation"
            ]
          })
          wx.ready(() => {
            wx.openLocation({
              latitude,
              longitude,
              scale: 18,
              name: this.state.data.name,
              address: this.state.data.address,
            })

          })
        })


    } else if (browserType == 'alipay') {
      Taro.navigateTo({
        url: 'https://m.amap.com/navi/?start=' + this.state.xPoint + ',' + this.state.yPoint + '&dest=' + this.state.data.xpoint + ',' + this.state.data.ypoint + '&destName=' + this.state.data.name + '&key=67ed2c4b91bf9720f108ae2cc686ec19'
      })
    } else {
      Taro.showToast({
        title: "信息出错",
        icon: "none"
      });
    }
    e.stopPropagation();
  }

  // 是否选择礼品
  chooseGift = () => {
    this.setState({ isPostage: !this.state.isPostage })
  }


  payment() {
    let _tempid = this.$router.params.publictypeid ? this.$router.params.publictypeid : undefined;
    let _temptype = this.$router.params.type;
    Taro.showLoading({
      title: 'loading',
    })
    let _type;
    let browserType = getBrowserType();
    if (browserType == 'wechat') {
      _type = 1;
    } else if (browserType == 'alipay') {
      _type = 2;
    } else {
      Taro.showToast({
        title: "支付出错",
        icon: "none"
      });
    }
    let datas = {}
    if (_type == 1) {
      datas = {
        public_type_id: this.$router.params.publictypeid ? this.$router.params.publictypeid : this.$router.params.id,
        activity_id: this.$router.params.activity_id,
        gift_id: this.state.isPostage ? this.$router.params.gift_id : undefined,
        open_id: Cookie.get(process.env.OPEN_ID),
        unionid: Cookie.get(process.env.UNION_ID),
        type: this.$router.params.type,
        xcx: 0,
        number: 1,
      }
    } else {
      datas = {
        public_type_id: this.$router.params.publictypeid ? this.$router.params.publictypeid : this.$router.params.id,
        activity_id: this.$router.params.activity_id,
        gift_id: this.state.isPostage ? this.$router.params.gift_id : undefined,
        type: this.$router.params.type,
        xcx: 0,
        number: 1,
        alipay_user_id: Cookie.get(process.env.ALIPAY_USER_ID),
      }
    }
    //请求支付属性
    request({
      url: 'payCentre/toWxPay',
      method: "POST",
      header: {
        "Content-Type": "application/json"
      },
      data: JSON.stringify(datas)
    })
      .then((res: any) => {
        Taro.hideLoading();
        let order_sn = res.channel_order_sn;//比增值少一层data
        if (_type == 1) {
          //微信支付
          window.WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
            "appId": res.data.appId,
            "timeStamp": res.data.timeStamp,
            "nonceStr": res.data.nonceStr,
            "package": res.data.package,
            "signType": res.data.signType,
            "paySign": res.data.paySign
          },
            function (res) {
              //微信支付成功
              if (res.err_msg == "get_brand_wcpay_request:ok") {
                if (_temptype == 5) {
                  //开团要得到开团活动id再跳转活动详情
                  Taro.showLoading({
                    title: 'loading',
                    mask: true
                  });
                  interval = setInterval(() => {
                    request({
                      url: 'api/wap/user/getUserYouhuiGroupId',
                      method: "GET",
                      data: { order_sn: order_sn }
                    }).then((res: any) => {
                      if (res.code == 200) {
                        clearInterval(interval);
                        Taro.hideLoading();
                        let resGroupid = res.data.id;
                        Taro.navigateTo({
                          url: '/pages/activity/pages/group/group?id=' + resGroupid,
                          success: () => {
                            var page = Taro.getCurrentPages().pop();
                            if (page == undefined || page == null) return;
                            page.onLoad();
                          }
                        })
                      }
                    })
                  }, 1000);
                } else if (_temptype == 55) {
                  Taro.navigateTo({
                    url: '/pages/activity/pages/group/group?id=' + _tempid,
                    success: () => {
                      var page = Taro.getCurrentPages().pop();
                      if (page == undefined || page == null) return;
                      page.onLoad();
                    }
                  })
                } else {
                  console.log('类型出错');
                  return;
                }

              } else {
                //微信支付失败
              }
            }
          );
        } else if (_type == 2) {
          //支付宝支付
          window.AlipayJSBridge.call('tradePay', {
            tradeNO: res.data.alipayOrderSn, // 必传，此使用方式下该字段必传
          }, res => {
            //支付宝支付成功
            if (res.resultCode === "9000") {
              if (_temptype == 5) {
                //开团要得到开团活动id再跳转活动详情
                Taro.showLoading({
                  title: 'loading',
                  mask: true
                });
                interval = setInterval(() => {
                  request({
                    url: 'api/wap/user/getUserYouhuiGroupId',
                    method: "GET",
                    data: { order_sn: order_sn }
                  }).then((res: any) => {
                    if (res.code == 200) {
                      clearInterval(interval);
                      Taro.hideLoading();
                      let resGroupid = res.data.id;
                      Taro.navigateTo({
                        url: '/pages/activity/pages/group/group?id=' + resGroupid,
                        success: () => {
                          var page = Taro.getCurrentPages().pop();
                          if (page == undefined || page == null) return;
                          page.onLoad();
                        }
                      })
                    }
                  })
                }, 1000);
              } else if (_temptype == 55) {
                Taro.navigateTo({
                  url: '/pages/activity/pages/group/group?id=' + _tempid,
                  success: () => {
                    var page = Taro.getCurrentPages().pop();
                    if (page == undefined || page == null) return;
                    page.onLoad();
                  }
                })
              } else {
                console.log('类型出错');
                return;
              }

            } else {
              //支付宝支付失败
            }
          })
        } else {
          console.log(_type)
        }
      })
  }

  payment2(_groupid, e) {
    Taro.showLoading({
      title: 'loading',
    })
    let _type;
    let browserType = getBrowserType();
    if (browserType == 'wechat') {
      _type = 1;
    } else if (browserType == 'alipay') {
      _type = 2;
    } else {
      Taro.showToast({
        title: "支付出错",
        icon: "none"
      });
    }
    let datas = {}
    if (_type == 1) {
      datas = {
        public_type_id: _groupid,
        activity_id: this.$router.params.activity_id,
        gift_id: this.state.isPostage ? this.$router.params.gift_id : undefined,
        open_id: Cookie.get(process.env.OPEN_ID),
        unionid: Cookie.get(process.env.UNION_ID),
        type: 55,
        xcx: 0,
        number: 1,
      }
    } else {
      datas = {
        public_type_id: _groupid,
        activity_id: this.$router.params.activity_id,
        gift_id: this.state.isPostage ? this.$router.params.gift_id : undefined,
        type: 55,
        xcx: 0,
        number: 1,
        alipay_user_id: Cookie.get(process.env.ALIPAY_USER_ID),
      }
    }
    //请求支付属性
    request({
      url: 'payCentre/toWxPay',
      method: "POST",
      header: {
        "Content-Type": "application/json"
      },
      data: JSON.stringify(datas)
    })
      .then((res: any) => {
        Taro.hideLoading();
        let order_id = res.data.order_id;
        if (_type == 1) {
          //微信支付
          window.WeixinJSBridge.invoke(
            'getBrandWCPayRequest', {
            "appId": res.data.appId,
            "timeStamp": res.data.timeStamp,
            "nonceStr": res.data.nonceStr,
            "package": res.data.package,
            "signType": res.data.signType,
            "paySign": res.data.paySign
          },
            function (res) {
              //微信支付成功
              if (res.err_msg == "get_brand_wcpay_request:ok") {
                Taro.navigateTo({
                  url: '/pages/activity/pages/group/group?id=' + _groupid,
                  // url: '/activity-pages/my-activity/my.activity',
                  success: function (e) {
                    let page = Taro.getCurrentPages().pop();
                    if (page == undefined || page == null) return;
                    page.onShow();
                  }
                })
              } else {
                //微信支付失败
              }
            }
          );
        } else if (_type == 2) {
          //支付宝支付
          window.AlipayJSBridge.call('tradePay', {
            tradeNO: res.data.alipayOrderSn, // 必传，此使用方式下该字段必传
          }, res => {
            //支付宝支付成功
            if (res.resultCode === "9000") {
              Taro.navigateTo({
                url: '/pages/activity/pages/group/group?id=' + _groupid,
                // url: '/activity-pages/my-activity/my.activity',
                success: function (e) {
                  let page = Taro.getCurrentPages().pop();
                  if (page == undefined || page == null) return;
                  page.onShow();
                }
              })
            } else {
              //支付宝支付失败
            }
          })
        } else {
          console.log(_type)
        }
      })
  }

  /**
   * 回首页
   */
  handleGoHome = () => {
    this.clearTimeOut();
    Taro.navigateTo({
      url: '/'
    })
  }

  addGroupList = () => {
    if ((this.state.data2.total / this.state.data2.pageRow) > this.state.groupListPages) {
      let thePage = this.state.groupListPages + 1;
      this.setState({ groupListPages: thePage }, () => {
        request({
          url: 'api/wap/user/getGroupbuyings',
          method: "GET",
          data: {
            group_info_id: this.$router.params.id,
            page: thePage
          }
        })
          .then((res: any) => {
            let newDate = this.state.data2.data.concat(res.data.data);
            let newObj = this.state.data2;
            newObj.data = newDate;
            this.setState({ data2: newObj });
          });

      });
    } else {
      return;
    }
  }
  goToaConfirm = (e) => {
    this.clearTimeOut();
    if (this.$router.params.type == '5') {
      //列表页或商家页进入拼团，路由params带过来的为活动id,id为活动id
      Taro.navigateTo({
        url: '/activity-pages/confirm-address/index?activityType=' + this.$router.params.type + '&id=' + this.$router.params.id + '&storeName=' + encodeURIComponent(this.state.data.name)
      })
    } else if (this.$router.params.type == '55') {
      //打开分享链接进入参团，接口的youhui_id为活动id，路由过来的id为团id
      Taro.navigateTo({
        url: '/activity-pages/confirm-address/index?activityType=' + this.$router.params.type + '&id=' + this.state.data.youhui_id + '&groupId=' + this.$router.params.id + '&storeName=' + encodeURIComponent(this.state.data.name)
      })
    }

  }
  goToaConfirmAddGroup = (_id, e) => {
    this.clearTimeOut();
    //轮播列表参团,路由params带过来的id为活动id, 接口传过来的id为团id
    Taro.navigateTo({
      url: '/activity-pages/confirm-address/index?activityType=55&id=' + this.$router.params.id + '&groupId=' + _id + '&storeName=' + encodeURIComponent(this.state.data.name)
    })
  }

  setTime = (_time, e) => {
    console.log('settime')
    let timer = setInterval(() => {
      let times = dayjs(_time).endOf('day')
      let time = getTime(new Date(times.$d).getTime() / 1000);
      if (time.display <= 0) { clearInterval(timer); this.setState({ date: '已结束' }); return } else {
        this.setState({ date: time.date })
      }
    }, 1000)
  }
  render() {
    const { images, description } = this.state.data;
    return (
      <View className="d_appre" >
        {
          this.state.groupListShow ? <View className="d_appre_groupList" onClick={(e) => { this.setState({ groupListShow: false }); e.stopPropagation(); }} onTouchMove={(e) => { this.setState({ groupListShow: false }); e.stopPropagation(); }}>
            <View className="d_appre_groupList_box" onClick={(e) => { e.stopPropagation() }} onTouchMove={(e) => { e.stopPropagation(); }}>
              <View className="d_appre_groupList_box_title">正在拼团</View>
              <View className="d_appre_groupList_box_slideBox">
                {/* <View className="d_appre_groupList_box_slideBox_content" > */}
                <ScrollView
                  className='d_appre_groupList_box_slideBox_content'
                  scrollY
                  scrollWithAnimation
                  onScrollToLower={this.addGroupList}
                >
                  {
                    this.state.data2.data.map((item: any) => {
                      return (
                        <View className="group_list0" >
                          <View className="group_list_img0" >
                            <Image className="listImg0" src={item.avatar} />
                          </View>
                          <View className="group_list_name0" >{item.real_name}</View>
                          <View className="group_list_timesbox0" >
                            <View className="group_list_lack0" >
                              <View className="group_list_lackredblack10" >还差</View>
                              <View className="group_list_lackred0" >{item.number - item.participation_number}人</View>
                              <View className="group_list_lackredblack20" >拼成</View>
                            </View>
                            <View className="group_list_times0" >
                              <TimeUp itemtime={item.activity_end_time} />
                            </View>
                          </View>
                          <View className="group_list_btnbox0" >
                            <View className="group_list_btn0" onClick={this.goToaConfirmAddGroup.bind(this, item.id)} >立即参团</View>
                          </View>
                        </View>
                      )
                    })
                  }

                </ScrollView>
                {/* </View> */}
              </View>
              <View className="group_list_toast" >上滑查看更多</View>
              {/* {
                this.state.data2.data && this.state.data2.data.length > 5 ? <View className="group_list_toast" >上滑查看更多</View> : null
              } */}
            </View>
            <View className="group_list_closebtn" >
              <AtIcon value='close-circle' size="28px" color='#fff'></AtIcon>
            </View>
          </View> : null
        }
        <View className="group_head_bottom_share" onClick={this.buttonToShare.bind(this)}>
          <Image className="shareimg" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/TTbP3DjHQZPhRCxkcY7aSBAaSxKKS3Wi.png" />
          分享
        </View >

        {
          this.state.data.images.length > 0 ? <View
            onClick={() => {
              this.setState({ imgZoom: true, imgZoomSrc: this.state.data.images[this.state.imagesCurrent] })
            }}>
            <Swiper
              onChange={(e) => {
                // console.log(e.detail.current)
                this.setState({ imagesCurrent: e.detail.current })
              }}
              className='test-h'
              indicatorColor='#999'
              indicatorActiveColor='#333'
              circular
              indicatorDots
              autoplay
            >
              {
                this.state.data.images ? this.state.data.images.map((item, index) => {
                  return (
                    <SwiperItem key={item} >
                      <View className='demo-text'>
                        <Image className="demo-text-Img" src={item} />
                      </View>
                    </SwiperItem>
                  )
                }) : null
              }
            </Swiper>
          </View> : null
        }

        <View className="coupon_box_title">
          <View className="group_coupon_title" >{this.state.data.youhui_name}</View>
          <View className="group_rule_time" >
            <View className="group_rule_time_key" >活动时间:</View>
            <View className="group_rule_time_data" > {this.state.data.activity_begin_time}-{this.state.data.activity_end_time}</View>
          </View>
          <View className="group_head_bottom" style={{ borderBottom: "none" }}>
            {this.state.data.gift ? <View className="group_head_bottom_gift">送{this.state.data.gift.title}</View> : null}
            <View className="group_head_bottom_list">{this.state.data.number}人团</View>
      <View className="group_head_bottom_list">{this.state.data.team_set_end_time}小时</View>
          </View>

          {/* <View className="group_msg" >
            <View className="group_msg_titlebox" >商品详情</View>
            <View className="group_msgBox" >
              <View className="group_msgTitle_Box" >
                <View className="group_msgTitle" >名称</View>
                <View className="group_msgTitle" >数量</View>
                <View className="group_msgTitle" >价格</View>
              </View>
              <View className="group_msgContent_Box" >
                <View className="group_msgContent" >番茄炒蛋</View>
                <View className="group_msgContent" >2</View>
                <View className="group_msgContent" >￥200</View>
              </View>
              <View className="group_msgContent_Box" >
                <View className="group_msgContent" >麦当劳开心乐园儿童套餐</View>
                <View className="group_msgContent" >1</View>
                <View className="group_msgContent" >￥150</View>
              </View>
            </View>
          </View> */}

        </View>

        {
          this.state.data.gift_id ?
            <View className="appre_gift" >
              <View className="appre_gift_titlebox" >
                <View className="appre_gift_title" >赠送礼品</View>
                <View className="appre_gift_Imagelist" onClick={this.toImgList.bind(this)}>图文详情</View>
              </View>
              <View className="appre_gift_giftinfo" >{this.state.data.gift.title}</View>
              <View className="appre_gift_giftmsgbox" >
                <View className="appre_gift_giftmsg" >{
                  this.state.data.gift.mail_mode == 1 ? '免运费' : `运费${this.state.data.gift.postage}元`
                }</View>
              </View>
              <View className="appre_gift_giftlist" >
                <Image className="appre_gift_giftlistImg"
                  mode="widthFix"
                  onClick={() => { this.setState({ imgZoom: true, imgZoomSrc: this.state.data.gift.cover_image }) }}
                  src={this.state.data.gift.cover_image} />
              </View>
            </View> : null
        }
        <View className="appre_process2" >
          <Image className="appre_process2_Image" src="http://tmwl.oss-cn-shenzhen.aliyuncs.com/front/x2WBTiwQwdap5ktNYYTyrGeP7E4zD5Qk.png" />
        </View>


        {
          this.state.data2.data && this.state.data2.data.length > 0 ? <View className="group_num" >
            <View className="group_num_titlebox" >
              <View className="group_num_title" >{this.state.data2.total}人正在拼</View>
              <View className="group_num_now" onClick={() => this.setState({ groupListShow: true })}>查看更多</View>
            </View>
          </View> : null
        }

        {
          this.state.data2.data && this.state.data2.data.length > 0 ? <View>
            <Swiper
              className='diu'
              vertical
              interval={3000}
              circular
              skipHiddenItemLayout={true}
              autoplay
              easingFunction={'easeOutCubic'}
              // indicatorColor='#999'
              // indicatorActiveColor='#333'
              // indicatorDots
              onChange={(e) => {
                this.setState({ currentPage: this.state.currentPage })
                // console.log(e.detail.current, Math.ceil(this.state.data2.data.length / 2) - 1);
                if (e.detail.current == Math.ceil(this.state.data2.data.length / 2) - 2) {
                  // console.log(e.detail.current);
                  e.detail.current = 0;
                }
              }}
              current={this.state.currentPage}
            >
              {
                this.state.newGroupList.map((item: any, index) => {
                  return (
                    <SwiperItem>
                      <View >
                        <View className="group_list" >
                          <View className="group_list_img" >
                            <Image className="listImg" src={item[0].avatar} />
                          </View>
                          <View className="group_list_name" >{item[0].real_name}</View>
                          <View className="group_list_btnbox" >
                            <View className="group_list_btn" onClick={this.goToaConfirmAddGroup.bind(this, item[0].id)} >立即参团</View>
                          </View>
                          <View className="group_list_timesbox" >
                            <View className="group_list_lack" >
                              <View className="group_list_lackredblack1" >还差</View>
                              <View className="group_list_lackred" >{item[0].number - item[0].participation_number}人</View>
                              <View className="group_list_lackredblack2" >拼成</View>
                            </View>
                            <View className="group_list_times" >
                              剩余{
                                ((new Date(item[0].end_at).getTime() - new Date().getTime()) / (3600 * 1000)).toFixed(1)
                              } 小时
                              {/* <TimeUp itemtime={item[0].activity_end_time} /> */}
                            </View>
                          </View>
                        </View>
                        {
                          item[1] ? <View className="group_list" >
                            <View className="group_list_img" >
                              <Image className="listImg" src={item[1].avatar} />
                            </View>
                            <View className="group_list_name" >{item[1].real_name}</View>
                            <View className="group_list_btnbox" >
                              <View className="group_list_btn" onClick={this.goToaConfirmAddGroup.bind(this, item[1].id)} >立即参团</View>
                            </View>
                            <View className="group_list_timesbox" >
                              <View className="group_list_lack" >
                                <View className="group_list_lackredblack1" >还差</View>
                                <View className="group_list_lackred" >{item[1].number - item[1].participation_number}人</View>
                                <View className="group_list_lackredblack2" >拼成</View>
                              </View>
                              <View className="group_list_times" >
                                剩余{
                                  ((new Date(item[1].end_at).getTime() - new Date().getTime()) / (3600 * 1000)).toFixed(1)
                                } 小时
                                {/* <TimeUp itemtime={item[1].activity_end_time} /> */}
                              </View>
                            </View>
                          </View> : null
                        }
                      </View>
                    </SwiperItem>
                  )
                })
              }
            </Swiper>
          </View> : null
        }


        <View className="appre_rule" >
          <View className="appre_rule_title" >使用规则</View>
          <View className="appre_rule_time" >
            <View className="appre_rule_time_key" >拼团人数:</View>
            <View className="appre_rule_time_data" >{this.state.data.number}人团</View>
          </View>
          <View className="appre_rule_time" >
            <View className="appre_rule_time_key" >时间限制:</View>
      <View className="appre_rule_time_data" >{this.state.data.team_set_end_time}小时内</View>
          </View>
          {
            (description) ?
              <View className="appre_rule_list" style={{ height: description.length <= 3 ? "auto" : (this.state.ruleMore ? "auto" : "2.5rem") }}>
                <View className="appre_rule_list_key" >详情描述:</View>
                <View className="appre_rule_list_data" >
                  {
                    (description) ? description.map((item) => {
                      return (
                        <View className="appre_rule_list_msg" >. {item}</View>
                      )
                    }) : null
                  }
                </View>

              </View> : null
          }
          {
            (description && description.length > 3) ?
              <View className="appre_rule_list_more" onClick={() => { this.setState({ ruleMore: !this.state.ruleMore }) }}>
                {this.state.ruleMore ? "收回" : "查看更多"}
                {
                  this.state.ruleMore ?
                    <AtIcon value="chevron-up" color="#999" size="16px" /> : <AtIcon value="chevron-down" color="#999" size="16px" />
                }
              </View> : null
          }
        </View>
        <View className="setMeal_store">
          <View className="setMeal_store_box" onClick={this.handleClick2.bind(this)}>
            <View className="setMeal_store_title">适用店铺</View>
            <View className="setMeal_store_storebox">
              <View className="setMeal_store_Image">
                <Image className="setMeal_store_img" src={this.state.data.preview} />
              </View>
              <View className="setMeal_store_msg">
                <View className="setMeal_store_name">{this.state.data.name}</View>
                {/* <View className="setMeal_store_price">人均：￥222</View> */}
              </View>
              <View className="setMeal_store_icon">
                <AtIcon value='chevron-right' size='20' color='#ccc'></AtIcon>
              </View>
            </View>
            <View className="setMeal_store_addressbox">
              <View className="setMeal_store_distance" onClick={this.routePlanning.bind(this)}>
                <View className="setMeal_store_distance_Image" >
                  <Image className="setMeal_store_distance_AddressImg" src={AddressImg} />
                </View>
                <View className="setMeal_store_distance_info" >{this.state.data.distances}</View>
              </View>
              <View className="setMeal_store_address" onClick={this.routePlanning.bind(this)}>{this.state.data.address}</View>
              <View className="setMeal_store_mobile" onClick={this.makePhoneCall.bind(this)}>
                <Image className="setMeal_store_MobileImg" src={MobileImg} />
              </View>
            </View>
          </View>
        </View>
        {
          (this.state.data.gift && this.state.data.gift.mail_mode == 2) ? (
            <View className='choosePostage' onClick={this.chooseGift}>

              <View>
                {
                  this.state.isPostage ? <Image src={require('../../../assets/choose.png')} className='choose' /> : <Image src={require('../../../assets/nochoose.png')} className='choose' />
                }
              </View>
              （邮费 {this.state.data.gift.postage}元）
          <View className='lbmsg' >
                <AtNoticebar marquee> {this.state.data.gift.title}</AtNoticebar>
              </View>
            </View>) : null
        }

        <View className="paymoney_box">
          <View className="paymoney_price">
            <View className="paymoney_price_icon">￥</View>
            <View className="paymoney_price_num">{this.state.data.participation_money}</View>
            <View className="paymoney_price_oldprice">￥{this.state.data.pay_money}</View>
            {
              this.state.isPostage ? <View className='paymoney_price_info'> {
                this.state.data.gift.mail_mode == 1 ? null :
                  '+' + this.state.data.gift.postage}</View> : null
            }
          </View>

          {
            this.$router.params.type == "55" ? <View className="paymoney_buynow" onClick={this.goToaConfirm.bind(this)}>参加拼团</View> : <View className="paymoney_buynow" onClick={this.goToaConfirm.bind(this)}>发起拼团</View>
          }
        </View>

        <Zoom
          src={this.state.imgZoomSrc}
          showBool={this.state.imgZoom}
          onChange={() => { this.setState({ imgZoom: !this.state.imgZoom }) }}
        />
        {/* 分享 */}
        {
          this.state.isShare == true ? (
            <View className='share_mask' onClick={this.closeShare}>
              <View className='share_box'>
                <View className='share_text text_top'>
                  点击此按钮分享给好友
                </View>
                {/* <View className='share_text'>
                  一起增值领礼品吧
                </View> */}
                <Image src={require('../../../assets/share_arro.png')} className='share_img' />
              </View>
            </View>
          ) : null
        }


        {/* 去首页 */}
        {
          this.state.isFromShare ? (
            <View style={{ position: 'fixed', bottom: '50%', right: '0px', zIndex: 3 }} onClick={this.handleGoHome.bind(this)}>
              <Image src={require('../../../assets/go-home/go_home.png')} style={{ width: '80px', height: '80px' }} />
            </View>
          ) : ''
        }
      </View>
    );
  }
}
