(async function() {
    const languageSelect = document.getElementById('languageSelect');

    languageSelect.addEventListener('change', async () => {
        const selectedLanguage = languageSelect.value;
        await translatePage(selectedLanguage);
    });

    async function translatePage(targetLanguage) {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        const nodes = [];
        
        while (walker.nextNode()) {
            nodes.push(walker.currentNode);
        }

        const textsToTranslate = nodes.map(node => node.textContent.trim()).filter(text => text);
        const translatedTexts = await Promise.all(textsToTranslate.map(text => translateText(text, targetLanguage)));

        nodes.forEach((node, index) => {
            if (translatedTexts[index]) {
                node.textContent = translatedTexts[index];
            }
        });
    }

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
