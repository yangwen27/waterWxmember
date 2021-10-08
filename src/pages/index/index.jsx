import { setCurAddr } from '@actions/ProductOrder'
import CustomBar from '@components/CustomBar'
import Loading from '@components/Loading'
import { Button, Form, Input, Navigator, Picker, ScrollView, Text, View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Taro, { Component } from '@tarojs/taro'
import { OrderCreateUrl, OrderPayUrl } from '@utils/apis'
import { request } from '@utils/request'
import { formatDate } from '@utils/util'
import './index.scss'

@connect(state=>state.ProductOrder,{setCurAddr})
export default class Index extends Component {
    constructor(props){
        super(props)
        this.state={
            dates:[],
            isLoading: false,
            deliverDate:'请选择配送时间'
        }
    }
    componentWillMount() {

     }

    componentDidMount() { }

    componentWillUnmount() { }

    componentDidShow() {
        let now=new Date()
        let dates=[]
        console.log('now.getHours() :>> ', now.getHours());
        if(now.getHours()<20)
            dates.push( {text: formatDate(now,'MM月dd日今天'),value: formatDate(now,'yyyy-MM-dd')})
        let dates2=[
           {text: formatDate(new Date(now.getTime()+24*60*60*1000),'MM月dd日明天'),value: formatDate(new Date(now.getTime()+24*60*60*1000),'yyyy-MM-dd')},
           {text: formatDate(new Date(now.getTime()+24*60*60*1000*2),'MM月dd日后天'),value: formatDate(new Date(now.getTime()+24*60*60*1000*2),'yyyy-MM-dd')},
           {text: formatDate(new Date(now.getTime()+24*60*60*1000*3),'MM月dd日'),value: formatDate(new Date(now.getTime()+24*60*60*1000*3),'yyyy-MM-dd')},
           {text: formatDate(new Date(now.getTime()+24*60*60*1000*4),'MM月dd日'),value: formatDate(new Date(now.getTime()+24*60*60*1000*4),'yyyy-MM-dd')},
        ]
        dates=dates.concat(dates2)
        let times=[]
        if(now.getHours()<20){
             times=[
                {text: '尽快送达',value:formatDate(now,'HH:mm:ss')}
             ]
             let hours=now.getHours()+1
             for(let i=hours;i<20;i++){
                 times.push({text:`${i}:00`,value:`${i}:00:00`})
                 times.push({text:`${i}:30`,value:`${i}:30:00`})
             }
        }else{
            for(let i=9;i<20;i++){
                times.push({text:`${i}:00`,value:`${i}:00:00`})
                times.push({text:`${i}:30`,value:`${i}:30:00`})
            }
        }
        
        this.setState({dates:[dates,times]})
        console.log('times',times);
    }

    componentDidHide() { 
    }

    config = {
        navigationBarTitleText: '一键订水'
    }
    onColumnChange=e=>{
        let now=new Date()
        let times=[]
        if(e.detail.column==0){
            if(e.detail.value==0){
                if( this.state.dates[0][0].text.indexOf('今天')>0)
                {
                    console.log('e.detail :>> ', this.state.dates[0][0]);
                    times.push({text: '尽快送达',value:formatDate(now,'HH:mm:ss')})
                    let hours=now.getHours()+1
                    for(let i=hours;i<20;i++){
                        times.push({text:`${i}:00`,value:`${i}:00:00`})
                        times.push({text:`${i}:30`,value:`${i}:30:00`})
                    }
                }else{
                    for(let i=9;i<20;i++){
                        times.push({text:`${i}:00`,value:`${i}:00:00`})
                        times.push({text:`${i}:30`,value:`${i}:30:00`})
                    }
                }
            }else{
                for(let i=9;i<20;i++){
                    times.push({text:`${i}:00`,value:`${i}:00:00`})
                    times.push({text:`${i}:30`,value:`${i}:30:00`})
                }
            }
            let dates=this.state.dates
            dates[1]=times
            this.setState({dates})
        }
        
    }
    onDateChange=e=>{
        let dates=this.state.dates
        let deliverDate=dates[0][e.detail.value[0]].text+dates[1][e.detail.value[1]].text
        let deliverDateVal=dates[0][e.detail.value[0]].value+' '+dates[1][e.detail.value[1]].value
        this.setState({deliverDate,deliverDateVal})
    }
    onSubmit=e=>{
        Taro.setStorageSync('cartItems',this.props.cartItems)
        if(!this.state.deliverDateVal){
            Taro.showToast({title:'请选择配送时间',icon:'none'})
            return
        }
        let req={
            DeliveryTime:this.state.deliverDateVal,
            Remark:e.detail.value.Remark,
            Items:this.props.cartItems.map(x=>{return {SkuId:x.ID,Count:x.Count}}),
            AddressId:this.props.curAddr.ID
        }
        
        this.setState({isLoading: true})
        request(OrderCreateUrl,req).then(rsp=>{
            if(rsp.Code==0){
                request(OrderPayUrl+rsp.Data.SerialNo,{},'GET').then(rsp2=>{
                    this.setState({isLoading: false})
                    if(rsp2.Code==0){
                        let payreq=Object.assign(rsp2.Data,{
                            success: res=>{
                                console.log('res :>> ', res)
                                Taro.showToast({title:'支付成功',icon:'none'})
                                setTimeout(() => {
                                    Taro.switchTab({url:'/pages/order/index'})
                                }, 1500);
                            },
                            fail: res=>{
                                console.log('res :>> ', res)
                                Taro.showToast({title:'支付失败',icon:'none'})
                                setTimeout(() => {
                                    Taro.switchTab({url:'/pages/order/index'})
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
    onShareAppMessage(options){
        console.log('options :>> ', options);
        return {
            title:'一键订水,方便、快捷、品质保证',
            pages:'/pages/index/index'
        }
    }
    onShareTimeline(){
        return {title:'惠民一键订水,方便、快捷、品质保证', pages:'/pages/index/index'}
    }
    render() {
        let {curAddr,cartItems}=this.props
        let {dates,deliverDate,isLoading}=this.state
        let amount=0
        cartItems.forEach(v=>{amount+=v.Price*v.Count})
        amount=amount.toFixed(2)
        return (
            <View style={{height:'100vh'}} className='index bg-cyan'>
                <CustomBar title='一键订水'></CustomBar>
                <Form onSubmit={this.onSubmit} style={{background:'rgba(0, 0, 0, 0)'}} className='cu-modal show '>
                    <View className='cu-dialog'  style={{background:'rgba(0, 0, 0, 0)'}}>
                    <View className=' bg-white cu-dialog  padding text-left '>
                        <View className='text-center padding text-xl text-bold'>
                            <Picker mode='multiSelector' onChange={this.onDateChange} rangeKey='text' range={dates} onColumnChange={this.onColumnChange}>
                                <View className=' text-xl'> <Text className='cuIcon-time  text-cyan'>{deliverDate}</Text></View>
                            </Picker>
                        </View>
                        <View className='cu-form-group'>
                            <Text className='title text-bold'>地址</Text>
                            <Navigator hoverClass='none' url='/pages/address/index?from=/pages/index/index' style={{flex:1}} className='cu-list menu text-left'>
                                <View className='cu-item arrow'>
                                    <View className='content text-cut'>{curAddr.MapName||curAddr.Address||'请选择地址'}</View>
                                </View>
                            </Navigator>
                        </View>
                        <View className='cu-form-group'>
                            <Text className='title text-bold'>商品</Text>
                            <Navigator  hoverClass='none' url='/pages/product/index?from=/pages/index/index' style={{flex:1,overflowX:'hidden'}}>
                                    {cartItems.length==0
                                    ? <View  className='cu-list menu text-left '> <View className='cu-item arrow'> <View className='content text-cut text-gray'>请选择商品</View>  </View></View>
                                    :( <ScrollView scrollY style={{maxHeight:'40vh',flex:1}}  >
                                        <View className='cu-list menu text-left '>
                                            {  cartItems.map(x=><View className='cu-item flex text-black text-cut' key={x.ID}>
                                            <View style={{flex:3}} className='text-cut'>{x.FullName}</View>
                                            <Text className='padding-lr text-xl'>{x.Count}</Text>
                                            <View style={{flex:1}} className='text-center price'>{(x.Price*x.Count).toFixed(2)}</View>
                                        </View> )
                                        }</View>
                                        </ScrollView>
                                    )
                                    }
                            </Navigator>
                           
                        </View>
                        <View className='cu-form-group'>
                            <Text  className='title text-bold'>备注</Text>
                            <Input name='Remark'  placeholder='如有特殊需要在此填写' />
                        </View>
                        {amount>0&&<View className='cu-form-group'>
                                <Button formType='submit' style={{flex:1}} className='cu-btn round padding bg-cyan text-bold'>立即支付<Text className='price'>{amount}</Text></Button>
                            </View>}
                    </View>
                    <View className='padding'>政企订水：0771-7711280</View>
                    </View>
                </Form>
                {isLoading && <Loading isModal title='正在提交...' />}
            </View>
        )
    }
}
