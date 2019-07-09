import Taro, { useState, useEffect, DependencyList, navigateBack } from "@tarojs/taro";
import { View, Text } from '@tarojs/components';

import './style.scss'
import { defaultData, handerExceedTimeLimit, routeGo } from './unit'
import request from '../../services/request'
import CashCoupon from "../../components/cash-coupon/index";
import { BuyShouldKnow } from './components/BuyShouldKnow'
import { BillingInfo } from './components/BillingInfo'
import { SuitStore } from './components/SuitStore'
import SanCode from './components/sanCode'

function useAsyncEffect(cb: Function, dep: DependencyList) {
  useEffect(() => {
    cb()
  }, dep)
}

function setTimeoutCallback() {
  let timer: any
  return function (fn: Function, time: number) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      fn()
    }, time)
  }
}

function Index() {
  console.log(this.$router)
  const cuoPonsId = this.$router.params.id
  const [dataInfo, setDataInfo] = useState(Object.assign({}, defaultData))
  const [isApply, showApply] = useState(false)
  let setTimeOut = setTimeoutCallback()
  const {
    description,
    begin_time,
    end_time,
    youhui_sn,
    expiration,
    tel,
    money,
    create_time,
    refund_time,
    confirm_time,
    status, // 1未使用 2已使用 3已退款
    distance,
    capita,
    coupons_type,//券类型 0 兑换券 1 现金券
    location_address,
    store_name,
    image,
  } = dataInfo
  useAsyncEffect(async () => {
    if (coupons_type * 1 === 0) { //兑换券获取兑换码
      request({
        url: 'api/wap/coupon/showCode',
        data: { coupons_log_id: cuoPonsId },
      })
        .then((res: any) => {
          console.log(res)
        })
    }
    request({
      url: "v3/user/coupons/info",
      data: { coupons_log_id: cuoPonsId, xpoint: '', ypoint: '' }
    })
      .then((res: any) => {
        res.data && setDataInfo(Object.assign({}, dataInfo, res.data))
      })
      .catch(() => {
        Taro.showToast({ title: '数据请求失败', icon: 'none' })
      })
  }, [cuoPonsId])

  const handerApplyShow = () => {
    showApply(!isApply)
  }

  const toReturnMoney = () => {
    request({
      url: "v3/user/coupons/refund",
      method: 'POST',
      data: { coupons_log_id: cuoPonsId },
    }).then((res: any) => {
      if (res.code === 200) {
        Taro.showToast({ title: '退款成功' })
        routeGo('/pages/orderdetail/refundProgress', cuoPonsId)
      } else {
        handerApplyShow()
        setTimeOut(() => {
          Taro.showToast({ title: '退款失败', icon: 'none' })
        }, 500)
      }
    }).catch(() => {
      Taro.showToast({ title: '退款失败', icon: 'none' })
      handerApplyShow()
    })
  }
  return (
    <View className='index'>
      <View className='a_head' >
        <CashCoupon cuoPonsId={cuoPonsId} />
      </View>
      { /* 购买须知  */}
      {
        coupons_type * 1 === 1 ?
          <View className='z_buyShouldKnow' >
            <BuyShouldKnow buyshowknowProps={{ status, description, begin_time, end_time, expiration }} />
          </View> : null
      }
      { /* 扫码输入验证  */}
      {
        coupons_type * 1 === 0 ?
          <View  >
            <View className='a_buyBox'  >
              <View className='a_one' >扫码/输入验证</View>
              <View className='a_sanCodeBox' >
                <View className='a_sancodeLast' >
                  <Text style={{ letterSpacing: '10rpx' }} >订单号:</Text>
                </View>
                <SanCode code={youhui_sn} url={null} />
              </View>
            </View>
          </View>
          : null
      }
      { /* 订单信息  */}
      <View className='z_billingInfo' >
        <BillingInfo billingInfoProps={{ youhui_sn, cuoPonsId, tel, money, create_time, refund_time, confirm_time, status }} />
      </View>
      { /* 适用商铺  */}
      <View className='z_billingInfo' >
        <SuitStore suitStoreProps={{ distance, location_address, store_name, capita, image }} />
      </View>
      { /* 申请退款 */}
      {
        status * 1 === 1 && !handerExceedTimeLimit(end_time) ?
          <View className='z_applyReturn' >
            <View onClick={handerApplyShow}  >申请退款</View>
          </View>
          : null
      }
      {/* 确认退款 */}
      {
        isApply ?
          <View className='a_mast' >
            <View className='a_mastContent' >
              <View className='a_return' >确定要申请退款吗</View>
              <View className='a_returnB' >
                <View onClick={handerApplyShow} >取消</View>
                <View onClick={toReturnMoney} >确定</View>
              </View>
            </View>
          </View> : null
      }

    </View>
  )
}

Index.config = {
  navigationBarTitleText: '订单详情',
}

export default Index 