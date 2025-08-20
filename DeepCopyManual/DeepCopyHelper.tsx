type TreeNode = {
    value: any;
    children: Map<String | number, TreeNode>;
};

function buildObjectTree(obj: any, seen = new WeakMap()): TreeNode {
    if(obj == null || typeof obj !== 'object') {
        return {value: obj, children: new Map()};
    }

    if(seen.has(obj)) {
        return {value: seen.get(obj), children: new Map()};
    }

    const node: TreeNode = { value: Array.isArray(obj) ? [] : {}, children: new Map()};
    seen.set(obj, node.value);

    for(const key in obj) {
        if(obj.hasOwnProperty(key)) {
            node.children.set(key, buildObjectTree(obj[key], seen));
        }
    }
    
    return node;
}

function reconstructFromTree(node: TreeNode, seen = new WeakMap()): any {
    if(node.children.size === 0) return node.value;
    
    if(seen.has(node)) return seen.get(node);

    const copy = Array.isArray(node.value) ? [] : {};
    seen.set(node, copy);

    for (const [key, childNode] of node.children) {
        (copy as any)[key] = reconstructFromTree(childNode, seen);
    }
    return copy;
}


function deepCopyUsingTree<T> (obj: T): T {
    const tree = buildObjectTree(obj);
    return reconstructFromTree(tree);
}