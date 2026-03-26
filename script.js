const PRICE = 150

function openOrder(){
document.getElementById("orderOverlay").style.display="flex"
updateAll()
}

function closeAll(){
document.querySelectorAll(".overlay").forEach(o=>o.style.display="none")
}

/* КОЛИЧЕСТВО */

function changeQty(id,val){

let el=document.getElementById(id)

let n=parseInt(el.value)||0

n+=val

if(n<0)n=0

el.value=n

updateAll()

}

/* ОБНОВЛЕНИЕ ВСЕГО */

function updateAll(){
updatePrice()
updatePreview()
checkOrderReady()
}

/* ЦЕНА */

function updatePrice(){

let h=parseInt(hingalshQty.value)||0
let c=parseInt(chepQty.value)||0

let total=(h+c)*PRICE

let delivery=document.querySelector('input[name="deliveryType"]:checked')

if(delivery && delivery.value==="доставка"){
priceBlock.innerText=`Без учёта доставки: ${total}₽`
}else{
priceBlock.innerText=`Цена: ${total}₽`
}

}

/* ПРОВЕРКА КНОПКИ */

function checkOrderReady(){

let h=parseInt(hingalshQty.value)||0
let c=parseInt(chepQty.value)||0

let pay=document.querySelector('input[name="payMethod"]:checked')
let delivery=document.querySelector('input[name="deliveryType"]:checked')

let ready = (h>0 || c>0) && pay && delivery

orderSubmit.disabled = !ready

}

/* PREVIEW */

function togglePreview(){

let el=previewContent

el.style.display = el.style.display==="none" ? "block" : "none"

}

function updatePreview(){

let h=hingalshQty.value
let c=chepQty.value
let wish=wishInput.value

let text=""

if(h>0) text+=`Хингалш: ${h}\n`
if(c>0) text+=`Ч1епалгш: ${c}\n`

if(wish){
text+=`\nПожелания: ${wish}`
}

previewContent.innerText = text || "Ничего не выбрано"

}

/* ДОСТАВКА */

document.querySelectorAll('input[name="deliveryType"]').forEach(el=>{
el.addEventListener("change",()=>{

if(el.value==="доставка" && el.checked){
addressInput.style.display="block"
setTimeout(()=>addressInput.style.opacity="1",10)
}else if(el.value==="самовывоз" && el.checked){
addressInput.style.opacity="0"
setTimeout(()=>addressInput.style.display="none",200)
}

updateAll()

})
})

/* СОБЫТИЯ */

document.querySelectorAll("input, textarea").forEach(el=>{
el.addEventListener("input",updateAll)
})

/* ЗАКАЗ */

function submitOrder(){

let h=parseInt(hingalshQty.value)||0
let c=parseInt(chepQty.value)||0

let thyme=thymeCheck.checked
let onion=onionCheck.checked

let cut=document.querySelector('input[name="cutOption"]:checked')
let pay=document.querySelector('input[name="payMethod"]:checked')
let delivery=document.querySelector('input[name="deliveryType"]:checked')

let address=addressInput.value
let wish=wishInput.value.trim()

let text="Здравствуйте, хочу заказать "

if(h>0){
text+=`хингалш ${h}`
if(thyme) text+=" с чебрецом"
}

if(c>0){
if(h>0) text+=" и "
text+=`ч1епалгш ${c}`
if(onion) text+=" с луком"
}

text+=`, ${cut.value}`

text+=`\nОплата: ${pay.value}`

if(delivery.value==="доставка"){
text+=`\nДоставка: ${address}`
}else{
text+=`\nСамовывоз`
}

text+= wish ? `\n\nМои пожелания: ${wish}` : `\n\nнету пожеланий`

navigator.clipboard.writeText(text)

window.open(`https://wa.me/79946666629?text=${encodeURIComponent(text)}`)

}