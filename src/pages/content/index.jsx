import CustomBar from '@components/CustomBar'
import Empty from '@components/Empty'
import GoTop from '@components/GoTop'
import Loading from '@components/Loading'
import { Image, Navigator, View } from '@tarojs/components'
import Taro, { Component } from '@tarojs/taro'
import { contentListUrl, fileUrl } from '@utils/apis'
import { request } from '@utils/request'


export default class Index extends　Component{
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
            // BrandId:null,
            // brands:[],
            // CatId:null,
            // cats:[],
        }
    }
    componentDidShow(){
        this.resetData()
    }
    onPullDownRefresh() {
        this.setState({
            Page: 0,
            Limit: 10,
            Count: 0,
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
    resetData(){
        this.setState({
            Page: 0,
            Limit: 10,
            PageCount: 1,
            Count: 0,
            list: [],
        },this.loadData)
    }
    loadData(){
        if (this.state.Page >= this.state.PageCount) {
            return
        }
        let req = {
            Page: this.state.Page + 1,
            Limit: this.state.Limit,

        }
        this.setState({ isLoading: true })

        request(contentListUrl, req).then(rsp => {
            this.setState({ isLoading: false })
            if (rsp.Code == 0) {
                this.setState({ list: this.state.list.concat(rsp.Data), Page: rsp.Page, PageCount: rsp.PageCount, Count: rsp.Count })
            } else {
                Taro.showToast({ title: rsp.Msg || '获取列表失败', icon: 'none' })
            }
        })
    }
    render(){
        let{ list,isLoading,Count,show2Top}=this.state
        return(
            <View style={{height:'100vh'}}>
            <CustomBar showHome isBack title={`帮助中心(${Count})`}></CustomBar>
            {isLoading&&<Loading />}
            {list.length==0
            ?<Empty />
            :<View className='cu-card article '>
                {
                    list.map(v=><Navigator url={`/pages/content/info?id=${v.ID}`} hoverClass='none' className='cu-item shadow' key={v.ID}>
                        <View className='title'><View className='text-cut'>{v.Title}</View></View>
                        <View className='content'>
                            <Image src={fileUrl+v.PictureId} mode='aspectFill'></Image>
                            <View className='desc'>
                                <View className='text-content'>{v.Intro}</View>
                                <View className='text-grey sm'>{v.CreateTime}</View>
                            </View>
                        </View>
                    </Navigator>)
                }</View>}
                    {show2Top && <GoTop />}
            </View>
        )
    }
}