// ============================================================
// 星空背景 & 流星
// ============================================================

// 星星陣列：存放所有靜態星星
let stars = [];

// 流星陣列：存放所有飛行中的流星
let meteors = [];

// 初始化星空：設定畫布大小、生成星星和流星
function initStars() {
    const c = document.getElementById('starsCanvas');
    c.width = window.innerWidth;
    c.height = window.innerHeight;
    document.getElementById('effectCanvas').width = c.width;
    document.getElementById('effectCanvas').height = c.height;

    stars = [];
    meteors = [];

    // 隨機生成 150 顆靜態星星（位置、大小、透明度隨機）
    for (let i = 0; i < 150; i++) {
        stars.push({
            x: Math.random() * c.width,
            y: Math.random() * c.height,
            size: Math.random() * 1.5 + 0.5,
            opacity: Math.random() * 0.5 + 0.1
        });
    }

    // 初始生成 8 顆流星
    for (let i = 0; i < 8; i++) {
        createMeteor();
    }
}

// 生成一顆新流星：從左上區域往右下飛行
function createMeteor() {
    const c = document.getElementById('starsCanvas');
    meteors.push({
        x: Math.random() * c.width * 0.3,                    // 起始 X（左側區域）
        y: Math.random() * c.height * 0.7 + c.height * 0.3,  // 起始 Y（中下區域）
        length: Math.random() * 60 + 40,                      // 尾巴長度
        speedX: Math.random() * 3 + 2,                        // 水平速度
        speedY: -(Math.random() * 2 + 1.5),                   // 垂直速度（向上）
        opacity: Math.random() * 0.4 + 0.2,                   // 透明度
        size: Math.random() * 1.5 + 1,                        // 粗細
        active: true                                          // 是否活躍
    });
}

// 每幀繪製星空背景 & 流星
function drawStars() { 
    const ctx = document.getElementById('starsCanvas').getContext('2d');
    if (!ctx) return;

    // 清除畫布
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    ctx.globalAlpha = 1;

    // 繪製所有靜態星星
    stars.forEach(s => { 
        ctx.beginPath(); 
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${s.opacity})`;
        ctx.fill(); 
    });

    // 繪製所有活躍的流星
    for (let i = 0; i < meteors.length; i++) {
        const m = meteors[i];
        if (!m.active) continue;

        // 計算流星尾巴的起點和終點
        const angle = Math.atan2(m.speedY, m.speedX);
        const tailX = m.x - Math.cos(angle) * m.length;
        const tailY = m.y - Math.sin(angle) * m.length;

        // 建立漸層：頭部亮、尾部透明
        const gradient = ctx.createLinearGradient(m.x, m.y, tailX, tailY);
        gradient.addColorStop(0, `rgba(255, 235, 150, ${m.opacity * 0.5})`);
        gradient.addColorStop(0.3, `rgba(255, 220, 100, ${m.opacity * 0.3})`);
        gradient.addColorStop(1, `rgba(255, 200, 50, 0)`);

        // 繪製流星線條
        ctx.beginPath();
        ctx.moveTo(m.x, m.y);
        ctx.lineTo(tailX, tailY);
        ctx.lineWidth = m.size;
        ctx.strokeStyle = gradient;
        ctx.stroke();

        // 繪製流星頭部光點
        ctx.beginPath();
        ctx.arc(m.x, m.y, m.size * 1.2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 235, 150, ${m.opacity})`;
        ctx.fill();

        // 更新流星位置
        m.x += m.speedX;
        m.y += m.speedY;

        // 流星飛出畫面外時，重置到起始位置
        if (m.x > window.innerWidth + 200 || m.y < -200) {
            m.x = -150;
m.y = Math.random() * window.innerHeight;
            m.speedX = Math.random() * 3 + 2;
            m.speedY = -(Math.random() * 2 + 1.5);
            m.opacity = Math.random() * 0.4 + 0.2;
            m.length = Math.random() * 60 + 40;
        }
    }

    // 下一幀繼續動畫
    requestAnimationFrame(drawStars);
}