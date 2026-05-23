// ============================================================
// 粒子特效
// ============================================================

// 粒子陣列：存放所有正在飛行的粒子
let particles = [];
let animationId = null;

// 取得特效畫布的繪圖上下文
const fxCtx = document.getElementById('effectCanvas').getContext('2d');

// 每幀更新粒子位置、透明度，繪製並移除已消失的粒子
function animateFX() { 
    if (!fxCtx) return;

    // 1. 每幀開始前，先儲存畫布目前的初始乾淨狀態
    fxCtx.save();

    // 清除畫布
    fxCtx.clearRect(0, 0, window.innerWidth, window.innerHeight); 

    // 逐一更新每個粒子
    particles.forEach(p => { 
        p.vx *= 0.98;
        p.vy += 0.15;
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.01;
        
        // 限制 life 最低為 0，避免 globalAlpha 變成負數出錯
        const currentAlpha = Math.max(0, p.life);
        fxCtx.globalAlpha = currentAlpha;
        
        fxCtx.fillStyle = p.color;
        fxCtx.beginPath(); 
        fxCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        fxCtx.fill(); 
    }); 

    // 移除已消失的粒子
    particles = particles.filter(p => p.life > 0); 

    // 2. 徹底還原畫布狀態（包含全域透明度 globalAlpha 強制回歸 1）
    fxCtx.restore();

    // 下一幀繼續動畫
    animationId = requestAnimationFrame(animateFX);
}

// 停止動畫 + 清畫布
function stopFX() {
    // 停止下一幀的 Loop 預約
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
    
    // 清空粒子數據
    particles = [];
    
    // 徹底物理重置畫布
    if (fxCtx) {
        fxCtx.save();
        fxCtx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        fxCtx.restore(); // 確保完全重置狀態機，不需要用 setTimeout
    }
}