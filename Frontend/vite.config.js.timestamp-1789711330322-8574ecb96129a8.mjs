// vite.config.js
import { defineConfig } from "file:///D:/Dairy%20Yatra%20Web/Dairy%20Yatra/node_modules/vite/dist/node/index.js";
import react from "file:///D:/Dairy%20Yatra%20Web/Dairy%20Yatra/node_modules/@vitejs/plugin-react/dist/index.js";
import path from "path";
var __vite_injected_original_dirname = "D:\\Dairy Yatra Web\\Dairy Yatra";
var vite_config_default = defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__vite_injected_original_dirname, "./src")
    }
  },
  server: {
    port: 3e3,
    host: true,
    watch: {
      ignored: [
        "**/Images/**",
        "**/Bg videos/**",
        "**/Knowledge Institute logo/**",
        "**/partners logo/**",
        "**/public/**",
        "**/.git/**",
        "**/*.jpeg",
        "**/*.jpg",
        "**/*.png",
        "**/*.webp",
        "**/*.svg",
        "**/*.mp4",
        "**/*.pdf",
        "**/*.zip"
      ]
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxEYWlyeSBZYXRyYSBXZWJcXFxcRGFpcnkgWWF0cmFcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXERhaXJ5IFlhdHJhIFdlYlxcXFxEYWlyeSBZYXRyYVxcXFx2aXRlLmNvbmZpZy5qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovRGFpcnklMjBZYXRyYSUyMFdlYi9EYWlyeSUyMFlhdHJhL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSdcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcbmltcG9ydCBwYXRoIGZyb20gJ3BhdGgnXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbcmVhY3QoKV0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcbiAgICB9LFxuICB9LFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiAzMDAwLFxuICAgIGhvc3Q6IHRydWUsXG4gICAgd2F0Y2g6IHtcbiAgICAgIGlnbm9yZWQ6IFtcbiAgICAgICAgJyoqL0ltYWdlcy8qKicsXG4gICAgICAgICcqKi9CZyB2aWRlb3MvKionLFxuICAgICAgICAnKiovS25vd2xlZGdlIEluc3RpdHV0ZSBsb2dvLyoqJyxcbiAgICAgICAgJyoqL3BhcnRuZXJzIGxvZ28vKionLFxuICAgICAgICAnKiovcHVibGljLyoqJyxcbiAgICAgICAgJyoqLy5naXQvKionLFxuICAgICAgICAnKiovKi5qcGVnJyxcbiAgICAgICAgJyoqLyouanBnJyxcbiAgICAgICAgJyoqLyoucG5nJyxcbiAgICAgICAgJyoqLyoud2VicCcsXG4gICAgICAgICcqKi8qLnN2ZycsXG4gICAgICAgICcqKi8qLm1wNCcsXG4gICAgICAgICcqKi8qLnBkZicsXG4gICAgICAgICcqKi8qLnppcCdcbiAgICAgIF1cbiAgICB9XG4gIH1cbn0pXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQXdSLFNBQVMsb0JBQW9CO0FBQ3JULE9BQU8sV0FBVztBQUNsQixPQUFPLFVBQVU7QUFGakIsSUFBTSxtQ0FBbUM7QUFLekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUyxDQUFDLE1BQU0sQ0FBQztBQUFBLEVBQ2pCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE9BQU87QUFBQSxNQUNMLFNBQVM7QUFBQSxRQUNQO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsUUFDQTtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGLENBQUM7IiwKICAibmFtZXMiOiBbXQp9Cg==
