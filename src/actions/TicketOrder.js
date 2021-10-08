import {AddToCart,MinusCart,DelCartItem} from '@constants/TicketOrder.js'

export const addToCart=(item)=>{
    return {
        type:AddToCart,
        payload:item
    }
}
export const minusCart=(item)=>{
    return {
        type:MinusCart,
        payload:item
    }
}
export const delCartItem=(item)=>{
    return {
        type:DelCartItem,
        payload:item
    }
}