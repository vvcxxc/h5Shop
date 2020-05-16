import Taro, { Component } from "@tarojs/taro";
import { AtIcon, AtToast } from "taro-ui"
import { View, Text, Image, ScrollView, Button, Switch } from "@tarojs/components";
import request from '../../services/request'
import { Swiper, SwiperItem } from '@tarojs/components'

interface Props {
    source: string | number;
    coupons_type: string | number;
    give_stage: string | number;
}
export default class GiftType extends Component<Props> {
    state = {
        itemText: ''
    }
    componentDidMount() {
        let text = '';
        const { source, coupons_type, give_stage } = this.props;
        if (source == 4) {
            // 增值
            switch (give_stage) {
                case 1:
                case '1':
                    text = '购买有礼';
                    break
                case 2:
                case '2':
                    text = '助力有礼';
                    break
                case 3:
                case '3':
                    text = '成交有礼';
                    break
            }
        } else if (source == 5) {
            // 团
            switch (give_stage) {
                case 1:
                case '1':
                    text = '开团有礼';
                    break
                case 2:
                case '2':
                    text = '参团有礼';
                    break
                case 3:
                case '3':
                    text = '成团有礼';
                    break
                case 4:
                case '4':
                    text = '成交有礼';
                    break
            }
        } else if (coupons_type == 0) {
            // 兑换
            switch (give_stage) {
                case 1:
                case '1':
                    text = '购买有礼';
                    break
                case 2:
                case '2':
                    text = '成交有礼';
                    break
            }
        } else if (coupons_type == 1) {
            // 现金
            switch (give_stage) {
                case 1:
                case '1':
                    text = '购买有礼';
                    break
                case 2:
                case '2':
                    text = '成交有礼';
                    break
            }
        }
        this.setState({ itemText: text })
    }


    render() {

        return (
            <Text>
                {this.state.itemText}
            </Text>
        );
    }
}
