import { combineReducers } from 'redux'
import ProductOrder from './ProductOrder'
import TicketOrder from './TicketOrder'
import MemberInfo from './MemberInfo'

export default combineReducers({
    ProductOrder,
    TicketOrder,
    MemberInfo
})