// ============================================================
// 星球軌道 (js/pages/galaxy.js)
// ============================================================

// 彈幕資料庫
const danmuPool = [
    "美莓生日快樂唷！",
    "媽媽我上電視啦！",
    "要天天開心哦～",
    "你是最棒嘟！",
    "跟所有的快樂說嗨嗨！",
    "白菜對你笑 白菜白菜對你笑 哈哈哈",
    "發財拉嘿嘿嘿",
    "跟所有的煩惱說掰掰！",
    "每日一嘻嘻 (1/1)",
    "老一歲囉囉囉",
    "你好呀美莓，看到我了嘛！",
    "我是彈幕　我是彈幕",
    "工作加油唷～",
    "不要熬夜！",
    "記得按時吃飯！",
    "累了要記得休息哦～",
    "祝你幸福～祝你健康～",
    "祝你前途光明～",
    "Happy birthday",
    "真好玩嘿嘿嘿",
    "人見人愛小美莓",
    "花見花開小美莓",
    "運氣爆棚小美莓",
    "依舊詞窮",
    "頭腦風暴了我去拉",
    "美美倒地",
    "嘟嘟嘟",
    "=))",
    "=)))",
    "=))))",
];

let danmuTimer = null; 
let lastTrack = -1; 
let recentDanmus = []; 

// 彈幕(三軌道)
function initLiveDanmu() {
    if (danmuTimer) clearInterval(danmuTimer);
    
    lastTrack = -1;
    recentDanmus = []; 

    const container = document.getElementById('danmuStage');
    if (!container) return;

    const trackCount = 3; 
    
    function launch() {
        const colors = [
            '#ff8acb', '#ffb3d9', '#d48aff', '#a38aff', 
            '#FFD700', '#ff8aff', '#ff4da6', '#8acbff'
        ];

        let text;
        let attempts = 0; 
        do {
            text = danmuPool[Math.floor(Math.random() * danmuPool.length)];
            attempts++;
            if (attempts > 30) break; 
        } while (recentDanmus.includes(text));

        recentDanmus.push(text);
        if (recentDanmus.length > 10) {
            recentDanmus.shift(); 
        }

        let randomTrack;
        do {
            randomTrack = Math.floor(Math.random() * trackCount);
        } while (randomTrack === lastTrack);
        lastTrack = randomTrack;  

        let color = colors[Math.floor(Math.random() * colors.length)];

        const fontSize = 0.85 + Math.random() * 0.15; 
        const top = 6 + (randomTrack * 28); 
        const duration = 10 + Math.random() * 2; 

        const dm = document.createElement('div');
        dm.innerText = text;
        dm.style.cssText = `
            position: absolute;
            top: ${top}px;
            left: 100%;
            white-space: nowrap;
            color: ${color};
            font-size: ${fontSize}rem;
            font-weight: bold;
            padding: 3px 14px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.2);
            pointer-events: none;
            will-change: transform;
            animation: danmuLive ${duration}s linear forwards;
            z-index: 99;
            text-shadow: 1px 1px 2px rgba(0,0,0,0.9), -1px -1px 2px rgba(0,0,0,0.9);
        `;

        container.appendChild(dm);

        setTimeout(() => {
            dm.remove();
        }, duration * 1000);
    }

    danmuTimer = setInterval(launch, 650);
}

// 牌位輪播
let currentRankSlide = 0;
const totalRankSlides = 8;

window.nextRankSlide = function() {
    currentRankSlide = (currentRankSlide + 1) % totalRankSlides;
    updateRankSlide();
};

window.prevRankSlide = function() {
    currentRankSlide = (currentRankSlide - 1 + totalRankSlides) % totalRankSlides;
    updateRankSlide();
};

function updateRankSlide() {
    const slides = document.getElementById('rankSlides');
    if (slides) {
        slides.style.transform = `translateX(-${currentRankSlide * 100}%)`;
    }
    const dots = document.querySelectorAll('.rank-dot');
    dots.forEach((dot, i) => {
        dot.style.opacity = i === currentRankSlide ? '1' : '0.4';
    });
}

let galaxyAnimationIds = [];
let currentFriendAudio = null;

