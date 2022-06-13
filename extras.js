const fs = require('fs');

function diffLines(code) {
    // find lines until you see [lh! +] or [lh! -]
    const lines = removeStartingNewlines(code).split('\n');
    console.log(lines);
    let positions = []; // [[], [], []...]
    for (let i = 0; i<lines.length; i++) {
        if (lines[i].includes('[lh! +]')) {
            positions.push([i+1, '+']);
            console.log('diffline')
        } else if(lines[i].includes('[lh! -]')) {
            positions.push([i+1, '-']);
        }
    };
    return positions;
};

function removeStartingNewlines(code) {
    // split by newlines
    const lines = code.split('\n');
    while (lines[0] == '') {
        lines.shift();
    }
    return lines.join('\n');
};

async function getThemeFile(themeName) {
    let themeFile;
    fs.readFile('./themes/' + themeName + '.json', (err, dat) => {
        
    }) 
}