import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import commonjs from "@rollup/plugin-commonjs"; // 让vite打包支持common.js语法
import AutoImport from "unplugin-auto-import/vite"; // 自动导入组件
import Components from "unplugin-vue-components/vite"; // 自动导入src/components下的组件
import { ElementPlusResolver } from "unplugin-vue-components/resolvers"; // 按需导入ep
import viteCompression from "vite-plugin-compression"; // gzip压缩
import { resolve } from "path";
import requireTransform from "vite-plugin-require-transform"; // 支持require
import { createSvgIconsPlugin } from "vite-plugin-svg-icons"; // 支持svg

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  root: process.cwd(), // 绝对路径
  resolve: {
    // 配置路径别名
    alias: [
      // 配置 @ 指代 src
      {
        find: "@",
        replacement: resolve(__dirname, "./src"),
      },
    ],
    extensions: [".js", ".vue", ".json"],
  },
  // 按需导入element-plus main.js里不需要再引入了
  plugins: [
    vue(),
    commonjs(),
    // 自动导入element plus组件
    AutoImport({
      resolvers: [ElementPlusResolver()],
    }),
    Components({
      dts: true,
      dirs: "src/components",
      resolvers: [ElementPlusResolver()], // ElementPlus按需加载
    }),
    viteCompression({
      verbose: true, // 默认即可
      disable: false, //开启压缩(不禁用)，默认即可
      deleteOriginFile: false, //删除源文件
      threshold: 10240, //压缩前最小文件大小
      algorithm: "gzip", //压缩算法
      ext: ".gz", //文件类型
    }),
    // 让vite支持require
    requireTransform({
      fileRegex: /.js$|.vue$/,
    }),
    // svg
    createSvgIconsPlugin({
      // Specify the icon folder to be cached
      iconDirs: [resolve(process.cwd(), "src/icons/svg")],
    }),
  ],
  css: {
    preprocessorOptions: {
      // 引入全局scss
      scss: {
        additionalData: `@import "./src/styles/base.scss";`,
      },
    },
  },
  server: {
    port: 8080,
    host: "0.0.0.0",
    https: false,
    open: true,
    // 热更新
    hmr: {
      overlay: false,
    },
    proxy: {
      // 本地后端代理
      "/api": {
        //要访问的跨域的域名
        target: "http://localhost:8888",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
      // minio 代理
      "/blog-images": {
        target: "http://mrzym.top:9000/blog-images",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/blog-images/, ""),
      },
      "/wapi": {
        // 网易云的音乐代理
        target: "http://mrzym.top:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/wapi/, ""),
      },
    },
  },
  // 打包输出
  build: {
    sourcemap: false,
    // 消除打包大小超过500kb警告
    chunkSizeWarningLimit: 4000,
    rollupOptions: {
      input: {
        index: resolve("index.html"),
      },
      // 静态资源分类打包
      output: {
        chunkFileNames: "static/js/[name]-[hash].js",
        entryFileNames: "static/js/[name]-[hash].js",
        assetFileNames: "static/[ext]/[name]-[hash].[ext]",
      },
    },
  },
});
