// 终极全局智能路由脚本：支持网页拦截 + 16路隐形代理 + 按月全自动多仓生成
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
        // 如果是浏览器访问，管他敲的是 202607.json 还是 202708.json，统统给他展示高大上的引导网页！
        url.pathname = "/index.html"; 
        return context.env.ASSETS.fetch(url);
    }

    // 3. 【核心黑科技一：16路隐形代理】
    // 别人家的接口被你封装成了自己的域名！源挂了你只需要在这里修改网址，用户端全自动复活。
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
        "/line13.json": "https://xn--ohqo134kjk的.v.nxog.top/apitv.php?id=16",
        "/line14.json": "https://xn--ohqo134kjk7c.v.nxog.top/apitv.php?id=17",
        "/line15.json": "https://xn--ohqo134kjk7c.v.nxog.top/apitv.php?id=18",
        "/line16.json": "https://xn--ohqo134kjk7c.v.nxog.top/apitv.php?id=20"
    };

    // 如果用户在盒子里点击了“收集一”（即访问了 line1.json）
    if (routes[url.pathname]) {
        return fetch(routes[url.pathname], request); 
    }

    // 4. 【核心黑科技二：按月全自动动态授权多仓】
    // 👉 以后你只需要维护这个列表！写在这里的年月就有效。
    // 比如 7 月到期了，你把 "202607" 删掉保存，7月的盒子就会立刻断开并提示联系续费！
const activeMonths = [
        "202607", "202608"
    ];

    // 自动抓取用户填写的网址里的月份，比如从 "/202607.json" 提取出 "202607"
    const monthMatch = url.pathname.match(/^\/(\d{6})\.json$/);

    if (monthMatch) {
        const requestMonth = monthMatch[1]; 
        
        // 如果客户填写的月份在上面的白名单列表里（有效授权）
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
            // 如果客户填写的月份不在列表里（判定为过期）
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

    // 5. 正常的底层访问（比如读取底层主文件 902.JSON），直接放行
    return context.next();
}
