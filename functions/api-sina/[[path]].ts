/**
 * Cloudflare Pages Function: 代理新浪行情接口
 * 路径: /api-sina/*
 */

interface Env {
  // 如果需要可以添加环境变量
}

export async function onRequest(context: {
  request: Request;
  env: Env;
  params: { path: string[] };
}) {
  const { request, params } = context;

  // 获取路径参数，例如 /api-sina/list=xxx → list=xxx
  const path = params.path?.join("/") || "";

  if (!path) {
    return new Response("Missing path", { status: 400 });
  }

  const url = `https://hq.sinajs.cn/${path}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Referer: "https://finance.sina.com.cn/",
        Accept: "*/*",
      },
    });

    // 获取原始响应内容
    const contentType =
      response.headers.get("content-type") || "text/plain; charset=gbk";
    const arrayBuffer = await response.arrayBuffer();

    // 返回响应，保留原始编码
    return new Response(arrayBuffer, {
      status: response.status,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Cache-Control": "public, max-age=60", // 缓存 60 秒
      },
    });
  } catch (error) {
    console.error("Proxy sina error:", error);
    return new Response(JSON.stringify({ error: "Proxy failed" }), {
      status: 502,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
}

// 处理 OPTIONS 预检请求
export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400",
    },
  });
}
