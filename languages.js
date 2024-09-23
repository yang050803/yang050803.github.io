(async function() {
    // 获取所有文本节点
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    const nodes = [];

    while (walker.nextNode()) {
        nodes.push(walker.currentNode);
    }

    // 过滤掉空文本节点
    const textsToTranslate = nodes.map(node => node.textContent.trim()).filter(text => text);

    // 自动翻译
    const translatedTexts = await Promise.all(textsToTranslate.map(text => translateText(text, 'es'))); // 选择目标语言

    // 替换原有文本
    nodes.forEach((node, index) => {
        if (translatedTexts[index]) {
            node.textContent = translatedTexts[index];
        }
    });

    // 翻译函数
    async function translateText(text, targetLanguage) {
        const response = await fetch('https://libretranslate.com/translate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                q: text,
                source: 'auto',
                target: targetLanguage,
                format: 'text'
            })
        });
        const data = await response.json();
        return data.translatedText;
    }
})();
