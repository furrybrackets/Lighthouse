const shiki = require('shiki');
const fs = require('fs');


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

    const lineNum = options.lineNumbers;
    const lang = options.lang;

    const highlight = await shiki.getHighlighter({
        theme: Theme
    });

    /*
    const difflines = diffLines(code);
    const highlights = highlights(code);
    */

    const primitive = highlight.codeToHtml(options.code, lang);

    let minusFG;
    let minusBG;

    const src = await JSON.parse(fs.readFileSync('./themes/github-dark.json'));

    for (let i = 0; i<src.tokenColors.length; i++) {
        let curr = src.tokenColors[i];
        if (Array.isArray(curr.scope) && curr.scope[0] == 'markup.deleted') {
            minusFG = curr.settings.foreground;
            minusBG = curr.settings.background;
        };
    };

    const linecolors = src.colors["editorLineNumber.foreground"];

    console.log(linecolors);

    const bgcolor = src.colors["editor.background"];

    // split html up by lines (\n) since <pre>

    let primitiveLines = primitive.split('\n');

    primitiveLines = primitiveLines.map((el, index) => {
        if (index == 0) {
                let noPre = el.replace(`<pre class="shiki" style="background-color: ${bgcolor}"><code>`, '');
                return `<pre class="shiki" style="background-color: ${bgcolor}"><code><span class="line-number" style="color:${linecolors}; text-align: right; -webkit-user-select: none; user-select: none;">${index+1}</span>${noPre}`;
        } else {
            return `<span class="line-number" style="color:${linecolors}; text-align: right; -webkit-user-select: none; user-select: none;">${index+1}</span>${el}`;
        }
    });

    console.log(primitiveLines);

    console.log(primitiveLines.join('\n'));
    
   return  {html: primitiveLines.join('\n'), error: (error ? true : false ), errorVal: error ? error: '' };
};

module.exports = {
    getHTML: getHTML
};