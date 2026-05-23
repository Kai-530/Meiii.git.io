// ============================================================
// 視窗大小調整（瀏覽器縮放時重新設定畫布尺寸與自適應縮放）
// ============================================================

window.applyAutoScaling = function() {
    const baseWidth = 1920; // 設計基準寬度 (1920px)
    const currentWidth = window.innerWidth;
    
    const bodyEl = document.body;
    if (!bodyEl) return;
    
    // 寬度大於 1000px ，啟用自適應等比例縮放
    if (currentWidth > 1000) {
        let zoomFactor = currentWidth / baseWidth;
        
        // 限制合理縮放區間，防極端變形
        if (zoomFactor < 0.5) zoomFactor = 0.5;
        if (zoomFactor > 1.5) zoomFactor = 1.5;
        
        bodyEl.style.zoom = zoomFactor;
        bodyEl.style.width = "100%";
        
        // 對全螢幕固定定位的「鎖屏」與「背景Canvas」進行反向縮放，確保它們能 100% 填滿螢幕
        const invZoom = 1 / zoomFactor;
        
        const lockScreen = document.getElementById('lockScreen');
        if (lockScreen) {
            lockScreen.style.zoom = invZoom;
        }
        
        const sc = document.getElementById('starsCanvas');
        if (sc) {
            sc.style.zoom = invZoom;
        }
        
        const ec = document.getElementById('effectCanvas');
        if (ec) {
            ec.style.zoom = invZoom;
        }
    } else {
        // 小於 1000px 時回到行動版警告狀態，重設 zoom
        bodyEl.style.zoom = "";
        bodyEl.style.width = "";
        
        const lockScreen = document.getElementById('lockScreen');
        if (lockScreen) lockScreen.style.zoom = "";
        
        const sc = document.getElementById('starsCanvas');
        if (sc) sc.style.zoom = "";
        
        const ec = document.getElementById('effectCanvas');
        if (ec) ec.style.zoom = "";
    }
};

// 監聽視窗 resize 事件
window.addEventListener('resize', () => {
    // 1. 執行自適應縮放
    if (typeof applyAutoScaling === 'function') {
        applyAutoScaling();
    }

    // 2. 取得星空與特效畫布，重設寬高
    const sc = document.getElementById('starsCanvas');
    const ec = document.getElementById('effectCanvas');

    if (sc) { 
        sc.width = window.innerWidth; 
        sc.height = window.innerHeight; 
    }

    if (ec) { 
        ec.width = window.innerWidth; 
        ec.height = window.innerHeight; 
    }

    // 重新繪製星空（以符合新的視窗大小）
    if (typeof initStars === 'function') {
        initStars();
    }
});

// 立即執行一次自適應縮放（指令碼載入時立刻套用）
if (document.body) {
    applyAutoScaling();
} else {
    document.addEventListener('DOMContentLoaded', () => {
        applyAutoScaling();
    });
}