import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast, AtTabs, AtTabsPane } from "taro-ui";
import { View, Text, Image, ScrollView, Button, Swiper, SwiperItem } from "@tarojs/components";
import "./index.less";
import { getBrowserType } from "@/utils/common";
import { getGroupYouhuiInfo, getGroupbuyings, getShareSign, toWxPay, getUserYouhuiGroupId } from "./service";
import { getLocation } from "@/utils/getInfo";
import Cookie from 'js-cookie';
import ApplyToTheStore from '@/components/applyToTheStore';
import TimeUp from '@/components/TimeUp';
import LandingBounced from '@/components/landing_bounced'//登录弹框
import Zoom from '@/components/zoom';
import ShareBox from "@/components/share-box";//分享组件
import wx from 'weixin-js-sdk';
import Poster from '@/components/posters/spell_group'//   海报无礼品
import { getGroupPoster } from '@/api/poster'

const BASIC_API = process.env.BASIC_API;//二维码域名
const share_url = process.env.GROUP_Details_URL;
const H5_URL = process.env.H5_URL
export default class GroupActivity extends Component {
  config = {
    navigationBarTitleText: "拼团活动",
    enablePullDownRefresh: false
  };


  state = {
    imgZoomSrc: '',
    imgZoom: false,
    //允许参加活动
    allowGroup: '',
    //从分享进入
    isFromShare: false,
    //登录弹框
    showBounced: false,
    //图片轮播下标
    bannerImgIndex: 0,
    //列表轮播下标
    current: 0,
    //查看更多
    showMoreRules: false,
    data: {
      invitation_user_id: '',
      share_text: '',
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
      team_set_end_time: '',
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
    showShare: false, //显示分享
    isShare: false,
    posterList: {},
    showPoster: false,
  };

  /**
       * 获取位置信息
       */
  componentDidShow() {
    let arrs = Taro.getCurrentPages()
    if (arrs.length <= 1) { this.setState({ isFromShare: true }) }
    Taro.showLoading({ title: 'loading' })
    getLocation().then((res: any) => {
      this.toShare()
      this.getGroupInfo({ group_info_id: this.$router.params.id, is_xcx: 0, ypoint: res.latitude || '', xpoint: res.longitude || '' })
    }).catch((err) => {
      this.getGroupInfo({ group_info_id: this.$router.params.id, is_xcx: 0, ypoint: '', xpoint: '' })
    })
  }


  /**
   * 获取拼团活动信息
   * @param {object} data 活动id，坐标
   */
  getGroupInfo = (data: object) => {
    let that = this;
    getGroupYouhuiInfo(data)
      .then((res: any) => {
        that.getGroupList({ group_info_id: this.$router.params.id, page: 1 });
        Taro.hideLoading();
        if (res.code == 200) {
          let isPostage = false;
          if (res.data.gift_id && res.data.gift.mail_mode == 2) { isPostage = true; }
          let new_time = new Date().getTime()//ql
          new Date(res.data.activity_end_time).getTime() + 86399000 < new_time ? this.setState({ allowGroup: '已结束' }) : null
          new Date(res.data.activity_begin_time).getTime() > new_time ? this.setState({ allowGroup: '暂未开始' }) : null
          that.setState({ data: res.data, isPostage }, () => { this.getPostList() });
        } else {
          Taro.showToast({ title: '请求失败', icon: 'none' });
        }
      }).catch(err => {
        Taro.hideLoading();
        Taro.showToast({ title: '请求失败', icon: 'none' });
        that.getGroupList({ group_info_id: this.$router.params.id, page: 1 });
      })
  }

  /**
    * 获取拼团列表
    * @param {object} data 活动id，页数
    */
  getGroupList = (data: object) => {
    Taro.showLoading({ title: 'loading' })
    getGroupbuyings(data).then((res: any) => {
      Taro.hideLoading();
      if (res.code == 200) {
        let newGroupList = this.chunk(res.data.data, 2);
        this.setState({ data2: res.data, newGroupList: newGroupList }, () => { this.listAtb() });
      } else {
        Taro.showToast({ title: res.message, icon: 'none' });
      }
    }).catch((err) => {
      Taro.hideLoading();
    })
  }

  /**
     * 切割数组
     * @param {object} arr 旧数组
     * @param {object} size 二维数组第二层长度
     */
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

  /**
        * 去图文详情
        */
  toImgList = () => {
    Taro.navigateTo({
      url: '/detail-pages/gift/gift?gift_id=' + this.$router.params.gift_id + '&activity_id=' + this.$router.params.activity_id
    })
  }

  /**
    * 底部发团参团，判断登录，判断带不带礼品
    */
  goToaConfirm = (e) => {
    let phone_status = Cookie.get('phone_status')
    if (phone_status != 'binded' && phone_status != 'bind_success') {//两者不等，需要登录
      this.setState({ showBounced: true })
      return
    }

    if (this.state.data.gift_id || this.state.data.supplier_delivery_id) {
      if (this.$router.params.type == '5') {
        //列表页或商家页进入拼团，路由params带过来的为活动id,id为活动id
        Taro.navigateTo({
          url: '/activity-pages/group-distribution/index?activityType=' + this.$router.params.type + '&id=' + this.$router.params.id + '&storeName=' + encodeURIComponent(this.state.data.name)
        })
      } else if (this.$router.params.type == '55') {
        Taro.navigateTo({
          url: '/activity-pages/group-distribution/index?activityType=' + this.$router.params.type + '&id=' + this.$router.params.id + '&groupId=' + this.$router.params.publictypeid + '&storeName=' + encodeURIComponent(this.state.data.name)
        })
      }
    } else {
      this.payment();
    }
  }

  /**
    * 列表参团，判断登录，判断带不带礼品
    */
  goToaConfirmAddGroup = (_id, e) => {
    let phone_status = Cookie.get('phone_status')
    if (phone_status != 'binded' && phone_status != 'bind_success') {//两者不等，需要登录
      this.setState({ showBounced: true })
      return
    }
    if (this.state.data.gift_id || this.state.data.supplier_delivery_id) {
      Taro.navigateTo({
        url: '/activity-pages/group-distribution/index?activityType=55&id=' + this.$router.params.id + '&groupId=' + _id + '&storeName=' + encodeURIComponent(this.state.data.name)
      })
    } else {
      this.groupPayment(_id);
    }
  }

  /**
    * 底部按钮发团或者拼团支付,不带礼品
    */
  payment() {
    let that = this;
    let _tempid = this.$router.params.publictypeid ? this.$router.params.publictypeid : undefined;
    let _temptype = this.$router.params.type;
    Taro.showLoading({ title: 'loading', mask: true });
    let sameDatas = {
      public_type_id: this.$router.params.publictypeid ? this.$router.params.publictypeid : this.$router.params.id,
      activity_id: this.$router.params.activity_id,
      type: this.$router.params.type,
      xcx: 0,
      number: 1,
    };
    let browserType = getBrowserType();
    let datas;
    if (browserType == 'wechat') {
      datas = {
        ...sameDatas,
        open_id: Cookie.get(process.env.OPEN_ID),
        unionid: Cookie.get(process.env.UNION_ID),
      }
    }
    else if (browserType == 'alipay') {
      datas = {
        ...sameDatas,
        alipay_user_id: Cookie.get(process.env.ALIPAY_USER_ID),
      }
    }
    else {
      Taro.showToast({ title: "浏览器类型出错", icon: "none" }); return;
    }
    toWxPay(datas).then((res: any) => {
      Taro.hideLoading();
      if (res.code == 200) {
        let order_sn = res.channel_order_sn;//比增值少一层data
        if (browserType == 'wechat') {
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
                if (_temptype == '5') {
                  //开团要得到开团活动id再跳转活动详情
                  that.getLastGroupId(order_sn);
                } else if (_temptype == '55') {
                  that.goToGroupInfo(_tempid);
                }
              } else { Taro.showToast({ title: "微信支付失败", icon: "none" }); }
            }
          );
        }
        else if (browserType == 'alipay') {
          //支付宝支付
          window.AlipayJSBridge.call('tradePay', {
            tradeNO: res.data.alipayOrderSn, // 必传，此使用方式下该字段必传
          }, res => {
            //支付宝支付成功
            if (res.resultCode === "9000") {
              if (_temptype == '5') {
                //开团要得到开团活动id再跳转活动详情
                that.getLastGroupId(order_sn);
              } else if (_temptype == '55') {
                that.goToGroupInfo(_tempid);
              }
            } else { Taro.showToast({ title: "支付宝支付失败", icon: "none" }); }
          })
        }
      } else {
        Taro.showToast({ title: res.message, icon: 'none' })
      }
    }).catch(err => {
      Taro.showToast({ title: '调起支付失败', icon: 'none' })
    })
  }

  /**
   * 列表参团，不带礼品
   * @param {object} _groupid 团id
   */
  groupPayment(_groupid) {
    let that = this;
    Taro.showLoading({ title: 'loading', mask: true });
    let sameDatas = {
      public_type_id: _groupid,
      activity_id: this.$router.params.activity_id,
      type: 55,
      xcx: 0,
      number: 1,
    };
    let browserType = getBrowserType();
    let datas;
    if (browserType == 'wechat') {
      datas = {
        ...sameDatas,
        open_id: Cookie.get(process.env.OPEN_ID),
        unionid: Cookie.get(process.env.UNION_ID),
      }
    }
    else if (browserType == 'alipay') {
      datas = {
        ...sameDatas,
        alipay_user_id: Cookie.get(process.env.ALIPAY_USER_ID),
      }
    }
    else {
      Taro.showToast({ title: "浏览器类型出错", icon: "none" }); return;
    }
    toWxPay(datas).then((res: any) => {
      Taro.hideLoading();
      if (res.code == 200) {
        if (browserType == 'wechat') {
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
                that.goToGroupInfo(_groupid);
              } else { Taro.showToast({ title: "微信支付失败", icon: "none" }); }
            }
          );
        }
        else if (browserType == 'alipay') {
          //支付宝支付
          window.AlipayJSBridge.call('tradePay', {
            tradeNO: res.data.alipayOrderSn, // 必传，此使用方式下该字段必传
          }, res => {
            //支付宝支付成功
            if (res.resultCode === "9000") {
              that.goToGroupInfo(_groupid);
            } else { Taro.showToast({ title: "支付宝支付失败", icon: "none" }); }
          })
        } else {
          Taro.showToast({ title: res.message, icon: 'none' })
        }
      }
    })
  }


  /**
  * 发团支付后查询团id跳转
  *  @param {object} order_sn 订单号
  */
  getLastGroupId = (order_sn) => {
    let that = this;
    Taro.showLoading({ title: '支付成功，正在查询用户团活动id', mask: true });
    let timer = setTimeout(() => {
      clearTimeout(timer);
      getUserYouhuiGroupId({ order_sn: order_sn })
        .then((res: any) => {
          if (res.code == 200) {
            Taro.hideLoading();
            that.goToGroupInfo(res.data.id)
          } else {
            that.getLastGroupId(order_sn)
          }
        }).catch((err) => {
          that.getLastGroupId(order_sn)
        })
    }, 1000);
  }

  /**
   * 跳转团详情
   *  @param {object} _tempid 团id
   */
  goToGroupInfo = (_tempid: any) => {
    Taro.navigateTo({
      url: '/pages/activity/pages/group/group?id=' + _tempid,
      success: () => {
        var page = Taro.getCurrentPages().pop();
        if (page == undefined || page == null) return;
        page.onLoad();
      }
    })
  }

  /**
   * 列表轮播
   */
  listAtb = () => {
    let timer = setTimeout(() => {
      clearTimeout(timer);
      let tempPage = this.state.current == this.state.newGroupList.length - 1 ? 0 : this.state.current + 1;
      this.setState({ current: tempPage }, () => { this.listAtb() })
    }, 5000)
  }

  /**
   * 回首页
   */
  handleGoHome = () => {
    Taro.switchTab({ url: '/pages/index/index' })
  }
  toShare = () => {
    let userAgent = navigator.userAgent;
    let isIos = userAgent.indexOf('iPhone') > -1;
    let url: any;
    if (isIos) {
      url = sessionStorage.getItem('url');
    } else {
      url = location.href;
    }
    let titleMsg = this.state.data.gift_id ? '你有一张' + this.state.data.return_money + '元增值券待领取，邀请好友助力还有免费好礼拿！' : '什么？' + this.state.data.pay_money + '元还可以当' + this.state.data.return_money + '元花，走过路过不要错过！';
    let descMsg = this.state.data.gift_id ? this.state.data.pay_money + '元当' + this.state.data.return_money + '元花的秘密，我只告诉你一个！增值成功还有' + this.state.data.gift.price + '元' + this.state.data.gift.title + '免费拿！' : this.state.data.location_name + '增值券福利来了！只要邀请' + this.state.data.dp_count + '个好友助力，' + this.state.data.pay_money + '元秒变' + this.state.data.return_money + '元，感觉能省一个亿！';
    let linkMsg = share_url + 'id=' + this.$router.params.id + '&type=1&gift_id=' + this.$router.params.gift_id + '&activity_id=' + this.$router.params.activity_id
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
            'updateAppMessageShareData',
            'updateTimelineShareData',
            'onMenuShareAppMessage', //旧的接口，即将废弃
            'onMenuShareTimeline'//旧的接口，即将废弃
          ]
        })
        wx.ready(() => {
          wx.updateAppMessageShareData({
            title: titleMsg,
            desc: descMsg,
            link: linkMsg + '&invitation_user_id=' + this.state.data.invitation_user_id,
            imgUrl: 'http://wx.qlogo.cn/mmhead/Q3auHgzwzM6UL4r7LnqyAVDKia7l4GlOnibryHQUJXiakS1MhZLicicMWicg/0',
            success: function () {
              //成功后触发
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

  copyText = () => {
    let NValue = this.state.data.share_text.replace(/@#@#/, H5_URL)
    let NumClip = document.createElement("textarea");
    NumClip.value = NValue;
    document.body.appendChild(NumClip);
    NumClip.select();
    this.selectText(NumClip, 0, NValue.length);
    if (document.execCommand('copy', false)) {
      document.execCommand('copy', false)// 执行浏览器复制命令
      Taro.showToast({ title: '复制成功，请前往微信发送给好友。' })
    } else {
      Taro.showToast({ title: '该浏览器不支持点击复制到剪贴板', icon: 'none' })
    }
    this.setState({ showShare: false })
  }

  selectText = (textbox, startIndex, stopIndex) => {
    if (textbox.createTextRange) {//ie
      var range = textbox.createTextRange();
      range.collapse(true);
      range.select();//不兼容苹果
    } else {//firefox/chrome
      textbox.setSelectionRange(startIndex, stopIndex);
      textbox.focus();
    }
  }


  /* 请求海报数据 */
  getPostList = () => {
    const { youhui_id } = this.state.data
    getGroupPoster({ youhui_id, from: 'h5' })
      .then(({ data, code }) => {
        this.setState({ posterList: data })
      })

  }

  /* 关闭海报 */
  closePoster = () => {
    this.setState({ showPoster: false, showShare: false })
  }

  render() {
    const { description } = this.state.data;
    const { showBounced, showPoster, posterList } = this.state;
    return (
      <View className="group-activity-detail">
        {/* 分享组件 */}
        <ShareBox
          show={this.state.showShare}
          onClose={() => this.setState({ showShare: false })}
          sendText={() => {
            this.copyText()
            this.setState({ showShare: false })
          }}
          sendLink={() => {
            this.buttonToShare()
            this.setState({ showShare: false })
          }}
          createPoster={() => {
            this.setState({ showPoster: true, showShare: false })
          }}
        />

        <View className={showPoster ? "show-poster" : "hidden-poster"} onClick={() => this.setState({ showPoster: false })}>
          <Poster show={showPoster} list={posterList} onClose={this.closePoster} />
          <View className="click-save">长按保存图片到相册</View>
        </View>

        {
          this.state.isShare == true ? (
            <View className='share_mask' onClick={this.closeShare}>
              <View className='share_box'>
                <View className='share_text text_top'>
                  点击此按钮分享给好友
                                    </View>
                <Image src={require('../../../assets/share_arro.png')} className='share_img' />
              </View>
            </View>
          ) : null
        }
        <View
          className="swiper-content"
          onClick={(e) => {
            this.setState({ imgZoom: true, imgZoomSrc: this.state.data.images[this.state.bannerImgIndex] })
          }}>
          <Swiper
            onChange={(e) => {
              this.setState({ bannerImgIndex: e.detail.current })
            }}
            className='group-banner'
            circular
            autoplay
          >
            {
              this.state.data.images.length ? this.state.data.images.map((item, index) => {
                return (
                  <SwiperItem className="group-banner-swiperItem" key={item}>
                    <Image className="group-banner-img" src={item} />
                  </SwiperItem>
                )
              }) : null
            }
          </Swiper>
          <View className="banner-number-box">
            <View className="banner-number">{Number(this.state.bannerImgIndex) + 1}</View>
            <View className="banner-number">{this.state.data.images.length}</View>
          </View>
        </View>

        {/* <View className="collect-box">
                    <Image className="collect-img" src="http://oss.tdianyi.com/front/7mXMpkiaD24hiAEw3pEJMQxx6cnEbxdX.png" />
                </View> */}
        {/* <View className="share-box">
          <Image className="share-img" src="http://oss.tdianyi.com/front/Af5WfM7xaAjFHSWNeCtY4Hnn4t54i8me.png" />
        </View> */}

        <View className="group-info-content">
          <View className="group-info-title">
            <View className="group-info-title-label">拼团券</View>
            <View className="group-info-title-text">{this.state.data.youhui_name}</View>
          </View>
          <View className="group-info-price">
            <View className="group-price-info">
              <View className="group-price-info-text">优惠价￥</View>
              <View className="group-price-info-new">{this.state.data.participation_money}</View>
              <View className="group-price-info-old">￥{this.state.data.pay_money}</View>
            </View>
            <View className="group-price-discounts">已优惠￥{Number(this.state.data.pay_money) - Number(this.state.data.participation_money)}</View>
          </View>
          <View className="group-info-label">
            <View className="group-info-label-item">{this.state.data.number}人团</View>
            {this.state.data.gift ? <View className="group-info-label-item">送{this.state.data.gift.title}</View> : null}
          </View>
        </View>
        <Image className="group-banner-nav" src="http://oss.tdianyi.com/front/AY8XDHGntwa8dWN3fJe4hTWkK4zFG7F3.png" />

        {
          this.state.newGroupList.length ? <View className="group-group-num">
            <View className='apply-title-box'>
              <View className='apply-title-left'></View>
              <View className='apply-title'>{this.state.data2.total}个团正在拼</View>
            </View>
            <View className='apply-title-right'>正在拼团</View>
          </View> : null

        }
        {
          this.state.newGroupList.length ? <AtTabs
            current={this.state.current}
            scroll
            className="swiper-group-list"
            tabDirection='vertical'
            height={'34.6vw'}
            tabList={[]}
            onClick={() => { }}>
            {
              this.state.newGroupList.map((item: any, index) => {
                return (
                  <AtTabsPane tabDirection='vertical' current={this.state.current} index={index} key={index} className="swiper-group-list-atTabsPane">
                    <View className="swiper-group-list-item">
                      <View className="swiper-item" onClick={() => { console.log(item[0]) }}>
                        <View className="group-user" >
                          <View className="group-list-img" >
                            <Image className="listImg" src={item[0].avatar} />
                          </View>
                          <View className="group-list-name" >{item[0].real_name}</View>
                        </View>

                        <View className="group-info" >
                          <View className="group-list-timesbox" >
                            <View className="group-list-lack" >
                              <View className="group-list-lackredblack1" >还差</View>
                              <View className="group-list-lackred" >{item[0].number - item[0].participation_number}人</View>
                              <View className="group-list-lackredblack2" >拼成</View>
                            </View>
                            <View className="group-list-times" >
                              <TimeUp itemtime={item[0].end_at} />
                            </View>
                          </View>
                          <View className="group-list-btnbox" >
                            {
                              item[0].is_team ? <View className="group-list-btn" style={{ background: '#999999' }}  >已参团</View> :
                                <View className="group-list-btn" onClick={this.goToaConfirmAddGroup.bind(this, item[0].id)} >参团</View>
                            }
                          </View>
                        </View>
                      </View>
                      {
                        item[1] ? <View className="swiper-item" >

                          <View className="group-user" >
                            <View className="group-list-img" >
                              <Image className="listImg" src={item[1].avatar} />
                            </View>
                            <View className="group-list-name" >{item[1].real_name}</View>
                          </View>

                          <View className="group-info" >
                            <View className="group-list-timesbox" >
                              <View className="group-list-lack" >
                                <View className="group-list-lackredblack1" >还差</View>
                                <View className="group-list-lackred" >{item[1].number - item[1].participation_number}人</View>
                                <View className="group-list-lackredblack2" >拼成</View>
                              </View>
                              <View className="group-list-times" >
                                <TimeUp itemtime={item[1].end_at} />
                              </View>
                            </View>
                            <View className="group-list-btnbox" >
                              {
                                item[1] && item[1].is_team ? <View className="group-list-btn" style={{ background: '#999999' }} >已参团</View> :
                                  <View className="group-list-btn" onClick={this.goToaConfirmAddGroup.bind(this, item[1].id)}  >参团</View>
                              }
                            </View>
                          </View>

                        </View> : null
                      }
                    </View>
                  </AtTabsPane>
                )
              })
            }
          </AtTabs>
            : null

        }
        {/* <Swiper
                    onChange={(e) => {
                        // if (this.state.current == this.state.list.length - 2) {
                        //     this.setState({ current: 0 })
                        // }
                        // else {
                        //     this.setState({ current: e.detail.current })
                        // };
                    }}
                    className='swiper-group-list'
                    autoplay
                    // circular
                    displayMultipleItems={2}
                    vertical
                >
                    {
                        this.state.list.map((item, index) => {
                            return (
                                <SwiperItem key={item} >
                                    <View className="swiper-item" onClick={() => { console.log(item) }}>

                                        <View className="group-user" >
                                            <View className="group-list-img" >
                                                <Image className="listImg" src={"http://oss.tdianyi.com/front/2tp2Gi5MjC47hd7mGBCjEGdsBiWt5Wec.png"} />
                                            </View>
                                            <View className="group-list-name" >{index}测试测试测试测试</View>
                                        </View>

                                        <View className="group-info" >
                                            <View className="group-list-timesbox" >
                                                <View className="group-list-lack" >
                                                    <View className="group-list-lackredblack1" >还差</View>
                                                    <View className="group-list-lackred" >33人</View>
                                                    <View className="group-list-lackredblack2" >拼成</View>
                                                </View>
                                                <View className="group-list-times" >
                                                    <TimeUp itemtime={'2020-6-8'} />
                                                </View>
                                            </View>
                                            <View className="group-list-btnbox" >
                                                <View className="group-list-btn" >参团</View>
                                            </View>
                                        </View>

                                    </View>
                                </SwiperItem>
                            )
                        })
                    }
                </Swiper> */}
        {
          this.state.newGroupList.length ? <View className="group-group-bottom"></View> : null
        }

        <View className="group-store-info">
          <ApplyToTheStore
            id={this.state.data.id}
            isTitle={true}
            img={this.state.data.preview}
            name={this.state.data.name}
            phone={this.state.data.tel}
            address={this.state.data.address}
            location={{ xpoint: this.state.data.xpoint, ypoint: this.state.data.ypoint }}
            meter={this.state.data.distances}
          />
        </View>

        {this.state.data.gift ?
          <View className="group-gift">
            <View className="group-title-box">
              <View className='group-title-left-box' >
                <View className='group-title-left'></View>
                <View className='group-title'>赠送礼品</View>
              </View>
              <View className='group-title-right' onClick={this.toImgList.bind(this)}>
                <View className='group-title-right-info'>查看详情</View>
                <Image className="group-title-right-icon" src={"http://oss.tdianyi.com/front/SpKtBHYnYMDGks85zyxGHrHc43K5cxRE.png"} />
              </View>
            </View>
            <View className='group-gift-brief'>{this.state.data.gift.title}</View>
            <View className='group-gift-label-box'>
              <View className='group-gift-label'>{this.state.data.gift.mail_mode == 1 ? '免运费' : `运费${this.state.data.gift.postage}元`}</View>
            </View>
            <Image className="group-gift-img" src={this.state.data.gift.cover_image} mode={'widthFix'} />
          </View> : null
        }


        <View className="group-rules">
          <View className="group-title-box">
            <View className='group-title-left'></View>
            <View className='group-title'>使用说明</View>
          </View>
          <View className="group-rules-item" >
            <View className="rules-key">拼团人数：</View>
            <View className="rules-words">{this.state.data.number}人成团</View>
          </View>
          <View className="group-rules-item" >
            <View className="rules-key"> 拼团时限：</View>
            <View className="rules-words">需{this.state.data.team_set_end_time}时内成团</View>
          </View>
          {/* <View className="group-rules-item" >
                        <View className="rules-key">有效期：</View>
                        <View className="rules-words">成团后7日内可用</View>
                    </View> */}
          {
            description && description.length && !this.state.showMoreRules ? <View>
              <View className="group-rules-list-title" >使用规则：</View>
              {
                description.length > 0 ? <View className="group-rules-list-text" >-{description[0]}</View> : null
              }
              {
                description.length > 1 ? <View className="group-rules-list-text" >-{description[1]}</View> : null
              }
              {
                description.length > 2 ? <View className="group-rules-list-text" >-{description[2]}</View> : null
              }
              {
                description.length > 3 ? <View className="group-rules-list-text" >-{description[3]}</View> : null
              }
            </View> : null
          }
          {
            description && description.length && description.length > 4 && this.state.showMoreRules ? <View>
              <View className="group-rules-list-title" >使用规则：</View>
              {
                description.map((item) => {
                  return (
                    <View className="group-rules-list-text" >-{item}</View>
                  )
                })
              }
            </View> : null
          }
          {
            description && description.length && description.length > 4 && !this.state.showMoreRules ? <View className="group-more" onClick={() => { this.setState({ showMoreRules: true }) }} >
              <Image className="group-more-icon" src={"http://oss.tdianyi.com/front/GQr5D7QZwJczZ6RTwDapaYXj8nMbkenx.png"} />
              <View className="group-more-text" >查看更多</View>
            </View> : null
          }
        </View>
        {/* <View className="group-buy-box" >
          <View className="group-buy-price-box" >
            <View className="group-buy-price-icon" >￥</View>
            <View className="group-buy-price-num" >{this.state.data.participation_money}</View>
          </View>
          <View className="group-buy-btn-box" >
            <View className="group-buy-btn-left" >分享活动</View>
            {
              this.state.allowGroup ? <View className="group-buy-btn-right" >{this.state.allowGroup}</View>
                : <View className="group-buy-btn-right" onClick={this.goToaConfirm.bind(this)} >
                  <View className="group-buy-btn-group" > {this.$router.params.type == "55" ? '参加拼团' : '发起拼团'}</View>
                  <View className="group-buy-btn-groupnum" >{this.state.data.number}人成团</View>
                </View>
            }
          </View>
        </View> */}


        <View className="new-buy-box" >
          <View className="new-price-box" >
            <View className="new-price-icon" >￥</View>
            <View className="new-price-num" >{this.state.data.participation_money}</View>
          </View>
          <View className="new-buy-btn-box" >
            <View className="new-buy-btn-left" onClick={() =>
              this.setState({ showShare: true })}>分享活动</View>
            {
              this.state.allowGroup ? <View className="new-buy-btn-right" >{this.state.allowGroup}</View>
                : <View className="new-buy-btn-right" onClick={this.goToaConfirm.bind(this)} >
                  {this.$router.params.type == "55" ? '参加拼团' : '发起拼团'}
                </View>
            }
          </View>
        </View>


        {
          showBounced ? <LandingBounced cancel={() => { this.setState({ showBounced: false }) }} confirm={() => {
            this.setState({ showBounced: false })
          }} /> : null
        }
        {
          this.state.isFromShare ? (
            <View style={{ position: 'fixed', bottom: '80px', right: '20px', zIndex: 88, width: '80px', height: '80px' }} onClick={this.handleGoHome.bind(this)}>
              <Image src={require('../../../assets/go-home/go_home.png')} style={{ width: '80px', height: '80px' }} />
            </View>
          ) : ''
        }


        <Zoom
          src={this.state.imgZoomSrc}
          showBool={this.state.imgZoom}
          onChange={() => { this.setState({ imgZoom: !this.state.imgZoom }) }}
        />
      </View>
    );
  }
}