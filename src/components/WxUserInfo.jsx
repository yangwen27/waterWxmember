import Taro, { Component } from '@tarojs/taro'
import {Button } from '@tarojs/components'
import{request,} from '@utils/request'
import{DecryptUrl} from '@utils/apis'

export default class UserInfo extends Component{
    constructor(prop){
        super(prop)
        this.stete={
            canIuse:Taro.canIUse('getUserInfo'),
        }
    }
    static options={
        addGlobalClass: true,
    }
    onGetUserInfo=e=>{
        if(e.detail.iv){
            request(DecryptUrl,e.detail).then(rsp=>{
                if(rsp.Code==0){
                    this.props.onData(rsp.Data)
                }else{
                    Taro.showToast({title:rsp.Msg||'网络异常',icon:'none'})
                }
            })
        }
    }
    componentDidShow(){
        if(Taro.canIUse('getUserInfo')){
            
        }
    }
    getData=e=>{
        e.stopPropagation()
        Taro.getUserInfo({
            success:res=>{
                console.log('res :>> ', res);
                request(DecryptUrl,{iv:res.iv,encryptedData:res.encryptedData}).then(rsp=>{
                    if(rsp.Code==0){
                        this.props.onData(rsp.Data)
                    }else{
                        Taro.showToast({title:rsp.Msg||'网络异常',icon:'none'})
                    }
                })
            }
        })
    }
    render(){
        let {text}=this.props
        return (
            this.state.canIUse?<Button className='cu-btn bg-green' onClick={this.getData}>{text||'获取微信公开信息'}</Button>
            :<Button className='cu-btn bg-green' openType='getUserInfo' onGetUserInfo={this.onGetUserInfo}>{text||'获取微信公开信息'}</Button>
        )
    }
}
