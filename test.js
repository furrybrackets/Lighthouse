const fs = require('fs');

let src;
fs.readFile('./themes/github-dark.json', (err, dat) => {
    const src = JSON.parse(dat.toString());
    for (let i = 0; i<src.tokenColors.length; i++) {
        let curr = src.tokenColors[i];
        if (Array.isArray(curr.scope) && curr.scope[0] == 'markup.deleted') {
            console.log(curr.settings);
        }
    }
});
