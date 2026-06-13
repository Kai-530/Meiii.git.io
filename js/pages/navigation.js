// ============================================================
// 頁面導航（切換頁面時呼叫）
// ============================================================

// 首頁小喇叭獨立監聽器（只在網頁載入時綁定一次）
if (typeof sfxDadadadada !== 'undefined') {
    sfxDadadadada.loop = true; // 讓首頁音效可以無限循環
}

function nav(id) {
    const countdown = document.getElementById('countdownBox');
    const modal = document.getElementById('modal');

    // 只要一換頁，立刻停止首頁的音效
    if (typeof sfxDadadadada !== 'undefined') {
        sfxDadadadada.pause();
        sfxDadadadada.currentTime = 0;
    }
    isDadadaPlaying = false;
    
    // 控制小喇叭只在首頁顯示，跳轉到別的頁面自動消失
    const speakerContainer = document.getElementById('audioControlContainer');
    if (speakerContainer) {
        if (id === 1) {
            speakerContainer.style.display = 'block'; 
        } else {
            speakerContainer.style.display = 'none';  
        }
    }

    // 只要換頁，就讓首頁按鈕的視覺重置回原本的 SVG 播放狀態
    const btn = document.getElementById('speakerBtn');
    if (btn) {
        btn.innerHTML = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="display: block;"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path></svg>';
        btn.style.borderColor = "#ff8acb";
        btn.style.color = "#ff8acb";
    }

    // 生日快樂歌背景音樂控制
    if (typeof bgmHappyBirthdaySong !== 'undefined') {
        if (id === 3) {
            // 如果進入蛋糕頁 → 啟動生日快樂歌背景循環
            bgmHappyBirthdaySong.play().catch(e => console.log("生日音樂被瀏覽器防禦"));
        } else {
            // 如果去別的頁面 → 停止撥放生日快樂歌
            bgmHappyBirthdaySong.pause();
            bgmHappyBirthdaySong.currentTime = 0;
        }
    }

    // 切換頁面時強制關閉所有彈窗
    if (modal) modal.style.display = 'none';

    // 進入星球頁時隱藏倒數計時框
    if (countdown) {
        if (id === 4) {
            countdown.style.opacity = '0';
            countdown.style.pointerEvents = 'none';
        } else {
            countdown.style.opacity = '1';
            countdown.style.pointerEvents = 'auto';
        }
    }

    // 隱藏所有頁面
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));

    // 顯示目標頁面
    const targetScreen = document.getElementById('pg' + id);
    if (targetScreen) targetScreen.classList.add('active');

    // 進入海克斯頁 → 初始化海克斯系統
    if (id === 2) initHexSystem();

    // 進入星球頁 → 初始化星系 + 更新已選海克斯
    if (id === 4) {
        initGalaxy();
        updateFinalHexUI();
    }

    // 回到首頁 → 重置運勢 + 重置神秘禮物 + 重置海克斯卡池與選中狀態
    if (id === 1) {
        resetFortune();
        resetGift();
        if (typeof resetHexSystem === 'function') {
            resetHexSystem();
        }
    }

    // 進入蛋糕頁或回到首頁 → 重置蛋糕狀態
    if (id === 3 || id === 1) {
        resetCake();
    }

    // 進入蛋糕頁重啟，離開蛋糕頁停止
    if (id === 3) {
        stopFX();
        animateFX();
    } else {
        stopFX();
    }
}
