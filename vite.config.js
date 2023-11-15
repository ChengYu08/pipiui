import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import svgr from "vite-plugin-svgr";
import autoprefixer from "autoprefixer";
import postcssPxToViewport from "postcss-px-to-viewport-8-plugin";
import requireTransform from "vite-plugin-require-transform";
import legacy from "@vitejs/plugin-legacy";
import sassDts from "vite-plugin-sass-dts";


function resolve(name) {
  return path.join(__dirname, name);
}

export default defineConfig({
  resolve: {
    alias: {
      "@": resolve("./src"),
    },
    extensions: [".ts", ".tsx", ".jsx", ".js", ".json"],
  },
  css: {
    postcss: {
      plugins: [
        autoprefixer(),
        postcssPxToViewport({
          unitToConvert: "px",
          viewportWidth: 750,
          unitPrecision: 3,
          propList: ["*"],
          viewportUnit: "vw",
          fontViewportUnit: "vw",
          selectorBlackList: [],
          minPixelValue: 1,
          mediaQuery: false,
          replace: true,
          exclude: [/node_modules/,/^(?!.*h5)/],
          landscape: false,
        }),
      ],
    },
  },

  plugins: [
    sassDts(),
    legacy({
      targets: ["defaults", "not IE 11"],
    }),
    react(),
    svgr(),
    requireTransform({})
  ],
  build: {
    target: 'es2015',
    cssTarget: 'chrome80',
    minify: "terser", // 必须开启：使用terserOptions才有效果
    terserOptions: {
      compress: {
        keep_infinity: true,  // 防止 Infinity 被压缩成 1/0，这可能会导致 Chrome 上的性能问题
        drop_console: true,   // 生产环境去除 console
        drop_debugger: true   // 生产环境去除 debugger
      },
    },
    chunkSizeWarningLimit: 2000, // chunk 大小警告的限制（以 kbs 为单位）
    rollupOptions: {
      output: {// 分包
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
    
  }
});
