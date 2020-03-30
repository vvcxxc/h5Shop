import request from '@/services/userRequest';

/**
*  获取信息
*/
export const userRelationShip = (data: object) =>
    request({
        url: 'v1/user/user/user_relation_ship',
        method: "GET",
        data
    })
    
