// 全局神级中间件：网页拦截 + 16路302弹射 + 全自动一年期授权计算 + 令牌锁 + 老客户兼容
export async function onRequest(context) {
    const request = context.request;
    const url = new URL(request.url);
    
    // 1. 获取特征
    const acceptHeader = request.headers.get("Accept") || "";
    const userAgent = request.headers.get("User-Agent") || "";

    // 2. 浏览器直接拦截，展示官方门面
    const isWebBrowser = acceptHeader.includes("text/html") || 
                        (userAgent.includes("Mozilla/") && !userAgent.includes("okhttp"));

    if (isWebBrowser) {
        url.pathname = "/index.html"; 
        return context.env.ASSETS.fetch(url);
    }

    // =================================================================
    // 👑 【老板唯一维护区：黑名单控制】
    // 👉 规则：因为现在是全自动计算一年期了，你不需要再每个月添加白名单！
    // 只有当某个月份被严重泄露时，你才把它填进 blacklist 里进行“人工封杀”。
    // 比如：const blacklist = ["202606"]; 
    // =================================================================
    const blacklist = [];

    // 提取客户端网址里携带的令牌
    let userToken = url.searchParams.get("token");

    // 💡【老客户兼容补丁】：为了今天已经发出去的 30 个客户，给他们自动打上 202607 标签。
    if (!userToken) {
        userToken = "202607";
    }

    // -----------------------------------------------------------------
    // 🧠 核心黑科技：【全自动时空算力引擎 (计算一年期)】
    // -----------------------------------------------------------------
    function isTokenValid(token) {
        if (!token || token.length !== 6) return false;
        if (blacklist.includes(token)) return false; // 命中黑名单，直接死刑

        const tokenYear = parseInt(token.substring(0, 4), 10);
        const tokenMonth = parseInt(token.substring(4, 6), 10);
        if (isNaN(tokenYear) || isNaN(tokenMonth)) return false;

        // 获取当前北京时间 (UTC+8) 的真实年月
        const now = new Date(new Date().getTime() + 8 * 60 * 60 * 1000);
        const currentYear = now.getUTCFullYear();
        const currentMonth = now.getUTCMonth() + 1; // 1-12

        // 把年月转换成“绝对月数”，方便做减法
        const tokenAbsolute = tokenYear * 12 + tokenMonth;
        const currentAbsolute = currentYear * 12 + currentMonth;

        const diff = currentAbsolute - tokenAbsolute;

        // 【安全规则 1：防白嫖猜未来】
        // diff < -1：这意味着允许你“提前1个月”发卡（比如现在6月，发7月卡 diff = -1，合法）。
        // 如果别人今天猜 202608 (diff = -2) 或者 202803，系统直接拦截！
        if (diff < -1) return false;

        // 【安全规则 2：满一年自动报废】
        // diff >= 12：比如房卡 202607，当前时间到了 202707。
        // 202707 - 202607 = 12。只要差值到达 12，瞬间自动断联报废！
        if (diff >= 12) return false;

        return true;
    }

    // 鉴定当前用户的令牌是否合法
    const hasValidAccess = isTokenValid(userToken);

    // -----------------------------------------------------------------
    // 核心安全机制一：底层主线文件的最高防线 (兼容 902.JSON 和 vip_core.json)
    // -----------------------------------------------------------------
    if (url.pathname.toUpperCase() === "/902.JSON" || url.pathname === "/vip_core.json") {
        if (hasValidAccess) {
            const secretUrl = new URL(request.url);
            secretUrl.pathname = "/902.JSON";
            return context.env.ASSETS.fetch(secretUrl);
        } else {
            return new Response(JSON.stringify({ "sites": [] }), {
                headers: { "Content-Type": "application/json;charset=UTF-8", "Access-Control-Allow-Origin": "*" }
            });
        }
    }

    // -----------------------------------------------------------------
    // 核心安全机制二：16路收集线的“带卡弹射”
    // -----------------------------------------------------------------
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
        if (hasValidAccess) {
            return Response.redirect(routes[url.pathname], 302);
        } else {
            return new Response(JSON.stringify({ "sites": [] }), {
                headers: { "Content-Type": "application/json;charset=UTF-8", "Access-Control-Allow-Origin": "*" }
            });
        }
    }

    // -----------------------------------------------------------------
    // 核心安全机制三：全自动多仓生成器（含准入判定）
    // -----------------------------------------------------------------
    const monthMatch = url.pathname.match(/^\/(\d{6})\.json$/);

    if (monthMatch) {
        const reqMonth = monthMatch[1]; 
        
        if (isTokenValid(reqMonth)) {
            const validConfig = {
                "urls": [
                    { "name": `💖 ${reqMonth} VIP专属主线 💖`, "url": `https://kyomomo.top/vip_core.json?token=${reqMonth}` },
                    { "name": "专业影音收集一", "url": `https://kyomomo.top/line1.json?token=${reqMonth}` },
                    { "name": "专业影音收集二", "url": `https://kyomomo.top/line2.json?token=${reqMonth}` },
                    { "name": "专业影音收集三", "url": `https://kyomomo.top/line3.json?token=${reqMonth}` },
                    { "name": "专业影音收集四", "url": `https://kyomomo.top/line4.json?token=${reqMonth}` },
                    { "name": "专业影音收集五", "url": `https://kyomomo.top/line5.json?token=${reqMonth}` },
                    { "name": "专业影音收集六", "url": `https://kyomomo.top/line6.json?token=${reqMonth}` },
                    { "name": "专业影音收集七", "url": `https://kyomomo.top/line7.json?token=${reqMonth}` },
                    { "name": "专业影音收集八", "url": `https://kyomomo.top/line8.json?token=${reqMonth}` },
                    { "name": "专业影音收集九", "url": `https://kyomomo.top/line9.json?token=${reqMonth}` },
                    { "name": "专业影音收集十", "url": `https://kyomomo.top/line10.json?token=${reqMonth}` },
                    { "name": "专业影音收集十一", "url": `https://kyomomo.top/line11.json?token=${reqMonth}` },
                    { "name": "专业影音收集十二", "url": `https://kyomomo.top/line12.json?token=${reqMonth}` },
                    { "name": "专业影音收集十三", "url": `https://kyomomo.top/line13.json?token=${reqMonth}` },
                    { "name": "专业影音收集十四", "url": `https://kyomomo.top/line14.json?token=${reqMonth}` },
                    { "name": "专业影音收集十五", "url": `https://kyomomo.top/line15.json?token=${reqMonth}` },
                    { "name": "专业影音收集十六", "url": `https://kyomomo.top/line16.json?token=${reqMonth}` }
                ]
            };
            return new Response(JSON.stringify(validConfig), {
                headers: { "Content-Type": "application/json;charset=UTF-8", "Access-Control-Allow-Origin": "*" }
            });
        } else {
            const expiredConfig = {
                "urls": [
                    { "name": `⚠️ 您的授权 [${reqMonth}] 已无效/未到发售期`, "url": "https://kyomomo.top/empty.json" },
                    { "name": "👉 请联系微信 xxxxx 购买/续费", "url": "https://kyomomo.top/empty.json" }
                ]
            };
            return new Response(JSON.stringify(expiredConfig), {
                headers: { "Content-Type": "application/json;charset=UTF-8", "Access-Control-Allow-Origin": "*" }
            });
        }
    }

    return context.next();
}
