// ==UserScript==
// @name         搜索导航增强
// @namespace    https://rensr.site
// @version      0.2
// @description  在百度/必应搜索页面右侧添加快捷导航
// @author       任尚仁
// @match        *://*.baidu.com/*
// @match        *://cn.bing.com/*
// @require      https://cdn.jsdelivr.net/npm/gbk.js@0.3.0/dist/gbk.js
// @require      https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加 jQuery
    const dom = {};
    dom.query = jQuery.noConflict(true);

    // 创建导航数据
    const getNavigationData = function() {
        return [
            {"name":"资源搜索","list":[
                {"name":"书签搜索", "url":"https://www.bookmarkearth.com/s/search?q=@@&currentPage=1"},
                {"name":"网盘搜索", "url":"https://www.dashengpan.com/#/main/search?keyword=@@&restype=1"},
                {"name":"财经搜索", "url":"https://www.shaduizi.com/s/search?q=@@&currentPage=1"},
                {"name":"百度百科", "url":"https://baike.baidu.com/item/@@"},
                {"name":"知乎搜索", "url":"https://www.zhihu.com/search?type=content&q=@@"},
                {"name":"B站搜索", "url":"https://search.bilibili.com/all?keyword=@@&from_source=webtop_search&spm_id_from=333.851"},
                {"name":"抖音搜索", "url":"https://www.douyin.com/search/@@?aid=0a9fc74b-01e8-4fb0-9509-307c5c07fda1&publish_time=0&sort_type=0&source=normal_search&type=general"},
                {"name":"搜狗|公众号", "url":"https://weixin.sogou.com/weixin?type=2&query=@@"},
                {"name":"搜狗|知乎", "url":"https://www.sogou.com/sogou?pid=sogou-wsse-ff111e4a5406ed40&insite=zhihu.com&ie=utf8&p=73351201&query=@@"},
                {"name":"豆瓣搜索", "url":"https://www.douban.com/search?q=@@"},
                {"name":"555电影", "url":"https://www.wuwuland.life/vodsearch/-------------.html?wd=@@"},
                {"name":"7080影院", "url":"https://7080.wang/so.html?mode=search&wd=@@"},
                {"name":"短剧网", "url":"http://www.xhzhicaoge.com/vodsearch/-------------/?wd=@@&submit="},
                {"name":"源仓库", "url":"https://www.yckceo.com/yuedu/shuyuan/index.html?keys=@@&uid=&order1=time&order2=1"},
                {"name":"维基百科", "url":"https://en.wikipedia.org/w/index.php?search=@@"},
                {"name":"法律法规", "url":"https://www.pkulaw.com/law/chl?Keywords=@@"},
                {"name":"PPT搜索", "url":"https://www.1ppt.com/plus/so.php?kwtype=0&q=@@", "useGBKEscape": true},
                {"name":"icon搜索", "url":"https://www.iconfont.cn/search/index?searchType=icon&q=@@"},
                {"name":"GitHub", "url":"https://github.com/search?q=@@"},
                {"name":"CSDN", "url":"https://so.csdn.net/so/search?q=@@&t=&u="},
                {"name":"ChatGPT", "url":"https://chat18.aichatos10.com/"}
            ]},
            {"name":"搜索引擎","list":[
                {"name":"百度", "url":"https://www.baidu.com/s?wd=@@"},
                {"name":"必应", "url":"https://cn.bing.com/search?q=@@"},
                {"name":"Google", "url":"https://www.google.com/search?q=@@"},
                {"name":"360搜索", "url":"https://www.so.com/s?ie=utf-8&fr=none&src=360sou_newhome&nlpv=basest&q=@@"},
                {"name":"搜狗", "url":"https://www.sogou.com/web?query=@@"},
                {"name":"头条搜索", "url":"https://so.toutiao.com/search?dvpf=pc&source=input&keyword=@@"}
            ]}
        ];
    };

    // 获取当前搜索词
    function getCurrentSearchQuery() {
        if (location.hostname === 'www.baidu.com') {
            return document.querySelector('#kw')?.value || '';
        } else if (location.hostname === 'cn.bing.com') {
            return document.querySelector('#sb_form_q')?.value || '';
        }
        return '';
    }

    // 在 createNavigationPanel 函数外创建一个缓存的面板
    let cachedPanel = null;

    // 创建导航面板
    function createNavigationPanel() {
        // 如果已经有缓存的面板，直接返回
        if (cachedPanel) {
            return cachedPanel;
        }

        const panel = document.createElement('div');
        panel.className = 'cr-content new-pmd navigation-panel';
        panel.style.cssText = `
            margin-bottom: 20px;
        `;

        // 创建内容
        const content = document.createElement('div');
        content.style.cssText = `
            background: white;
            border-radius: 12px;
            padding: 16px;
        `;

        // 添加提示文字
        const disclaimer = document.createElement('div');
        disclaimer.textContent = '⚠请谨慎对待跳转链接后的广告内容';
        disclaimer.style.cssText = `
            font-size: 12px;
            color: #ff0000; /* 红色字体 */
            margin-bottom: 12px;
        `;
        content.appendChild(disclaimer);

        const navigationData = getNavigationData();

        navigationData.forEach(category => {
            // 创建分类标题
            const categoryTitle = document.createElement('div');
            categoryTitle.textContent = category.name;
            categoryTitle.style.cssText = `
                font-size: 14px;
                color: #222;
                font-weight: bold;
                margin: 8px 0;
                padding-left: 4px;
            `;
            content.appendChild(categoryTitle);

            // 创建链接容器
            const linkContainer = document.createElement('div');
            linkContainer.style.cssText = `
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 8px;
                margin-bottom: 12px;
            `;

            // 创建链接列
            category.list.forEach(item => {
                const link = document.createElement('a');
                link.textContent = item.name;
                link.href = 'javascript:void(0);';
                link.style.cssText = `
                    display: block;
                    padding: 6px 4px;
                    color: #2440b3;
                    text-decoration: none;
                    font-size: 13px;
                    text-align: center;
                    background: #f5f5f6;
                    border-radius: 6px;
                    transition: all 0.3s;
                `;

                // 添加悬停效果
                link.addEventListener('mouseover', () => {
                    link.style.background = '#f0f0f1';
                });
                link.addEventListener('mouseout', () => {
                    link.style.background = '#f5f5f6';
                });

                link.addEventListener('click', () => {
                    const searchQuery = getCurrentSearchQuery();
                    if (searchQuery) {
                        if (item.useGBKEscape) {
                            const encodedQuery = GBK.encode(searchQuery).map(byte =>
                                '%' + byte.toString(16).toUpperCase().padStart(2, '0')
                            ).join('');
                            const url = item.url.replace('@@', encodedQuery);
                            window.open(url, '_blank');
                        } else {
                            const url = item.url.replace('@@', encodeURIComponent(searchQuery));
                            window.open(url, '_blank');
                        }
                    }
                });

                linkContainer.appendChild(link);
            });

            content.appendChild(linkContainer);
        });

        panel.appendChild(content);

        // 缓存创建好的面板
        cachedPanel = panel;
        return panel;
    }

    // 优化插入逻辑
    function insertPanel() {
        if (location.hostname === 'www.baidu.com') {
            let retryCount = 0;
            const maxRetries = 10;

            const tryInsertBaidu = () => {
                // 检查面板是否已存在且可见
                const existingPanel = document.querySelector('.navigation-panel');
                if (existingPanel && existingPanel.offsetParent !== null) {
                    return; // 如果面板存在且可见，直接返回
                }

                retryCount++;
                const contentRight = document.querySelector('#content_right') ||
                                   document.querySelector('.c-container.wrapper_new');

                if (!contentRight) {
                    if (retryCount < maxRetries) {
                        setTimeout(tryInsertBaidu, 500);
                    }
                    return;
                }

                try {
                    // 只在面板不存在时创建并插入
                    if (!document.querySelector('.navigation-panel')) {
                        const panel = createNavigationPanel();
                        contentRight.insertBefore(panel, contentRight.firstChild);
                    }
                } catch (e) {
                    console.error('插入导航面板时出错:', e);
                }
            };

            // 初始插入
            tryInsertBaidu();

            // 只在滚动停止时检查一次
            let scrollTimeout;
            const handleScroll = () => {
                if (scrollTimeout) {
                    clearTimeout(scrollTimeout);
                }
                scrollTimeout = setTimeout(() => {
                    tryInsertBaidu();
                }, 500);
            };

            window.addEventListener('scroll', handleScroll, { passive: true });

        } else if (location.hostname === 'cn.bing.com') {
            const sideBar = document.querySelector('#b_context');
            if (sideBar && !sideBar.querySelector('.navigation-panel')) {
                const panel = createNavigationPanel();
                sideBar.insertBefore(panel, sideBar.firstChild);
            }
        }
    }

    // 优化初始化逻辑
    function initialize() {
        try {
            // 创建一个 MutationObserver 来监视 DOM 变化
            const observer = new MutationObserver((mutations) => {
                try {
                    for (const mutation of mutations) {
                        if (mutation.addedNodes.length) {
                            const contentRight = document.querySelector('#content_right');
                            const bingContext = document.querySelector('#b_context');

                            if (contentRight || bingContext) {
                                insertPanel();
                                break;
                            }
                        }
                    }
                } catch (error) {
                    console.error('MutationObserver 处理出错:', error);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            insertPanel();
        } catch (error) {
            console.error('初始化脚本时出错:', error);
        }
    }

    // 启动脚本
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }
})();