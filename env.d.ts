interface Env {
    readonly VITE_BACKEND_URL: string;
}

interface ImportMeta {
    readonly env: Env;
}
