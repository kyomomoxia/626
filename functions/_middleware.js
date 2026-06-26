// 终极全局智能路由脚本：支持网页拦截 + 16路洗白安全代理 + 按月全自动多仓
export async function onRequest(context) {
    const request = context.request;
    const url = new URL(request.url);
    
    // 1. 获取访问者的“身份特征”
    const acceptHeader = request.headers.get("Accept") || "";
    const userAgent = request.headers.get("User-Agent") || "";

    // 2. 判断是不是人类用的手机/电脑浏览器
    const isWebBrowser = acceptHeader.includes("text/html") || 
                        (userAgent.includes("Mozilla/") && !userAgent.includes("okhttp"));

    if (isWebBrowser) {
        url.pathname = "/index.html"; 
        return context.env.ASSETS.fetch(url);
    }

    // 3. 【核心黑科技一：16路洗白隐形代理】
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
        "/line13.json": "https://xn--ohqo134kjk7c.v.nxog.top/apitv.php?id=16", // 已修复上一版AI手误多出的字
        "/line14.json": "https://xn--ohqo134kjk7c.v.nxog.top/apitv.php?id=17",
        "/line15.json": "https://xn--ohqo134kjk7c.v.nxog.top/apitv.php?id=18",
        "/line16.json": "https://xn--ohqo134kjk7c.v.nxog.top/apitv.php?id=20"
    };

    if (routes[url.pathname]) {
        const targetUrl = routes[url.pathname];
        try {
            // 【洗白核心技】绝对不能传原 request！
            // 剥离所有 Cloudflare 追踪头，只携带客户端的 User-Agent 重新发起纯净 GET
            const upstreamResp = await fetch(targetUrl, {
                method: "GET",
                headers: {
                    "User-Agent": request.headers.get("User-Agent") || "okhttp/4.12.0",
                    "Accept": "*/*"
                }
            });

            const content = await upstreamResp.text();
            
            // 拿到上游数据后，重新封包发给盒子，并强行贴上“允许跨域”标，防止播放器底层卡死
            return new Response(content, {
                status: upstreamResp.status,
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    "Access-Control-Allow-Origin": "*"
                }
            });
        } catch (err) {
            return new Response(JSON.stringify({ error: `上游源站连接超时: ${err.message}` }), { 
                status: 500,
                headers: { "Content-Type": "application/json;charset=UTF-8" }
            });
        }
    }

    // 4. 【核心黑科技二：按月动态多仓白名单】（切记目前只留6、7月）
    const activeMonths = ["202606", "202607"];

    const monthMatch = url.pathname.match(/^\/(\d{6})\.json$/);

    if (monthMatch) {
        const requestMonth = monthMatch[1]; 
        
        if (activeMonths.includes(requestMonth)) {
            const validConfig = {
                "urls": [
                    { "name": `💖 ${requestMonth} VIP专属主线 💖`, "url": "https://kyomomo.top/902.JSON" },
                    { "name": "专业影音收集一", "url": "https://kyomomo.联.top/line1.json" },
                    { "name": "专业影音收集二", "url": "https://kyomomo.top/line2.json" },
                    { "name": "专业影音收集三", "url": "https://kyomomo.top/line3.json" },
                    { "name": "专业影音收集四", "url": "https://kyomomo.top/line4.json" },
                    { "name": "专业影音收集五", "url": "https://kyomomo.top/line5.json" },
                    { "name": "专业影音收集六", "url": "https://kyomomo.top/line6.json" },
                    { "name": "专业影音收集七", "url": "https://kyomomo.top/line7.json" },
                    { "name": "专业影音收集八", "url": "https://kyomomo.top/line8.json" },
                    { "name": "专业影音收集九", "url": "https://kyomomo.top/line9.json" },
                    { "name": "专业影音收集十", "url": "https://kyomomo.top/line10.json" },
                    { "name": "专业影音收集十一", "url": "https://kyomomo.top/line11.json" },
                    { "name": "专业影音收集十二", "url": "https://kyomomo.top/line12.json" },
                    { "name": "专业影音收集十三", "url": "https://kyomomo.top/line13.json" },
                    { "name": "专业影音收集十四", "url": "https://kyomomo.top/line14.json" },
                    { "name": "专业影音收集十五", "url": "https://kyomomo.top/line15.json" },
                    { "name": "专业影音收集十六", "url": "https://kyomomo.top/line16.json" }
                ]
            };
            return new Response(JSON.stringify(validConfig), {
                headers: { 
                    "Content-Type": "application/json;charset=UTF-8",
                    "Access-Control-Allow-Origin": "*"
                }
            });
        } else {
            const expiredConfig = {
                "urls": [
                    { "name": `⚠️ 您的 ${requestMonth} 授权已过期！`, "url": "https://kyomomo.top/empty.json" },
                    { "name": "👉 请联系微信 xxxxx 续费获取新授权地址", "url": "https://kyomomo.top/empty.json" }
                ]
            };
            return new Response(JSON.stringify(expiredConfig), {
                headers: { 
                    "Content-Type": "application/json;charset=UTF-8",
                    "Access-Control-Allow-Origin": "*"
                }
            });
        }
    }

    return context.next();
}
