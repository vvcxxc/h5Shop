/**
 * 所有活动: 图片|描述|路由(参数type为当前活动的券的类型)
 */
import activity1 from "@/static/images/ic_appreciation.png"
import activity2 from "@/static/images/ic_group.png"
import activity3 from "@/static/images/ic_zero.png"
import activity4 from "@/static/images/ic_more.png"
import activity5 from "@/static/images/ic_exchange.png"
import activity6 from "@/static/images/ic_earn.png"
import activity7 from "@/static/images/ic_double.png"
import activity8 from "@/static/images/ic_build.png"

export const activitys = [
  {
    src: activity1,
    text: "增值买",
    path: "/pages/activity/pages/list/list?type=1"
  },
  {
    src: activity2,
    text: "拼团",
    path: "/pages/activity/pages/list/list?type=5"
  },
  {
    src: activity3,
    text: "0元享",
    path: ""
  },
  {
    src: activity4,
    text: "大牌秒杀",
    path: ""
  },
  {
    src: activity5,
    text: "开心兑",
    path: ""
  },
  {
    src: activity6,
    text: "每天赚",
    path: ""
  },
  {
    src: activity7,
    text: "双倍拿",
    path: ""
  },
  {
    src: activity8,
    text: "建圈子",
    path: ""
  }
]

/**
 * 根据活动type来读取活动对应数据
 *  @field title
 *  @field path 主页
 *  @field list(api: 获取数据列表, field: 需要的字段)
 *  @field logid(api: 获取支付时用到的id的api, field: 对应id字段)
 *  @field detail 获取详情
 */
export const activityData = {
  "1": {
    title: "增值买活动",
    path: "/pages/activity/pages/appreciation/appreciation",
    list: {
      api: "api/wap/user/appreciation/getYouhuiList",
      method: "post"
    },
    logid: {
      api: "api/wap/user/appreciation/getYouhuiLogId",
      field: "youhui_log_id"
    },
    detail: {
      api: "api/wap/user/appreciation/getYouhuiAppreciationInfo",
      field: "youhui_id"
    }
  },
  "5": {
    title: "团购",
    path: "/pages/activity/pages/group/group",
    list: {
      api: "api/wap/user/getYonhuiActiveGroupList"
    },
    logid: {
      api: "api/wap/user/getGroupLogId",
      field: "group_id"
    },
    detail: {
      api: "api/wap/user/getGroupYouhuiInfo",
      field: "group_info_id"
    }
  }
}

// 表示当前用户对前前券: 未增值|已增值, 修改时, 跟后端约定
export const APPRECIATE_NOT = 0
export const APPRECIATE_ALREADY = 1
// 表示当前券是: 别人|自己的
export const COUPON_OTHER = 0
export const COUPON_SELF = 1

// 已参团
export const GROUP_AREADY = 1
// 未使用|已使用
export const UNUSED = 0
export const USED = 1

// 未领取
export const NOT_GET = 0
