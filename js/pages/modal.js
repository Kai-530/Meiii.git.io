// ============================================================
// 彈窗系統
// ============================================================

// t = 彈窗標題，b = 彈窗內容（HTML）
function pop(t, b) { 
    // 設定標題
    document.getElementById('mTitle').innerText = t; 

    // 設定內容
    document.getElementById('mBody').innerHTML = b; 

    // 設定確認按鈕（點擊關閉彈窗）
    document.getElementById('modalBtnArea').innerHTML = `<button class="btn-main" onclick="document.getElementById('modal').style.display='none'">確認</button>`; 

    // 顯示彈窗
    document.getElementById('modal').style.display = 'flex'; 
}