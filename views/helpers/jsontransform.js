exports.jsontransform = (data) => {
    let arr = []
    var parent = []

    for (const level in data) {
        // count index of nodes in each level
        let index = 0;
        for (const item of data[level]) {
            let prev_level = level - 1;
            // link id to level index
            parent[item.id] = index;
            if (item.parent_id !== null) {
                let parent_index = parent[item.parent_id];
                // find number of children of its parent node
                let n = Object.keys(data[prev_level][parent_index].children).length;
                data[prev_level][parent_index].children[n] = item;
            }
            index++
        }
    }

    arr = data[0];
    return arr;
}


