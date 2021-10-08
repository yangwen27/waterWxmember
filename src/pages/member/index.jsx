import { dispatchInfo } from '@actions/MemberInfo'
import CustomBar from '@components/CustomBar'
import { Block, Navigator, OpenData, Text, View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Taro, { Component } from '@tarojs/taro'
import { fileUrl } from '@utils/apis'

@connect(state=>state.MemberInfo,{dispatchInfo})
export default class Index extends Component {
    constructor(props){
        super(props)
        this.state={
        }
    }
    componentWillUnmount() { }

    componentDidShow() { 
        this.props.dispatchInfo().then(rsp=>{
            if(rsp.Code==403||rsp.Code==401){
                Taro.showToast({title:'请登录后操作',icon:'none'})
            }
        })
    }
    componentDidHide() { 
    }

    config = {
        navigationBarTitleText: '一键订水'
    }
    render() {
        let {info}=this.props
        return (
            <View style={{height:'100vh'}} className='index bg-cyan'>
                <CustomBar title='我的账户'></CustomBar>
                <View style={{height:'100%',position:'relative'}} className='flex flex-direction solid-top'>
                    <View style={{height:'25vh'}} className=' padding'>
                    <View className='flex align-center'>
                            {info?
                            <Block>
                            <View style={{width:'128rpx',height:'128rpx',backgroundImage:'url('+(fileUrl+info.PhotoId)+')'}}  className='cu-avatar lg round bg-blue'></View>
                            <View style={{flex:1}} className='padding-left flex flex-direction'>
                                <View className=''>{info.Name}</View>
                                <View >{info.CellPhone}</View>
                            </View>
                            <Navigator hoverClass='none' url='/pages/member/setting'><Text className='cuIcon-settings'></Text>设置</Navigator>
                            </Block>
                            :<Block>
                                <View  style={{width:'128rpx',height:'128rpx',}}  className='cu-avatar lg round bg-blue'>
                                <OpenData  className='wx-userAvatar'  type='userAvatarUrl'></OpenData>
                                </View>
                                <Navigator url='/pages/login' style={{flex:1}} className='padding-left flex flex-direction'>
                                    <View className=''><OpenData type='userNickName'></OpenData></View>
                                    <View >点击登录</View>
                                </Navigator>
                            </Block>
                            }
                            
                        </View>
                    </View>
                    <View style={{height:'10vh',top:'20vh',left:'20rpx',right:'20rpx',position:'absolute'}} className='bg-white shadow solid round'>
                        <View style={{height:'100%'}} className='flex justify-center align-center text-center'>
                            <Navigator hoverClass='none' url='/pages/deposit/index'  className='flex-sub  text-xl'>
                                <View><Text className='price text-bold'>{info.Deposits}</Text></View>
                                <View><Text className='cuIcon-unlock text-orange'></Text>桶押金</View>
                            </Navigator>
                            <Navigator hoverClass='none' url='/pages/ticket/myticket'  className='flex-sub text-xl'>
                                <View><Text className='text-bold' >{info.TicketCount}</Text></View>
                                <View><Text className='cuIcon-ticket line-cyan'></Text>我的水票</View>
                            </Navigator>
                        </View>
                    </View>
                    <View style={{flex:1,paddingTop:'5vh'}} className='bg-white '>
                        <View className='padding cu-list menu '>
                            <View className='cu-item arrow'>
                                <Navigator  hoverClass='none' url='/pages/address/index' className='content'>
                                    <Text className='cuIcon-addressbook'></Text>
                                    <Text className='text-grey'>我的地址</Text>
                                </Navigator>
                            </View>
                            <View className='cu-item arrow'>
                                <Navigator url='/pages/content/index'  hoverClass='none' className='content'>
                                    <Text className='cuIcon-question'></Text>
                                    <Text className='text-grey'>使用帮助</Text>
                                </Navigator>
                            </View>
                            <View className='cu-item arrow'>
                                <View className='content'>
                                    <Text className='cuIcon-service'></Text>
                                    <Text className='text-grey'>联系客服</Text><Text className='text-grey text-sm'> 0771-7711280</Text>
                                </View>
                            </View>
                            <View className='cu-item arrow'>
                                <View className='content'>
                                    <Text className='cuIcon-global'></Text>
                                    <Text className='text-grey'>企业订水</Text><Text className='text-grey text-sm'> 0771-7711280</Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                
            </View>
        )
    }
}