// 初始化星系
function initGalaxy() {
    galaxyAnimationIds.forEach(id => cancelAnimationFrame(id));
    galaxyAnimationIds = [];

    const galaxy = document.getElementById('galaxy');
    if (!galaxy) return;

    const orbits = galaxy.querySelectorAll('.orbit');
    const friends = galaxy.querySelectorAll('.friend-planet');
    orbits.forEach(el => el.remove());
    friends.forEach(el => el.remove());

    const friendsData = [
        { 
            n: "SerendiPityuu", 
            img: "avatar/hkr.png", 
            zodiac: "♊", 
            msg: `
                <div style="text-align: left; background: rgba(255,255,255,0.05); 
                border-radius: 15px; 
                padding: 15px; 
                margin-top: 10px; 
                line-height: 1.8; 
                font-size: 0.9rem; 
                color: #ddd;">
                    美莓美莓 祝你生日快樂呀！<br>
                    你今天是美美的小壽星，<br>
                    必須要開心哦，不開心的話我要打人拉！<br>
                    要永遠健康平安，不要內耗，<br>
                    也不要給自己太大壓力。<br>
                    恭喜你又成熟了一點，<br>
                    新的一歲要越來越好哦～<br>
                    我催了我的老朋友好幾天，<br>
                    他們終於給我錄音啦哈哈哈哈！<br>
                    遇到什麼煩心事都可以跟我們說，<br>
                    我們都在唷！
                </div>
            `, 
            s: 0.1, rx: 300, ry: 200, v: 0.3,
            audio: "audio/friendBless/hkr.mp3" 
        },
        { n: "生椰抹茶拿鐵", img: "avatar/qwr.jpg", zodiac: "♎", msg: "<img src='blessings/qwr.jpg' style='width: 250px; height: 250px; object-fit: contain; border-radius: 20px;'>", s: 0.085, rx: 400, ry: 260, audio: "audio/friendBless/qwr.mp3", v: 0.4 },
        { n: "專業送頭AD", img: "avatar/wyb.jpg", zodiac: "♍", msg: "<img src='blessings/wyb.jpg' style='width: 250px; height: 250px; object-fit: contain; border-radius: 20px;'>", s: 0.07, rx: 500, ry: 320, audio: "audio/friendBless/wyb.mp3" },
        { n: "Sihao", img: "avatar/slh.png", zodiac: "♓", msg: "<img src='blessings/slh.jpg' style='width: 250px; height: 250px; object-fit: contain; border-radius: 20px;'>", s: 0.06, rx: 600, ry: 380, audio: "audio/friendBless/slh.mp3", v: 0.3 },
    ];

    friendsData.forEach((f) => {
        const rx = f.rx, ry = f.ry;

        const orbit = document.createElement('div'); 
        orbit.className = 'orbit'; 
        orbit.style.width = (rx * 2) + 'px'; 
        orbit.style.height = (ry * 2) + 'px'; 
        orbit.style.borderRadius = '50%';
        galaxy.appendChild(orbit);

        const p = document.createElement('div'); 
        p.className = 'friend-planet';
        p.innerHTML = `<img src="${f.img}" style="width:50px; height:50px; border-radius:50%; object-fit:cover;"><div class="friend-name">${f.n}</div>`; 
        galaxy.appendChild(p);

        let ang = Math.random() * 360;

        function rotate() {
            if (!document.getElementById('pg4') || !document.getElementById('pg4').classList.contains('active')) return;
            const rad = ang * Math.PI / 180;
            p.style.transform = `translate(${Math.cos(rad) * rx}px, ${Math.sin(rad) * ry}px)`;
            ang += f.s;
            const animationId = requestAnimationFrame(rotate);
            galaxyAnimationIds.push(animationId);
        }

        p.onclick = (e) => { 
            e.stopPropagation();

            if (currentFriendAudio) {
                currentFriendAudio.pause();
                currentFriendAudio.currentTime = 0;
            }

            currentFriendAudio = new Audio(f.audio);
            currentFriendAudio.volume = 0.6;
            currentFriendAudio.play().catch(err => console.log("點擊播放語音被瀏覽器安全機制防禦"));

            document.getElementById('mTitle').innerText = f.zodiac;
            document.getElementById('mBody').innerHTML = `
                <div style="text-align: center;">
                    <img src="${f.img}" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; margin-bottom: 0px; border: 2px solid var(--primary);">
                    <div style="font-size: 1.2rem; font-weight: bold; color: var(--secondary); margin-bottom: 8px;">${f.n}</div>
                    <div style="font-size: 0.95rem; color: #ddd; line-height: 1.8;">${f.msg}</div>
                </div>
            `;
            
            document.getElementById('modalBtnArea').innerHTML = `<button class="btn-main" onclick="closeFriendModal()">確認</button>`;
            document.getElementById('modal').style.display = 'flex';
        };

        rotate();
    });
}

