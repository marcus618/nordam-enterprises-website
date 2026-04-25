import { renderers } from './renderers.mjs';
import { c as createExports } from './chunks/entrypoint_DF2FnWPT.mjs';
import { manifest } from './manifest_Cb_jDRz8.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/about.astro.mjs');
const _page2 = () => import('./pages/admin/_collection_/edit/_slug_.astro.mjs');
const _page3 = () => import('./pages/admin/_collection_/new.astro.mjs');
const _page4 = () => import('./pages/admin/_collection_.astro.mjs');
const _page5 = () => import('./pages/admin.astro.mjs');
const _page6 = () => import('./pages/api/admin/delete.astro.mjs');
const _page7 = () => import('./pages/api/admin/save.astro.mjs');
const _page8 = () => import('./pages/api/admin/upload.astro.mjs');
const _page9 = () => import('./pages/api/auth/callback.astro.mjs');
const _page10 = () => import('./pages/api/auth/login.astro.mjs');
const _page11 = () => import('./pages/api/auth/logout.astro.mjs');
const _page12 = () => import('./pages/products.astro.mjs');
const _page13 = () => import('./pages/services.astro.mjs');
const _page14 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/about.astro", _page1],
    ["src/pages/admin/[collection]/edit/[slug].astro", _page2],
    ["src/pages/admin/[collection]/new.astro", _page3],
    ["src/pages/admin/[collection]/index.astro", _page4],
    ["src/pages/admin/index.astro", _page5],
    ["src/pages/api/admin/delete.ts", _page6],
    ["src/pages/api/admin/save.ts", _page7],
    ["src/pages/api/admin/upload.ts", _page8],
    ["src/pages/api/auth/callback.ts", _page9],
    ["src/pages/api/auth/login.ts", _page10],
    ["src/pages/api/auth/logout.ts", _page11],
    ["src/pages/products.astro", _page12],
    ["src/pages/services.astro", _page13],
    ["src/pages/index.astro", _page14]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./_noop-actions.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "b3c463dd-476f-48af-9877-5e44d3e1d440",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;

export { __astrojsSsrVirtualEntry as default, pageMap };
