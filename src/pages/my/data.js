import iconOrder from "@/static/images/ic_order_2.png"
import iconWelfare from "@/static/images/ic_gift.png"
import iconActivity from "@/static/images/ic_activity.png"
export const cells = [
  {
    text: "我的订单",
    icon: iconOrder,
    path: "/pages/order/index",
    open_type: "switchTab"
  },
  // {
  //   text: "扫码支付订单记录",
  //   icon: iconOrder,
  //   path: "/activity-pages/offline/order",
  //   open_type: "navigate"
  // },
  {
    text: "福利中心",
    icon: iconWelfare,
    path: "/activity-pages/my-welfare/pages/gift/welfare.gift",
    open_type: "navigate"
  },
  {
    text: "我参加的活动",
    icon: iconActivity,
    path: "/activity-pages/my-activity/my.activity",
    open_type: "navigate"
  }
]
