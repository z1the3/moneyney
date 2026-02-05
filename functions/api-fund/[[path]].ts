/**
 * Cloudflare Pages Function: 代理天天基金接口
 * 路径: /api-fund/*
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

  // 获取路径参数，例如 /api-fund/js/001632.js → js/001632.js
  const path = params.path?.join("/") || "";

  if (!path) {
    return new Response("Missing path", { status: 400 });
  }

  const url = `https://fundgz.1234567.com.cn/${path}`;

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "*/*",
      },
    });

    const contentType =
      response.headers.get("content-type") ||
      "application/javascript; charset=utf-8";
    const body = await response.text();

    return new Response(body, {
      status: response.status,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Cache-Control": "public, max-age=300", // 缓存 5 分钟
      },
    });
  } catch (error) {
    console.error("Proxy fund error:", error);
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
