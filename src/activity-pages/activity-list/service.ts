import request from '@/services/request'

export const getList = (data) =>
  request({
    url: 'v3/channel_youhui',
    data
  })
