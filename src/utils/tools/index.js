/*
 * @Author       : feihu1024 1690806685@qq.com
 * @Date         : 2023-12-28 10:05:38
 * @LastEditors  : feihu1024 1690806685@qq.com
 * @LastEditTime : 2023-12-29 15:52:42
 * @Description  : 工具类
 */

/** 深度优先遍历（待优化） */
function deepRecursion(tree, fn, extOption) {
    const { parent, key, fieldNames } = extOption || {};
    const childrenField = fieldNames?.children || 'children';

    const treeList = tree instanceof Array ? tree : [tree];
    if (treeList.length <= 0) return;
    for (let i = 0; i < treeList.length; i++) {
        const itemKey = key ? `${key}-${i}` : `${i}`;
        const itemFn = typeof fn === 'function' ? fn : (node) => ({ ...node });

        itemFn(treeList[i], i, { parent, key: itemKey, fieldNames });
        if (treeList[i]?.[childrenField] instanceof Array) {
            deepRecursion(treeList[i][childrenField], itemFn, { parent: treeList[i], key: itemKey, fieldNames });
        }
    }
}

/**
 * @description  : 递归遍历传入的树形结构,类似Array.map方法
 * @param         {*} tree          树形结构
 * @param         {*} fn            回调函数 fn(node, index, extOption) => newNode
 * @param         {*} extOption     附加参数
 * @return        {*}               树形结构的副本
 * @example      : tools.deepAdvance(tree, (node,index,extOption) => ({ ...node }))
 */
function deepAdvance(tree, fn = (node) => ({ ...node }), extOption = {}) {
    const { path, level = 0, fieldNames } = extOption;
    const childrenField = fieldNames?.children || 'children';
    const treeList = tree instanceof Array ? tree : [tree];
    let result = [];
    for (let i = 0; i < treeList.length; i++) {
        const itemPath = path ? `${path}-${i + 1}` : `${i + 1}`;
        const node = fn?.(treeList[i], i, { path: itemPath, level, fieldNames });
        if (treeList[i]?.[childrenField] instanceof Array) {
            node[childrenField] = deepAdvance(treeList[i][childrenField], fn, { path: itemPath, level: level + 1, fieldNames });
        }
        result.push(node);
    }
    return result;
}

/** 递归过滤（待优化） */
function deepFilter(tree, fn, extOption, result = []) {
    const childrenField = extOption?.fieldNames?.children || 'children';
    const treeList = tree instanceof Array ? tree : [tree];
    for (let i = 0; i < treeList.length; i++) {
        if (fn?.(treeList[i])) result.push(treeList[i]);
        if (treeList[i]?.[childrenField] instanceof Array) {
            deepFilter(treeList[i][childrenField], fn, extOption, result);
        }
    }
    return result;
}

/** 递归查找 (若查找到，返回数组，否则返回undefined) */
function deepFindPath(tree, fn, extOption, result = []) {
    const childrenField = extOption?.fieldNames?.children || 'children';
    const treeList = tree instanceof Array ? tree : [tree];
    for (let i = 0; i < treeList.length; i++) {
        if (fn?.(treeList[i])) {
            result.push(treeList[i]);
            return result;
        } else {
            if (treeList[i]?.[childrenField] instanceof Array) {
                if (deepFindPath(treeList[i][childrenField], fn, extOption, result)) {
                    result.push(treeList[i]);
                    return result;
                }
            }
        }
    }
}

export default { deepRecursion, deepAdvance, deepFilter, deepFindPath };
