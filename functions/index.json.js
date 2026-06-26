// 这个脚本会在 Cloudflare 的全球边缘节点上运行
export async function onRequest(context) {
    const request = context.request;
    
    // 获取访问者的“身份特征”
    const acceptHeader = request.headers.get("Accept") || "";
    const userAgent = request.headers.get("User-Agent") || "";

    // 判断逻辑：如果对方明确要求看网页(text/html)，或者是常见的浏览器，且不是电视盒子常用的 okhttp 引擎
    const isWebBrowser = acceptHeader.includes("text/html") || 
                        (userAgent.includes("Mozilla/") && !userAgent.includes("okhttp"));

    if (isWebBrowser) {
        // 【如果是人在用浏览器访问】
        // 悄悄把请求指向 index.html（我们刚做好的漂亮网页），并返回网页画面
        const url = new URL(request.url);
        url.pathname = "/index.html"; 
        return context.env.ASSETS.fetch(url);
    }

    // 【如果是 TVBox 在访问】
    // 直接放行，返回纯正的 index.json 原始代码给电视盒子读取
    return context.next();
}
