// ============================================================
// 蛋糕頁
// ============================================================

var countdownInterval = null;

// 吹蠟燭：火焰熄滅 → 倒數 3 秒 → 顯示祝福 + 粒子特效 + 耶音效
function blow() {
    const flameEl = document.getElementById('flame');
    if (!flameEl) return;

    // 防止重複點擊
    if (flameEl.classList.contains('blowing')) return;

    // 隱藏對話框
    const bubble = document.getElementById('cakeOsBubble');
    if (bubble) bubble.classList.add('hide');

    flameEl.classList.add('blowing');

    const cakeMsg = document.getElementById('cakeMsg');
    let countdown = 3;

    if (cakeMsg) cakeMsg.innerHTML = `<span style="color: #ffb3d9;">倒計時... <span style="font-size: 3rem;">${countdown}</span> !</span>`;

    clearInterval(countdownInterval);

    countdownInterval = setInterval(function() {
        countdown--;
        if (countdown > 0) {
            if (cakeMsg) cakeMsg.innerHTML = `<span style="color: #ffb3d9;">倒計時... <span style="font-size: 3rem;">${countdown}</span> !</span>`;
        } else {
            clearInterval(countdownInterval);

            // 1. 倒數歸零瞬間，播放音效
            if (typeof sfxYeah !== 'undefined') {
                sfxYeah.volume = 0.10;
                sfxYeah.play().catch(e => console.log("YEAH音效被瀏覽器防禦"));
            }
            
            // 2. 把背景的生日歌稍微調小聲，讓 YEAH 聽起來更震撼
            if (typeof bgmHappyBirthdaySong !== 'undefined') {
                bgmHappyBirthdaySong.volume = 0.05; 
            }
            // ============================================================

            if (cakeMsg) cakeMsg.innerHTML = '<span style="color: #ffb3d9; font-size: 2.0rem;">呀比！美莓你的願望一定會成真噠!</span>';

            const nextBtn = document.getElementById('nextBtn');
            if (nextBtn) nextBtn.style.display = 'inline-block';

            const cakeObj = document.getElementById('cakeObj');
            if (cakeObj) {
                const r = cakeObj.getBoundingClientRect();
                for (let i = 0; i < 200; i++) {
                    particles.push({
                        x: r.left + r.width / 2,
                        y: r.top + 10, 
                        vx: (Math.random() - 0.5) * 50,
                        vy: (Math.random() - 0.8) * 13, 
                        size: Math.random() * 10 + 3,
                        color: i % 2 ? '#c8b0e8' : '#ffd700',
                        life: 1
                    });
                }
            }
        }
    }, 1000);
}

// 重置蛋糕頁：恢復火焰、文字、隱藏按鈕
function resetCake() {
    const flameEl = document.getElementById('flame');
    const cakeMsg = document.getElementById('cakeMsg');
    const nextBtn = document.getElementById('nextBtn');

    // 只要重置蛋糕，背景生日歌自動調回 0.15 音量
    if (typeof bgmHappyBirthdaySong !== 'undefined') {
        bgmHappyBirthdaySong.volume = 0.15;
    }

    // 恢復火焰
    if (flameEl) flameEl.classList.remove('blowing');

    // 恢復文字
    if (cakeMsg) cakeMsg.innerHTML = '<span style="color: #ffb3d9;">許願拉！</span>';

    // 隱藏前往星球按鈕
    if (nextBtn) nextBtn.style.display = 'none';

    // 恢復蛋糕訊息
    const bubble = document.getElementById('cakeOsBubble');
if (bubble) bubble.classList.remove('hide');
}