import CustomBar from '@components/CustomBar'
import Empty from '@components/Empty'
import GoTop from '@components/GoTop'
import Loading from '@components/Loading'
import  Product from '@components/ticket/Ticket'
import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView, Navigator, Image, Block } from '@tarojs/components'
import{request} from '@utils/request'
import{ticketListUrl,ticketSaleCityUrl,ticketCatUrl,ticketOrderUrl,ticketOrderPayUrl,fileUrl} from '@utils/apis'
// eslint-disable-next-line import/no-commonjs
let QQMapWX = require('@utils/qqmap-wx-jssdk.js')

let qqmap

export default class Index extends Component {
    constructor(props){
        super(props)
        this.state={
            Page: 0,
            Limit: 10,
            PageCount: 1,
            isLoading: false,
            list: [],
            show2Top:false,
            cats:[],
            Count: 0,
            contentLoading:true,
            height:20,
            capsule:{},
            isShowCitySelect:false,
            TicketType:null,
            curCity:{},
            CatId:null,
            showProduct:false
        }
    }
    componentDidMount() { 
        qqmap = new QQMapWX({
            key: 'HKFBZ-6EQKF-KOFJY-NCGTS-4BWVZ-PWFG5'
        });
        const info = Taro.getSystemInfoSync()
        const capsule=Taro.getMenuButtonBoundingClientRect()
        this.setState({ height: info.statusBarHeight ,capsule})
        request(ticketSaleCityUrl,{},'GET').then(rsp=>{
            if(rsp.Code==0){
                this.setState({cities:rsp.Data},this.getLocation)
            }
        })
        request(ticketCatUrl,{},'GET').then(rsp=>{
            if(rsp.Code==0){
                this.setState({cats:rsp.Data})
            }
        })
    }

    componentWillUnmount() { }

