// ============================================================
// 海克斯系統
// ============================================================

// 海克斯資料庫（10 張，隨機抽 3 張顯示）
const hexMasterPool = [
    { t: "三星來嚕", d: "獲得一隻三星五費！<br> 要美美吃雞拉！", img: "hextech/samsungIsHere.png", msg: "哈哈哈哈哈是我拉， <br> 我要上場戰鬥嚕！美莓你看我發揮呀！"  },
    { t: "好運門票", d: "D 一下運氣有 50% 機率會 +1 唷！", img: "hextech/luckyTickets.png", msg: "錢都送你拉，快 D 快 D ， <br> 美莓運氣猛猛往上漲嘿嘿嘿。"  },
    { t: "後期之力", d: "立刻獲得 100 金幣， <br> 後期要來嚕！", img: "hextech/lateStage Power.png", msg: "美莓你愛玩需要運營的陣容， <br> 相信你未來也會超厲害噠， <br> 我要投資你！！！"  },
    { t: "壽星假人", d: "獲得一個可可愛愛小假人， <br> 雖然看著弱弱的，但他很能扛的！", img: "hextech/birthdayDummy.png", msg: "美莓你今天只需要負責開心， <br> 有的沒的我都替你扛下拉！"  },
    { t: "生日之力", d: "壽星光環啟動！<br> 這一回合開始連勝金幣 +10 ， <br> 輸了我來補！", img: "hextech/birthdayPower.png", msg: "今天做什麼都會順順順！相信自己哦， <br> 你的節奏沒有人可以打亂噠！" },
    { t: "願望備戰", d: "備戰席可以用來存放願望， <br> 三回合後將實現願望！", img: "hextech/desireToPrepareForWar.png", msg: "美莓快把願望丟上去嘿嘿嘿， <br> 今天你的願望我包拉哈哈哈， <br> 如果我辦得到的話直接幫你實現呀！"  },
    { t: "對手祝福", d: "立即暫停五回合， <br> 對手都來你的棋盤狂歡啦！", img: "hextech/opponent'sBlessing.png", msg: "好歡樂好歡樂，大家都來慶祝你拉， <br> 開不開心呀美莓！"  },
    { t: "雙倍快樂", d: "雙排啟動！你跟隊友共享快樂值， <br> 而且越輸越快樂哦， <br> 哈哈哈哪個傻子在說話？", img: "hextech/doubleTheHappiness.png", msg: "美莓以後無聊的話直接拉我呀， <br> 單機遊戲多沒意思嘿嘿嘿。"  },
    { t: "美美吃雞", d: "壽星把把吃雞， <br> 對手通通給我閃開！", img: "hextech/meimeiEatsChicken.png", msg: "美莓今天把把都第一 <br> 壽星自帶氣場，對手看到都害怕拉！"  },
    { t: "時光回溯", d: "上一回合過載了嘛， <br> 坐上時光機要回溯到前一回合囉！", img: "hextech/timeTravel.png", msg: "美莓累了嘛，坐穩拉， <br> 時光機美美啟動， <br> 把那些煩人的事通通洗掉嚕！"  },
];

// 海克斯狀態變數
let pool = [];                      // 總卡池（洗牌後的 10 張）
let activeHex = [];                 // 目前顯示的 3 張
let remainingPool = [];             // 剩餘可刷新的 7 張
let refreshUsed = [false, false, false]; // 每張是否已刷新
let userSelectedHex = null;         // 使用者選定的海克斯
let hexLocked = false;              // 是否已鎖定（選定後不可再選）

