module.exports = {
  env: {
    NODE_ENV: '"test"',
    // BASIC_API: '"https://api.tdianyi.com/"',
    UNION_ID: '"unionid"',

    //  测试环境
    BASIC_API: '"http://test.api.tdianyi.com/"',
    OPEN_ID: '"test_open_id"',
    TOKEN: '"test_token_auth"',
    ALIPAY_USER_ID: '"test_alipay_user_id"',
    LOGIN_URL: '"http://test.api.tdianyi.com"',
    AUTH_LOGIN_URL: '"http://test.wxauth.tdianyi.com/"',
    USER_API: '"http://test.usercenter.tdianyi.com/"'，
    WX_APPID: 'wxfe816c3a5440ce7a',
    ALI_APPID: '2018080960968490',

    // 预发布环境
    // BASIC_API: '"http://release.api.tdianyi.com/"',
    // LOGIN_URL: '"http://release.api.tdianyi.com"',
    // OPEN_ID: '"open_id"',
    // TOKEN: '"token_auth"',
    // ALIPAY_USER_ID: '"alipay_user_id"',
    // AUTH_LOGIN_URL: '"https://wxauth.tdianyi.com/"',
    // USER_API: '"https://release.usercenter.tdianyi.com/"'，
    // WX_APPID: 'wxecdd282fde9a9dfd',
    // ALI_APPID: '2017111509949310',

    GROUP_URL: '"http://test.mall.tdianyi.com/pages/activity/pages/group/group?id="',
    APPRE_URL: '"http://test.mall.tdianyi.com/pages/activity/pages/appreciation/appreciation?id="',
    APPRE_Details_URL: '"http://test.mall.tdianyi.com/pages/activity/appreciation/index?"',
    GROUP_Details_URL: '"http://test.mall.tdianyi.com/pages/activity/group/index?"',
    BUSINESS_URL: '"http://test.mall.tdianyi.com/pages/business/index?id="',
    TICKETBUY_URL: '"http://test.mall.tdianyi.com/business-pages/ticket-buy/index?id="',
    SETMEAL_URL: '"http://test.mall.tdianyi.com/business-pages/set-meal/index?id="',

  },
  defineConstants: {
  },
  weapp: {},
  h5: {}
}
