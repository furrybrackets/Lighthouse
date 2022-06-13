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
    /*
    
    fs.readFile(`themes/${process.env.DEFAULTTHEME}.json`, (err, dat) => {
        if (err) {
            error = 'An unknown error occured.';
        };
        Theme = JSON.parse(dat.toString());
    });

    */
    
    if (!options.code) {
        error = 'You need to attach code to highlight.';
    };
    if (!options.theme) {
        if (fileTheme) {
            Theme = options.fileTheme;     
        }
    } else {
        Theme = options.theme | process.env.DEFAULTHEME;
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
    const diffLines = diffLines(code);
    const highlights = highlights(code);
    */

    const primitive = highlight.codeToHtml(options.code, lang);

    /*
    if (lineNum) {

    }
    */
   return  {html: primitive, error: (error ? true : false ), errorVal: error ? error: '' };
};

module.exports = {
    getHTML: getHTML
};