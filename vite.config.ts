import { defineConfig } from 'vite'
import dts from "vite-plugin-dts";
import * as path from "node:path";

// https://vite.dev/config/
export default defineConfig({
    server: {
        port: 5173,
    },
    build: {
        lib: {
            entry: path.resolve(__dirname, "src/main.ts"),
            name: 'ESLiveWebSDK',
            fileName: 'eslive-web-sdk',
        },
        rollupOptions: {
        }
    },
    define: {
        'process.env.NODE_ENV': JSON.stringify('production'),
    },
    plugins: [
        dts({
            tsconfigPath: './tsconfig.json',
            rollupTypes: true,
        }),
    ],
    resolve: {
        alias: {
        }
    }
})
