/*
 * @Author       : feihu1024 1690806685@qq.com
 * @Date         : 2023-12-28 17:38:57
 * @LastEditors  : feihu1024 1690806685@qq.com
 * @LastEditTime : 2024-01-25 15:12:35
 * @Description  : Tree组件工具类
 */

import tools from '@/utils/tools';

/** 初始化节点 */
function initNode(node, { level, key, fieldNames }, isExpandAll) {
    const label = node[fieldNames.label];
    const children = node[fieldNames.children] || [];
    const isLeafe = !!node[fieldNames.isLeafe] || children.length <= 0;
    const enable = node[fieldNames.enable] === undefined ? true : !!node[fieldNames.enable];
    const expanded = !!node[fieldNames.expanded] || !!isExpandAll;
    const nodeItem = { propsNode: node, label, nodeKey: key, level, enable, expanded, isLeafe, checked: false, indeterminate: false };
    isLeafe || (nodeItem.children = children);
    return nodeItem;
}

/** 初始化节点的选中状态 */
function initNodesChecked(nodeList, checkedKeys) {
    // 查找所有选中节点的nodeKey
    const checkedNodeList = checkedKeys.map((item) => tools.deepFindPath(nodeList, (node) => node.propsNode.key === item)).filter((item) => !!item);
    // 按降序进行层级排序
    checkedNodeList.sort((aList, bList) => {
        return bList[0].nodeKey.split('-').length - aList[0].nodeKey.split('-').length
    });
    // 设置选中状态和半选状态
    checkedNodeList.forEach((nodePath) => setNodeChecked(nodePath, true));
}

/** 设置某个节点及其所有子级、父级节点的选中状态 */
function setNodeChecked(nodePath, value) {
    // 直接设置当前节点及其所有子节点为选中
    tools.deepForEach(nodePath[0], (item) => {
        if (item.enable) {
            item.checked = value;
            item.indeterminate = false;
        }
    });
    // 循环设置每一级父节点的选中状态和半选状态，每一个父级的状态只取决于它下一级所有children的状态组合
    for (let i = 1; i < nodePath.length; i++) {
        const checkedCount = nodePath[i].children.filter((item) => item.checked).length;
        const indeterminateCount = nodePath[i].children.filter((item) => item.indeterminate).length;
        const childrenCount = nodePath[i].children.filter((item) => item.enable).length;
        nodePath[i].indeterminate = indeterminateCount > 0 || (checkedCount > 0 && checkedCount < childrenCount);
        nodePath[i].checked = checkedCount >= childrenCount;
    }
}

export default { initNode, initNodesChecked, setNodeChecked };