// 關閉朋友彈窗
window.closeFriendModal = function() {
    document.getElementById('modal').style.display = 'none';
    if (currentFriendAudio) {
        currentFriendAudio.pause();
        currentFriendAudio.currentTime = 0;
    }
};

// 主星球
function showMaster() { 

    if (window.bgmArctic) {
        window.bgmArctic.pause();
        window.bgmArctic.currentTime = 0;

        window.bgmArctic.play()
        if (typeof bgmArctic !== 'undefined') {
        bgmArctic.volume = 0.2; 
        bgmArctic.play().catch(e => console.log("大星球音效被瀏覽器防禦"));
    }
}

    const modalEl = document.getElementById('modal');
    if (modalEl) {
        const modalCard = modalEl.querySelector('.modal-card');
        if (modalCard) {
            modalCard.classList.add('master-card');

            modalCard.style.width = "960px";  
            modalCard.style.maxWidth = "95vw";
            modalCard.style.maxHeight = "100vh";
            modalCard.style.height = "auto";
            modalCard.style.padding = "20px 35px"; 
            modalCard.style.boxSizing = "border-box"; 
            modalCard.style.margin = "auto"; 
            modalCard.style.transition = "all 0.4s ease";
            modalCard.style.overflow = "visible";
            modalCard.style.display = "flex";
            modalCard.style.flexDirection = "column";
            modalCard.style.zoom = "1"; 
        }
    }
    
    document.getElementById('mTitle').innerHTML = `
        <div style="display: flex; align-items: center; justify-content: center; gap: 12px; padding: 2px 0; width: 100%;">
            <img src="avatar/MeiMei.png" style="width: 48px; height: 48px; border-radius: 50%; object-fit: cover; border: 2px solid var(--gold-active); box-shadow: 0 0 12px rgba(255, 215, 0, 0.4);">
            <div style="font-size: 1.25rem; font-weight: bold; color: var(--secondary); letter-spacing: 0.5px;">Luck game1 #game</div>
        </div>
    `;
    
    document.getElementById('mBody').style.maxHeight = "70vh";
    document.getElementById('mBody').style.overflowY = "auto";
    document.getElementById('mBody').style.paddingLeft = "35px";
    document.getElementById('mBody').style.paddingRight = "35px";
    document.getElementById('mBody').style.boxSizing = "border-box";
    
    document.getElementById('mBody').innerHTML = 
        '<div style="text-align: center; padding: 0px; width: 100%; margin: 0 auto; font-family: sans-serif; box-sizing: border-box;">' +
    
    '<style>' +
        '@keyframes danmuLive {' +
            '0%   { transform: translateX(0); }' +
            '100% { transform: translateX(calc(-1000px - 100%)); }' + 
        '}' +
    '</style>' +

    '<div style="display: flex; flex-direction: column; gap: 12px; width: 100%; margin: 0 auto; box-sizing: border-box;">' +

        '<div style="display: flex; flex-direction: column; gap: 6px; text-align: left; width: 100%;">' +
            '<div style="color: #ff8acb; font-weight: bold; font-size: 0.85rem; border-left: 3px solid #ff8acb; padding-left: 8px; letter-spacing: 1px;">小小彈幕</div>' +
            '<div id="danmuStage" style="background: rgba(0, 0, 0, 0.45); border: 1px solid rgba(255,179,217,0.15); border-radius: 10px; height: 95px; position: relative; overflow: hidden; box-sizing: border-box; padding: 2px 0; width: 100%;">' +
            '</div>' +
        '</div>' +

        '<div style="display: grid; grid-template-columns: 1.4fr 1fr; gap: 15px; text-align: left; align-items: stretch; width: 100%; box-sizing: border-box;">' +

            // ✅ 左欄：牌位輪播
            '<div style="display: flex; flex-direction: column; justify-content: flex-start; width: 100%;">' +
                '<div style="background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; padding: 12px; width: 100%; height: 100%; display: flex; flex-direction: column; box-sizing: border-box; overflow: hidden;">' +
                    '<div style="color: #ff8acb; font-weight: bold; font-size: 0.85rem; border-left: 3px solid #ff8acb; padding-left: 8px; letter-spacing: 1px; margin-bottom: 6px;">小小爬山</div>' +
                    
                    '<div style="position: relative; flex: 1; min-height: 0; border-radius: 8px; overflow: hidden;">' +
                        
                        '<div id="rankSlides" style="display: flex; transition: transform 0.5s ease; height: 100%;">' +
                            '<div class="rank-slide" style="min-width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">' +
                                '<img src="rank/platinum1.png" style="width: 80%; height: 75%; object-fit: contain; border-radius: 8px;">' +
                                '<div style="color: #5fddfd; font-size: 1rem;">大家好 俺是大大白金一！</div>' +
                            '</div>' +
                            '<div class="rank-slide" style="min-width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">' +
                                '<img src="rank/emerald4.png" style="width: 80%; height: 75%; object-fit: contain; border-radius: 8px;">' +
                                '<div style="color: #60fc7c; font-size: 1rem;">耶 小綠人四號</div>' +
                            '</div>' +
                            '<div class="rank-slide" style="min-width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">' +
                                '<img src="rank/emerald2.png" style="width: 80%; height: 75%; object-fit: contain; border-radius: 8px;">' +
                                '<div style="color: #60fc7c; font-size: 1rem;">小綠人三號被我吃掉拉 剩下小綠人二號</div>' +
                            '</div>' +
                            '<div class="rank-slide" style="min-width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">' +
                                '<img src="rank/emerald1.png" style="width: 80%; height: 75%; object-fit: contain; border-radius: 8px;">' +
                                '<div style="color: #60fc7c; font-size: 1rem;">嗚嗚嗚小綠人一號還在努力</div>' +
                            '</div>' +
                            '<div class="rank-slide" style="min-width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">' +
                                '<img src="rank/diamond4.png" style="width: 80%; height: 75%; object-fit: contain; border-radius: 8px;">' +
                                '<div style="color: #628dfc; font-size: 1rem;">耶耶耶變顔色嚕！俺接下來將成爲小藍人</div>' +
                            '</div>' +
                            '<div class="rank-slide" style="min-width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">' +
                                '<img src="rank/diamond2.png" style="width: 80%; height: 75%; object-fit: contain; border-radius: 8px;">' +
                                '<div style="color: #628dfc; font-size: 1rem;">小藍人三號又被我吃掉拉 好可憐嗚嗚嗚嗚</div>' +
                            '</div>' +
                            '<div class="rank-slide" style="min-width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">' +
                                '<img src="rank/diamond1.png" style="width: 80%; height: 75%; object-fit: contain; border-radius: 8px;">' +
                                '<div style="color: #628dfc; font-size: 1rem;">加油加油 gogo宜得利 gogo北海道</div>' +
                            '</div>' +
                            '<div class="rank-slide" style="min-width: 100%; height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center;">' +
                                '<img src="rank/master.png" style="width: 80%; height: 75%; object-fit: contain; border-radius: 8px;">' +
                                '<div style="color: #ad68fc; font-size: 1rem;">耶耶耶耶耶小小大師 美美拿捏</div>' +
                            '</div>' +
                        '</div>' +
                        
                        '<button onclick="prevRankSlide()" style="position: absolute; left: 5px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); border: none; color: #fff; font-size: 1.2rem; cursor: pointer; border-radius: 50%; width: 30px; height: 30px; z-index: 10;">◀</button>' +
                        '<button onclick="nextRankSlide()" style="position: absolute; right: 5px; top: 50%; transform: translateY(-50%); background: rgba(0,0,0,0.5); border: none; color: #fff; font-size: 1.2rem; cursor: pointer; border-radius: 50%; width: 30px; height: 30px; z-index: 10;">▶</button>' +
                        
                        '<div style="position: absolute; bottom: 5px; left: 50%; transform: translateX(-50%); display: flex; gap: 5px; z-index: 10;">' +
                            '<span class="rank-dot" style="width: 6px; height: 6px; background: #fff; border-radius: 50%; opacity: 1;"></span>' +
                            '<span class="rank-dot" style="width: 6px; height: 6px; background: #fff; border-radius: 50%; opacity: 0.4;"></span>' +
                            '<span class="rank-dot" style="width: 6px; height: 6px; background: #fff; border-radius: 50%; opacity: 0.4;"></span>' +
                            '<span class="rank-dot" style="width: 6px; height: 6px; background: #fff; border-radius: 50%; opacity: 0.4;"></span>' +
                            '<span class="rank-dot" style="width: 6px; height: 6px; background: #fff; border-radius: 50%; opacity: 0.4;"></span>' +
                            '<span class="rank-dot" style="width: 6px; height: 6px; background: #fff; border-radius: 50%; opacity: 0.4;"></span>' +
                            '<span class="rank-dot" style="width: 6px; height: 6px; background: #fff; border-radius: 50%; opacity: 0.4;"></span>' +
                            '<span class="rank-dot" style="width: 6px; height: 6px; background: #fff; border-radius: 50%; opacity: 0.4;"></span>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +

            // ✅ 右欄：截圖
            '<div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px; display: flex; flex-direction: column; justify-content: flex-start; box-sizing: border-box; height: 100%; width: 100%;">' +
                '<div style="color: #ff8acb; font-weight: bold; font-size: 0.85rem; border-left: 3px solid #ff8acb; padding-left: 8px; letter-spacing: 1px; margin-bottom: 6px;">小小喀擦</div>' +
                '<div style="display: flex; flex-direction: column; justify-content: center; flex-grow: 1; width: 100%; overflow: hidden;">' +
                    '<div style="position: relative; border-radius: 8px; overflow: hidden; border: 1px solid rgba(255,255,255,0.15); box-shadow: 0 6px 20px rgba(0,0,0,0.6); width: 100%; height: 100%; min-height: 168px;">' +
                        '<img src="screenshot/screenshot.jpg" alt="圖圖" style="width: 100%; height: 100%; object-fit: cover; display: block;">' +
                    '</div>' +
                '</div>' +
            '</div>' +

        '</div>' + 

    '</div>' + 

'</div>';
    
    document.getElementById('modalBtnArea').style.padding = "3px 0 3px 0";
    document.getElementById('modalBtnArea').innerHTML = '<button class="btn-main" style="padding: 8px 25px; font-size: 0.9rem; margin-top: 5px;" onclick="closeMasterModal()">確認</button>';
    document.getElementById('modal').style.display = 'flex';
    document.getElementById('mTitle').style.marginBottom = "3px";

    // 重置輪播到第一張
    currentRankSlide = 0;
    setTimeout(() => updateRankSlide(), 100);

    initLiveDanmu();
}

