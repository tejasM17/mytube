const backendUrl = (process.env.NEXT_PUBLIC_BACKEND_URL || process.env.BACKEND_URL || "").replace(/\/$/, "");

export function mediaUrl(filepath) {
    if (!filepath) return "";
    return `${backendUrl}/${filepath.replace(/^\/+/, "")}`;
}
