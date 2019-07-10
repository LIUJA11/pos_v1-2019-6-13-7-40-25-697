'use strict';

function printReceipt(cartItemIds){
    var statisticItems = statisticalCartItem(cartItemIds);
    var needBuyItems = getCartItemInfo(statisticItems);
    var receipt = getReceipt(needBuyItems);
    console.log(receipt);
   
}

function statisticalCartItem(cartItemIds){
    var map = new Map();
    for(let i = 0; i<cartItemIds.length; i++){
        let item = cartItemIds[i];
        let index = item.indexOf("-");
        if(index===-1){
            map.set(item,map.get(item)?map.get(item)+1:1);
        }else{
            let itemBarCodeInfo = item.split("-");
            let item2 = itemBarCodeInfo[0];
            let count = parseFloat(itemBarCodeInfo[1]);
            map.set(item2,map.get(item2)?map.get(item2)+count:count);
        }
       
    }
    return map;
}

function getCartItemInfo(statisticItems){
    var allItems = loadAllItems();
    var needBuyItems = new Map();
    statisticItems.forEach((count,key) =>{
        for(let i = 0; i<allItems.length; i++){
            if(allItems[i].barcode == key){
                needBuyItems.set(allItems[i],count)
            }
        }
    });
    return needBuyItems;
}

function discount(item,count){
    var promotions = loadPromotions();
    var discountPrice = 0;
    for(let i = 0; i<promotions.length; i++){
        let promotion = promotions[i];
        if(promotion.type === "BUY_TWO_GET_ONE_FREE"){
            let barcodes = promotion.barcodes;
            if(barcodes.includes(item.barcode)){
                discountPrice+=(Math.floor(count/3))*item.price;
            }
        }
    }
    return discountPrice;
}

function getReceipt(needBuyItems){
    var receipt = "***<没钱赚商店>收据***\n";
    var totalPrice = 0;
    var discountPrice = 0;
    needBuyItems.forEach((count,item) => {
        totalPrice += count*item.price;
        let eachDiscountPrice =  discount(item,count);
        discountPrice+= eachDiscountPrice;
        receipt += `名称：${item.name}，数量：${count}${item.unit}，单价：${item.price.toFixed(2)}(元)，小计：${(count*item.price-eachDiscountPrice).toFixed(2)}(元)\n`;
    });
    receipt += "----------------------\n";
    receipt += `总计：${(totalPrice-discountPrice).toFixed(2)}(元)\n`;
    receipt += `节省：${discountPrice.toFixed(2)}(元)\n`;
    receipt+="**********************";
    return receipt;
}