// ============================================================
// 關閉主星球彈窗
// ============================================================
window.closeMasterModal = function() {
    //退出主星球立刻關閉音效
    if (window.bgmArctic) {
    window.bgmArctic.pause();
    window.bgmArctic.currentTime = 0;
}

    const modalEl = document.getElementById('modal');
    if (modalEl) {
        const mc = modalEl.querySelector('.modal-card');
        if (mc) {
            mc.classList.remove('master-card');
            mc.style.transform = "";
            mc.style.transformOrigin = "";
            mc.style.width = "";
            mc.style.maxWidth = "";
            mc.style.height = "";
            mc.style.padding = "";
            mc.style.margin = "";
            mc.style.boxSizing = "";
            mc.style.transition = "";
            mc.style.zoom = "";
        }
    }

    document.getElementById('mBody').style.maxHeight = "";
    document.getElementById('mBody').style.overflowY = "";
    document.getElementById('mBody').style.paddingLeft = "";
    document.getElementById('mBody').style.paddingRight = "";
    document.getElementById('mBody').style.boxSizing = "";

    document.getElementById('modal').style.display = 'none';

    if (danmuTimer) {
        clearInterval(danmuTimer);
        danmuTimer = null;
    }
};

// ============================================================
// 瀏覽器分頁切換監聽（解決背景分頁定時器導致的彈幕堆積 bug）
// ============================================================
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // 當切換到其他分頁時，立刻清除彈幕發送定時器，防範 DOM 堆積
        if (danmuTimer) {
            clearInterval(danmuTimer);
            danmuTimer = null;
        }
        // 清除當前舞台上所有尚未播完的彈幕元素，切換回來時更乾淨
        const container = document.getElementById('danmuStage');
        if (container) {
            container.innerHTML = '';
        }
    } else {
        // 當切換回本網頁時，若大星球彈窗仍是開啟狀態，則重新初始化並播放彈幕
        const modalEl = document.getElementById('modal');
        if (modalEl && modalEl.style.display === 'flex') {
            const mc = modalEl.querySelector('.modal-card');
            if (mc && mc.classList.contains('master-card')) {
                initLiveDanmu();
            }
        }
    }
});