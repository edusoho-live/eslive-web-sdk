import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';
import del from 'rollup-plugin-delete';
import typescript from '@rollup/plugin-typescript';
import { babel } from '@rollup/plugin-babel';
import dts from "rollup-plugin-dts";
import replace from 'rollup-plugin-replace';

export default [
    // browser-friendly UMD build
    {
        input: 'src/index.ts',
        output: {
            name: 'ESLiveWebSDK',
            file: pkg.browser,
            format: 'umd',
            sourcemap: true,
        },
        plugins: [
            del({
                targets: ['dist/*'],
                runOnce: true,
            }),
            typescript({ tsconfig: './tsconfig.json' }),
            resolve(), // so Rollup can find `ms`
            commonjs(), // so Rollup can convert `ms` to an ES module
            babel({
                babelHelpers: 'runtime',
                babelrc: false,
                presets: [
                    ['@babel/preset-env', { modules: false }]
                ],
                plugins: [
                    ["@babel/plugin-transform-runtime"]
                ]
            }),
            replace({
                'process.env.NODE_ENV': JSON.stringify( 'production' )
            }),
        ]
    },

    // CommonJS (for Node) and ES module (for bundlers) build.
    // (We could have three entries in the configuration array
    // instead of two, but it's quicker to generate multiple
    // builds from a single configuration where possible, using
    // an array for the `output` option, where we can specify
    // `file` and `format` for each target)
    {
        input: 'src/index.ts',
        output: [
            { file: pkg.main, format: 'cjs', exports: 'default', sourcemap: true, },
            { file: pkg.module, format: 'es', sourcemap: true, }
        ],
        plugins: [
            typescript({ tsconfig: './tsconfig.json' }),
        ]
    },
    {
        input: "dist/types/index.d.ts",
        output: [{ file: pkg.typings, format: "es" }],
        plugins: [dts()],
    },
];
