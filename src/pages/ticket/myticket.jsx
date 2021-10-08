import CustomBar from '@components/CustomBar'
import Empty from '@components/Empty'
import Loading from '@components/Loading'
import OrderItem from '@components/ticket/OrderItem'
import { ScrollView, View } from '@tarojs/components'
import Taro, { Component } from '@tarojs/taro'
import { ticketMyUrl } from '@utils/apis'
import { request } from '@utils/request'



export default class MyTicket extends Component {
    constructor(props){
        super(props)
        this.state={
            curTab:1,
            Page: 0,
            Limit: 10,
            PageCount: 1,
            isLoading: false,
            show2Top: false,
            Count: 0,
            list: [],
        }
    }
    componentDidShow(){
        this.loadData()
    }
    setCurTab=(i,e)=>{
        e.stopPropagation()
        this.setState({curTab:i},this.resetData)
    }
    resetData(){
        this.setState(prevState=>{
            return {
                ...prevState,
                Page: 0,
                Limit: 10,
                PageCount: 1,
                Count: 0,
                list: [],
            }
        },this.loadData)
    }
    loadData(){
        if (this.state.Page >= this.state.PageCount) {
            return
        }
        let req={}
        if(this.state.curTab==1){
            req={State:1,valid:true}
        }else if(this.state.curTab==2){
            req={State:0}
        }else if( this.state.curTab==3){
            req={State:1,Invalid:true}
        }
        this.setState({isLoading:true})
        request(ticketMyUrl,req).then(rsp=>{
            this.setState({ isLoading: false })
            if (rsp.Code == 0) {
                this.setState({ list: this.state.list.concat(rsp.Data), Page: rsp.Page, PageCount: rsp.PageCount, Count: rsp.Count })
            } else {
                Taro.showToast({ title: rsp.Msg || '获取列表失败', icon: 'none' })
            }
        })

    }
    onReachBottom(){
        this.loadData()
    }
    onPullDownRefresh(){
        this.resetData()
    }
    render(){
        let {curTab,isLoading,list}=this.state
        return(
            <View>
                <CustomBar isBack showHome  title='我的水票'></CustomBar>
                <ScrollView scrollX className='nav bg-white solid-bottom'>
                    <View className='flex  text-center'>
                        <View onClick={this.setCurTab.bind(this,1)} className={'cu-item flex-sub ' + (curTab == 1 ? ' text-cyan cur' : '')}>可用水票</View>
                        <View onClick={this.setCurTab.bind(this,2)} className={'cu-item flex-sub ' + (curTab == 2 ? ' text-cyan cur' : '')}>未付款</View>
                        <View onClick={this.setCurTab.bind(this,3)} className={'cu-item flex-sub ' + (curTab == 3 ? ' text-cyan cur' : '')}>已失效</View>
                    </View>
                </ScrollView>
                <View style={{flex:1}}>
                    {isLoading&&<Loading />}
                    {list.length==0&&<Empty />}
                    <View className='cu-list menu-avatar'>
                    {
                        list.map(v=><OrderItem item={v} key={v.ID} />)
                    }
                    </View>
                </View>
            </View>
        )
    }
}