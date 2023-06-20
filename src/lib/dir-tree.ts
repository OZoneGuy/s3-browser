export interface Tree {
    [name: string]: Tree | null;
}

export function dirTree(paths: string[]): Tree {
    const tree: Tree = {};

    paths.forEach((path) => {
        const parts = path.split('/');
        let node = tree;

        parts.forEach((part) => {
            if (!node[part]) {
                node[part] = {};
            }

            node = node[part] as Tree;
        });
    });

    return tree;
}
