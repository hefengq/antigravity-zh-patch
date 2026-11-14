/* --- ANTIGRAVITY CHINESE LOCALIZATION START --- */
(() => {
    const USE_TW = false;
    const map = new Map(Object.entries(__DICT_PLACEHOLDER__));
    const lowerMap = new Map();
    const LOWER_WORDS_EXCLUDE = new Set([
        'on', 'in', 'to', 'at', 'by', 'for', 'with', 'as',
        'system', 'review', 'active', 'browser', 'global',
        'including', 'and', 'or', 'file', 'files', 'help',
        'app', 'plan', 'search',
        'type', 'from', 'use', 'runs', 'reads', 'show', 'hide',
        'fill', 'auto', 'branch', 'commit', 'push', 'voice',
        'chat', 'cloud', 'after', 'before', 'design', 'live', 'web'
    ]);
    for (const [k, v] of map.entries()) {
        const lowerK = k.toLowerCase();
        if (LOWER_WORDS_EXCLUDE.has(lowerK) && k !== lowerK) {
            continue;
        }
        lowerMap.set(lowerK, v);
    }

    const longEntries = __REPLACEMENT_ENTRIES_PLACEHOLDER__;
    const translatedValues = new WeakMap();

    const SKIP_TAGS = ['SCRIPT', 'STYLE', 'PRE', 'CODE'];

    // 容器级物理隔离选择器：跳过代码块、编辑器、终端、输入框、用户提问、AI回复正文、思考内容、文件名及侧边栏会话标题
    const CODE_ISOLATION_SELECTOR = [
        'pre', 'code', '.monaco-editor', '.cm-editor', '.cm-line',
        '[contenteditable="true"]', '[contenteditable="plaintext-only"]', '[contenteditable=""]',
        '[data-lexical-editor]', '.terminal', '.xterm', '.code-line', '.code-block', '.line-content',
        '[aria-label="File Viewer"]', '[data-file-uri]', '[data-uri]', '[class*="diffEditor"]',
        '.token', '.hljs', '[class*="mtk"]', '.font-mono', '[data-quotable-inline="true"]',
        '.context-scope-mention', '[data-testid="file-title-name"]', '[data-testid="entity-pill"]',
        '[data-project-card="true"]', '[data-testid="conversation-row-sidebar"] span.truncate',
        '[translate="no"]', '.notranslate', '.md-divider-spacing', '.cursor-edit',
        '[data-testid="user-input-step"] [data-quotable="true"]',
        '[data-testid="user-input-step"] .whitespace-pre-wrap',
        '[data-testid="planner-response-text"]',
        '[data-testid="thinking-collapsible-trigger"] + div',
        '[data-testid="thinking-collapsible-trigger"] ~ div'
    ].join(', ');

    function isCodeOrEditor(node) {
        try {
            if (!node) return false;
            let el = node.nodeType === Node.ELEMENT_NODE ? node : node.parentElement;
            if (!el) return false;
            if (el.isContentEditable) return true;
            const active = document.activeElement;
            if (
                active &&
                (active.isContentEditable ||
                    active.tagName === 'INPUT' ||
                    active.tagName === 'TEXTAREA' ||
                    (active.getAttribute && active.getAttribute('data-lexical-editor') === 'true')) &&
                (active === el || active.contains(el))
            ) {
                return true;
            }
            while (el) {
                if (el.isContentEditable) return true;
                if (typeof el.closest === 'function' && el.closest(CODE_ISOLATION_SELECTOR)) {
                    return true;
                }
                const root = typeof el.getRootNode === 'function' ? el.getRootNode() : null;
                el = root && root.host ? root.host : null;
            }
            return false;
        } catch (e) {
            return false;
        }
    }

    function norm(s) {
        if (!s) return '';
        return s.replace(/\s+/g, ' ').replace(/[‘’]/g, "'").replace(/[“”]/g, '"').replace(/…/g, '...').trim();
    }

    function translateWithShortcut(val) {
        if (!val) return null;
        const match = val.match(/^(.+?)\s*\((Ctrl|Cmd|Alt|Shift|⌘|⌥|⇧|⌃)\+?([^)]*)\)$/i);
        if (match) {
            const prefix = match[1].trim();
            const normPref = norm(prefix);
            const lowerPref = normPref.toLowerCase();
            let transPref = null;
            if (map.has(normPref)) {
                transPref = map.get(normPref);
            } else if (lowerMap.has(lowerPref)) {
                transPref = lowerMap.get(lowerPref);
            }
            if (transPref) {
                return transPref + ' (' + match[2] + (match[3] ? '+' + match[3] : '') + ')';
            }
        }
        return null;
    }

    function isFilePathOrUri(s) {
        if (!s) return false;
        return (
            /^[a-zA-Z]:[\\/]/.test(s) ||
            /^[\\/~].*[\\/]/.test(s) ||
            /[\\/]SKILL\.md/i.test(s) ||
            /[\\/]\.gemini[\\/]/i.test(s) ||
            /^file:\/\//i.test(s)
        );
    }

    function translateDynamicPattern(t) {
        if (!t) return null;
        if (/^Show\s+(\d+)\s+earlier\s+steps?$/i.test(t)) {
            return t.replace(/^Show\s+(\d+)\s+earlier\s+steps?$/i, (m, num) => '显示更早的 ' + num + ' 个步骤');
        }
        if (/^Generation\s+Steps\s*\((\d+)\)$/i.test(t)) {
            return t.replace(/^Generation\s+Steps\s*\((\d+)\)$/i, (m, num) => '生成步骤 (' + num + ')');
        }
        if (/^Show\s+more\s*\((\d+)\)$/i.test(t)) {
            return t.replace(/^Show\s+more\s*\((\d+)\)$/i, (m, num) => '显示更多 (' + num + ')');
        }
        if (/^Show\s+submitted\s*\((\d+)\)$/i.test(t)) {
            return t.replace(/^Show\s+submitted\s*\((\d+)\)$/i, (m, num) => '显示已提交 (' + num + ')');
        }
        if (/^Show\s+(\d+)\s+more\s+subagents?$/i.test(t)) {
            return t.replace(/^Show\s+(\d+)\s+more\s+subagents?$/i, (m, num) => '显示另外 ' + num + ' 个子智能体');
        }
        if (/^(\d+)\s+comments?$/i.test(t)) {
            return t.replace(/^(\d+)\s+comments?$/i, (m, num) => num + ' 条批注');
        }
        if (/^(\d+)\s+active\s+conversations?$/i.test(t)) {
            return t.replace(/^(\d+)\s+active\s+conversations?$/i, (m, num) => num + ' 个活跃会话');
        }
        if (/^(\d+)\s+archived\s+conversations?$/i.test(t)) {
            return t.replace(/^(\d+)\s+archived\s+conversations?$/i, (m, num) => num + ' 个已归档会话');
        }
        if (/^Sort\s+and\s+filter\s+conversations\s*\((\d+)\s+active\)$/i.test(t)) {
            return t.replace(/^Sort\s+and\s+filter\s+conversations\s*\((\d+)\s+active\)$/i, (m, num) => '排序和筛选会话（' + num + ' 个活跃）');
        }
        if (/^(\d+)\s+tools?\s+enabled$/i.test(t)) {
            return t.replace(/^(\d+)\s+tools?\s+enabled$/i, (m, num) => num + ' 个工具已启用');
        }
        if (/^(\d+)\s+tools?\s+disabled$/i.test(t)) {
            return t.replace(/^(\d+)\s+tools?\s+disabled$/i, (m, num) => num + ' 个工具已禁用');
        }
        if (/^(\d+)\s+tools?\s+excluded$/i.test(t)) {
            return t.replace(/^(\d+)\s+tools?\s+excluded$/i, (m, num) => num + ' 个工具已排除');
        }
        if (/^Hide\s+tools$/i.test(t)) {
            return '收起工具';
        }
        if (/^(\d+)\s+tools$/i.test(t)) {
            return t.replace(/^(\d+)\s+tools$/i, (m, num) => num + ' 个工具');
        }
        if (/^(\d+)\s+Files?\s+With\s+Changes$/i.test(t)) {
            return t.replace(/^(\d+)\s+Files?\s+With\s+Changes$/i, (m, num) => num + ' 个文件有更改');
        }
        if (/^(\d+)\s+files?\s+changed$/i.test(t)) {
            return t.replace(/^(\d+)\s+files?\s+changed$/i, (m, num) => num + ' 个文件已更改');
        }
        if (/^(\d+)\s+questions?$/i.test(t)) {
            return t.replace(/^(\d+)\s+questions?$/i, (m, num) => num + ' 个问题');
        }
        if (/^(\d+)\s+turns?$/i.test(t)) {
            return t.replace(/^(\d+)\s+turns?$/i, (m, num) => num + ' 轮对话');
        }
        if (/^Turn\s+(\d+)\s+of\s+(\d+)$/i.test(t)) {
            return t.replace(/^Turn\s+(\d+)\s+of\s+(\d+)$/i, (m, a, b) => '第 ' + a + ' / ' + b + ' 轮');
        }
        if (/^Step\s+(\d+)\s+of\s+(\d+)$/i.test(t)) {
            return t.replace(/^Step\s+(\d+)\s+of\s+(\d+)$/i, (m, a, b) => '第 ' + a + ' / ' + b + ' 步');
        }
        if (/^Question\s+(\d+)\s+of\s+(\d+)$/i.test(t)) {
            return t.replace(/^Question\s+(\d+)\s+of\s+(\d+)$/i, (m, a, b) => '问题 ' + a + ' / ' + b);
        }
        if (/^Downloads,\s*(\d+)%\s*complete$/i.test(t)) {
            return t.replace(/^Downloads,\s*(\d+)%\s*complete$/i, (m, num) => '下载中，已完成 ' + num + '%');
        }
        if (/^Waiting\s+for\s+command\s+completion\s*\(up\s+to\s+(\d+)\s*s(?:ec(?:onds?)?)?\)$/i.test(t)) {
            return t.replace(/^Waiting\s+for\s+command\s+completion\s*\(up\s+to\s+(\d+)\s*s(?:ec(?:onds?)?)?\)$/i, (m, num) => '正在等待命令完成（最多 ' + num + ' 秒）');
        }
        if (/^Show\s+(\d+)\s+more(\s+(results?|items?|commands?|options?))?(\.\.\.|…)?$/i.test(t)) {
            return t.replace(
                /^Show\s+(\d+)\s+more(\s+(results?|items?|commands?|options?))?(\.\.\.|…)?$/i,
                (m, num, p2, type) => {
                    if (type) {
                        if (/result/i.test(type)) return '显示另外 ' + num + ' 个结果...';
                        if (/command/i.test(type)) return '显示另外 ' + num + ' 个命令...';
                        if (/item/i.test(type)) return '显示另外 ' + num + ' 个项目...';
                        if (/option/i.test(type)) return '显示另外 ' + num + ' 个选项...';
                    }
                    return '显示另外 ' + num + ' 个...';
                }
            );
        }
        if (/^Show\s+(\d+)\s+breakdown(s)?$/i.test(t)) {
            return t.replace(/^Show\s+(\d+)\s+breakdown(s)?$/i, (m, num) => '显示 ' + num + ' 项细目');
        }
        if (/^Hide\s+breakdown(s)?$/i.test(t)) {
            return '收起细目';
        }
        if (/^Show\s+breakdown(s)?$/i.test(t)) {
            return '显示细目';
        }
        if (/^See all\s*\((\d+)\)$/i.test(t)) {
            return t.replace(/^See all\s*\((\d+)\)$/i, (m, num) => '显示全部 (' + num + ')');
        }
        if (/^(?:\+\s*)?See\s+(\d+)\s+more(?:\s+(.+))?$/i.test(t)) {
            return t.replace(/^(?:\+\s*)?See\s+(\d+)\s+more(?:\s+(.+))?$/i, (m, num) => (/^\+/.test(t) ? '+ ' : '') + '展开另外 ' + num + ' 项');
        }
        if (/^See\s+more\s+in\s+(.+)$/i.test(t)) {
            return t.replace(/^See\s+more\s+in\s+(.+)$/i, (m, name) => '在 ' + name + ' 中展开更多');
        }
        if (/^(?:(Permanently delete)\s+)?(.+?)\s+including\s+(\d+)\s+active conversations?([.。])?$/i.test(t)) {
            return t.replace(
                /^(?:(Permanently delete)\s+)?(.+?)\s+including\s+(\d+)\s+active conversations?([.。])?$/i,
                (match, del, name, count, dot) => (del ? '永久删除 ' : '') + name + '（包含 ' + count + ' 个活跃会话）' + (dot ? '。' : '')
            );
        }
        if (/^(Thought|Thinking|Worked|Running) for\s+(.+)$/i.test(t)) {
            return t.replace(/^(Thought|Thinking|Worked|Running) for\s+(.+)$/i, (match, verb, dur) => {
                const vZh = /^Thought/i.test(verb) ? '已思考 ' : /^Thinking/i.test(verb) ? '正在思考 ' : /^Running/i.test(verb) ? '已运行 ' : '已工作 ';
                const dZh = dur
                    .trim()
                    .replace(/(\d+)\s*h(?:ours?|r)?/gi, '$1 小时')
                    .replace(/(\d+)\s*m(?:inutes?|in)?/gi, '$1 分钟')
                    .replace(/(\d+)\s*s(?:econds?|ec)?/gi, '$1 秒');
                return vZh + dZh;
            });
        }
        return null;
    }

    function translateNode(node) {
        try {
            if (!node) return;

            if (node.nodeType === Node.ELEMENT_NODE) {
                const tag = node.tagName.toUpperCase();
                if (SKIP_TAGS.includes(tag)) return;

                for (const attr of ['placeholder', 'title', 'aria-label']) {
                    const v = node.getAttribute(attr);
                    if (v) {
                        const t = norm(v);
                        if (isFilePathOrUri(t)) continue;
                        const shortcutTrans = translateWithShortcut(t);
                        if (shortcutTrans) node.setAttribute(attr, shortcutTrans);
                        else if (map.has(t)) node.setAttribute(attr, map.get(t));
                        else if (lowerMap.has(t.toLowerCase())) node.setAttribute(attr, lowerMap.get(t.toLowerCase()));
                        else {
                            const dynTrans = translateDynamicPattern(t);
                            if (dynTrans) node.setAttribute(attr, dynTrans);
                        }
                    }
                }

                if (isCodeOrEditor(node)) return;
                if (node.isContentEditable) return;
                if (node.classList && (node.classList.contains('monaco-editor') || node.classList.contains('terminal') || node.classList.contains('xterm'))) return;

                const elText = node.textContent ? node.textContent.trim() : '';
                if (/^Show\s+\d+\s+more(?:\.\.\.|…)?$/i.test(elText)) {
                    const textChildren = Array.from(node.childNodes).filter(c => c.nodeType === Node.TEXT_NODE);
                    if (textChildren.length >= 2) {
                        for (const tc of textChildren) {
                            const v = tc.nodeValue;
                            if (v === 'Show ' || norm(v) === 'Show') {
                                tc.nodeValue = '显示另外 ';
                                translatedValues.set(tc, tc.nodeValue);
                            } else if (v === ' more...' || v === ' more…' || norm(v) === 'more...') {
                                tc.nodeValue = ' 个...';
                                translatedValues.set(tc, tc.nodeValue);
                            }
                        }
                    } else if (textChildren.length === 1) {
                        const m = elText.match(/^Show\s+(\d+)\s+more(?:\.\.\.|…)?$/i);
                        if (m) {
                            textChildren[0].nodeValue = '显示另外 ' + m[1] + ' 个...';
                            translatedValues.set(textChildren[0], textChildren[0].nodeValue);
                        }
                    }
                }

                if (node.shadowRoot) translateNode(node.shadowRoot);
                for (const child of node.childNodes) translateNode(child);

            } else if (node.nodeType === Node.TEXT_NODE) {
                if (isCodeOrEditor(node)) return;

                let originalVal = node.nodeValue;
                if (!originalVal || originalVal.trim().length < 1) return;

                const parentText = node.parentElement && node.parentElement.textContent ? node.parentElement.textContent.trim() : '';
                if (isFilePathOrUri(originalVal.trim()) || isFilePathOrUri(parentText)) return;
                if (
                    parentText &&
                    (/^(?:Show|显示另外)\s+\d+\s+(?:more|个)(?:\.\.\.|…)?$/i.test(parentText) ||
                        (node.parentElement.getAttribute && node.parentElement.getAttribute('value')?.startsWith('fastpick-show-more:')))
                ) {
                    if (originalVal === 'Show ' || norm(originalVal) === 'Show') {
                        node.nodeValue = '显示另外 ';
                        translatedValues.set(node, node.nodeValue);
                        return;
                    }
                    if (originalVal === ' more...' || originalVal === ' more…' || norm(originalVal) === 'more...') {
                        node.nodeValue = ' 个...';
                        translatedValues.set(node, node.nodeValue);
                        return;
                    }
                }

                if (originalVal.toLowerCase().includes('pack.info')) {
                    const parent = node.parentElement;
                    if (parent) {
                        if (parent.getAttribute('translate') !== 'no') parent.setAttribute('translate', 'no');
                        try {
                            if (!parent.classList.contains('notranslate')) parent.classList.add('notranslate');
                        } catch (e) {}
                    }
                    return;
                }

                if (translatedValues.get(node) === originalVal) return;

                let newVal = originalVal;
                let dynTrans = null;
                const valNorm = norm(originalVal);
                const valLower = valNorm.toLowerCase();

                const shortcutTrans = translateWithShortcut(valNorm);
                if (shortcutTrans) {
                    newVal = shortcutTrans;
                } else if (
                    (valNorm === 'Type' || valNorm === 'and select') &&
                    node.parentElement &&
                    ((typeof node.parentElement.closest === 'function' && node.parentElement.closest('[data-testid="plan-command-fyi-alert"]')) ||
                        (node.parentElement.textContent && node.parentElement.textContent.includes('generate a plan')))
                ) {
                    if (valNorm === 'Type') newVal = '输入';
                    else if (valNorm === 'and select') newVal = '并选择';
                } else if (map.has(valNorm)) {
                    newVal = map.get(valNorm);
                } else if (lowerMap.has(valLower)) {
                    newVal = lowerMap.get(valLower);
                } else if (/^Send message\s+(Enter|⏎|\u23ce)$/i.test(valNorm)) {
                    newVal = '发送消息 ' + valNorm.replace(/^Send message\s+/i, '');
                } else if (/^Queue message\s+(Enter|⏎|\u23ce)$/i.test(valNorm)) {
                    newVal = '排队发送消息 ' + valNorm.replace(/^Queue message\s+/i, '');
                } else if (/^to have the agent generate a plan\.?$/i.test(valNorm)) {
                    newVal = '让智能体生成计划。';
                } else if (
                    valNorm === 'and' &&
                    node.parentElement &&
                    node.parentElement.textContent &&
                    (node.parentElement.textContent.includes('Privacy Policy') ||
                        node.parentElement.textContent.includes('Terms of Service') ||
                        node.parentElement.textContent.includes('隐私政策'))
                ) {
                    newVal = '以及';
                } else if (
                    (valNorm === 'Search conversations with' || valNorm === 'in the top left.') &&
                    node.parentElement &&
                    node.parentElement.textContent &&
                    node.parentElement.textContent.includes('in the top left')
                ) {
                    newVal = valNorm === 'Search conversations with' ? '可通过左上角的' : '搜索对话。';
                } else if (
                    (valNorm === 'View archived in the sidebar' || valNorm === 'menu)') &&
                    node.parentElement &&
                    node.parentElement.textContent &&
                    node.parentElement.textContent.includes('View archived in the sidebar')
                ) {
                    newVal = valNorm === 'View archived in the sidebar' ? '已归档对话可在侧边栏' : '菜单中查看。';
                } else if (
                    (valNorm === 'For help, visit' || valNorm === 'or join the' || valNorm === 'chat space') &&
                    node.parentElement &&
                    node.parentElement.textContent &&
                    node.parentElement.textContent.includes('chat space')
                ) {
                    if (valNorm === 'For help, visit') newVal = '如需帮助，请访问';
                    else if (valNorm === 'or join the') newVal = '或加入';
                    else if (valNorm === 'chat space') newVal = '聊天空间';
                } else if (/^(?:Refreshes|You have (?:used (?:some|all) of|reached) your (?:weekly|5-hour) limit, it will fully refresh) in (\d+) days?, (\d+) hours?\.?$/i.test(valNorm)) {
                    newVal = valNorm.replace(/^(?:Refreshes|You have (?:used (?:some|all) of|reached) your (?:weekly|5-hour) limit, it will fully refresh) in (\d+) days?, (\d+) hours?\.?$/i, (match, d, h) => d + ' 天 ' + h + ' 小时后刷新');
                } else if (/^(?:Refreshes|You have (?:used (?:some|all) of|reached) your (?:weekly|5-hour) limit, it will fully refresh) in (\d+) hours?, (\d+) minutes?\.?$/i.test(valNorm)) {
                    newVal = valNorm.replace(/^(?:Refreshes|You have (?:used (?:some|all) of|reached) your (?:weekly|5-hour) limit, it will fully refresh) in (\d+) hours?, (\d+) minutes?\.?$/i, (match, h, m) => h + ' 小时 ' + m + ' 分钟后刷新');
                } else if (/^(?:Refreshes|You have (?:used (?:some|all) of|reached) your (?:weekly|5-hour) limit, it will fully refresh) in (\d+) days?\.?$/i.test(valNorm)) {
                    newVal = valNorm.replace(/^(?:Refreshes|You have (?:used (?:some|all) of|reached) your (?:weekly|5-hour) limit, it will fully refresh) in (\d+) days?\.?$/i, (match, d) => d + ' 天后刷新');
                } else if (/^(?:Refreshes|You have (?:used (?:some|all) of|reached) your (?:weekly|5-hour) limit, it will fully refresh) in (\d+) hours?\.?$/i.test(valNorm)) {
                    newVal = valNorm.replace(/^(?:Refreshes|You have (?:used (?:some|all) of|reached) your (?:weekly|5-hour) limit, it will fully refresh) in (\d+) hours?\.?$/i, (match, h) => h + ' 小时后刷新');
                } else if (/^(?:Refreshes|You have (?:used (?:some|all) of|reached) your (?:weekly|5-hour) limit, it will fully refresh) in (\d+) minutes?\.?$/i.test(valNorm)) {
                    newVal = valNorm.replace(/^(?:Refreshes|You have (?:used (?:some|all) of|reached) your (?:weekly|5-hour) limit, it will fully refresh) in (\d+) minutes?\.?$/i, (match, m) => m + ' 分钟后刷新');
                } else if (/^(?:Refreshes|You have (?:used (?:some|all) of|reached) your (?:weekly|5-hour) limit, it will fully refresh) in less than a minute\.?$/i.test(valNorm)) {
                    newVal = '不到 1 分钟后刷新';
                } else if (/^(?:Refreshes|You have (?:used (?:some|all) of|reached) your (?:weekly|5-hour) limit, it will fully refresh) in a few seconds\.?$/i.test(valNorm)) {
                    newVal = '几秒后刷新';
                } else if (/^Learn more about$/i.test(valNorm)) {
                    newVal = '了解更多关于';
                } else if (/^Learn more about (.+)$/i.test(valNorm)) {
                    newVal = valNorm.replace(/^Learn more about (.+)$/i, (match, p) => {
                        let translatedPreset = p;
                        const pLow = p.toLowerCase();
                        if (pLow === 'default' || pLow.includes('默认')) translatedPreset = '默认 (Default)';
                        else if (pLow === 'inherit global' || pLow.includes('继承全局')) translatedPreset = '继承全局 (Inherit Global)';
                        else if (pLow === 'full machine' || pLow.includes('全机')) translatedPreset = '全机访问 (Full Machine)';
                        else if (pLow === 'turbo mode' || pLow.includes('极速')) translatedPreset = '极速模式 (Turbo Mode)';
                        else if (pLow === 'custom' || pLow.includes('自定义')) translatedPreset = '自定义 (Custom)';
                        return '了解更多关于 ' + translatedPreset + ' 的信息';
                    });
                } else if (/^Yes, and always allow '(.+)' in this project$/i.test(valNorm)) {
                    newVal = valNorm.replace(/^Yes, and always allow '(.+)' in this project$/i, (match, cmd) => "是，且在此项目中始终允许运行 '" + cmd + "'");
                } else if (/^Yes, and always allow '(.+)'$/i.test(valNorm)) {
                    newVal = valNorm.replace(/^Yes, and always allow '(.+)'$/i, (match, cmd) => "是，且始终允许运行 '" + cmd + "'");
                } else if (/^Available AI Credits: (\d+)$/i.test(valNorm)) {
                    newVal = valNorm.replace(/^Available AI Credits: (\d+)$/i, (match, num) => '可用 AI 额度: ' + num);
                } else if (/^Version\s+([\d\.]+)$/i.test(valNorm)) {
                    newVal = valNorm.replace(/^Version\s+([\d\.]+)$/i, (match, v) => '版本 ' + v);
                } else if (/^(\d+)(s|m|h|d|w|mo|yr)$/i.test(valNorm)) {
                    newVal = valNorm.replace(/^(\d+)(s|m|h|d|w|mo|yr)$/i, (match, num, unit) => {
                        const unitMap = { s: '秒前', m: '分钟前', h: '小时前', d: '天前', w: '周前', mo: '个月前', yr: '年前' };
                        return num + (unitMap[unit.toLowerCase()] || unit);
                    });
                } else if (/^Models within this group:\s*(.+)$/i.test(valNorm)) {
                    newVal = valNorm.replace(/^Models within this group:\s*(.+)$/i, (match, list) => '此分组包含的模型：' + list);
                } else if (/^just now$/i.test(valNorm)) {
                    newVal = '刚刚';
                } else if (/^(\d+)(s|m|h|d|w|mo|yr)\s+ago$/i.test(valNorm)) {
                    newVal = valNorm.replace(/^(\d+)(s|m|h|d|w|mo|yr)\s+ago$/i, (match, num, unit) => {
                        const unitMap = { s: '秒前', m: '分钟前', h: '小时前', d: '天前', w: '周前', mo: '个月前', yr: '年前' };
                        return num + (unitMap[unit.toLowerCase()] || unit);
                    });
                } else if (/^(Rules|Skills|Mcp Tools): ([\d,]+) tokens$/i.test(valNorm)) {
                    newVal = valNorm.replace(/^(Rules|Skills|Mcp Tools): ([\d,]+) tokens$/i, (match, kind, num) => {
                        const kindMap = { Rules: '规则', Skills: '技能', 'Mcp Tools': 'MCP 工具' };
                        return (kindMap[kind] || kind) + '：' + num + ' Token';
                    });
                } else if ((dynTrans = translateDynamicPattern(valNorm))) {
                    newVal = dynTrans;
                } else if (/^(?:(Exploring|Explored|Editing|Edited|Running|Ran)\s+)?(\d+)\s+(files?|folders?|searches?|commands?|tasks?|pages?|browsers?|images?|actions?|artifacts?)(?:,\s*(?:(Exploring|Explored|Editing|Edited|Running|Ran)\s+)?(\d+)\s+(files?|folders?|searches?|commands?|tasks?|pages?|browsers?|images?|actions?|artifacts?))*$/i.test(valNorm)) {
                    const verbMap = { exploring: '正在探索', explored: '已探索', editing: '正在编辑', edited: '已编辑', running: '正在运行', ran: '已运行' };
                    const nounMap = {
                        file: '个文件', files: '个文件', folder: '个文件夹', folders: '个文件夹',
                        search: '次搜索', searches: '次搜索', command: '个命令', commands: '个命令',
                        task: '个任务', tasks: '个任务', page: '个网页', pages: '个网页',
                        browser: '次浏览器操作', browsers: '次浏览器操作', image: '张图片', images: '张图片',
                        action: '项操作', actions: '项操作', artifact: '个工件', artifacts: '个工件'
                    };
                    newVal = valNorm
                        .split(/\s*,\s*/)
                        .map(part => {
                            const pm = part.match(/^(?:(Exploring|Explored|Editing|Edited|Running|Ran)\s+)?(\d+)\s+(files?|folders?|searches?|commands?|tasks?|pages?|browsers?|images?|actions?|artifacts?)$/i);
                            if (!pm) return part;
                            const v = pm[1] ? (verbMap[pm[1].toLowerCase()] || pm[1]) + ' ' : '';
                            const n = nounMap[pm[3].toLowerCase()] || pm[3];
                            return v + pm[2] + ' ' + n;
                        })
                        .join('，');
                } else {
                    for (const [key, translated] of longEntries) {
                        if (key.length > 15 && key.includes(' ') && valNorm.includes(key)) {
                            newVal = newVal.split(key).join(translated);
                            break;
                        } else if ((valNorm.endsWith('...') || valNorm.endsWith('…')) && valNorm.length >= 35) {
                            const cleanVal = valNorm.replace(/(\.\.\.|…)$/, '').trim().toLowerCase();
                            if (cleanVal.length >= 30 && key.toLowerCase().startsWith(cleanVal)) {
                                newVal = translated;
                                break;
                            }
                        }
                    }
                }

                if (newVal !== originalVal) {
                    translatedValues.set(node, newVal);
                    node.nodeValue = newVal;
                }
            }
        } catch (e) {}
    }

    const observer = new MutationObserver(mutations => {
        for (const m of mutations) {
            if (m.type === 'childList') {
                for (const n of m.addedNodes) {
                    translateNode(n);
                }
            } else if (m.type === 'characterData') {
                translateNode(m.target);
            }
        }
    });

    const obsOpts = { childList: true, subtree: true, characterData: true };

    const startEngine = () => {
        const target = document.body || document.documentElement;
        if (target) {
            try {
                observer.observe(target, obsOpts);
                translateNode(target);
            } catch (e) {}
        }
    };

    const origAttachShadow = Element.prototype.attachShadow;
    Element.prototype.attachShadow = function() {
        const sr = origAttachShadow.apply(this, arguments);
        try {
            observer.observe(sr, obsOpts);
        } catch (e) {}
        return sr;
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', startEngine);
    } else {
        startEngine();
    }
    window.addEventListener('load', startEngine);
    setTimeout(startEngine, 100);
    setTimeout(startEngine, 300);
    setTimeout(startEngine, 1000);
    setTimeout(startEngine, 3000);
})();
/* --- ANTIGRAVITY CHINESE LOCALIZATION END --- */
