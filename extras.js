function diffLines(code) {
    // find lines until you see [lh! +] or [lh! -]
    const lines = code.split('\n');
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
    let posObj = {
        positions: [],
        types: []
    };

    for (let i = 0; i<positions.length; i++) {
        posObj.positions.push(positions[i][0]);
        posObj.types.push(positions[i][1]);
    };
    return posObj;
};

function highlights(code) {
    const lines = code.split('\n');
    let positions = [];
    // find lines until you see [lh! fc]
    for (let i = 0; i<lines.length; i++) {
        if (lines[i].includes('[lh! fc]')) {
            positions.push(i+1);
        };
    };
    return positions;
}

module.exports = {
    diffLines: diffLines,
    highlights: highlights
};