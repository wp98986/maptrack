import { defineConfig } from 'umi';

// const { PUBLic_PATH = './' } = process.env;

export default defineConfig({
  // chainWebpack(memo, { env, webpack }) {
  //   env === 'development'
  //     ? memo
  //         .plugin('open-browser-webpack-plugin')
  //         .use('open-browser-webpack-plugin', [
  //           { url: 'http://localhost:8000' },
  //         ])
  //     : ''; // 此处URL与项目启动的URL保持一致
  // },
  nodeModulesTransform: {
    type: 'none',
  },
  routes: [{ path: '/', component: '@/pages/index' }],
  fastRefresh: {},
  publicPath: './',
  history: {
    type: 'hash',
  },
  hash: true,
  // base: PUBLic_PATH,
});