    componentDidShow() {
        
    }
    getLocation(){
        Taro.getLocation({
            type: 'gcj02',
            success: (res)=> {
                console.log('location',res)
                //this.
                qqmap.reverseGeocoder({
                    location:{ latitude:res.latitude, longitude:res.longitude},
                    success:rsp=>{
                        if(rsp.result){
                            let result=rsp.result
                            let cityCode=result.ad_info.city_code.replace(result.ad_info.nation_code,'')
                            this.setState({
                                curCity:{Key:result.ad_info.city,Value:cityCode}
                            },this.loadData)
                            // if(this.state.cities){
                            //     let c=this.state.cities.find(x=>x.Value==cityCode)
                            //     if(c){
                            //         this.setState({
                            //             curCity:c
                            //         },this.loadData)
                            //     }else{
                            //         console.log('当前城市没有 :>> ');
                            //         this.setState({
                            //             curCity:this.state.cities[0]
                            //         },this.loadData)
                            //     }
                            // }
                            
                        }
                    },
                    fail:err=>{
                        console.log('reverseGeocoder err :>> ', err);
                    }
                })
            },
            fail:err=>{
                console.log('err :>> ', err)
                Taro.showModal({
                    title:'提示',
                    content:'请授权使用位置信息',
                    success:res=>{
                        console.log('res :>> ', res);
                        Taro.openSetting({
                            success:()=>{this.getLocation()}
                        })
                    }
                })
            }
        })
    }
    componentDidHide() { 
    }
    loadData(){
        if (this.state.Page >= this.state.PageCount) {
            return
        }
        let req = {
            Page: this.state.Page + 1,
            Limit: this.state.Limit,
            CatId:this.state.CatId,
            CityCode:this.state.curCity.Value,
            // TicketType:this.state.TicketType,
        }
        this.setState({ isLoading: true })
        request(ticketListUrl, req).then(rsp => {
            this.setState({ isLoading: false })
            if (rsp.Code == 0) {
                this.setState({ list: this.state.list.concat(rsp.Data), Page: rsp.Page, PageCount: rsp.PageCount, Count: rsp.Count })
            } else {
                Taro.showToast({ title: rsp.Msg || '获取列表失败', icon: 'none' })
            }
        })
    }
    onPullDownRefresh() {
        this.setState({
            Page: 0,
            Limit: 10,
            Count: 0,
            TicketType:null,
            CatId:null,
            list: [],
            PageCount: 1,
        }, this.loadData)
    }
    onReachBottom() {
        this.loadData()
    }
    config = {
        navigationBarTitleText: '水票'
    }
    onPageScroll(res){
        this.setState({show2Top:res.scrollTop>50})
        console.log('res :>> ', res);
    }
    showCitySelect=e=>{
        e.stopPropagation()
        this.setState({isShowCitySelect:!this.state.isShowCitySelect})
    }
    showTicketIntro=e=>{
        e.stopPropagation()
        this.setState({isShowTicketIntro:!this.state.isShowTicketIntro})
    }
    setCurCity=(city,e)=>{
        e.stopPropagation()
        if(this.state.curCity.Value!=city.Value)
            this.setState({curCity:city,isShowCitySelect:false, Page: 0,
                Limit: 10,
                Count: 0,
                TicketType:null,
                list: [],
                PageCount: 1},this.loadData)
        else{
            this.setState({isShowCitySelect:false})
        }
        
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


    selectSku=(ticket)=>{
        this.setState({showDialog:true,curTicket:ticket,curSku:ticket.Skus[0]})
    }
    setCurSku=(sku,e)=>{
        e.stopPropagation()
        this.setState({curSku:sku})
    }
    hideDialog=e=>{
        e.stopPropagation()
        this.setState({showDialog:false})
    }
    buyTicket=e=>{
        e.stopPropagation()
        this.setState({isLoading: true})
        request(ticketOrderUrl,{SkuId:this.state.curSku.ID}).then(rsp=>{
            if(rsp.Code==0){
                request(ticketOrderPayUrl+rsp.Data.SerialNo,{},'GET').then(rsp2=>{
                    this.setState({isLoading: false})
                    if(rsp2.Code==0){
                        let payreq=Object.assign(rsp2.Data,{
                            success: res=>{
                                console.log('res :>> ', res)
                                Taro.showToast({title:'支付成功',icon:'none'})
                            },
                            fail: res=>{
                                console.log('res :>> ', res)
                                Taro.showToast({title:'支付失败',icon:'none'})
                            }
                        })
                        Taro.requestPayment(payreq)
                    }else{
                        Taro.showToast({title:rsp2.Msg,icon:'none'})
                    }
                })
            }
            else{
                this.setState({isLoading: false})
                Taro.showToast({title:rsp.Msg,icon:'none'})
            }
        })
        console.log('buyTicket e :>> ', e);
    }
    setShowProduct=e=>{
        e.stopPropagation()
        this.setState({showProduct:!this.state.showProduct})
    }
    render() {
        let {show2Top,height,capsule,curCity,isShowCitySelect,isShowTicketIntro,cities,isLoading,list,showDialog,curSku,showProduct,curTicket}=this.state
        return (
            <Block>
                <CustomBar title='水票列表'></CustomBar>
                <View className='' style={{position:'fixed',zIndex:9991,left:0,right:0,top:(capsule.bottom + capsule.top - height)+'px'}} >
                    <View className='cu-bar bg-white'>
                        <View className='action'>
                            <Text onClick={this.showCitySelect} className='cuIcon-location text-green'>{curCity.Key}</Text>
                        </View>
                        <View className='action'>
                            <Text onClick={this.showTicketIntro} className='cuIcon-question '>水票说明</Text>
                        </View>
                    </View>
                    {isShowCitySelect?<View className='padding bg-white'>
                            {cities.map(v=><View key={v.Value} onClick={this.setCurCity.bind(this,v)} className={['cu-tag text-xl padding-sm round margin-sm',v.Value==curCity.Value?'bg-orange':'']}>{v.Key}</View>)}
                        </View>
                        :<View className='bg-white nav'>
                        <View className='flex text-center'>
                            <View className='cu-item flex-sub text-blue'>购买水票</View>
                            <View className='cu-item flex-sub'>
                                <Navigator hoverClass='none' url='/pages/ticket/myticket'>
                                    我的水票
                                </Navigator>
                            </View>
                        </View>
                    </View>}
                </View>
                <View style={{paddingTop:(capsule.bottom + capsule.top+ height )+'px',paddingBottom:height +'px'}}   className='flex flex-direction'>
                    {isLoading ? <Loading isModal={false} title='正在加载...' />
                    :list.length==0?<Empty title='所选的配送地址暂无商品可配送' />
                    :list.map(v=><Product onSelectSku={this.selectSku} item={v} key={v.ID} />)}
                </View>
                <View className={['cu-modal bottom-modal',isShowTicketIntro&&'show']}>
                    <View className='cu-dialog  text-left'>
                        <View className='cu-bar'>
                            <View className='action'>水票说明</View>
                            <View className='action'>
                                <View onClick={this.showTicketIntro} className='cuIcon-close'></View>
                            </View>
                        </View>
                        <View>
                            <View className='cu-list menu text-left padding-tb'>
                                <View className='cu-item padding-tb flex-direction'>
                                    <View style={{width:'100%'}} className='cuIcon-title text-orange text-bold'>Q:什么是水票？</View>
                                    <View style={{width:'100%'}} className='cuIcon-title text-orange text-xl'>A:</View>
                                    <View style={{width:'100%'}}>1 水票是平台推出的订水劵，可抵扣现金。</View>
                                    <View style={{width:'100%'}}>2 通用水票：指定多款商品可用；专用水票：特定某款商品可用。</View>
                                    <View style={{width:'100%'}}>3 水票有订水起送量限制。</View>
                                </View>
                                <View className='cu-item  flex-direction padding-bottom'>
                                    <View style={{width:'100%'}} className='cuIcon-title text-orange text-bold'>Q:水票优势？</View>
                                    <View style={{width:'100%'}} className='cuIcon-title text-orange text-xl'>A:</View>
                                    <View style={{width:'100%'}}>1 一次购买，可分多次使用。</View>
                                    <View style={{width:'100%'}}>2 水票订水更优惠，且水票订水不受商品价格浮动影响。</View>
                                </View>
                                <View className='cu-item  flex-direction padding-bottom'>
                                    <View style={{width:'100%'}} className='cuIcon-title text-orange text-bold'>Q:如何购买水票？</View>
                                    <View style={{width:'100%'}} className='cuIcon-title text-orange text-xl'>A:</View>
                                    <View style={{width:'100%'}}>首页/水票→点击水票[购买]→选择水票套餐→购买水票→付款</View>
                                </View>
                                <View className='cu-item  flex-direction padding-tb'>
                                    <View style={{width:'100%'}} className='cuIcon-title text-orange text-bold'>Q:如何使用水票？</View>
                                    <View style={{width:'100%'}} className='cuIcon-title text-orange text-xl'>A:</View>
                                    <View style={{width:'100%'}}>我的水票→立即送水→确认订单→配送</View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
                {/* 购买水票 */}
                <View onClick={this.hideDialog} className={['cu-modal bottom-modal',showDialog?'show':'']}>
                    <View onClick={e=>e.stopPropagation()} className='cu-dialog'>
                        <View className='cu-bar bg-white'>
                            <View className='action text-bold'>请选择套餐</View>
                            <View className='action text-blue'> <Text onClick={this.hideDialog} className='cuIcon-close'></Text></View>
                        </View>
                        <View style={{height:'200rpx',position:'relative'}} className='flex bg-white margin-top text-left'>
                            <Image style={{height:'200rpx',width:'200rpx'}}  mode='aspectFill' src={fileUrl+curTicket.PicId} />
                            <View style={{flex:3}} className='padding'>
                                <View  className='text-cut'>{curTicket.Name}</View>
                                <View  className='text-cut'>价格:<Text className='price'>{curSku.Price}</Text></View>
                                <View  className='text-cut'>已选:<Text>{curSku.Name+(curSku.GiftName&&",赠品:"+curSku.GiftName)} </Text></View>
                                {(curSku.MinSaleCount!=null&&curSku.MinSaleCount>1)&&<Text className='text-grey'>{curSku.MinSaleCount}件起送</Text>}
                            </View>
                        </View>
                        <View  className='cu-bar bg-white margin-top'>
                            <View className='action text-bold'>套餐</View>
                            <View onClick={this.setShowProduct} className='action  text-blue'>{curTicket.Products.length}款产品可用<Text className='cuIcon-unfold'></Text></View>
                        </View>
                        {showProduct&&<View  onClick={this.setShowProduct} className={['cu-modal bottom-modal ',showProduct&&'show']}>
                            <View  onClick={e=>e.stopPropagation()} className='text-right cu-dialog  padding-bottom'>
                                <View className='cu-bar  bg-white'>
                                    <View className='action text-bold'>{curTicket.Products.length}款产品可用</View>
                                    <View onClick={this.setShowProduct} className='action text-blue cuIcon-close'></View>
                                </View>
                                {curTicket.Products.map(v=><View className='padding-top-sm padding-right' key={v}>{v}</View>)}
                            </View>
                        </View>}
                       <View className='padding text-left flex-wrap flex'>
                       {
                            curTicket.Skus.map(s=><View onClick={this.setCurSku.bind(this,s)} key={s.ID} className={['cu-btn round margin-lr',curSku.ID==s.ID?'bg-red':' bg-gray']} >
                               <Text >{s.Name}</Text>
                                {s.GiftName&&<Text className={['cu-tag bagde',curSku.ID==s.ID?'bg-red text-yellow':'bg-gray text-orange']}>赠:{s.GiftName}</Text>}
                            </View>)
                        }
                       </View>
                        <View onClick={this.buyTicket} className='bg-orange margin-top text-center padding-sm text-xl'>立刻购买</View>
                    </View>
                </View>
                {isLoading && <Loading isModal title='正在提交...' />}
                {show2Top && <GoTop />}
            </Block>
        )
    }
}
