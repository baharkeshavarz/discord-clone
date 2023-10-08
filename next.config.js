/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config) => {
        config.externals.push({
            "utf-8-validate": "commonjs utf-8-validate",
            bufferutil: "commonjs bufferutil"
        })

        return config;
    },
    // This means that when Webpack encounters these dependencies, it will not try to bundle them, but instead, it will expect them to be provided by the environment.
    // In summary, this code is configuring Webpack to treat "utf-8-validate" and "bufferutil" as external dependencies
    // and expect them to be available in the environment where your Next.js app is running.
    images: {
        domains: [
            "uploadthing.com",
            "utfs.io",
            "img.clerk.com"
        ]
    }
}

module.exports = nextConfig
