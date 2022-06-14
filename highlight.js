const shiki = require('shiki');
const fs = require('fs');
const diffLines = require('./extras.js').diffLines;
const highlights = require('./extras.js').highlights;
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
    return char == '+';
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
    const Highlights = highlights(options.code);

    const primitive = highlight.codeToHtml(options.code.replaceAll('[lh! +]', '').replaceAll(`[lh! -]`, '').replaceAll('[lh! fc]', ''), lang);

    let minusFG;
    let minusBG;
    let plusBG;
    let plusFG;

    const src = await JSON.parse(fs.readFileSync(`./themes/${options.theme}.json`));


    const linecolors = src.colors["editorLineNumber.foreground"] || src.colors["editor.foreground"];


    let bgcolor = src.colors["editor.background"];

    for (let i = 0; i<src.tokenColors.length; i++) {
            let curr = src.tokenColors[i];
            if ((Array.isArray(curr.scope) && curr.scope[0] == 'markup.deleted') || curr.scope == 'markup.deleted') {
                minusFG = curr.settings.foreground;
                minusBG = curr.settings.background || src.colors["diffEditor.removedTextBackground"];
            } else if ((Array.isArray(curr.scope) && curr.scope[0] == 'markup.inserted') || curr.scope == 'markup.inserted') {
                plusFG = curr.settings.foreground;
                plusBG = curr.settings.background || src.colors["diffEditor.insertedTextBackground"];
            }
    };
    

    if (src.tokenColors[0].settings.background) {
        bgcolor = src.tokenColors[0].settings.background;
    }

    // split html up by lines (\n) since <pre>

    let primitiveLines = primitive.split('\n');


    primitiveLines = primitiveLines.map((el, index) => {
        if (index == 0) {
                let noPre = el.replaceAll(`<pre class="shiki" style="background-color: ${bgcolor}">`, '').replaceAll('<code>', '');
                if (difflines.positions.includes(1)) {
                    const type = difflines.types[0];
                    let root = HTMLParser.parse(noPre);
                    for (let i = 0; i<root.childNodes.length; i++) {
                        for (let j = 0; j<root.childNodes[i].childNodes.length; j++) {
                            root.childNodes[i].childNodes[j].rawAttrs = `style=color:${plusminus(type) ? plusFG : minusFG}`;
                            root.childNodes[i].rawAttrs = `class="line ${Highlights.length == 0 ? '' : 'line-focus'}"`;
                            // root.childNodes[i]._rawAttrs.class = root.childNodes[i]._rawAttrs.class + Highlights.includes(index+1) ? 'line-focus' : '';
                        }
                    };
                    noPre = root.toString().replaceAll(`[lh! +]`, '').replaceAll(`[lh! -]`, '').replaceAll('[lh! fc]', '');
        
                    return `<pre class="shiki ${Highlights.length == 0 ? '' : 'has-focus'}" style="background-color: ${bgcolor}"><code>` + `<div style="background-color:${plusminus(type) ? plusBG : minusBG} !important; display: inline;" class="line ${Highlights.includes(index+1) ? 'line-focus' : ''}">` + (lineNum ? `<span class="line-number" style="color:${plusminus(type) ? plusFG : minusFG}; text-align: right; -webkit-user-select: none; user-select: none;">${difflines.types[0]}</span>` : '') + `${noPre}` + `</span>` + `</div>`;
                } else {
                    let root = HTMLParser.parse(noPre.replaceAll(`[lh! +]`, '').replaceAll(`[lh! -]`, '').replaceAll('[lh! fc]', ''));
                    for (let i = 0; i<root.childNodes.length; i++) {
                            root.childNodes[i].rawAttrs = `class="line ${Highlights.length == 0 ? '' : 'line-focus'}"`;
                            // root.childNodes[i]._rawAttrs.class = root.childNodes[i]._rawAttrs.class + Highlights.includes(index+1) ? 'line-focus' : '';
                    };
                    noPre = root.toString();
                    return `<pre class="shiki ${Highlights.length == 0 ? '' : 'has-focus'}" style="background-color: ${bgcolor}"><code>` + `<div class="line ${Highlights.includes(index+1) ? 'line-focus' : ''}">` + (lineNum ? `<span class="line-number" style="color:${linecolors}; text-align: right; -webkit-user-select: none; user-select: none;">${index+1}</span>` : '') + `${noPre}` + '</div>';
                }
        } else {
            if (difflines.positions.includes(index+1)) {
                const type = difflines.types[difflines.positions.indexOf(index+1)];
                difflines.types[difflines.positions.indexOf(index+1)];
                let str = (lineNum ? `<span class="line-number ${Highlights.includes(index+1) ? 'line-focus' : ''}" style="color:${plusminus(type) ? plusFG : minusFG}; text-align: right; -webkit-user-select: none; user-select: none;">${difflines.types[difflines.positions.indexOf(index+1)]}</span>` : '');
                let nEl = el.replaceAll(`[lh! +]`, '').replaceAll(`[lh! -]`, '').replaceAll('[lh! fc]', '');
                let root = HTMLParser.parse(nEl);
                for (let i = 0; i<root.childNodes.length; i++) {
                    for (let j = 0; j<root.childNodes[i].childNodes.length; j++) {
                        root.childNodes[i].childNodes[j].rawAttrs = `style=color:${plusminus(type) ? plusFG : minusFG}`;
                        root.childNodes[i].rawAttrs = `class="line ${Highlights.length == 0 ? '' : 'line-focus'}"`;
                        // root.childNodes[i]._rawAttrs.class = root.childNodes[i]._rawAttrs.class + Highlights.includes(index+1) ? 'line-focus' : '';
                    }
                };
                nEl = root.toString();
                return `<div style="background-color:${plusminus(type) ? plusBG : minusBG} !important; color:${plusminus(type) ? plusFG : minusFG} !important; display: inline;" class="line ${Highlights.includes(index+1) ? 'line-focus' : ''}"` + str + nEl + '</div>';
            }
            if (el.includes(`</code>`)) {
                // remove the </code></pre>
                let noEnd = el.replaceAll('</code></pre>').replaceAll(`[lh! +]`, '').replaceAll(`[lh! -]`, '').replaceAll('[lh! fc]', '');
                
                if (difflines.positions.includes(index+1)) {
                    const type = difflines.types[difflines.positions.indexOf(index+1)];
                    noEnd = el;
                    let root = HTMLParser.parse(noEnd);
                    for (let i = 0; i<root.childNodes.length; i++) {
                        for (let j = 0; j<root.childNodes[i].childNodes.length; j++) {
                            root.childNodes[i].childNodes[j].rawAttrs = `style=color:${plusminus(type) ? plusFG : minusFG}`;
                            root.childNodes[i]._rawAttrs.class = root.childNodes[i]._rawAttrs.class + Highlights.includes(index+1) ? 'line-focus' : '';
                        }
                    };
                    noEnd = root.toString();
                }
                return `<div class="line ${Highlights.includes(index+1) ? 'line-focus' : ''}">` + (lineNum ? `<span class="line-number" style="color:${linecolors}; text-align: right; -webkit-user-select: none; user-select: none;">${index+1}</span>` : '') + noEnd.replaceAll(undefined, '') + '</div>' + '</code></pre>';
            }
            let root = HTMLParser.parse(el.replaceAll(`[lh! +]`, '').replaceAll(`[lh! -]`, '').replaceAll('[lh! fc]', ''));
            for (let i = 0; i<root.childNodes.length; i++) {
                    root.childNodes[i].rawAttrs = `class="line ${Highlights.length == 0 ? '' : 'line-focus'}"`;
                    // root.childNodes[i]._rawAttrs.class = root.childNodes[i]._rawAttrs.class + Highlights.includes(index+1) ? 'line-focus' : '';
            };
            let newEl = root.toString();
            return `<div class="line ${Highlights.includes(index+1) ? 'line-focus' : ''}">` + (lineNum ? `<span class="line-number" style="color:${linecolors}; text-align: right; -webkit-user-select: none; user-select: none;">${index+1}</span>` : '') + `${newEl}` + '</div>';
        }
    });

    
   return  {html: primitiveLines.join('\n'), error: (error ? true : false ), errorType: error ? error: '' };
};

module.exports = {
    getHTML: getHTML
};