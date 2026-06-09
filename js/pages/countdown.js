// ============================================================
// 倒數計時（8月9日）+ 鎖定
// ============================================================

// 測試開關：true = 現在就解鎖 / false = 等到 2026/8/9 00:00
// 支援透過 URL 參數 ?test=true 或 ?bypass=true 強制進入測試解鎖模式
const urlParams = new URLSearchParams(window.location.search);
const isTestMode = urlParams.get('test') === 'true' || urlParams.get('bypass') === 'true';

function updateCountdown() {
    const now = new Date(); 
    const currentYear = now.getFullYear();

    // 鎖屏：2026年8月9日 00:00
    const unlockDate = new Date(2026, 7, 9, 0, 0, 0);
    const lockScreen = document.getElementById('lockScreen');

    // 如果鎖屏元素存在且測試模式關閉 + 時間未到 → 顯示鎖屏
    if (lockScreen && !isTestMode && now < unlockDate) {
        lockScreen.style.display = 'flex';
        const diff = unlockDate - now;

        // 倒數最後 10 秒（10000 毫秒）加上震動與發光加速特效
        const lockCircle = document.getElementById('lockCircle');
        if (lockCircle) {
            if (diff <= 10000) {
                lockCircle.classList.add('shaking');
            } else {
                lockCircle.classList.remove('shaking');
            }
        }

        const d = Math.floor(diff / 86400000);
        const h = Math.floor((diff / 3600000) % 24);
        const m = Math.floor((diff / 60000) % 60);
        const s = Math.floor((diff / 1000) % 60);
        const pad = n => n.toString().padStart(2, '0');
        const lockTimer = document.getElementById('lockTimer');
        if (lockTimer) {
            lockTimer.innerHTML = `${d}<span class="timer-unit">D</span>${pad(h)}<span class="timer-unit">H</span>${pad(m)}<span class="timer-unit">M</span>${pad(s)}<span class="timer-unit">S</span>`;
        }

        // 鬧鐘指針旋轉邏輯
        const hourHand = document.getElementById('clockHourHand');
        const minHand = document.getElementById('clockMinHand');
        if (hourHand) {
            const hourAngle = ((h % 12) + m / 60 + s / 3600) * 30;
            hourHand.style.transform = `rotate(${hourAngle}deg)`;
        }
        if (minHand) {
            const minAngle = (m + s / 60) * 6;
            minHand.style.transform = `rotate(${minAngle}deg)`;
        }

        return;
    }

    // 隱藏鎖屏，並移除同步鎖定與震動樣式類別，防止干擾後續頁面
    if (lockScreen) lockScreen.style.display = 'none';
    document.documentElement.classList.remove('is-locked');
    const lockCircle = document.getElementById('lockCircle');
    if (lockCircle) lockCircle.classList.remove('shaking');

    const timerEl = document.getElementById('timer');
    const labelEl = document.querySelector('.countdown-label');
    const countdownBoxEl = document.getElementById('countdownBox');

    // 生日當天 
    const isBirthdayToday = (now.getMonth() === 7 && now.getDate() === 9);


    if (isBirthdayToday) {
        if (countdownBoxEl && !countdownBoxEl.classList.contains('is-birthday')) {
            countdownBoxEl.classList.add('is-birthday');
            // 確保清除可能存在的點擊事件、樣式與提示
            countdownBoxEl.onclick = null;
            countdownBoxEl.style.cursor = "";
            countdownBoxEl.removeAttribute('title');
        }
        
        if (labelEl) labelEl.innerHTML = "耶耶耶！生日快樂呀美莓～";
        if (timerEl) {
            timerEl.innerHTML = "Happyyyyyyyyy!";
        }
        return; 
    }

    // 非生日當天
    let bday = new Date(currentYear, 7, 9); 
    if (now > new Date(currentYear, 7, 9, 23, 59, 59)) {
        bday.setFullYear(currentYear + 1);
    }
    const diff = bday - now;
    if (labelEl) labelEl.innerHTML = "距離小獅子生日還剩下：";
    if (countdownBoxEl) countdownBoxEl.classList.remove('is-birthday');
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff / 3600000) % 24);
    const m = Math.floor((diff / 60000) % 60);
    const s = Math.floor((diff / 1000) % 60);
    const pad = n => n.toString().padStart(2, '0');
    if (timerEl) {
        timerEl.innerHTML = `${d}<span class="timer-unit">D</span>${pad(h)}<span class="timer-unit">H</span>${pad(m)}<span class="timer-unit">M</span>${pad(s)}<span class="timer-unit">S</span>`;
    }
}

var countdownTimer = setInterval(updateCountdown, 1000);
