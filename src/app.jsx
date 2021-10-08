import { Provider } from '@tarojs/redux'
import Taro, { Component } from '@tarojs/taro'
import { wxLoginUrl } from '@utils/apis'
import { refreshToken, request } from '@utils/request'
import './app.scss'
import configStore from './store'

const store = configStore()
// 如果需要在 h5 环境中开启 React Devtools
// 取消以下注释：
// if (process.env.NODE_ENV !== 'production' && process.env.TARO_ENV === 'h5')  {
//   require('nerv-devtools')
// }

class App extends Component {

  componentDidMount () {
    Taro.login({
        success: function (res) {
          if (res.code) {
            //发起网络请求
            request(wxLoginUrl+res.code,{},'GET').then(rsp=>{
                if(rsp.Code!=0){
                    refreshToken()
                }
            })
          } else {
            console.log('登录失败！' + res.errMsg)
            refreshToken()
          }
        }
      })
  }

  componentDidShow () {}

  componentDidHide () {}

  componentDidCatchError () {}

  config = {
    pages: [
      'pages/index/index',
      'pages/order/index',
      'pages/order/info',
      'pages/ticket/index',
      'pages/ticket/myticket',
      'pages/ticket/waterorder',
      'pages/address/index',
      'pages/address/add',
      'pages/member/index',
      'pages/member/setting',
      'pages/product/index',
      'pages/login',
      'pages/content/index',
      'pages/content/info',
      'pages/deposit/pay',
      'pages/deposit/index',
      'pages/deposit/refundlog',


    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#fff',
      navigationBarTitleText: 'WeChat',
      navigationBarTextStyle: 'black',
      navigationStyle:'custom',
      enablePullDownRefresh: true,
      },
      tabBar:{
        color:'#a9b7b7',
        selectedColor:'#11cd6e',
        borderStyle:'black',
        list:[{
            selectedIconPath:'./images/gongzuotai.png',
            iconPath:'./images/gongzuotai_1.png',
            pagePath:'pages/index/index',
            text:'一键订水'
        },
        {
          selectedIconPath:'./images/youhui_1.png',
          iconPath:'./images/youhui.png',
          pagePath:'pages/ticket/index',
          text:'水票'
      },
      {
        selectedIconPath:'./images/order.png',
        iconPath:'./images/order_1.png',
        pagePath:'pages/order/index',
        text:'订单'
    },
    {
      selectedIconPath:'./images/wode.png',
      iconPath:'./images/wode_1.png',
      pagePath:'pages/member/index',
      text:'我的'
  }]
    },
    permission:{
        "scope.userLocation":{
                desc:'使用您的位置信息'
        }
    }
  }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render () {
    return (
        <Provider store={store}>
        {this.props.children}
      </Provider>
      
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
