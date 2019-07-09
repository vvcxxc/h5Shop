/**
 * http status
 */
export const FETCH_OK = 200
export const FETCH_BAD = 400
export const NOT_SIGN = 401
export const NOT_FIND = 404
export const SERVER_ERROR = 500

/**
 * coupon type
 * @type 0 -> 普通券
 * @type 1 -> 增值
 * @type 5 -> 团购
 * @type 55 -> 开团
 */
export const TYPE_NORMAL = 0
export const TYPE_APPRECIATION = 1
export const TYPE_GROUP = 5
export const TYPE_GROUP_OPEN = 55
/**
 * order status
 * @status 0 -> 全部
 * @status 1 -> 待使用
 * @status 2 -> 已使用
 * @status 3 -> 已过期
 */
// export const STATUS_ALL = 0
export const STATUS_AWAIT = 1
export const STATUS_AREADY = 2
export const STATUS_OVER_DUE = 3

/**
 * user action
 * @action view -> 查看
 * @action get -> 领取(, 券)
 * @action use -> 使用(, 券)
 * @action submit -> 提交
 * @action close -> 关闭
 * @action jump -> 跳转
 * @action appreciation -> 增值
 * @action checked -> 选中
 */
export const ACTION_VIEW = "view"
export const ACTION_GET = "get"
export const ACTION_USE = "use"
export const ACTION_SUBMIT = "submit"
export const ACTION_CLOSE = "close"
export const ACTION_JUMP = "jump"
// export const ACTION_INVITE = "invite"
export const ACTION_APPRECIATION = "appreciation"
export const ACTION_CHECKED = "checked"

/**
 * 积分商品
 * @status 1 -> 免邮费
 */
export const FREE_POSTAGE = 1
