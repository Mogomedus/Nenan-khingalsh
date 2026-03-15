// стоимость одного товара
const PRICE = 150;

// users
let users = JSON.parse(localStorage.getItem("users")) || [];
localStorage.setItem("users", JSON.stringify(users));

/* открытие окон */
function openLogin() { document.getElementById("loginOverlay").style.display = "flex"; }
function openRegister() { document.getElementById("registerOverlay").style.display = "flex"; }
function openOrder() {
    document.getElementById("orderOverlay").style.display = "flex";
    updatePrice(); // сразу обновляем цену
}
function openTop() {
    document.getElementById("topOverlay").style.display = "flex";
    showTop();
}
function closeAll() { document.querySelectorAll(".overlay").forEach(el => el.style.display = "none"); }

/* регистрация */
function register() {
    let name = document.getElementById("regName").value;
    let pass = document.getElementById("regPass").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find(u => u.login === name)) {
        alert("логин занят");
        return;
    }

    users.push({ login: name, pass: pass, role: "user" });
    localStorage.setItem("users", JSON.stringify(users));
    alert("аккаунт создан");
    closeAll();
}

/* вход */
function login() {
    let name = document.getElementById("loginName").value;
    let pass = document.getElementById("loginPass").value;

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let user = users.find(u => u.login === name && u.pass === pass);

    if (!user) { alert("неверный логин или пароль"); return; }

    localStorage.setItem("currentUser", JSON.stringify(user));
    updateAuth();
    closeAll();
}

/* выход */
function logout() { localStorage.removeItem("currentUser"); updateAuth(); }

/* обновление интерфейса */
function updateAuth() {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    if (user) {
        document.getElementById("authButtons").style.display = "none";
        document.getElementById("userPanel").style.display = "block";
        document.getElementById("userName").innerText = user.login;
    } else {
        document.getElementById("authButtons").style.display = "block";
        document.getElementById("userPanel").style.display = "none";
    }
}
updateAuth();

/* изменение количества товаров */
function changeQty(id, amount) {
    let input = document.getElementById(id);
    let val = parseInt(input.value) || 0;
    val += amount; if (val < 0) val = 0;
    input.value = val;
    updatePrice();
}

/* обновление цены и видимости "важно!" */
function updatePrice() {
    let h = parseInt(document.getElementById("hingalshQty").value) || 0;
    let c = parseInt(document.getElementById("chepQty").value) || 0;
    let total = (h + c) * PRICE;

    let deliveryType = document.querySelector('input[name="deliveryType"]:checked')?.value;

    if (deliveryType === "доставка") {
        document.getElementById("priceBlock").innerText = `Без учёта доставки: ${total}₽`;
        document.getElementById("delivery-warning").style.display = "block";
    } else {
        document.getElementById("priceBlock").innerText = `Цена: ${total}₽`;
        document.getElementById("delivery-warning").style.display = "none";
        document.getElementById("deliveryInfo").style.display = "none";
    }
}

/* показать/скрыть инфо о доставке */
function toggleDeliveryInfo() {
    let info = document.getElementById("deliveryInfo");
    info.style.display = (info.style.display === "none") ? "block" : "none";
}

/* выбор доставки: показываем адрес и важность */
function toggleAddress() {
    let type = document.querySelector('input[name="deliveryType"]:checked')?.value;
    let address = document.getElementById("addressInput");
    address.style.display = (type === "доставка") ? "block" : "none";
    updatePrice();
}

/* заказ */
function submitOrder() {
    let h = parseInt(document.getElementById("hingalshQty").value) || 0;
    let c = parseInt(document.getElementById("chepQty").value) || 0;
    if (h < 1 && c < 1) { alert("выберите товар"); return; }

    let thyme = document.getElementById("thymeCheck").checked;
    let onion = document.getElementById("onionCheck").checked;

    // проверка резать/не резать
    let cutOption = document.querySelector('input[name="cutOption"]:checked');
    if (!cutOption) { alert("выберите резать или не резать"); return; }
    let cut = cutOption.value;

    let pay = document.querySelector('input[name="payMethod"]:checked');
    if (!pay) { alert("выберите оплату"); return; }

    let deliveryType = document.querySelector('input[name="deliveryType"]:checked')?.value;
    let address = document.getElementById("addressInput").value;
    if (deliveryType === "доставка" && address.trim() === "") { alert("введите адрес доставки"); return; }

    let wish = document.getElementById("wishInput").value.trim();

    let text = "Здравствуйте, хочу заказать ";
    if (h > 0) { text += `хингалш ${h}`; if (thyme) text += " с чебрецом"; }
    if (c > 0) { if (h > 0) text += " и "; text += `ч1епалгш ${c}`; if (onion) text += " с луком"; }
    text += `, ${cut}`;
    text += `\nОплата: ${pay.value}`;
    text += (deliveryType === "доставка") ? `\nДоставка: ${address}` : "\nСамовывоз";
    text += (wish === "") ? "\n\nнету пожеланий" : `\n\nМои пожелания: ${wish}`;

    navigator.clipboard.writeText(text);
    let url = `https://wa.me/79946666629?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank");

    updateTop(h + c);
}

/* система топов */
function updateTop(count) {
    let user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) return;

    let top = JSON.parse(localStorage.getItem("topUsers")) || {};
    let now = new Date().toLocaleDateString();

    if (!top[user.login]) { top[user.login] = { count: 0, date: now }; }

    top[user.login].count += count;
    top[user.login].date = now;

    localStorage.setItem("topUsers", JSON.stringify(top));
}

/* показываем топ */
function showTop() {
    weeklyClearTop();

    let user = JSON.parse(localStorage.getItem("currentUser"));
    if (!user) {
        document.getElementById("topList").innerHTML = "вы не зарегистрированы и не можете быть в топах";
        return;
    }

    let top = JSON.parse(localStorage.getItem("topUsers")) || {};
    let arr = Object.entries(top);
    arr.sort((a, b) => b[1].count - a[1].count);

    let html = "<ol>";
    arr.forEach(t => { html += `<li>${t[0]} — ${t[1].count} шт (последний заказ: ${t[1].date})</li>`; });
    html += "</ol>";

    if (user.login === "Мохьмад Эмин") {
        html += `<button onclick="clearTop()" style="margin-top:10px;background:red;color:white;">Очистить топы</button>`;
    }

    document.getElementById("topList").innerHTML = html;
}

/* очистка топов */
function clearTop() {
    if (confirm("Очистить топ покупателей?")) {
        localStorage.removeItem("topUsers");
        localStorage.setItem("lastClearWeek", new Date().getTime());
        showTop();
    }
}

/* еженедельная очистка */
function weeklyClearTop() {
    let last = localStorage.getItem("lastClearWeek");
    let now = Date.now();
    if (!last || now - parseInt(last) > 7 * 24 * 60 * 60 * 1000) {
        localStorage.removeItem("topUsers");
        localStorage.setItem("lastClearWeek", now);
    }
}

// обновление цены при изменении количества
document.getElementById("hingalshQty").addEventListener("input", updatePrice);
document.getElementById("chepQty").addEventListener("input", updatePrice);

// обновление при смене доставки
document.querySelectorAll('input[name="deliveryType"]').forEach(el => el.addEventListener("change", toggleAddress));