import Taro, { Component } from "@tarojs/taro"
import request from '../../../../services/request'
import "./index.less"
import { spawn } from "child_process"
import TimeUp from '../../../../pages/activity/group/TimeUp'
import wx from 'weixin-js-sdk';
import QRCode from 'qrcode'
import { AtCurtain, AtButton } from 'taro-ui'

interface Props {
  // list: any
}
const share_url = process.env.GROUP_URL;

export default class TuxedoInformation extends Component<Props> {

  state = {
    listData: [],
    codeImg: '',
    isOpened: false,
    
  }

  componentDidMount() {
    request({
      url: 'api/wap/user/getMeGroupList',
      method: "GET"
    })
      .then((res: any) => {
        const { data, code } = res
        if (code !== 200) return
        this.setState({ listData: res.data })
      })
  }

  // 未开团人数头像显示
  for_data = (list: Array<string>, length: number) => {
    let total: any = []
    list.map((item2: any, index2: number) => {
      total.push(<div
        className={index2 == 0 ? '' : 'tuxedo_people'} style={{ zIndex: 6 - index2 }}>
        <div className="user_head">
          <img src={item2} alt="" />
        </div>
        {index2 == 0 ? <span>团长</span> : null}
      </div>)
    })

    for (let i = 0; i < length; i++) {
      total.push(
        <div className="no_user_head " style={{ zIndex: 5 - length - i }}>
          <img src={require('../../../../assets/problem.png')} alt="" />
        </div>
      )
    }
    if (total.length >= 5) total.length = 5
    return total
  }

  againGroup = (youhui_id, gift_id, activity_id) => {
    Taro.navigateTo({
      url: '/pages/activity/group/index?id=' + youhui_id + '&type=5&gift_id=' + gift_id + '&activity_id=' + activity_id
    })
    
  }

  shopDetails = (location_id) => {
    Taro.navigateTo({
      url: '/pages/business/index?id=' + location_id
    })
  }

  routerShare=(id,e)=>{
    Taro.navigateTo({
      url: '/pages/activity/pages/group/group?id=' + id
    })
    e.stopPropagation()
  }

  //使用卡券
  userCard = (data) => {
      QRCode.toDataURL(JSON.stringify(data))
      .then((url: any) => {
        Taro.hideLoading();
        this.setState({ codeImg: url, isOpened: true })
      })
      .catch((err: any) => {
        Taro.hideLoading();
        Taro.showToast({ title: '获取二维码失败', icon: 'none' })
      })
  }

  handleChange() {
    this.setState({
      isOpened: true
    })
  }
  onClose() {
    this.setState({
      isOpened: false
    })
  }



  render() {
    const { listData } = this.state
    return (
      <div className="tuxedo_box">
        {
          listData.map((item: any, index: number) => {
            return <div className="message" >
              <div className="tuxedo_title" onClick={this.shopDetails.bind(this, item.location_id)}>
                <img src={require('../../../../assets/shop_head.png')} alt="" />
                <div className="title_right" >{item.supplier_name}
                </div>
              </div>
              <div className="tuxedo_content" onClick={this.againGroup.bind(this, item.youhui_id, item.gift_id, item.activity_id)}>
                <div className="message_left">
                  <img src={item.image} alt="" />
                </div>
                <div className="message_right">
                  <div className="full_name">
                    <span>{item.name}</span>
                  </div>
                  <div className="residue_time">
                    {
                      item.end_at == '' &&
                        item.number !==
                        item.participation_number
                        ||
                        item.number !==
                        item.participation_number && new Date(item.end_at).getTime()
                        <= new Date().getTime()
                        ? <span className="failure">拼团失败</span> : null
                    }
                    {
                      item.end_at == '' &&
                        item.number ==
                        item.participation_number
                        ||
                        item.number ==
                        item.participation_number && new Date(item.end_at).getTime()
                        <= new Date().getTime() ? <span>拼团成功</span> : null
                    }

                    {
                      item.number !==
                        item.participation_number && new Date(item.end_at).getTime()
                        > new Date().getTime() ? <span>剩余时间</span> : null
                    }
                    {
                      item.number !==
                        item.participation_number && new Date(item.end_at).getTime()
                        > new Date().getTime() ? <TimeUp itemtime={item.active_end_time} /> : null
                    }
                  </div>
                  <div className="group">
                    <div className="group_left">
                      <img src={item.cover_image} alt="" />
                    </div>
                    <div className="group_right">
                      <div className="original_price">原价：￥{item.pay_money}</div>
                      <div className="group_price">
                        <span>拼团价：</span>
                        <span>￥{item.participation_money}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="foot">
                <div className="left">
                  {
                    this.for_data(item.head_list, item.number)
                  }
                </div>
                <div className="right">
                  {
                    item.number !==
                      item.participation_number && new Date(item.end_at).getTime()
                      > new Date().getTime() ? <div className="invite" onClick={this.routerShare.bind(this,item.id)}>邀好友参团</div> : null
                  }

                  {
                    item.number ==
                      item.participation_number &&
                      new Date(item.youhui_end_time).getTime()
                      > new Date().getTime() ? <div className="userCoupon" onClick={this.userCard.bind(this,item.qr_code)}>使用卡券</div> : null
                  }


                  {
                    item.end_at == '' || item.number == item.participation_number
                      && new Date(item.youhui_end_time).getTime()
                      <= new Date().getTime() ? <div className="userCoupon">已过期</div> : null
                  }

                  {
                    new Date(item.youhui_end_time).getTime() > new Date().getTime() &&
                      (item.number !== item.participation_number ||
                        new Date(item.end_at).getTime() >= new Date().getTime())
                      ? <div className="userCoupon"
                        onClick={this.againGroup.bind(this,item.youhui_id, item.gift_id, item.activity_id)}>再次拼团</div> : null
                  }

                </div>
              </div>
            </div>
          })
        }

        <AtCurtain
          isOpened={this.state.isOpened}
          onClose={this.onClose.bind(this)}
        >
          <div >
            <div className="user_prompt">商家扫码/输码验证即可消费</div>
            <img
              src={this.state.codeImg}
            />
          </div>
        </AtCurtain>

      </div>
    )
  }
}