import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    /* config options here */
    devIndicators: false,
    async rewrites() {
        return [
            {
                source: "/api/:path*",
                destination:
                    "https://frontend-test-be.stage.thinkeasy.cz/:path*",
            },
        ];
    },
};

export default nextConfig;
