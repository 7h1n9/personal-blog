import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/route-dist/',  // 注意：仓库名必须与你的 GitHub 仓库名称一致，以斜杠开头和结尾
})