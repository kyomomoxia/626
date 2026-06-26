// 全局神级中间件：网页伪装拦截 + 16路302隐形弹射 + 按月全自动多仓白名单
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

    // 3. 【黑科技核心：302 隐形弹射】
    // 盒子访问 lineX.json 时，Cloudflare 不再亲自去抓数据，而是直接把盒子“弹射”给源站！
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
        // 302 重定向指令：让电视盒子的底层播放器自己去目标网址进货！
        return Response.redirect(routes[url.pathname], 302);
    }

    // 4. 按月动态白名单（老板每月维护区，目前只留6、7月）
    const activeMonths = ["202606", "202607"];

    const monthMatch = url.pathname.match(/^\/(\d{6})\.json$/);

    if (monthMatch) {
        const requestMonth = monthMatch[1]; 
        
        if (activeMonths.includes(requestMonth)) {
            const validConfig = {
                "urls": [
                    { "name": `💖 ${requestMonth} VIP专属主线 💖`, "url": "https://kyomomo.top/902.JSON" },
                    { "name": "专业影音收集一", "url": "https://kyomomo.top/line1.json" },
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
                headers: { "Content-Type": "application/json;charset=UTF-8" }
            });
        }
    }

    return context.next();
}
