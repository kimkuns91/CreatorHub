/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    env: {
        NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
        KAKAO_CLIENT_ID: process.env.KAKAO_CLIENT_ID,
        KAKAO_CLIENT_SECRET: process.env.KAKAO_CLIENT_SECRET,
    },
    // disableStaticImages: true,
    images: {
        disableStaticImages: true,
        remotePatterns: [{
                protocol: "http",
                hostname: "k.kakaocdn.net",
            },
            {
                protocol: "https",
                hostname: "rgvzlonuavmjvodmalpd.supabase.co",
                port: "",
                pathname: "/storage/v1/object/public/**",
            },
            {
                protocol: "https",
                hostname: "avatars.githubusercontent.com",
                port: "",
                pathname: "/u/**",
            },
            {
                protocol: "https",
                hostname: "aceternity.com",
            },
            {
                protocol: "https",
                hostname: "storage.googleapis.com",
                pathname: "/**",
            },
            {
                hostname: "loremflickr.com",
            },
            {
                hostname: "firebasestorage.googleapis.com",
            },
        ],
    },
};

export default nextConfig;