/*
 * @Author       : feihu1024 1690806685@qq.com
 * @Date         : 2023-12-28 10:05:38
 * @LastEditors  : feihu1024 1690806685@qq.com
 * @LastEditTime : 2024-01-25 15:02:08
 * @Description  : 通用工具类
 */

import { options } from 'less';

const TYPE_PRIMARY = 'primary';
const TYPE_OBJECT = 'object';
const TYPE_ARRAY = 'array';

/**
 * @description  : 判断给定目标的类型，返回对应的类型标识，类型标识包括: TYPE_PRIMARY(基本类型)、TYPE_OBJECT(对象类型)、TYPE_ARRAY(数组类型)
 * @param         {*} target 目标值
 * @return        {*} 类型标识
 * @example      : getTargetType(null)
 */
function getTargetType(target) {
    if (typeof target === 'string') {
        return TYPE_PRIMARY;
    } else if (typeof target === 'number') {
        return TYPE_PRIMARY;
    } else if (typeof target === 'boolean') {
        return TYPE_PRIMARY;
    } else if (typeof target === 'undefined') {
        return TYPE_PRIMARY;
    } else if (typeof target === 'symbol') {
        return TYPE_PRIMARY;
    } else if (target === null) {
        return TYPE_PRIMARY;
    } else if (typeof target === 'function') {
        return TYPE_PRIMARY;
    } else if (target instanceof Array) {
        return TYPE_ARRAY;
    } else if (typeof target === 'object') {
        return TYPE_OBJECT;
    } else {
        return TYPE_PRIMARY;
    }
}

/**
 * @description  : 树形结构对象遍历(用法类似Array.forEach)
 * @param         {*} tree 待遍历的树结构对象，可以是树节点对象，也可以是树节点数组
 * @param         {*} callback 针对每一个树节点执行的回调函数
 * @param         {*} option 其他选项，如树节点对象的字段映射关系
 * @return        {*}
 * @example      : deepForEach(treeList, (node) => console.log(node), { fieldNames: { children: 'childList' } })
 */
function deepForEach(tree, callback, option) {
    // 参数预处理
    const treeList = tree instanceof Array ? tree : [tree];
    const childrenKey = option?.fieldNames?.children || 'children';
    const callbackFn = callback !== undefined ? callback : () => {};

    // 内部递归函数
    const recursive = (treeList, callback, nodeProps, option) => {
        const { key, childrenKey, level = 0, parentNode, rootNode } = nodeProps || {};
        if (treeList.length <= 0) return;

        let nodeKey = null;
        for (let i = 0; i < treeList.length; i++) {
            // 将每节点的列表索引按层级拼接作为该节点的唯一标识
            nodeKey = key ? `${key}-${i + 1}` : `${i + 1}`;

            const nodeSelfProps = { key: nodeKey, childrenKey, level, parentNode, rootNode };

            // 执行用户回调函数
            callback(treeList[i], nodeKey, nodeSelfProps, option);

            // 若存在子节点，则进入递归
            if (treeList[i]?.[childrenKey] instanceof Array) {
                recursive(treeList[i][childrenKey], callback, { ...nodeSelfProps, level: level + 1, parentNode: treeList[i] }, option);
            }
        }
    };

    recursive(treeList, callbackFn, { key: '', childrenKey, level: 0, parentNode: null, rootNode: tree }, option);
}

/**
 * @description  : 树形结构对象遍历(用法类似Array.map)
 * @param         {*} tree 待遍历的树结构对象，可以是树节点对象，也可以是树节点数组
 * @param         {*} callback 针对每一个树节点执行的回调函数，需要返回一个新的树节点,默认返回每个节点的浅拷贝
 * @param         {*} option 其他选项，如树节点对象的字段映射关系
 * @return        {*} tree 树结构对象的副本
 * @example      : deepMap(treeList, (node) => ({...node}))
 */
function deepMap(tree, callback, option) {
    // 参数预处理
    const treeList = tree instanceof Array ? tree : [tree];
    const childrenKey = option?.fieldNames?.children || 'children';
    const callbackFn = callback !== undefined ? callback : (treeNode) => ({ ...treeNode });

    // 内部递归方法
    const recursive = (treeList, callback, nodeProps, option) => {
        const { key, childrenKey, level = 0, parentNode, rootNode } = nodeProps || {};
        const result = [];
        if (treeList.length <= 0) return result;

        let nodeKey = null;
        let nodeSelf = null;
        for (let i = 0; i < treeList.length; i++) {
            // 将每节点的列表索引按层级拼接作为该节点的唯一标识
            nodeKey = key ? `${key}-${i + 1}` : `${i + 1}`;

            const nodeSelfProps = { key: nodeKey, childrenKey, level, parentNode, rootNode };

            // 执行用户回调函数，得到该节点的一个拷贝
            nodeSelf = callback?.(treeList[i], nodeKey, nodeSelfProps, option);

            // 若存在子节点，则进入递归
            if (treeList[i]?.[childrenKey] instanceof Array) {
                const nodeChildren = recursive(treeList[i][childrenKey], callback, { ...nodeSelfProps, level: level + 1, parentNode: treeList[i] }, option);
                // 当节点的拷贝是一个合法的对象时，才对子节点进行赋值
                getTargetType(nodeSelf) === TYPE_OBJECT && (nodeSelf[childrenKey] = nodeChildren);
            }
            result.push(nodeSelf);
        }
        return result;
    };

    // 返回拷贝结果，层级结构与传入参数保持一致
    const resultList = recursive(treeList, callbackFn, { key: '', childrenKey, level: 0, parentNode: null, rootNode: tree }, option);
    return treeList instanceof Array ? resultList : resultList[0];
}

