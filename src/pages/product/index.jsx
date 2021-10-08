import CustomBar from '@components/CustomBar'
import Empty from '@components/Empty'
import GoTop from '@components/GoTop'
import Loading from '@components/Loading'
import BottomCart from '@components/water/bottomcart'
import Taro, { Component } from '@tarojs/taro'
import { View,ScrollView,Text } from '@tarojs/components'
import Product from '@components/water/product'
import{request} from '@utils/request'
import{productList,productCatsUrl,productbrandUrl} from '@utils/apis'
import { connect } from '@tarojs/redux'

@connect(state=>state.ProductOrder)
export default class Index extends Component {
    constructor(props){
        super(props)
        this.state={
            Page: 0,
            Limit: 10,
            PageCount: 1,
            isLoading: false,
            show2Top: false,
            Count: 0,
            list: [],
            BrandId:null,
            brands:[],
            CatId:null,
            cats:[],
            showSelects:0,
            capsule:{},
            height:20,
        }
    }
    componentDidMount(){
        request(productCatsUrl,{},'GET').then(rsp=>{
            if(rsp.Code==0){
                this.setState({cats:rsp.Data})
            }
        })
        request(productbrandUrl,{},'GET').then(rsp=>{
            if(rsp.Code==0){
                this.setState({brands:rsp.Data})
            }
        })
        const info = Taro.getSystemInfoSync()
        const capsule=Taro.getMenuButtonBoundingClientRect()
        this.setState({ height: info.statusBarHeight ,capsule})
    }
    componentDidShow(){
        this.loadData()
    }
    loadData(){
        if (this.state.Page >= this.state.PageCount) {
            return
        }
        let addrId=null;
        if(this.props.curAddr){
            if(this.props.curAddr.ID){
                addrId=this.props.curAddr.ID
            }
        }
        let req = {
            Page: this.state.Page + 1,
            Limit: this.state.Limit,
            BrandId:this.state.BrandId,
            CatId:this.state.CatId,
            AddressBookId:addrId
        }
        this.setState({ isLoading: true })
        request(productList, req).then(rsp => {
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
            BrandId:null,
            CatId:null,
            list: [],
            PageCount: 1,
        }, this.loadData)
    }
    onReachBottom() {
        this.loadData()
    }
    onPageScroll(res) {
        this.setState({ show2Top: res.scrollTop > 50 })
    }
    setShowSelect=(val,e)=>{
        e.stopPropagation()
        this.setState({showSelects:val})
    }
    setBrand=(val,e)=>{
        e.stopPropagation()
        this.setState({BrandId:val,Page: 0,
            Limit: 10,
            Count: 0,
            list: [],
            showSelects:false,
            PageCount: 1,},this.loadData)
    }
    setCat=(val,e)=>{
        e.stopPropagation()
        this.setState({CatId:val,Page: 0,
            Limit: 10,
            Count: 0,
            list: [],
            showSelects:false,
            PageCount: 1,},this.loadData)
    }
    goBack=e=>{
        e.stopPropagation()
       Taro.navigateBack({
           delta:1,
           fail:err=>{
               console.log('err :>> ', err);
            Taro.switchTab({url:'/pages/index/index'})
           }
       })
    }
    render(){
        let { show2Top, isLoading, list,height,capsule, Count,brands,cats,showSelects,BrandId,CatId, } = this.state
        return <View style={{height:'100vh'}}>
                <CustomBar title={`选购商品(${Count}件)`} isBack showHome></CustomBar>
                <View style={{flex:1}}   className='flex flex-direction' >
                    <View style={{position:'fixed',zIndex:9991,left:0,right:0,top:(capsule.bottom + capsule.top - height)+'px'}} className='flex bg-white text-center padding'>
                        <View onClick={this.setShowSelect.bind(this,0)} className='text-orange' style={{flex:1}}>推荐</View>
                        <View onClick={this.setShowSelect.bind(this,1)} style={{flex:1}}>分类</View>
                        <View onClick={this.setShowSelect.bind(this,2)} style={{flex:1}}>品牌</View>
                        
                    </View>
                    <View style={{position:'fixed',zIndex:9991,left:0,right:0,top:((capsule.bottom + capsule.top - height)*2- height)+'px'}}>
                    {
                           ( showSelects==2)&&<View className='padding bg-white solid-bottom solid-top' >
                               <View className={['cu-tag radius  margin-sm',BrandId==null?'bg-orange':'']} onClick={this.setBrand.bind(this,null)}>全部</View>
                                {brands.map(v=><View className={['cu-tag margin-sm radius',BrandId==v.ID?'bg-orange':'']} key={v.ID} onClick={this.setBrand.bind(this,v.ID)}>{v.Name}</View>)}
                            </View>
                        }
                        {
                           ( showSelects==1)&&<View className='padding bg-white solid-bottom' >
                               <View className={['cu-tag radius',CatId==null?'bg-orange':'']} onClick={this.setCat.bind(this,null)}>全部</View>
                                {cats.map(v=><View className={['cu-tag radius',CatId==v.ID?'bg-orange':'']} key={v.ID} onClick={this.setCat.bind(this,v.ID)}>{v.Name}</View>)}
                            </View>
                        }
                    </View>
                    <ScrollView scrollY style={{flex:1,paddingBottom:(capsule.bottom + capsule.top - height)+'px',paddingTop:(capsule.bottom + capsule.top - height)+'px'}} >
                    {isLoading && <Loading isModal={false} title='正在加载...' />}
                    {list.length==0?<Empty title='所选的配送地址暂无商品可配送' />
                    :list.map(v=><Product item={v} key={v.ID} />)}
                    </ScrollView>
                    <View className='cu-bar  bg-black foot'>
                        <BottomCart  />
                        <View  onClick={this.goBack} className='cu-bar padding-lr-xl bg-red submit'><Text className='padding-lr-xl'>确定</Text></View>
                    </View>
                </View>
               
                
                {show2Top && <GoTop />}
        </View>
    }
}