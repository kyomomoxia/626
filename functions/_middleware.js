// 这是一个全局中间件脚本，无论用户访问你的 07.json 还是 08.json 都会先经过这里
export async function onRequest(context) {
    const request = context.request;
    
    // 获取访问者的“身份特征”
    const acceptHeader = request.headers.get("Accept") || "";
    const userAgent = request.headers.get("User-Agent") || "";

    // 判断是不是人类用的浏览器
    const isWebBrowser = acceptHeader.includes("text/html") || 
                        (userAgent.includes("Mozilla/") && !userAgent.includes("okhttp"));

    if (isWebBrowser) {
        // 如果是浏览器访问，悄悄拦截，强制返回你漂亮的 index.html 网页
        const url = new URL(request.url);
        url.pathname = "/index.html"; 
        return context.env.ASSETS.fetch(url);
    }

    // 如果是电视盒子（TVBox）访问，直接放行，把 07.json 或 08.json 的代码发给它
    return context.next();
}
