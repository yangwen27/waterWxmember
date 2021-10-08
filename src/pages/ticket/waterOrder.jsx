import CustomBar from '@components/CustomBar'
import Loading from '@components/Loading'
import { Button, Form, Input, Navigator, Picker, ScrollView, Text, View } from '@tarojs/components'
import { connect } from '@tarojs/redux'
import Taro, { Component } from '@tarojs/taro'
import { createWaterOrderUrl, fileUrl, ticketOrderInfoUrl } from '@utils/apis'
import { request } from '@utils/request'
import { formatDate } from '@utils/util'
import './ticket.scss'

@connect(state=>state.ProductOrder)
class WaterOrder extends Component {
    constructor(props){
        super(props)
        this.state={
            dates:[],
            isLoading: false,
            deliverDate:'请选择配送时间'
        }
    }
    componentDidMount(){
        this.getOrderInfo()
    }
    componentDidShow() {
        let now=new Date()
        let dates=[
           {text: formatDate(now,'MM月dd日今天'),value: formatDate(now,'yyyy-MM-dd')},
           {text: formatDate(new Date(now.getTime()+24*60*60*1000),'MM月dd日明天'),value: formatDate(new Date(now.getTime()+24*60*60*1000),'yyyy-MM-dd')},
           {text: formatDate(new Date(now.getTime()+24*60*60*1000*2),'MM月dd日后天'),value: formatDate(new Date(now.getTime()+24*60*60*1000*2),'yyyy-MM-dd')},
           {text: formatDate(new Date(now.getTime()+24*60*60*1000*3),'MM月dd日'),value: formatDate(new Date(now.getTime()+24*60*60*1000*3),'yyyy-MM-dd')},
           {text: formatDate(new Date(now.getTime()+24*60*60*1000*4),'MM月dd日'),value: formatDate(new Date(now.getTime()+24*60*60*1000*4),'yyyy-MM-dd')},
        ]
        let times=[
           {text: '尽快送达',value:formatDate(now,'HH:mm:ss')}
        ]
        let hours=now.getHours()+1
        for(let i=hours;i<20;i++){
            times.push({text:`${i}:00`,value:`${i}:00:00`})
            times.push({text:`${i}:30`,value:`${i}:30:00`})
        }
        this.setState({dates:[dates,times]})
        console.log('times',times);
    }
    onColumnChange=e=>{
     
        let now=new Date()
        let times=[]
        if(e.detail.column==0){
            if(e.detail.value==0){
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
    getOrderInfo(){
        if(this.$router.params.sn){
            request(ticketOrderInfoUrl+this.$router.params.sn,{},'GET').then(rsp=>{
                console.log('rsp :>> ', rsp);
                this.setState({orderInfo:rsp.Data})
                if(rsp.Data.Skus.length==1){
                    this.setState({curSku:rsp.Data.Skus[0]})
                }
            })
        }else{
            Taro.showModal({
                title:'错误',
                content:'无效的水票',
                success: function (res) {
                    if (res.confirm) {
                      Taro.navigateBack({delta:1})
                    } else if (res.cancel) {
                        Taro.navigateBack({delta:1})
                    }
                  }
            })
        }
    }
    selectSku=(v,e)=>{
        e.stopPropagation()
        this.setState({curSku:v})
    }
    onSubmit=e=>{
        e.stopPropagation()
        if(!this.state.deliverDateVal){
            Taro.showToast({title:'请选择配送时间',icon:'none'})
            return
        }
        if(!this.state.curSku){
            Taro.showToast({title:'请选择要购买的商品',icon:'none'})
            return
        }
        let req={
            DeliveryTime:this.state.deliverDateVal,
            Remark:e.detail.value.Remark,
            SkuId:this.state.curSku.ID,
            AddressId:this.props.curAddr.ID,
            Count:e.detail.value.Count,
            TicketOrderId:this.state.orderInfo.ID
        }
        this.setState({isLoading: true})

        request(createWaterOrderUrl,req).then(rsp=>{
            this.setState({isLoading: false})
            if(rsp.Code==0){
                Taro.showToast({title:'订单已提交，我们将按您约定的时间安排配送',icon:'none'})
                setTimeout(() => {
                    Taro.navigateBack({delta:1})
                }, 1500);
            }else{
                this.setState({isLoading: false})
                Taro.showToast({title:rsp.Msg,icon:'none'})
            }
        })
    }
    render(){
        let {curAddr,}=this.props
        let {isLoading,deliverDate,dates,orderInfo,curSku}=this.state
        return <View style={{height:'100vh'}} className='bg-cyan'>
            <CustomBar isBack showHome title='水票订水' />
            <Form onSubmit={this.onSubmit} style={{background:'rgba(0, 0, 0, 0)'}} className='cu-modal show '>
                    <View className=' bg-white cu-dialog  padding text-left '>
                        <View className='text-center padding text-xl text-bold'>
                            <Picker mode='multiSelector' onChange={this.onDateChange} rangeKey='text' range={dates} onColumnChange={this.onColumnChange}>
                                <View className=' text-xl'> <Text className='cuIcon-time  text-cyan'>{deliverDate}</Text></View>
                            </Picker>
                        </View>
                        <View className='cu-form-group'>
                            <Text className='title'>地址</Text>
                            <Navigator hoverClass='none' url='/pages/address/index?from=/pages/index/index' style={{flex:1}} className='cu-list menu text-left'>
                                <View className='cu-item arrow'>
                                    <View className='content text-cut'>{curAddr.MapName||curAddr.Address||'请选择地址'}</View>
                                </View>
                            </Navigator>
                        </View>
                        <View className='cu-form-group' style={{padding:0}}>
                            <Text className='title'>选择商品</Text>
                            <ScrollView scrollY style={{ flex:1,overflowX:'hidden',maxHeight:'40vh', height:(orderInfo?orderInfo.Skus.length*160:160)+'rpx'}} className='flex flex-warp flex-direction'>
                                <View className='cu-list menu-avatar'>
                                {orderInfo&&orderInfo.Skus.map(v=><View onClick={this.selectSku.bind(this,v)} className={['cu-item margin-sm bg-grey text-black',curSku.ID==v.ID?'line-cyan text-bold solid padding-sm':'']} key={v.ID}>
                                <View className='cu-avatar round lg' style={{backgroundImage:'url('+(fileUrl+v.PicId)+')'}}></View>
                                    <View className='content '>
                                        <View className='text-cut'>{v.FullName}</View>
                                        <View className='text-sm'> 起送数量：{v.MinSaleCount}</View>
                                    </View>
                                </View>)}
                                </View>
                            </ScrollView>
                        </View>
                        <View className='cu-form-group'>
                            <Text  className='title'>数量</Text>
                            <Input name='Count' type='number' value='1' placeholder='输入订购数量' />
                        </View>
                        <View className='cu-form-group'>
                            <Text  className='title'>备注</Text>
                            <Input name='Remark'  placeholder='如有特殊需要在此填写' />
                        </View>
                       <View className='cu-form-group'>
                                <Button formType='submit' style={{flex:1}} className='cu-btn round padding bg-cyan'>提交订单</Button>
                            </View>
                    </View>
                </Form>
                {isLoading && <Loading isModal title='正在提交...' />}
        </View>
    }
}
export default WaterOrder