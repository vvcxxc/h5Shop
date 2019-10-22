import Taro, { Component } from "@tarojs/taro";
import { getTime } from '@/utils/common';
import dayjs from 'dayjs'
interface Props {
    itemtime: any
}

export default class TimeUp extends Component<Props>{

    state = {
        time: {
            date: '',
            display: 2
        },
        differ_time: [],
    };

    componentDidMount() {
        this.setTime();
    }
    // componentDidShow() {
        // this.setTime();
    // }
    // componentWillReceiveProps(props, nextprops) {
    //     this.setTime();
    // }
    componentWillUnmount() {
        // console.log('清除计时器');
        // var end = setTimeout(function () { }, 1);
        // var start = (end - 100) > 0 ? end - 100 : 0;
        // for (var i = start; i <= end; i++) {
        //     clearTimeout(i);
        // }
    }
    /**
       * 定时
       */
    setTime = () => {
        let timer;
        if (this.state.time.display <= 0) {
            clearTimeout(timer)
            return
        } else {
            timer = setTimeout(() => {
                clearTimeout(timer);
                let times = dayjs(this.props.itemtime).endOf('day')
                let time = getTime(new Date(times.$d).getTime() / 1000);
                // console.log(new Date(this.props.itemtime).getTime() / 1000)
                this.setState({
                    time
                })
                this.setTime()
            }, 1000);
            // console.log('timer', timer)
        }
    }


    render() {
        return (
            <div className="timeUp" >
                {this.state.time.date}
            </div>
        );
    }
}
