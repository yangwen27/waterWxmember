import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

export default class Empty extends Component{

    static options={
        addGlobalClass: true,
    }
    render(){
        let {title}=this.props
        return (
        <View className='padding flex flex-direction align-center justify-center text-center'>
            <View  style={{fontSize:64+'px'}} className='cuIcon-emoji text-orange lg'> </View>
            <View className='text-gray'>{title||'没有数据'}</View>
        </View>
        )
    }
}
