import Taro, { Component } from '@tarojs/taro'
import { View, Text,Image } from '@tarojs/components'
import {imgUrl} from '@utils/apis'
import {upload} from '@utils/request'


export default class ImgUpload extends Component{
    static defaultProps={
        count:1,
        title:'请上传图片',
        images:[],
        onChange:null/**回调 */
    }
    constructor(props){
        super(props)
        let count = 1
        if (props.count) {
            if (props.count > 9)
                count = 9
            if (props.count < 1)
                count = 1
        }
        this.state = {
            maxCount: count,
            imgs:[],
            del:[],
        }
    }
    
    componentDidMount(){
        console.log('this.props componentDidShowcomponentDidShow:>> ', this.props);
        this.setState({maxCount:this.props.count,imgs:this.props.images})
    }
    static options={
        addGlobalClass:true
    }
    notifyChange(){
        let {imgs,del}=this.state
        if(this.props.onChange){
            console.log('发送通知 :>> ',imgs);
            
            this.props.onChange(imgs,del)
        }
    }
    afterUpload=()=>{
        let{willUploadCount,uploadCount,imgs,isNotify}=this.state
        if(willUploadCount+uploadCount==imgs.length){
            console.log('全部上传完毕 :>> ',imgs.length);
            //由于setstate是异步的，所以仍然有可能发送多次通知
            if(!isNotify){
                this.setState({isNotify:true})
               this.notifyChange()
            }
        }else{
            console.log('还有'+(willUploadCount+uploadCount-imgs.length)+'未上传 :>> ');
        }
    }
    doUpload=(tempFilePaths)=>{
        let {title}=this.props
        this.setState({willUploadCount:tempFilePaths.length,uploadCount:this.state.imgs.length,isNotify:false})
        tempFilePaths.map(v=>{
            upload(v,(title||'文件')+'.jpg').then(rsp=>{
                console.log('rsp :>> ', rsp.Code);
                if(rsp.Code===0){
                    this.setState(prevState=>{
                        let imgs=prevState.imgs
                        imgs.push(rsp.Msg)
                        return {
                            ...prevState,
                            imgs:imgs,
                        }
                    },this.afterUpload)
                }else{
                    Taro.showToast({title:rsp.Msg||'网络异常',icon:'none'})
                }
                
            })
        })
    }
    viewImage=e=>{
        e.stopPropagation()
        let index=e.currentTarget.dataset.index||0
        let images=this.state.imgs.map(img=>imgUrl+img)
        Taro.previewImage({
            current:images[index],
            urls:images
        })

    }
    delImg=e=>{
        e.stopPropagation()
        console.log(' delImg e :>> ', e);
        let id=e.currentTarget.dataset.id
        let{del,imgs}=this.state
        let image=imgs.filter(x=>x!=id)
        del.push(id)
        this.setState({del:del,imgs:image},this.notifyChange)
    }
    chooseImg=e=>{
        e.stopPropagation()
        let {imgs,maxCount}=this.state
        Taro.chooseImage({
            count:maxCount-imgs.length, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有，在H5浏览器端支持使用 `user` 和 `environment`分别指定为前后摄像头
            success:  (res)=> {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                //this.setState({tempFilePaths:res.tempFilePaths},this.doUpload)
                this.doUpload(res.tempFilePaths)
            }   
        })
    }
    render()
    {
        let{maxCount,imgs}=this.state
        let{title,subtitle,isRequired}=this.props
        return (
            <View style={{width:'100vw'}} className='cu-form-group flex flex-direction justify-between align-stretch align-start'>
                <View className='title'>
                    {isRequired&&<Text className='text-red'>*</Text>}
                    {title||'请上传图片'}({imgs.length}/{maxCount})
                </View>
                <View className='text-gray text-sm'>{subtitle}</View>
                <View className='cu-list grid col-4 grid-square flex-sub'>
                    {imgs.map((img,index)=><View className='bg-img' data-index={index}  onClick={this.viewImage} key={img}>
                        <Image style={{left:0,top:0}} src={imgUrl+img} mode='aspectFill'></Image>
                        <View className='cu-tag bg-red' data-id={img} onClick={this.delImg}>
                            <Text className='cuIcon-close'></Text>
                        </View>
                    </View>)}
                    {
                       ( imgs.length<maxCount)&&<View className='solids' onClick={this.chooseImg}>
                       <Text className='cuIcon-cameraadd'></Text>
                   </View>
                    }
                </View>
            </View>
        )
    }
}