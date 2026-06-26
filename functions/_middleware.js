// 这是一个全局中间件脚本，不仅拦截浏览器访问，还能作为“隐形代理”控制你的收集线路
export async function onRequest(context) {
    const request = context.request;
    const url = new URL(request.url);
    
    // 1. 获取访问者的“身份特征”
    const acceptHeader = request.headers.get("Accept") || "";
    const userAgent = request.headers.get("User-Agent") || "";

    // 2. 判断是不是人类用的浏览器
    const isWebBrowser = acceptHeader.includes("text/html") || 
                        (userAgent.includes("Mozilla/") && !userAgent.includes("okhttp"));

    if (isWebBrowser) {
        // 如果是浏览器访问，悄悄拦截，强制返回你漂亮的 index.html 网页
        url.pathname = "/index.html"; 
        return context.env.ASSETS.fetch(url);
    }

    // 3. 【核心黑科技：隐形代理】在这里配置你的 16 个收集线路！
    // 这样不仅实现了“全部变更为自己可控的域名”，而且你根本不需要在 GitHub 建 16 个文件。
    // 每个月如果源失效了，你只需要在这个脚本里改后面的网址就行！
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

    // 如果用户在电视盒子里点击了“收集一”（即请求了 line1.json）
    if (routes[url.pathname]) {
        const targetUrl = routes[url.pathname];
        // Cloudflare 会在后台悄悄去目标网址抓取数据，然后完美地用 kyomomo.top 返回给用户
        return fetch(targetUrl, request); 
    }

    // 4. 如果是正常的访问（比如请求 07.json 或者是你的主线 902.JSON），直接放行
    return context.next();
}
