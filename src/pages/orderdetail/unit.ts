import Taro from "@tarojs/taro";

export function handerExceedTimeLimit(time:string){
    return Date.parse( String(new Date()) ) > Date.parse(time) 
}

export  function routeGo(url:string,id:number,data ? :any){
    Taro.navigateTo({
        url:url+'?id='+id+'&data='+(data?JSON.stringify(data):null)
    })
}

export const defaultData :any = {
        // coupons_log_id:'',//优惠券记录ID
        // coupons_id:'',//优惠券ID
        // expiration:'',//过期时间
        // coupons_name:'',//优惠券名称
        // money:'',//优惠券金额
        // store_name:'',//店铺名称
        // image:'',//优惠券图片
        // begin_time:0,//起始时间
        // end_time:0,//使用结束时间
        // coupons_type:0,//优惠券类型 0兑换券 1现金券
        // confirm_time:0,//确认使用时间
        // description:[],//使用规则
        // pay_money:0,//实际购买价格
        // youhui_sn:'',//订单号 与码同一个
        // create_time:0,//付款时间
        // refund_time:0,//退款时间
        // status:0,//状态 状态 1未使用 2已使用 3已退款 只有显示已退款才可以请求查看退款进度 退款进度接口 /v3/user/coupons/refund/schedule	
        // location_address:'',//店铺地址
        // tel:'',//电话号码
        // distance:'',//距离
        // capita:'',//人均费用
        "coupons_log_id":877,
        "coupons_id":936,
        "expiration":"2019-08-08 18:33:06",
        "coupons_name":"多美优惠券",
        "money":"100.0000",
        "store_name":"多美蛋糕店",
        "image":"http://oss.tdianyi.com/front/Bpn8iRjEmWid5yQJ8iWpNDrFNMJ8Ja6D.jpg",
        "begin_time":"2018-12-10",
        "end_time":"2019-08-08 ",
        "coupons_type":0,
        "confirm_time":"2018-12-10 15:08:03",
        "total_fee":0,
        "description":[
            "仅限本店使用",
            "请在使用日期内使用",
            "仅限本店使用",
            "请在使用日期内使用",
            "仅限本店使用",
            "请在使用日期内使用"
        ],
        "pay_money":"100.0000",
        "youhui_sn":"CC605998DF06",
        "create_time":"2018-12-10 15:00:32",
        "refund_time":0,
        "status":1,
        "location_address":"海珠区大干围海珠创意产业园",
        "tel":"13026875303",
        "distance":"12m",
        "capita":"108.00"
}
