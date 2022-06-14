const shiki = require('shiki');
const fs = require('fs');
const diffLines = require('./extras.js');
const HTMLParser = require('node-html-parser');

/* 
...
properties: {
          code: { type: 'string' },
          theme: { type: 'string' },
          lang: { type: 'string' },
          lineNumbers: { type: 'boolean' },
          fileTheme: { type: 'string' },
        }
...
*/
function plusminus(char) {
    return char == '+' ? true : false;
}


async function getHTML(options) {
    let Theme;
    let error;
    let LangSpec;
    
    Theme = await JSON.parse(fs.readFileSync(`./themes/nord.json`));
    
    if (!options.code) {
        error = 'You need to attach code to highlight.';
    };
    if (!options.theme) {
        if (fileTheme) {
            Theme = options.fileTheme;     
        }
    } else {
        Theme = await JSON.parse(fs.readFileSync(`./themes/${options.theme}.json`));
       /* 
       Theme = 'github-dark';
       */
    };

    const lineNum = options.lineNumbers || false;
    const lang = options.lang;

    const highlight = await shiki.getHighlighter({
        theme: Theme
    });

    const difflines = diffLines(options.code);
    console.log(difflines);
    /*
    const highlights = highlights(code);
    */

    const primitive = highlight.codeToHtml(options.code, lang);

    let minusFG;
    let minusBG;

    const src = await JSON.parse(fs.readFileSync(`./themes/${options.theme}.json`));


    const linecolors = src.colors["editorLineNumber.foreground"];

    console.log(linecolors);

    let bgcolor = src.colors["editor.background"];

    console.log(`${options.theme}: ${bgcolor}`)
    for (let i = 0; i<src.tokenColors.length; i++) {
            let curr = src.tokenColors[i];
            if (Array.isArray(curr.scope) && curr.scope[0] == 'markup.deleted') {
                minusFG = curr.settings.foreground;
                minusBG = curr.settings.background || src.colors["diffEditor.removedTextBackground"];
            };
    };
    

    if (src.tokenColors[0].settings.background) {
        console.log(src.tokenColors[0].settings.background);
        bgcolor = src.tokenColors[0].settings.background;
    }

    // split html up by lines (\n) since <pre>

    let primitiveLines = primitive.split('\n');

    primitiveLines = primitiveLines.map((el, index) => {
        if (index == 0) {
                let noPre = el.replace(`<pre class="shiki" style="background-color: ${bgcolor}">`, '').replace('<code>', '').replace(`[lh! +]`, '').replace(`[lh! -]`, '');
                if (difflines.positions.includes(1)) {
                    return `<pre class="shiki" style="background-color: ${bgcolor}"><code>` + (lineNum ? `<span class="line-number" style="color:${minusFG}; text-align: right; -webkit-user-select: none; user-select: none;">${difflines.types[0]}</span>` : '') + `<span style="background-color:${minusBG}; color:${minusFG}">` + `${noPre}` + `</span>`;
                } else {
                    return `<pre class="shiki" style="background-color: ${bgcolor}"><code>` + (lineNum ? `<span class="line-number" style="color:${linecolors}; text-align: right; -webkit-user-select: none; user-select: none;">${index+1}</span>` : '') + `${noPre}`;
                }
        } else {
            if (difflines.positions.includes(index+1)) {
                let str = (lineNum ? `<span class="line-number" style="color:${minusFG}; text-align: right; -webkit-user-select: none; user-select: none;">${difflines.types[difflines.positions.indexOf(index+1)]}</span>` : '');
                let nEl = el.replace(`[lh! +]`, '').replace(`[lh! -]`, '');
                let root = HTMLParser.parse(nEl);
                console.log(root.childNodes[0]);
                for (let i = 0; i<root.childNodes.length; i++) {
                    for (let j = 0; j<root.childNodes[i].childNodes.length; j++) {
                        root.childNodes[i].childNodes[j].rawAttrs = `style=color:${minusFG}`;
                    }
                };
                nEl = root.toString();
                console.log(nEl);
                return `<div style="background-color:${minusBG} !important; color:${minusFG} !important; display: inline;" class="line"` + str + nEl + '</div>';
            }
            return `<div class="line">` + (lineNum ? `<span class="line-number" style="color:${linecolors}; text-align: right; -webkit-user-select: none; user-select: none;">${index+1}</span>` : '') + `${el}` + '</div>';
        }
    });
    
   return  {html: primitiveLines.join('\n'), error: (error ? true : false ), errorVal: error ? error: '' };
};

module.exports = {
    getHTML: getHTML
};