// 強制刷新總卡池：重新洗牌 10 張
function forceRefreshHex() {
    pool = [...hexMasterPool];
    // Fisher-Yates 洗牌
    for (let i = pool.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    remainingPool = [];
}

// 初始化海克斯系統：從卡池抽 3 張顯示
function initHexSystem() {
    if (pool.length < 3) forceRefreshHex();
    activeHex = pool.slice(0, 3);           // 取前 3 張
    remainingPool = pool.slice(3);          // 剩下 7 張可刷新
    refreshUsed = [false, false, false];
    userSelectedHex = null;
    hexLocked = false;

    // 隱藏「準備許願」按鈕
    const giftBtn = document.getElementById('giftSceneBtn');
    if (giftBtn) giftBtn.style.display = 'none';

    renderHex();
}

// 渲染 3 張海克斯卡片
function renderHex() {
    const container = document.getElementById('hexContainer');
    if (!container) return;
    container.innerHTML = '';

    activeHex.forEach((d, i) => {
        const card = document.createElement('div');
        card.className = 'hex-card';
        card.id = 'hex-' + i;
        if (!d) return;
        card.innerHTML = `
            <img src="${d.img}" style="width: 150px; height: 150px; object-fit: contain; border-radius: 15px; margin-bottom: 25px;">
            <h3>${safeHtml(d.t)}</h3>
            <p>${safeHtml(d.d)}</p>
            <button class="refresh-btn ${refreshUsed[i]?'used':''}" onclick="refreshOne(${i}, event)"> 刷 新 </button>
        `;

        // 點擊卡片 → 選定海克斯
        card.onclick = (function(idx, data) {
            return function() { selectHex(idx, data); };
        })(i, d);

        container.appendChild(card);
    });
}

// 刷新單張卡片：從剩餘卡池抽一張替換
function refreshOne(i, e) {
    e.stopPropagation();
    
    // 如果這張卡片已經刷新過，或者系統已鎖定，就直接返回，不執行任何動作
    if (refreshUsed[i] || hexLocked) return;

    if (typeof sfxDontWant !== 'undefined') {
        sfxDontWant.volume = 0.4; 
        sfxDontWant.play().catch(e => console.log("刷新音效被瀏覽器防禦"));
    } // 添加不要音效

    if (remainingPool.length > 0) {
        activeHex[i] = remainingPool.pop();     // 從剩餘卡池取一張
        refreshUsed[i] = true;
        renderHex();
    }
}

// 選定海克斯：標示選中、彈窗顯示內容
function selectHex(index, data) {
    if (hexLocked) return;

    // 清除所有選中狀態
    document.querySelectorAll('.hex-card').forEach(el => el.classList.remove('selected'));

    // 標示選中的卡片
    const targetCard = document.getElementById('hex-' + index);
    if (targetCard) targetCard.classList.add('selected');

    userSelectedHex = data;
    popHexRitual(data.t, data.d, data.msg, data.img);
}

// 海克斯選定彈窗：圖片 + 名稱 + 描述 + 訊息
function popHexRitual(t, d, msg, img) {
    var imgHTML = (img && img !== "") 
        ? `<img src="${img}" style="width: 130px; height: 130px; object-fit: contain; border-radius: 15px; margin-bottom: 15px;">` 
        : '';

    document.getElementById('mTitle').innerText = "選定海克斯";
    document.getElementById('mBody').innerHTML = `
        <div style="text-align: center;">
            ${imgHTML}
            <div style="font-size: 1.5rem; font-weight: bold; color: var(--secondary); margin-bottom: 8px;">${safeHtml(t)}</div>
            <div style="font-size: 1.0rem; color: #b0a0c0; margin-bottom: 10px;">${safeHtml(d)}</div>
            <div style="font-size: 1.0rem; color: #ffb3d9; line-height: 1.8; background: rgba(255,179,217,0.1); border-radius: 15px; padding: 14px;">${msg}</div>
        </div>
    `;
    document.getElementById('modalBtnArea').innerHTML = `<button class="btn-main" id="btnAcceptHex">美美確定拉</button>`;
    document.getElementById('modal').style.display = 'flex';

    // 點「美美確定拉」→ 鎖定所有卡片
    setTimeout(function () {
        var btn = document.getElementById('btnAcceptHex');
        if (btn) {
            btn.onclick = function () {
                sfxCallTheLandlord.volume = 0.4;
                sfxCallTheLandlord.play().catch(e => console.log("確認音效被瀏覽器防禦")); // 叫地主音效
                document.getElementById('modal').style.display = 'none';
                lockAllHexCards();
            };
        }
    }, 100);
}

// 鎖定所有海克斯卡片：不可再選、不可再刷新
function lockAllHexCards() {
    hexLocked = true;

    // 所有刷新按鈕變灰
    var allRefreshBtns = document.querySelectorAll('.refresh-btn');
    for (var i = 0; i < allRefreshBtns.length; i++) {
        allRefreshBtns[i].classList.add('used');
        allRefreshBtns[i].onclick = null;
    }

    // 所有卡片不可點擊、變暗
    var allCards = document.querySelectorAll('.hex-card');
    for (var j = 0; j < allCards.length; j++) {
        allCards[j].style.pointerEvents = 'none';
        allCards[j].style.opacity = '0.6';
    }

    // 選中的那張保持亮
    var selectedCard = document.querySelector('.hex-card.selected');
    if (selectedCard) {
        selectedCard.style.opacity = '1';
        selectedCard.style.pointerEvents = 'auto';
    }

    // 顯示「準備許願」按鈕
    const giftBtn = document.getElementById('giftSceneBtn');
    if (giftBtn) giftBtn.style.display = 'inline-block';
}

// 更新星球頁左側「已選海克斯」顯示
function updateFinalHexUI() {
    const display = document.getElementById('finalHexDisplay');
    if (!display) return;

    if (userSelectedHex) {
        var imgHTML = userSelectedHex.img 
            ? `<img src="${userSelectedHex.img}" style="width: 40px; height: 40px; object-fit: contain; border-radius: 10px; flex-shrink: 0;">`
            : '';

        display.innerHTML = `
            <div class="selected-hex-display" id="selectedHexBox" style="cursor: pointer;">
                ${imgHTML}
                <div>
                    <h4>${safeHtml(userSelectedHex.t)}</h4>
                    <p style="line-height: 1.6; line-break: strict; word-break: break-word;">${userSelectedHex.d.replace(/<br\s*\/?>/gi, ' ')}</p>
                </div>
            </div>
        `;

        // 點擊已選海克斯 → 彈窗顯示訊息
        setTimeout(function() {
            var box = document.getElementById('selectedHexBox');
            if (box) {
                box.onclick = function() {
                    if (userSelectedHex) {
                        var title = userSelectedHex.t;
                        var msg = userSelectedHex.msg || userSelectedHex.d;
                        pop(title, msg);
                    }
                };
            }
        }, 100);
    } else {
        display.innerHTML = `<p style="font-size:0.8rem; color:#666;">尚未選取海克斯，請回首頁重新選擇...</p>`;
    }
}