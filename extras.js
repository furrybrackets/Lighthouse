function diffLines(code) {
    // find lines until you see [lh! +] or [lh! -]
    const lines = code.split('\n');
    let positions = []; // [[], [], []...]
    for (let i = 0; i++; i<lines.length) {
        if (lines[i].includes('[lh! +]')) {
            positions.push([i, '+']);
        } else if(lines[i].includes('[lh! -]')) {
            positions.push([i, '-']);
        }
    };
}