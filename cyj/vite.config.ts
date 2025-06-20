import path from 'node:path'
import process from 'node:process'
// import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig, loadEnv } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // 获取各种环境下对应的变量
  const env = loadEnv(mode, process.cwd())
  return {
    plugins: [
      vue(),
      createSvgIconsPlugin({
        // Specify the icon folder to be cached

        iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
        // Specify symbolId format
        symbolId: 'icon-[dir]-[name]',
      }),
    ],
    resolve: {
      alias: {
        '@': path.resolve('./src'),
        // '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },

    // scss全局变量配置
    css: {
      preprocessorOptions: {
        scss: {
          additionalData:
            '@import "@/styles/variable.scss";@import "@/styles/mixin.scss";',
        },
      },
    },
    server: {
      proxy: {
        // 开发环境代理
        [env.VITE_APP_BASE_API]: {
          target: env.VITE_SERVE,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api/, ''),
        },
      },
    },

    // 打包配置采用相对路径
    base: './',
  }
})
