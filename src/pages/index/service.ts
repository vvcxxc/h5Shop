import request from '@/services/request'

/**
 * 获取城市名
*/
export const getCityName = (data: object) =>
  request({
    url: 'v3/city_name',
    data
  })




// -------------------------- 营销活动首页的接口 ----------------------

/**
 * 获取营销首页频道的数据（网红和品牌）
 * */
export const getChannelInfo = () =>
  request({
    url: 'v3/channels',
    method: 'GET'
  })

export const getTabList = data =>
  request({
    url: 'v3/channel_youhui',
    method: 'GET',
    data
  })
