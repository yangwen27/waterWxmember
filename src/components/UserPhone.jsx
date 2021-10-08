import Taro, { Component } from '@tarojs/taro'
import {Button } from '@tarojs/components'
import{request,} from '@utils/request'
import{DecryptUrl} from '@utils/apis'

export default class UserPhone extends Component{
    constructor(prop){
        super(prop)
    }
    static options={
        addGlobalClass: true,
    }
    onGetPhoneNumber=e=>{
        if(e.detail.iv){
            request(DecryptUrl,e.detail).then(rsp=>{
                if(rsp.Code==0){
                    this.props.onGetPhoneNumber(rsp.Data.phoneNumber)
                }else{
                    Taro.showToast({title:rsp.Msg||'网络异常',icon:'none'})
                }
            })
        }
    }
    render(){
        let {text}=this.props
        return (
            <Button className='cu-btn bg-green' openType='getPhoneNumber' onGetPhoneNumber={this.onGetPhoneNumber}>{text||'获取号码'}</Button>
        )
    }
}
