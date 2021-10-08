import {SetCurAddr,AddToCart,MinusCart,DelCartItem} from '@constants/ProductOrder.js'

export const setCurAddr=(addr)=>{
    return {
        type:SetCurAddr,
        payload:addr
    }
}
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