
import Taro  from '@tarojs/taro'

const baseUrl=getBaseUrl()
// const baseUrl='http://192.168.2.101:52836/'
function getBaseUrl(){
    const info=Taro.getAccountInfoSync()
    if(info.miniProgram.envVersion=='develop'){
        return  'http://192.168.2.101:52836/'
    }else if (info.miniProgram.envVersion=='trial'){
        return 'http://192.168.2.101:52836/'
    }else{
        return 'http://192.168.2.101:52836/'
    }
}
export const uploadUrl=baseUrl+'/api/common/Upload'
export const DecryptUrl=baseUrl+'/api/common/DecryptWx'//解密数据
export const wxLoginUrl=baseUrl+'/api/member/WxLogin?id='// 微信授权登录
export const wxRegisterUrl=baseUrl+'/api/member/WxRegister'// 微信授权登录
export const loginUrl=baseUrl+'/api/member/login'// 登录

export const addressListUrl=baseUrl+'/api/member/address/index'//用戶地址

export const addressAddUrl=baseUrl+'/api/member/address/add'//用戶地址
export const addressDelUrl=baseUrl+'/api/member/address/del?id='//用戶地址

export const productList=baseUrl+'/api/member/product/index'//用戶地址来显示商品
export const productCatsUrl=baseUrl+'/api/member/product/category'
export const productbrandUrl=baseUrl+'/api/member/product/brand'

export const OrderCreateUrl=baseUrl+'/api/member/order/create'
export const OrderPayUrl=baseUrl+'/api/wxpay/OrderPay?id='
export const orderCancelUrl=baseUrl+'/api/member/order/Cancel?sn='//订单取消
export const ticketListUrl=baseUrl+'/api/member/ticket/index'//水票列表
export const ticketSaleCityUrl=baseUrl+'/api/member/ticket/GetCities'//获取有水票的城市
export const ticketCatUrl=baseUrl+'/api/member/ticket/Cats'//水票分类
export const ticketOrderUrl=baseUrl+'/api/member/ticket/Order'//水票dingda
export const ticketOrderPayUrl=baseUrl+'/api/wxpay/ticketPay?id='//水票订单支付
export const ticketMyUrl=baseUrl+'/api/member/ticket/MyTickets'//我的水票
export const ticketCancelOrderUrl=baseUrl+'/api/member/ticket/Cancel?sn='//我的水票
export const ticketOrderInfoUrl=baseUrl+'/api/member/ticket/GetOrderInfo?sn='//水票的详细信息
export const createWaterOrderUrl=baseUrl+'/api/member/ticket/CreateWaterOrder'//水票订水

export const orderStatesUrl=baseUrl+'/api/member/order/GetOrderStates'//订单的全部状态
export const orderListUrl=baseUrl+'/api/member/order/List'//订单列表
export const orderInfoUrl=baseUrl+'/api/member/order/Info?id='//订单列表

export const wxUnbindUrl=baseUrl+'/api/member/login/WxUnbind'//微信登录，获取微信token
export const MapCDN_PATH='https://3gimg.qq.com/lightmap/xcx/demoCenter/images'

export const fileUrl=baseUrl+'/api/common/getfile/'
export const imgUrl=baseUrl+'/api/common/getfile/'
export const userInfoUrl=baseUrl+'/api/member/userinfo'//用戶信息和地址
export const userBaseUrl=baseUrl+'/api/member/BaseInfo'//用戶信息
export const updatePwdUrl=baseUrl+'/api/member/SetPwd'//设置密码
export const updateAvatarUrl=baseUrl+'/api/member/UpdateAvatar?photo='//修改头像
export const updateOauthBindUrl=baseUrl+'/api/member/OauthBind'//微信绑定
export const updateMemberUrl=baseUrl+'/api/member/Update'


export const contentListUrl=baseUrl+'/api/common/Content'
export const contentInfoUrl=baseUrl+'/api/common/ContentInfo?id='

export const depositAmountUrl=baseUrl+'/api/member/deposit/GetDeposit'
export const depositListUrl=baseUrl+'/api/member/deposit/Index'
export const depositRefundtUrl=baseUrl+'/api/member/deposit/Refund?id='
export const depositRefundLogUrl=baseUrl+'/api/member/deposit/RefundLogs'

export const depositCreateUrl=baseUrl+'/api/member/deposit/Pay'
export const depositStationUrl=baseUrl+'/api/member/deposit/GetStation?id='
export const depositPayUrl=baseUrl+'/api/wxpay/DepositPay?id='


