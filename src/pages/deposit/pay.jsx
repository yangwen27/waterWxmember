import CustomBar from '@components/CustomBar'
import Loading from '@components/Loading'
import { Button, Form, Input, Text, View } from '@tarojs/components'
import Taro, { Component } from '@tarojs/taro'
import { depositAmountUrl, depositCreateUrl, depositPayUrl, depositStationUrl } from '@utils/apis'
import { request } from '@utils/request'
import { getQueryString } from '@utils/util'



export default class Pay extends Component {
    constructor(props){
        super(props)
        this.state={
            amount:0,
            count:0,
            station:{ID:null}
        }
    }
    componentDidMount(){
        request(depositAmountUrl,{},'GET').then(rsp=>{
            if(rsp.Code==0){
                this.setState({amount:rsp.Data})
            }else if(rsp.Code==403||rsp.Code==401){
                Taro.showModal({
                    title:rsp.Msg||'无权进行该操作',
                    content:'该操作需要授权方可使用\n 点击确定去登录',
                    success:(r)=>{
                        if (r.confirm) {
                            Taro.navigateTo({url:'/pages/login'})
                          } else {
                            Taro.navigateBack({
                                delta:1,
                                fail:()=>{
                                    Taro.navigateTo({url:'/pages/index/index',fail:()=>{Taro.switchTab({url:'/pages/index/index'})}})
                                }
                            })
                          }
                    }
                })
            }else{
                Taro.showToast({title:rsp.Msg||'网络异常',icon:'none'})
            }
        })
    }
    componentDidShow(){
        //扫码进，支付桶押金
        if( this.$router.params.q){
            let url=decodeURIComponent(this.$router.params.q)
            let stationId=getQueryString(url,'id')
            console.log('stationId :>> ', stationId);
            request(depositStationUrl+stationId,{},'GET').then(rsp=>{
                console.log(rsp)
                if(rsp.Code==0){
                    this.setState({station:rsp.Data})
                }else{
                    this.inValidStation()
                }
            })
        }else{
            this.inValidStation()
        }
        console.log('this.router :>> ', this.$router.params.q);
    }
    inValidStation(){
        Taro.showModal({
            title:'错误',
            content:'无效的二维码',
            success: function (res) {
                console.log('res :>> ', res);
                Taro.navigateBack({
                    delta:1,
                    fail:()=>{
                        Taro.navigateTo({url:'/pages/index/index',fail:()=>{Taro.switchTab({url:'/pages/index/index'})}})
                    }
                })
              }
        })
    }
    handleCountInput=e=>{
        e.stopPropagation()
        console.log('e :>> ', e.detail.value)
        // eslint-disable-next-line no-restricted-globals
        if(isNaN(e.detail.value)){
            console.log('e.detail.value :>> isNaN ',);
        }else{
            console.log('e.detail.value :>> ', e.detail.value);
            let count=parseInt( e.detail.value)
            this.setState({count:count})
        }
    }
    submit=e=>{
        e.stopPropagation()
        console.log('e :>> ', e)
        request(depositCreateUrl,e.detail.value).then(rsp=>{
            if(rsp.Code==0){
                request(depositPayUrl+rsp.Data.ID,{},'GET').then(rsp2=>{
                    this.setState({isLoading: false})
                    if(rsp2.Code==0){
                        let payreq=Object.assign(rsp2.Data,{
                            success: res=>{
                                console.log('res :>> ', res)
                                Taro.showToast({title:'支付成功',icon:'none'})
                                setTimeout(() => {
                                    Taro.navigateTo({url:'/pages/deposit/index'})
                                }, 1500);
                            },
                            fail: res=>{
                                console.log('res :>> ', res)
                                Taro.showToast({title:'支付失败',icon:'none'})
                                setTimeout(() => {
                                    Taro.navigateTo({url:'/pages/deposit/index'})
                                }, 1500);
                            }
                        })
                        Taro.requestPayment(payreq)
                    }else{
                        Taro.showToast({title:rsp2.Msg,icon:'none'})
                    }
                })
            }else{
                this.setState({isLoading: false})
                Taro.showToast({title:rsp.Msg,icon:'none'})
            }
        })
    }
    render(){
        let{count,amount,station,isLoading}=this.state
        return (
            <View style={{height:'100vh'}} className='index bg-cyan flex'>
                <CustomBar showHome title='支付押金'></CustomBar>
                <View style={{flex:1}} className='flex justify-center align-center'>
                    <Form onSubmit={this.submit} onReset={()=>{this.setState({count:0})}}  style={{width:'80vw'}}  className='bg-white padding-sm'>
                        <View className='text-center padding '>
                            <View className=' text-xl text-bold'>桶押金缴纳</View>
                            <View className='text-sm'>每个桶需要押金<Text className='price'>{amount }</Text></View>
                        </View>
                        <View className='cu-form-group '>
                            <View className='title'>桶数:</View>
                            <Input maxLength='4' type='number' onInput={this.handleCountInput} placeholder='要押几个桶？' name='Count' />
                        </View>
                        <View className='cu-form-group '>
                           {count>0&& <View className='title'>{count}个桶，要支付押金<Text className='price'>{(count*amount).toFixed(2)}</Text></View>}
                        </View>
                        <View className='flex justify-center '>
                            <Button className='cu-btn bg-orange margin-right' formType='reset'>重置</Button>
                            <Button className='cu-btn bg-cyan margin-left'  formType='submit'>提交</Button>
                        </View>
                        <Input type='number' className='hide' name='StationId' value={station.ID}></Input>

                    </Form>
                </View>
                {isLoading && <Loading isModal title='正在提交...' />}
            </View>
        )
    }
}