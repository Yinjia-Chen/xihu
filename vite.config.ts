import path from 'node:path'

// import { fileURLToPath, URL } from 'node:url'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    createSvgIconsPlugin({
      // Specify the icon folder to be cached
      // eslint-disable-next-line node/prefer-global/process
      iconDirs: [path.resolve(process.cwd(), 'src/assets/icons')],
      // Specify symbolId format
      symbolId: 'icon-[dir]-[name]',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      // '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },

  // scss全局变量配置
  css: {
    preprocessorOptions: {
      scss: {
        additionalData:
          '@import "@/styles/variable.scss";',
      },
    },
  },
})
