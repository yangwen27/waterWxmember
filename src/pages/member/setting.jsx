import CustomBar from '@components/CustomBar'
import ImgUpload from '@components/ImgUpload'
import Loading from '@components/Loading'
import { Button, Form, Input, Text, View } from '@tarojs/components'
import Taro, { Component } from '@tarojs/taro'
import { updateAvatarUrl, updateMemberUrl, updateOauthBindUrl, updatePwdUrl, userBaseUrl } from '@utils/apis'
import { request } from '@utils/request'

export default class Setting extends Component {
    constructor(props){
        super(props)
        this.state={
            isLoading:false,
            showSetPwd:false,
            showSetAvatar:false,
            showSetName:false,
            imgs:[],
            info:null
        }
    }
    componentDidMount() {
        this.getData()
     }

    componentWillUnmount() { }

    componentDidShow() {
    }

    componentDidHide() { 
    }
    getData(){
        request(userBaseUrl,{},'GET').then(rsp=>{
            if(rsp.Code==0){
                if(rsp.Data.PhotoId){
                    this.setState({imgs:[rsp.Data.PhotoId],info:rsp.Data})
                }
            }else{
                if(rsp.Code==403||rsp.Code==401){
                    Taro.redirectTo({url:'/pages/login'})
                }
            }
        })
    }
    config = {
        navigationBarTitleText: '一键订水'
    }
    stopPropagation(e){
        e.stopPropagation()
        
    }
    hideModal=(val,e)=>{
        e.stopPropagation()
        if(val==1){
            console.log('val :>> ', val);
            this.setState({showSetPwd:!this.state.showSetPwd})
        }
        if(val==2){
            this.setState({showSetAvatar:!this.state.showSetAvatar})
        }
        if(val==3){
            this.setState({showSetName:!this.state.showSetName})
        }
    }
    updatPwd=e=>{
        let form =e.detail.value
        console.log('form >> ', form)
        if(!form.OldPwd||!form.NewPwd){
            Taro.showToast({title:'请输入密码',icon:'none'})
            return
        }
        if(form.NewPwd!=form.NewPwd2){
            Taro.showToast({title:'两次输入的新密码不一致',icon:'none'})
            return
        }
        this.setState({isLoading:true})
        request(updatePwdUrl,form).then(rsp=>{
            this.setState({isLoading:false})
            Taro.showToast({title:rsp.Msg||'网络异常',icon:'none'})
            if(rsp.Code==0){
                this.setState({showSetPwd:false})
            }
        })
    }
    onUpload=(imgs,dels)=>{
        console.log('dels :>> ', dels);
        if(imgs){
            if(imgs.length>0){
                this.setState({isLoading:true})
                request(updateAvatarUrl+imgs[0]).then(rsp=>{
                    this.setState({isLoading:false})
                    Taro.showToast({title:rsp.Msg||'网络异常',icon:'none'})
                    if(rsp.Code==0){
                        this.setState({showSetAvatar:false},this.getData)
                    }
                })
            }
        }
    }
    setName=e=>{
        let form=e.detail.value
        if(form.Name==''){
            Taro.showToast({title:'请输入昵称',icon:'none'})
            return
        }
        this.setState({isLoading:true})
        request(updateMemberUrl,{Entity:form}).then(rsp=>{
            this.setState({isLoading:false})
            Taro.showToast({title:rsp.Msg||'网络异常',icon:'none'})
            if(rsp.Code==0){
                this.setState({showSetName:false},this.getData)
            }
        })
    }
    wxBind=e=>{
        e.stopPropagation()
        Taro.showModal({
            title:'确定要进行该操作吗？',
            content:'如果原来绑定过微信的将解除绑定，原来没有绑定过的将绑定当前微信',
        success:res=>{
           if( res.confirm){
            this.setState({isLoading:true})
            request(updateOauthBindUrl).then(rsp=>{
                this.setState({isLoading:false})
                Taro.showToast({title:rsp.Msg||'网络异常',icon:'none'})
                if(rsp.Code==0){
                    this.setState({showSetName:false})
                }
            })
           }
        }
        })
    }
    render() {
        let {isLoading,showSetAvatar,showSetPwd,imgs,showSetName,info}=this.state
        console.log('imgs :>> ', imgs);
        return (
            <View style={{height:'100vh'}} className='index'>
                {isLoading&&<Loading title='正在提交...' />}
                <CustomBar  isBack showHome  title='账户设置'></CustomBar>
                <View style={{height:'100%',position:'relative'}} className='flex flex-direction solid-top'>
                    <View style={{flex:1,paddingTop:'5vh'}} className='bg-white '>
                        <View className='padding cu-list menu '>
                            <View className='cu-item arrow'>
                                <View onClick={this.hideModal.bind(this,2)}  className='content'>
                                    <Text className='cuIcon-edit'></Text>
                                    <Text className='text-grey'>上传头像</Text>
                                </View>
                            </View>
                            <View className='cu-item arrow'>
                                <View  onClick={this.hideModal.bind(this,3)}  className='content'>
                                    <Text className='cuIcon-edit'></Text>
                                    <Text className='text-grey'>修改昵称</Text>
                                </View>
                            </View>
                            <View className='cu-item arrow'>
                                <View onClick={this.hideModal.bind(this,1)} className='content'>
                                    <Text className='cuIcon-edit'></Text>
                                    <Text className='text-grey'>设置密码</Text>
                                </View>
                            </View>
                            <View className='cu-item arrow'>
                                <View onClick={this.wxBind} className='content'>
                                    <Text className='cuIcon-edit'></Text>
                                    <Text className='text-grey'>绑定/解绑微信</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                <View className={['cu-modal text-black ',showSetPwd&&'show']} onClick={this.hideModal.bind(this,1)}>
                    <Form className='cu-dialog' onSubmit={this.updatPwd} onClick={this.stopPropagation}>
                        <View className='cu-bar solid-bottom bg-gray'>
                            <View className='action'>设置密码</View>
                            <View className='action' onClick={this.hideModal.bind(this,1)}><Text className='cuIcon-close text-cyan'></Text></View>
                        </View>
                        <View className='padding margin text-left'>
                            <Input password name='OldPwd' className=' margin-top solid-bottom' value={showSetPwd?'':''} placeholder='请输入原密码' />
                            <Input password name='NewPwd' className=' margin-top solid-bottom' value={showSetPwd?'':''} placeholder='请输入新密码' />
                            <Input password name='NewPwd2' className=' margin-top solid-bottom' value={showSetPwd?'':''} placeholder='请再次输入新密码' />
                        </View>
                        <View className='flex cmd-btn'>
                            <Button formType='reset' onClick={this.hideModal.bind(this,1)} className='flex-sub bg-orange'>取消</Button>
                            <Button formType='submit' className='flex-sub bg-cyan'>确定</Button>
                        </View>
                    </Form>
                </View>
                <View className={['cu-modal text-black',showSetAvatar&&'show']}onClick={this.hideModal.bind(this,2)}>
                    <View className='cu-dialog'>
                    {showSetAvatar&&<ImgUpload images={imgs} onChange={this.onUpload} title='请上传头像' />}
                    </View>
                </View>
                <View className={['cu-modal text-black',showSetName&&'show']}onClick={this.hideModal.bind(this,3)}>
                    <View className='cu-dialog'>
                    <Form className='cu-dialog' onSubmit={this.setName} onClick={this.stopPropagation}>
                        <View className='cu-bar solid-bottom bg-gray'>
                            <View className='action'>设置昵称</View>
                            <View className='action' onClick={this.hideModal.bind(this,3)}><Text className='cuIcon-close text-cyan'></Text></View>
                        </View>
                        <View className='padding margin text-left'>
                            <Input  name='OldPwd' className=' margin-top solid-bottom' value={info.Name}  disabled />
                            <Input  name='Name' className=' margin-top solid-bottom' value={showSetName?'':''} placeholder='请输入昵称' />
                        </View>
                        <View className='flex cmd-btn'>
                            <Button formType='reset' onClick={this.hideModal.bind(this,3)} className='flex-sub bg-orange'>取消</Button>
                            <Button formType='submit' className='flex-sub bg-cyan'>确定</Button>
                        </View>
                    </Form>
                    </View>
                </View>
            </View>
        )
    }
}