/**
 * @description  : 树形结构对象过滤(用法类似Array.filter)
 * @param         {*} tree 待过滤的树结构对象，可以是树节点对象，也可以是树节点数组
 * @param         {*} callback 针对每一个树节点执行的回调函数，需要返回一个布尔值,默认返回true
 * @param         {*} option 其他选项，如树节点对象的字段映射关系
 * @return        {*} nodeList 包含满足条件的树节点所组成的数组
 * @example      : deepFilter(treeList, (node) => node.children.length > 0)
 */
function deepFilter(tree, callback, option) {
    // 参数预处理
    const treeList = tree instanceof Array ? tree : [tree];
    const childrenKey = option?.fieldNames?.children || 'children';
    const callbackFn = callback !== undefined ? callback : () => true;

    // 内部递归方法
    const recursive = (treeList, callback, nodeProps, option, result = []) => {
        const { key, childrenKey, level = 0, parentNode, rootNode } = nodeProps || {};
        if (treeList.length <= 0) return result;
        let nodeKey = null;
        for (let i = 0; i < treeList.length; i++) {
            // 将每节点的列表索引按层级拼接作为该节点的唯一标识
            nodeKey = key ? `${key}-${i + 1}` : `${i + 1}`;

            const nodeSelfProps = { key: nodeKey, childrenKey, level, parentNode, rootNode };

            // 执行用户回调函数
            if (callback?.(treeList[i], nodeKey, nodeSelfProps, option)) result.push(treeList[i]);

            // 若存在子节点，则进入递归
            if (treeList[i]?.[childrenKey] instanceof Array) {
                recursive(treeList[i][childrenKey], callback, { ...nodeSelfProps, level: level + 1, parentNode: treeList[i] }, option, result);
            }
        }
        return result;
    };

    return recursive(treeList, callbackFn, { key: '', childrenKey, level: 0, parentNode: null, rootNode: tree }, option);
}

/**
 * @description  : 树形结构对象查找(用法类似Array.find)
 * @param         {*} tree 待查找的树结构对象，可以是树节点对象，也可以是树节点数组
 * @param         {*} callback 针对每一个树节点执行的回调函数，需要返回一个布尔值
 * @param         {*} option 其他选项，如树节点对象的字段映射关系
 * @return        {*} nodeList 满足条件的树节点及其所有父级节点所组成的数组,若未找到则返回undefined
 * @example      : deepFindPath(treeList, (node) => node.children.length > 0)
 */
function deepFindPath(tree, callback, option) {
    // 参数预处理
    const treeList = tree instanceof Array ? tree : [tree];
    const childrenKey = option?.fieldNames?.children || 'children';
    const callbackFn = callback;

    // 内部递归方法
    const recursive = (treeList, callback, nodeProps, option, result = []) => {
        const { key, childrenKey, level = 0, parentNode, rootNode } = nodeProps || {};
        let nodeKey = null;
        for (let i = 0; i < treeList.length; i++) {
            // 将每节点的列表索引按层级拼接作为该节点的唯一标识
            nodeKey = key ? `${key}-${i + 1}` : `${i + 1}`;

            const nodeSelfProps = { key: nodeKey, childrenKey, level, parentNode, rootNode };

            // 执行用户回调函数
            if (callback(treeList[i], nodeKey, nodeSelfProps, option)) {
                result.push(treeList[i]);
                return result;
            }

            // 若存在子节点，则进入递归
            if (treeList[i]?.[childrenKey] instanceof Array) {
                if (recursive(treeList[i][childrenKey], callback, { ...nodeSelfProps, level: level + 1, parentNode: treeList[i] }, option, result)) {
                    result.push(treeList[i]);
                    return result;
                }
            }
        }
    };

    return recursive(treeList, callbackFn, { key: '', childrenKey, level: 0, parentNode: null, rootNode: tree }, option);
}

/**
 * @description  : 树形结构对象查找(用法类似Array.find)
 * @param         {*} tree 待查找的树结构对象，可以是树节点对象，也可以是树节点数组
 * @param         {*} callback 针对每一个树节点执行的回调函数，需要返回一个布尔值
 * @param         {*} option 其他选项，如树节点对象的字段映射关系
 * @return        {*} node 满足条件的树节点对象,若未找到则返回undefined
 * @example      : deepFind(treeList, (node) => node.children.length > 0)
 */
function deepFind(tree, callback, option) {
    return deepFindPath(tree, callback, option)?.[0];
}

export default { TYPE_PRIMARY, TYPE_OBJECT, TYPE_ARRAY, getTargetType, deepForEach, deepMap, deepFilter, deepFind, deepFindPath };
