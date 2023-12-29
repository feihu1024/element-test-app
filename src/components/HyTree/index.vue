<template>
    <div :class="!!border ? 'hy-tree border' : 'hy-tree'">
        <tree-node v-for="node in nodeList" :key="node.nodeKey" :node="node" :activeKey="activeKey"></tree-node>
        <div class="empty" v-if="nodeList.length < 1">暂无数据</div>
    </div>
</template>
<script>
import tools from '@/utils/tools';

import TreeNode from './tree-node.vue';
import treeBus from './tree-bus';
import utils from './utils';

const defaultFieldNames = { label: 'label', key: 'key', checkable: 'checkable', isLeafe: 'isLeafe', children: 'children' };

export default {
    name: 'HyTree',
    components: { TreeNode },
    props: {
        data: { type: Array, default: () => [] },
        fieldNames: { type: Object, default: () => defaultFieldNames },
        defaultExpandAll: { type: Boolean, default: false },
        checkedKeys: { type: Array, default: () => [] },
        border: { type: Boolean, default: true }
    },
    data() {
        return {
            activeKey: null
        };
    },
    computed: {
        innerFieldNames() {
            return { ...defaultFieldNames, ...this.fieldNames };
        },
        nodeList() {
            // 设置每个节点的基本属性
            const list = tools.deepAdvance(this.data, (node, index, extOption) => utils.initNode(node, extOption, this.defaultExpandAll), { fieldNames: this.innerFieldNames });
            // 设置每个节点的选中状态
            utils.initNodesChecked(list, this.checkedKeys);
            return list;
        }
    },
    /** 注册事件监听函数 */
    created() {
        // 监听节点点击：记录当前被点击的节点
        treeBus.$on('activeNode', (key) => {
            this.activeKey = key;
        });
        // 监听节点选中状态变化：更新该节点及其相关节点的选中状态,触发用户onChecked事件
        treeBus.$on('checkedNode', (node, checked) => {
            const nodePath = tools.deepFindPath(this.nodeList, (item) => item.nodeKey === node.nodeKey);
            utils.setNodeChecked(nodePath, checked);

            // 更新checkedKeys列表,触发用户onChecked事件
            const newCheckedKeys = tools.deepFilter(this.nodeList, (item) => item.checked).map((item) => item.propsNode.key);
            this.$emit('onChecked', checked, node.propsNode, newCheckedKeys);
        });
    },
    /** 取消事件监听函数 */
    beforeDestroy() {
        treeBus.$off('activeKey');
        treeBus.$off('checkedNode');
    }
};
</script>
<style>
.hy-tree {
    .empty {
        display: flex;
        height: 100px;
        justify-content: center;
        align-items: center;
        font-size: 14px;
        color: #909399;
    }
}
.hy-tree.border {
    border: 1px solid #ebebeb;
    border-radius: 4px;
    padding: 12px;
}
</style>
