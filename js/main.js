// ============================================================
// 動態載入 JS 模組
// ============================================================

// ===================================================
// 音效庫
// ===================================================
const sfxCallTheLandlord  = new Audio('audio/callTheLandlord.mp3');
const sfxDadadadada     = new Audio('audio/dadadadada.mp3');
const sfxDontWant  = new Audio('audio/dontWant.mp3');
const sfxYeah    = new Audio('audio/yeah.mp3');
const sfxSurprise  = new Audio('audio/surprise.mp3');
const sfxJiang2  = new Audio('audio/jiang2.mp3');

const sfxHkr = new Audio('audio/friendBless/hkr.mp3');
const sfxQwr = new Audio('audio/friendBless/qwr.mp3');
const sfxWyb = new Audio('audio/friendBless/wyb.mp3');
const sfxSlh = new Audio('audio/friendBless/slh.mp3');

window.bgmHappyBirthdaySong = new Audio('audio/happyBirthdaySong.mp3');
window.bgmArctic = new Audio('audio/goToTheArcticToForgetYou.mp3');

window.bgmArctic.loop = true;
window.bgmArctic.volume = 0.4;

window.bgmHappyBirthdaySong.loop = true;
window.bgmHappyBirthdaySong.volume = 0.15;

// ===================================================
// 各種 function、按鈕監聽器
// ===================================================
(function() {
    // 所有需要載入的 JS 檔案
    const scripts = [
        'js/utils/helpers.js',          // 工具函數（safeHtml）
        'js/effects/stars.js',          // 星空背景 & 流星
        'js/effects/particles.js',      // 粒子特效
        'js/pages/countdown.js',        // 倒數計時
        'js/pages/modal.js',            // 彈窗系統
        'js/pages/navigation.js',       // 頁面導航
        'js/pages/hex-system.js',       // 海克斯系統
        'js/pages/cake.js',             // 蛋糕頁
        'js/pages/gifts.js',            // 神秘禮物
        'js/pages/fortune.js',          // 運勢抽籤
        'js/pages/galaxy.js',           // 星球軌道
        'js/responsive/resize.js',      // 視窗大小調整
    ];

    let loaded = 0;

    // 逐一建立 <script> 標籤並載入
    scripts.forEach(function(src) {
        const s = document.createElement('script');
        s.src = src;

        // 每個檔案載入完成後 +1
        s.onload = function() {
            loaded++;

            // 全部載入完畢 → 觸發自訂事件
            if (loaded === scripts.length) {
                window.dispatchEvent(new Event('modules-ready'));
            }
        };
        
        s.onerror = function() {
            console.error('載入失敗:', src);
        };

        document.body.appendChild(s);
    });
})();

// ============================================================
// 頁面啟動（等所有模組載入完才執行）
// ============================================================
window.addEventListener('modules-ready', () => { 
    if (typeof applyAutoScaling === 'function') {
        applyAutoScaling(); // 啟動自適應縮放
    }
    initStars();           // 初始化星空
    drawStars();           // 開始繪製星空
    animateFX();           // 開始粒子動畫
    forceRefreshHex();     // 隨機洗牌海克斯
    updateCountdown();     // 啟動倒數計時
    selectRandomGift();    // 隨機選一個神秘禮物
});

// ============================================================
// 首頁小喇叭音效控制
// ============================================================
let isDadadaPlaying = false; // 音效是不是正在播放

window.toggleFirstSound = function() {
    const btn = document.getElementById('speakerBtn');
    const tip = document.getElementById('speakerTip');
    
    if (!btn) return;

    // 只要音效播完了，自動變為可撥放狀態
    sfxDadadadada.onended = function() {
        isDadadaPlaying = false;
        btn.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>';
        btn.style.borderColor = "#ff8acb";          // 自動變回粉紅色
        btn.style.color = "#ff8acb";
    };

    if (!isDadadaPlaying) {
        sfxDadadadada.volume = 0.4;
        // 1. 如果音效沒播，點下去就立刻放音效
        sfxDadadadada.play()
            .then(() => {
                isDadadaPlaying = true;
                btn.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>';
                btn.style.borderColor = "#a38aff";  // 變成紫色
                btn.style.color = "#a38aff";
            })
            .catch(e => console.log("音效被瀏覽器防禦"));
    } else {
        // 2. 如果音效正在播，再次點擊就靜音
        sfxDadadadada.pause();
        sfxDadadadada.currentTime = 0;              // 播放時間歸零
        isDadadaPlaying = false;
        btn.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>';
        btn.style.borderColor = "#ff8acb";          // 變回原本的粉紅色
        btn.style.color = "#ff8acb";
    }
}
