// 终极安全版：防遍历暗号化 + 老板隐藏控制台(10年) + 全自动时空引擎 + 找回老客户保底补丁
export async function onRequest(context) {
    const request = context.request;
    const url = new URL(request.url);

    // =================================================================
    // 👑 【老板核心机密区】
    // =================================================================
    const SECRET_SALT = "MAX_YINGYIN_888999"; 
    const BOSS_PWD = "666"; 
    const blacklist = []; 

    function getSecureSuffix(monthStr) {
        let str = monthStr + SECRET_SALT;
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = ((hash << 5) - hash) + str.charCodeAt(i);
            hash = hash & hash; 
        }
        let suffix = Math.abs(hash).toString(36);
        while (suffix.length < 4) suffix = "0" + suffix;
        return suffix.substring(0, 4);
    }

    // =================================================================
    // 🖥️ 【老板专属后台】
    // =================================================================
    if (url.pathname.toLowerCase().replace(/\/$/, '') === "/boss888") {
        const pwd = url.searchParams.get("pwd");
        
        if (pwd !== BOSS_PWD) {
            return new Response(`
                <html>
                <head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
                <body style="background:#0a0a12;color:#fff;text-align:center;padding:20vh 20px;">
                    <h2>👑 老板安全验证</h2>
                    <script>
                        let p = prompt("请输入 MAX 影音核心控制台密码：");
                        if(p) window.location.href = "/boss888?pwd=" + p;
                    </script>
                </body></html>
            `, { headers: {"Content-Type": "text/html;charset=UTF-8"} });
        }

        let listHtml = "";
        const now = new Date(new Date().getTime() + 8 * 3600000); 
        let y = now.getUTCFullYear();
        let m = now.getUTCMonth() + 1;

        for(let i = 0; i < 120; i++) {
            let checkY = y + Math.floor((m - 1 + i) / 12);
            let checkM = ((m - 1 + i) % 12) + 1;
            
            let monthStr = checkY.toString() + (checkM < 10 ? "0" + checkM : checkM);
            let suffix = getSecureSuffix(monthStr);
            let finalUrl = `https://kyomomo.top/${monthStr}${suffix}.json`;
            
            listHtml += `
                <div style="background:#1c1c28; margin-bottom:15px; padding:15px; border-radius:10px; text-align:left;">
                    <span style="color:#8e8e9f; font-size:14px;">发给新客户 (${monthStr}) :</span><br>
                    <b style="color:#4cd964; font-size:16px; font-family:monospace; user-select:all;">${finalUrl}</b>
                </div>
            `;
        }

        return new Response(`
            <html>
            <head><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
            <body style="background:#0a0a12;color:#fff;text-align:center;padding:30px 15px;font-family:sans-serif;">
                <h2 style="margin-bottom:5px;">👑 MAX 影音发卡机</h2>
                <p style="color:#8e8e9f;font-size:13px;margin-bottom:30px;">（全自动加密版 · 动态生成未来10年）</p>
                ${listHtml}
                <div style="margin-top:40px; font-size:12px; color:#555;">点击网址可长按复制。绝密页面，请勿外传。</div>
            </body></html>
        `, { headers: {"Content-Type": "text/html;charset=UTF-8"} });
    }

    // -----------------------------------------------------------------
    // 日常拦截与验证逻辑
    // -----------------------------------------------------------------
    const acceptHeader = request.headers.get("Accept") || "";
    const userAgent = request.headers.get("User-Agent") || "";
    const isWebBrowser = acceptHeader.includes("text/html") || (userAgent.includes("Mozilla/") && !userAgent.includes("okhttp"));

    if (isWebBrowser) {
        url.pathname = "/index.html"; 
        return context.env.ASSETS.fetch(url);
    }

    // 提取令牌
    let userToken = url.searchParams.get("token");

    // =================================================================
    // 💡【核心修复：老客户免死金牌补丁】
    // 找回昨天漏掉的补丁：如果发现没带 token 来敲门，强行给他们贴上 202607 标签！
    // 这样那几个没换配置的旧客户，今晚就能正常使用了！
    // =================================================================
    if (!userToken) {
        userToken = "202607";
    }

    // -----------------------------------------------------------------
    // 🧠 全自动时空算力引擎
    // -----------------------------------------------------------------
    function isTokenValid(token) {
        if (!token) return false;
        if (blacklist.includes(token)) return false; 

        const tokenYear = parseInt(token.substring(0, 4), 10);
        const tokenMonth = parseInt(token.substring(4, 6), 10);
        if (isNaN(tokenYear) || isNaN(tokenMonth)) return false;

        const now = new Date(new Date().getTime() + 8 * 3600000);
        const currentYear = now.getUTCFullYear();
        const currentMonth = now.getUTCMonth() + 1; 

        const tokenAbsolute = tokenYear * 12 + tokenMonth;
        const currentAbsolute = currentYear * 12 + currentMonth;
        const diff = currentAbsolute - tokenAbsolute;

        if (diff < -1) return false; 
        if (diff >= 12) return false; 

        return true;
    }

    const hasValidAccess = isTokenValid(userToken);

    // 保护底层主线
    if (url.pathname.toUpperCase() === "/902.JSON") {
        if (hasValidAccess) return context.next();
        return new Response(JSON.stringify({ "sites": [] }), { headers: { "Content-Type": "application/json;charset=UTF-8", "Access-Control-Allow-Origin": "*" } });
    }

    // 16路隐形弹射
    const routes = {
        "/line1.json": "https://xn--ohqo134kjk7c.v.nxog.top/apitv.php?id=1",
        "/line2.json": "https://xn--ohqo134kjk7c.v.nxog.top/apitv.php?id=3",
        "/line3.json": "https://xn--ohqo134kjk7c.v.nxog.top/apitv.php?id=2",
        "/line4.json": "https://xn--ohqo134kjk7c.v.nxog.top/apitv.php?id=4",
        "/line5.json": "https://xn--ohqo134kjk7c.v.nxog.top/apitv.php?id=5",
        "/line6.json": "https://xn--ohqo134kjk7c.v.nxog.top/apitv.php?id=6",
        "/line7.json": "https://xn--ohqo134kjk7c.v.nxog.top/apitv.php?id=8",
        "/line8.json": "https://xn--ohqo134kjk7c.v.nxog.top/apitv.php?id=10",
        "/line9.json": "https://xn--ohqo134kjk7c.v.nxog.top/apitv.php?id=11",
        "/line10.json": "https://xn--ohqo134kjk7c.v.nxog.top/apitv.php?id=12",
        "/line11.json": "https://xn--ohqo134kjk7c.v.nxog.top/apitv.php?id=13",
        "/line12.json": "https://xn--ohqo134kjk7c.v.nxog.top/apitv.php?id=15",
        "/line13.json": "https://xn--ohqo134kjk7c.v.nxog.top/apitv.php?id=16",
        "/line14.json": "https://xn--ohqo134kjk7c.v.nxog.top/apitv.php?id=17",
        "/line15.json": "https://xn--ohqo134kjk7c.v.nxog.top/apitv.php?id=18",
        "/line16.json": "https://xn--ohqo134kjk7c.v.nxog.top/apitv.php?id=20"
    };

    if (routes[url.pathname]) {
        if (hasValidAccess) return Response.redirect(routes[url.pathname], 302);
        return new Response(JSON.stringify({ "sites": [] }), { headers: { "Content-Type": "application/json;charset=UTF-8", "Access-Control-Allow-Origin": "*" } });
    }

    // -----------------------------------------------------------------
    // 👑 自动生成多仓 
    // -----------------------------------------------------------------
    const secureMatch = url.pathname.match(/^\/(\d{6})([a-z0-9]{4})\.json$/);
    const oldMatch = url.pathname.match(/^\/(\d{6})\.json$/); 

    let reqMonth = null;
    let reqSuffix = null;
    let finalToken = null;
    let isRequestValid = false;

    if (secureMatch) {
        reqMonth = secureMatch[1]; 
        reqSuffix = secureMatch[2]; 
        
        if (reqSuffix === getSecureSuffix(reqMonth) && isTokenValid(reqMonth + reqSuffix)) {
            finalToken = reqMonth + reqSuffix; 
            isRequestValid = true;
        }
    } else if (oldMatch) {
        reqMonth = oldMatch[1];
        if ((reqMonth === "202606" || reqMonth === "202607") && isTokenValid(reqMonth)) {
            finalToken = reqMonth; 
            isRequestValid = true;
        }
    }

    if (reqMonth) {
        if (isRequestValid) {
            const validConfig = {
                "urls": [
                    { "name": `💖 ${reqMonth} VIP专属主线 💖`, "url": `https://kyomomo.top/902.JSON?token=${finalToken}` },
                    { "name": "专业影音收集一", "url": `https://kyomomo.top/line1.json?token=${finalToken}` },
                    { "name": "专业影音收集二", "url": `https://kyomomo.top/line2.json?token=${finalToken}` },
                    { "name": "专业影音收集三", "url": `https://kyomomo.top/line3.json?token=${finalToken}` },
                    { "name": "专业影音收集四", "url": `https://kyomomo.top/line4.json?token=${finalToken}` },
                    { "name": "专业影音收集五", "url": `https://kyomomo.top/line5.json?token=${finalToken}` },
                    { "name": "专业影音收集六", "url": `https://kyomomo.top/line6.json?token=${finalToken}` },
                    { "name": "专业影音收集七", "url": `https://kyomomo.top/line7.json?token=${finalToken}` },
                    { "name": "专业影音收集八", "url": `https://kyomomo.top/line8.json?token=${finalToken}` },
                    { "name": "专业影音收集九", "url": `https://kyomomo.top/line9.json?token=${finalToken}` },
                    { "name": "专业影音收集十", "url": `https://kyomomo.top/line10.json?token=${finalToken}` },
                    { "name": "专业影音收集十一", "url": `https://kyomomo.top/line11.json?token=${finalToken}` },
                    { "name": "专业影音收集十二", "url": `https://kyomomo.top/line12.json?token=${finalToken}` },
                    { "name": "专业影音收集十三", "url": `https://kyomomo.top/line13.json?token=${finalToken}` },
                    { "name": "专业影音收集十四", "url": `https://kyomomo.top/line14.json?token=${finalToken}` },
                    { "name": "专业影音收集十五", "url": `https://kyomomo.top/line15.json?token=${finalToken}` },
                    { "name": "专业影音收集十六", "url": `https://kyomomo.top/line16.json?token=${finalToken}` }
                ]
            };
            return new Response(JSON.stringify(validConfig), { headers: { "Content-Type": "application/json;charset=UTF-8", "Access-Control-Allow-Origin": "*" } });
        } else {
            const expiredConfig = {
                "urls": [
                    { "name": `⚠️ 您输入的授权配置不合法或已过期`, "url": "https://kyomomo.top/empty.json" },
                    { "name": "👉 请联系微信获取专属授权码", "url": "https://kyomomo.top/empty.json" }
                ]
            };
            return new Response(JSON.stringify(expiredConfig), { headers: { "Content-Type": "application/json;charset=UTF-8", "Access-Control-Allow-Origin": "*" } });
        }
    }

    return context.next();
}
