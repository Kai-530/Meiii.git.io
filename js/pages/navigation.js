// ============================================================
// 頁面導航（切換頁面時呼叫）
// ============================================================

// 首頁小喇叭獨立監聽器（只在網頁載入時綁定一次）
if (typeof sfxDadadadada !== 'undefined') {
    sfxDadadadada.loop = true; // 讓首頁音效可以無限循環
}

document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('speakerBtn');
    
    if (btn) {
        btn.addEventListener('click', () => {
            if (typeof sfxDadadadada !== 'undefined') {
                if (sfxDadadadada.paused) {
                    // 如果原本是暫停的，點了就播放
                    sfxDadadadada.play().catch(e => console.log("音樂被瀏覽器防禦"));
                    isDadadaPlaying = true;
                    
                    // 更換成「播放中（可點擊靜音）」的視覺
                    btn.innerText = "🔇"; 
                    btn.style.borderColor = "#ff4da6"; // 變亮粉紅
                    btn.style.color = "#ff4da6";
                } else {
                    // 如果正在播放，點了就暫停
                    sfxDadadadada.pause();
                    isDadadaPlaying = false;
                    
                    // 更換成「已暫停（可點擊放音）」的視覺
                    btn.innerText = "🔊"; 
                    btn.style.borderColor = "#ff8acb"; // 變回淡粉紅
                    btn.style.color = "#ff8acb";
                }
            }
        });
    }
});

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

    // 只要換頁，就讓首頁按鈕的視覺重置回原本的 🔊 狀態
    const btn = document.getElementById('speakerBtn');
    if (btn) {
        btn.innerText = "🔊";
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

    // 回到首頁 → 重置運勢 + 重置神秘禮物
    if (id === 1) {
        resetFortune();
        resetGift();
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