// ============================================================
// 神秘禮物系統
// ============================================================

// 禮物資料庫：名稱、訊息、圖片
const giftList = [
    { name: "一枚睡眠泡泡", message: "祝美莓每晚都有好夢， <br> 醒來精神滿滿！", img: "memes/sleep.jpg" },
    { name: "一個美美盾牌", message: "我幫你擋掉所有負面情緒拉， <br> 只留快樂嘻嘻嘻！", img: "memes/nut.jpg" },
    { name: "一拖拉庫好運", message: "好運一個接一個， <br> 都彈到美莓身邊！", img: "memes/goodLuck.jpg" },
    { name: "一隻憨厚狗勾", message: "美莓有心事別自己消化呀， <br> 快來跟傻傻的狗勾說！我我我！", img: "memes/dog.jpg" },
    { name: "一瓶快樂藥水", message: "美莓你今天開心嘛？ <br> 嗨皮起來！動次打次！", img: "memes/minions.jpg" },
    { name: "一顆幸運骰子", message: "美莓今天不管骰什麼，骰到都是 6 ， <br> 美莓 666 哈哈哈哈哈！", img: "memes/dice.jpg" },
    { name: "一隻加油鴨鴨", message: "美莓加油！嘎嘎嘎， <br> 戰戰戰美莓殺殺殺，今天你要成功拉！", img: "memes/duck.jpg" },
    { name: "一首生日祝福", message: "對所有的煩惱說 Bye Bye ， <br> 對所有的快樂說 Hi Hi ， <br> 親愛的親愛的生日快樂， <br> 每一天都精彩！", img: "memes/birthday.jpg" },
    { name: "一張小按摩券", message: "美莓工作辛苦拉，按摩按摩， <br> 我捏捏捏嘿嘿。", img: "memes/massage.jpg" },
    { name: "一次精神補給", message: "來唷來唷，睏了累了喝這個， <br> 直接美美滿血復活！", img: "memes/energy.jpg" },
];

// 當前選中的禮物
let currentGift = null;

// 禮物是否已開啟
let giftOpened = false;

// 隨機選一個禮物（頁面載入或重置時呼叫）
function selectRandomGift() {
    const randomIndex = Math.floor(Math.random() * giftList.length);
    currentGift = giftList[randomIndex];
    giftOpened = false;
    updateGiftAppearance();
}

// 點擊禮物盒：先變暗 → 彈窗顯示內容 → 關閉後換成表情包
function openRandomGift() {

    // 開禮物音效
    if (typeof sfxJiang2 !== 'undefined') {
        sfxJiang2.volume = 0.25; 
        sfxJiang2.play().catch(e => console.log("禮物音效被瀏覽器防禦"));
    }

    // 已開過就不能再開
    if (giftOpened) return;
    if (!currentGift) return;

    // 禮物盒變暗
    const giftPanel = document.getElementById('randomGiftPanel');
    if (giftPanel) {
        giftPanel.style.opacity = '0.4';
        giftPanel.style.pointerEvents = 'none';
    }

    // 如果有圖片就顯示
    var imgHTML = (currentGift.img && currentGift.img !== "") 
    ? `<img src="${currentGift.img}" style="
        width: 220px; 
        height: 220px; 
        object-fit: cover; 
        border-radius: 20px; 
        margin: 15px auto 0 auto; 
        display: block;
        border: 3px solid #c8b0e8;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
    ">`
    : '';

    // 彈窗內容：名稱 + 訊息 + 圖片
    document.getElementById('mTitle').innerText = "小神秘來嚕！";
    document.getElementById('mBody').innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 1.5rem; font-weight: bold; color: var(--secondary); margin-bottom: 10px;">${currentGift.name}</div>
            <div style="font-size: 1.0rem; color: #ddd; line-height: 1.8; margin-bottom: 20px;">${safeHtml(currentGift.message)}</div>
            ${imgHTML}
        </div>
    `;
    document.getElementById('modalBtnArea').innerHTML = `<button class="btn-main" id="btnCloseGift">收下禮物</button>`;
    document.getElementById('modal').style.display = 'flex';

    // 關閉彈窗後 → 禮物盒換成表情包
    setTimeout(function() {
        var btn = document.getElementById('btnCloseGift');
        if (btn) {
            btn.onclick = function() {
                document.getElementById('modal').style.display = 'none';
                giftOpened = true;
                updateGiftAppearance();
            };
        }
    }, 100);
}

// 更新禮物盒外觀：未開啟 = 禮物盒 / 已開啟 = 表情包圖片
function updateGiftAppearance() {
    const giftPanel = document.getElementById('randomGiftPanel');
    if (!giftPanel) return;

    if (giftOpened && currentGift && currentGift.img) {
        // 已開啟 → 換成表情包圖片
        giftPanel.innerHTML = `<img src="${currentGift.img}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 16px; border: 2px solid var(--primary); box-shadow: 0 0 15px rgba(200,176,232,0.5);">`;
        giftPanel.style.opacity = '1';
        giftPanel.style.pointerEvents = 'none';
        giftPanel.style.cursor = 'default';
    } else {
        // 未開啟 → 恢復禮物盒
        giftPanel.innerHTML = `<div class="gift-box-panel"></div>`;
        giftPanel.style.opacity = '1';
        giftPanel.style.pointerEvents = 'auto';
        giftPanel.style.cursor = 'pointer';
    }
}

// 重置禮物：回到首頁時呼叫
function resetGift() {
    currentGift = null;
    selectRandomGift();
}