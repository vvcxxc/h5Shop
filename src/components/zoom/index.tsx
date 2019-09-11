import Taro, { Component } from "@tarojs/taro";
import { View, Image } from "@tarojs/components";


interface Props {
    src: string;
    showBool: boolean;
    onChange: Function
}
{/*
调用方式：  state={ imgZoom: false , imgZoomSrc: '',}
             <Image onClick={() => { this.setState({ imgZoom: true, imgZoomSrc:item.src }) }}
            <Zoom
                src={this.state.imgZoomSrc}
                showBool={this.state.imgZoom}
                onChange={() => { this.setState({ imgZoom: !this.state.imgZoom }) }}
            /> */}
export default class Zoom extends Component<Props> {

    state = {
    };

    handlerTablChange() {
        console.log(this);
        const { onChange } = this.props;
        onChange && onChange();
    }

    render() {
        return (
            <View
                onClick={this.handlerTablChange.bind(this)}
                style={{ height: "100vh", width: "100vw", position: "fixed", top: "0", background: "rgb(0,0,0,.9)",zIndex:999, display: this.props.showBool ? "block" : "none" }}>
                <View style={{ height: "100%", width: "100%", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
                    <Image src={this.props.src} style={{ width: "100%" }} />
                </View>
            </View>
        );
    }
}
