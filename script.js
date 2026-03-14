const ADMIN_LOGIN="Ненан Хингалш";
const ADMIN_PASS="admin22546khingalsh&";

let users=JSON.parse(localStorage.getItem("users"))||[
{login:ADMIN_LOGIN,pass:ADMIN_PASS,role:"admin"}
];

localStorage.setItem("users",JSON.stringify(users));

let adminMode=false;
let currentEdit=null;

/* modals */
function openLogin(){document.getElementById("loginOverlay").style.display="flex";}
function openRegister(){document.getElementById("registerOverlay").style.display="flex";}
function openOrder(){document.getElementById("orderOverlay").style.display="flex";}
function closeOrder(){document.getElementById("orderOverlay").style.display="none";}
function closeModal(){document.querySelectorAll(".overlay").forEach(o=>o.style.display="none");}

/* register */
function register(){
const name=document.getElementById("regName");
const pass=document.getElementById("regPass");
if(users.find(u=>u.login===name.value)){
name.classList.add("error");
document.getElementById("regError").innerText="логин занят";
setTimeout(()=>{name.classList.remove("error");document.getElementById("regError").innerText="";},3000);
return;
}
users.push({login:name.value,pass:pass.value,role:"user"});
localStorage.setItem("users",JSON.stringify(users));
alert("Аккаунт создан");
closeModal();
}

/* login */
function login(){
const name=document.getElementById("loginName").value;
const pass=document.getElementById("loginPass").value;
const user=users.find(u=>u.login===name && u.pass===pass);
if(!user){alert("Неверные данные"); return;}
localStorage.setItem("currentUser",JSON.stringify(user));
location.reload();
}

function logout(){
localStorage.removeItem("currentUser");
location.reload();
}

/* admin mode */
function toggleAdmin(){
adminMode=!adminMode;
if(adminMode){
document.querySelectorAll(".editable").forEach(el=>{
const btn=document.createElement("button");
btn.innerText="изменить";
btn.className="editBtn";
btn.onclick=()=>{currentEdit=el; document.getElementById("editOverlay").style.display="flex"; document.getElementById("editInput").value=el.innerText;};
el.after(btn);
});
}
}
function saveEdit(){currentEdit.innerText=document.getElementById("editInput").value; closeModal();}

/* quantity */
function changeQty(id,amount){
let input=document.getElementById(id);
let value=parseInt(input.value)||0;
value+=amount;
if(value<0)value=0;
input.value=value;
updateOptions();
}

// блокировка галочек и кнопки заказать
function updateOptions(){
let hQty=parseInt(document.getElementById("hingalshQty").value)||0;
let cQty=parseInt(document.getElementById("chepQty").value)||0;
document.getElementById("thymeCheck").disabled = hQty < 1;
document.getElementById("onionCheck").disabled = cQty < 1;
document.querySelector(".submitOrder").disabled = (hQty < 1 && cQty < 1);
}

/* submit order */
function submitOrder(){
let hQty=parseInt(document.getElementById("hingalshQty").value)||0;
let cQty=parseInt(document.getElementById("chepQty").value)||0;
if(hQty<1 && cQty<1){alert("Выберите хотя бы один товар"); return;}
let thyme=document.getElementById("thymeCheck").checked;
let onion=document.getElementById("onionCheck").checked;
let cut=document.getElementById("cutCheck").checked;
let wish=document.getElementById("wishInput").value.trim();
let text="Здравствуйте, хочу заказать ";
if(hQty>=1){text+=`хингалш ${hQty}`; if(thyme) text+=", с чебрецом"; text+=" ";}
if(cQty>=1){if(hQty>=1) text+="и "; text+=`чlепалгш ${cQty}`; if(onion) text+=", с луком"; text+=" ";}
text+= cut ? ", резать" : ", не резать";
text+= wish==="" ? "\n\nнету пожеланий" : `\n\nМои пожелания: ${wish}`;
navigator.clipboard.writeText(text);
let url=`https://wa.me/79946666629?text=${encodeURIComponent(text)}`;
window.open(url,"_blank");
}

/* init */
window.onload=()=>{
const user=JSON.parse(localStorage.getItem("currentUser"));
if(user){
document.getElementById("authButtons").style.display="none";
document.getElementById("userPanel").style.display="block";
document.getElementById("username").innerText=user.login;
if(user.role!=="admin") document.getElementById("adminToggle").style.display="none";
}
updateOptions();
};