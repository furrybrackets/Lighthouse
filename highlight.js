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
          langSpec: { type: 'string' }
        }
...
*/
function getHTML(options) {
    let Theme;
    let error;
    let LangSpec;
    fs.readFile(`themes/${process.env.DEFAULTTHEME}.json`, (err, dat) => {
        if (err) {
            error = new Error('An unknown error occured.');
        };
        Theme = JSON.parse(dat.toString());
    });
    if (!options.code) {
        error = new Error('You need to attach code to highlight.');
    };
    if (!options.theme) {
        if (fileTheme) {
            Theme = options.fileTheme;     
        }
    } else {
        fs.readFile(`themes/${options.theme}.json`, (err, dat) => {
            if (err) {
                error = new Error('An unknown error occured.');
            };
            Theme = JSON.parse(dat.toString());
        });
    };
    if (options.langSpec) {
        
    };

    const lineNum = options.lineNumbers;
    const lang = options.lang;

    const highlight = shiki.getHighlighter({
        theme: Theme,

    })
}