/**
 * API配置 - 根据环境自动检测后端URL
 */

// 获取后端API基础URL
export function getApiBaseUrl(): string {
  const isDev = import.meta.env.DEV;
  const hostname = window.location.hostname;
  const protocol = window.location.protocol;
  const port = window.location.port;

  console.log("[API Config] 环境检测:", {
    isDev,
    hostname,
    protocol,
    port,
    fullUrl: window.location.href,
  });

  // 如果在开发环境且是localhost，使用localhost:4000
  if (isDev && hostname === "localhost") {
    const url = "http://localhost:4000/api";
    console.log("[API Config] 使用本地开发URL:", url);
    return url;
  }

  // 如果是Clacky平台（*.clackypaas.com）
  if (hostname.includes("clackypaas.com")) {
    let backendUrl: string;

    // 如果是预览域名（包含-5173或preview）
    if (hostname.includes("-5173") || hostname.includes("preview")) {
      // 替换端口号：5173-xxx-web → 4000-xxx-web
      const newHostname = hostname.replace(/5173/g, "4000");
      backendUrl = `${protocol}//${newHostname}/api`;
    } else if (hostname.includes("-app")) {
      // 生产环境，使用同域名下的/api
      backendUrl = `${protocol}//${hostname}/api`;
    } else if (hostname.match(/^\d{4}-[a-f0-9]+-web/)) {
      // 匹配格式：5173-747747751f9f-web.clackypaas.com
      // 替换为：4000-747747751f9f-web.clackypaas.com
      const newHostname = hostname.replace(/^\d{4}/, "4000");
      backendUrl = `${protocol}//${newHostname}/api`;
    } else {
      // 其他情况，尝试添加-4000
      const baseDomain = hostname.split(".")[0];
      backendUrl = `${protocol}//${baseDomain}-4000.clackypaas.com/api`;
    }

    console.log("[API Config] 使用Clacky平台URL:", backendUrl);
    return backendUrl;
  }

  // 其他情况使用同源路径
  const url = "/api";
  console.log("[API Config] 使用相对路径URL:", url);
  return url;
}

export const API_BASE_URL = getApiBaseUrl();
