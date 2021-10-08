import CustomBar from '@components/CustomBar'
// import Empty from '@components/Empty'
import Loading from '@components/Loading'
import UserPhone from '@components/UserPhone'
import UserInfo from '@components/WxUserInfo'
import { Button, Form, Input, Text, View } from '@tarojs/components'
import Taro, { Component } from '@tarojs/taro'
import { loginUrl, wxRegisterUrl } from '@utils/apis'
import { request, updateToken } from '@utils/request'

export default class Login extends Component {
    constructor(props){
        super(props)
        this.state={wxUserInfo:null,showGetPhone:false}
    }
    submit=e=>{
        e.stopPropagation()
        console.log('formData :>> ', e);
        let formData=e.detail.value
        if(formData.Name==""||formData.Password==""){
            Taro.showToast({title:'请输入帐号和密码',icon:'none'})
            return
        }
        this.setState({showLoading:true})
        request(loginUrl,formData).then(rsp=>{
            this.setState({showLoading:false})
            if(rsp.Code==0){
                Taro.showToast({icon:'none',title:'登录成功'})
                setTimeout(() => {
                    Taro.navigateBack({
                        delta:1,
                        fail:()=>{
                            Taro.navigateTo({url:'/pages/index/index',fail:()=>{Taro.switchTab({url:'/pages/index/index'})}})
                        }
                    })
                }, 1500)
            }else{
                Taro.showModal({
                    title: '错误',
                    content: rsp.Msg||'网络异常',
                })
            }
        })
    }
    onUserInfo=e=>{
       
        this.setState({wxUserInfo:e,showGetPhone:true})
    }
    onGetPhoneNumber=e=>{
        if(!this.state.wxUserInfo){
            this.setState({showGetPhone:false})
            Taro.showToast({title:'请先获取信息公开信息',icon:'none'})
        }else{
            let req={
                Name:this.state.wxUserInfo.nickName,
                AvatarUrl:this.state.wxUserInfo.avatarUrl,
                Gender:this.state.wxUserInfo.gender,
                Phone:e,
                OpenId:this.state.wxUserInfo.openId,
                Address:this.state.province+this.state.city
            }
             //微信一键登录
            request(wxRegisterUrl,req).then(rsp=>{
                if(rsp.Code==0){
                    updateToken(rsp.Data)
                    Taro.showToast({icon:'none',title:'登录成功'})
                    setTimeout(() => {
                        Taro.navigateBack({
                            delta:1,
                            fail:()=>{
                                Taro.navigateTo({url:'/pages/index/index',fail:()=>{Taro.switchTab({url:'/pages/index/index'})}})
                            }
                        })
                    }, 1500)
                }else{
                    Taro.showModal({
                        title:'错误',
                        content:rsp.Msg||'网络异常'
                    })
                }
            })
        }
        
    }
    render() {
        let { showLoading,showGetPhone } = this.state
        return (
            <View style={{ height: '100vh' }} className='bg-cyan '>
                <CustomBar showHome title='请登录' />
                <View style={{background:'rgba(0, 0, 0, 0.2)'}} className='cu-modal show'>
                    <View className=' bg-white cu-dialog  padding text-left '>
                        <Form onSubmit={this.submit}>
                            <View className='text-xl text-bold padding text-center'>请登录</View>
                            <View id='Name' className='cu-form-group'>
                                <View class='title'><Text className='text-red'>*</Text>帐号:</View>
                                <Input name='UserName' placeholder='请输入登录帐号' />
                            </View>
                            <View id='Password' className='cu-form-group'>
                                <View class='title'><Text className='text-red'>*</Text>密码:</View>
                                <Input password name='Password' placeholder='请输入密码' />
                            </View>
                            <View className='cu-form-group' style={{ minHeight: 0, padding: 0 }}></View>
                            <View className='padding-top margin-top flex'>
                                <UserInfo text='微信一键登录' onData={this.onUserInfo} />
                                <Button style={{flex:1}} formType='submit' className='cu-btn block bg-cyan  margin-left'>
                                <Text className='cuIcon-save'></Text> 登录</Button>
                            </View>
                        </Form>
                    </View>
                </View>
                {showLoading && <Loading />}
                <View className={['cu-modal bottom-modal',showGetPhone?'show':'']}>
                    <View className='cu-dialog '>
                        <View className='cu-bar bg-cyan light'>
                            <View className='action'>授权提示</View>
                            <View className='action'><Text className='cuIcon-close'></Text></View>
                        </View>
                        <View className='padding text-grey'>我们需要获取您微信绑定的手机号码来注册，请点击下方按钮授权获取</View>
                        <UserPhone  text='授权获取号码' onGetPhoneNumber={this.onGetPhoneNumber} />
                        <View className='margin-top '></View>
                    </View>
                </View>
            </View>
        )
    }
}