// ============================================================
// 運勢抽籤系統
// ============================================================

const fortuneBallList = [
    { name: "大吉", message: "美莓你今天運氣非常好呀！<br>做什麼事都會成功的，<br>要相信自己哦！", color: "#ff8acb" },
    { name: "中吉", message: "保持平常心！好事自然會發生的，<br>幸運女神在偷偷等你囉！", color: "#ff8aff" },
    { name: "小吉", message: "微微順風的一天，<br>可能不會驚天動地，<br>但會有小小的好事冒出來哦！", color: "#d48aff" },
    { name: "平順", message: "雖然沒有大起大落，<br>但能穩穩地過、開心地過，<br>好運就會悄悄來報到啦！", color: "#a38aff" },
    { name: "神秘", message: "今天是一個潘多拉，<br>驚喜說不定就在下個轉角，<br>美莓你準備好了嘛！", color: "#ffffff" },
];

let canDraw = true;
let pendingBall = null;

function drawLottery() {

    if (!canDraw) {
        if (typeof pop === 'function') {
            pop("提醒：", "今天已經翻過牌啦！但可以重整再試一次哦～");
        }
        return;
    }

    const randomIndex = Math.floor(Math.random() * fortuneBallList.length);
    const ball = fortuneBallList[randomIndex];

    if (typeof sfxSurprise !== 'undefined') {
        sfxSurprise.volume = 0.3; 
        sfxSurprise.currentTime = 0;
        sfxSurprise.play().catch(e => console.log("運勢音效被瀏覽器防禦"));
    }

    // 暫存運勢
    pendingBall = ball;
    canDraw = false;

    // 彈窗中顯示翻牌結果
    const modalTitle = document.getElementById('mTitle');
    const modalBody = document.getElementById('mBody');
    const modalBtnArea = document.getElementById('modalBtnArea');
    const modalEl = document.getElementById('modal');

    if (modalTitle && modalBody && modalBtnArea && modalEl) {
        modalTitle.innerText = "運來運來！";
        modalBody.innerHTML = `
            <div style="text-align: center; padding: 10px 0;">
                <!-- 彈窗內的翻牌動畫 -->
                <div class="fortune-flip-card" style="height: 270px; position: relative; margin: 0 auto;">
                    <div class="fortune-face fortune-front" style="position: absolute; width: 100%; height: 100%;">
                        <div style="font-size: 1.2rem; color: #b0a0c0;">翻牌中...</div>
                    </div>
                    <div class="fortune-face fortune-back" style="position: absolute; width: 100%; height: 100%; transform: rotateY(180deg); display: flex; flex-direction: column; align-items: center; justify-content: center;">
                        <div style="width: 60px; height: 60px; border-radius: 50%; background: ${ball.color}; margin: 0 auto 12px auto; box-shadow: 0 0 25px ${ball.color}; ${ball.color === '#ffffff' ? 'border: 3px solid rgba(150,150,150,0.6);' : 'border: 3px solid rgba(255,255,255,0.4);'}"></div>
                        <div style="font-size: 1.4rem; font-weight: bold; color: ${ball.color}; margin-bottom: 8px;">${ball.name.trim()}</div>
                        <div style="font-size: 0.95rem; color: #ddd; line-height: 1.6;">${ball.message}</div>
                    </div>
                </div>
            </div>
            <style>
                #modal .fortune-flip-card {
                    animation: modalFlip 0.6s ease forwards;
                    animation-delay: 0.2s;
                    transform-style: preserve-3d;
                }
                @keyframes modalFlip {
                    0% { transform: rotateY(0); }
                    100% { transform: rotateY(180deg); }
                }
                #modal .fortune-face {
                    backface-visibility: hidden;
                    -webkit-backface-visibility: hidden;
                }
            </style>
        `;
        modalBtnArea.innerHTML = `<button class="btn-main" id="confirmFortuneBtn">確認</button>`;
        modalEl.style.display = 'flex';

        // 點擊確認按鈕 → 更新右側面板
        setTimeout(function() {
            var btn = document.getElementById('confirmFortuneBtn');
            if (btn) {
                btn.onclick = function() {
                    modalEl.style.display = 'none';
                    showFortuneOnCard();
                };
            }
        }, 100);
    }
}

// 確認後才顯示到右側卡片上
function showFortuneOnCard() {
    if (!pendingBall) return;

    const flipCard = document.getElementById('fortuneFlip');
    const front = flipCard.querySelector('.fortune-front');
    const back = flipCard.querySelector('.fortune-back');

    if (front) front.style.display = 'none';
    if (back) {
        back.style.transform = 'none';
        back.style.position = 'relative';
    }

    const ballColor = document.getElementById('ballColor');
    const ballText = document.getElementById('ballText');
    const ballMessage = document.getElementById('ballMessage');

    ballColor.style.background = pendingBall.color;
    ballColor.style.boxShadow = `0 0 25px ${pendingBall.color}`;

    if (pendingBall.color === '#ffffff') {
        ballColor.style.border = '3px solid rgba(150,150,150,0.6)';
    } else {
        ballColor.style.border = '3px solid rgba(255,255,255,0.4)';
    }

    ballText.innerText = pendingBall.name;
    ballText.style.color = pendingBall.color;

    ballMessage.innerHTML = pendingBall.message;
    if (ballMessage) {
    ballMessage.textContent =
        pendingBall.message.replace(/<br\s*\/?>/gi, ' ');
}
}

function resetFortune() {
    canDraw = true;
    pendingBall = null;

    const flipCard = document.getElementById('fortuneFlip');
    if (flipCard) flipCard.classList.remove('flipped');

    const ballColor = document.getElementById('ballColor');
    if (ballColor) {
        ballColor.style.background = '';
        ballColor.style.boxShadow = '';
        ballColor.style.border = '3px solid rgba(255, 255, 255, 0.4)';
    }
    const ballText = document.getElementById('ballText');
    if (ballText) ballText.innerHTML = '';
    const ballMessage = document.getElementById('ballMessage');
    if (ballMessage) ballMessage.innerHTML = '';
    const front = document.querySelector('.fortune-front');
const back = document.querySelector('.fortune-back');

if(front) front.style.display = 'flex';

if(back){
    back.style.transform = 'rotateY(180deg)';
    back.style.position = '';
}

}
