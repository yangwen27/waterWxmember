import Taro, { Component } from '@tarojs/taro'
import { View, Image, } from '@tarojs/components'


// import loading2Png from '../images/1.png'
import loadingPng from '../images/loading.png'

export default class Loading extends Component{
    static defaultProps={
        isModal:true,
        title:'加载中...'
    }
    static options={
        addGlobalClass:true
    }
    render(){
        let{isModal,title}=this.props
        return isModal?(
            <View className='cu-load load-modal'>
                <Image src={loadingPng} class='png' mode='aspectFit'></Image>
                <View className='text-gray'>{title}</View>
            </View>
        ):(
            <View className='cu-load bg-grey mloading'>{title}</View>
        )
    }
}