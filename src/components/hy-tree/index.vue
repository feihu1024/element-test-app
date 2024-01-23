<template>
    <div :class="!!border ? 'hy-tree border' : 'hy-tree'">
        <tree-node v-for="node in nodeList" :key="node.nodeKey" :node="node" :rootTree="rootTree" :activeKey="activeKey"
            :renderContent="renderContent"></tree-node>
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
        fieldNames: { type: Object, default: () => defaultFieldNames },
        defaultExpandAll: { type: Boolean, default: false },
        defaultCheckedKeys: { type: Array, default: () => [] },
        border: { type: Boolean, default: true },
        dataSource: { type: [Array, Function], default: () => Promise.resolve([]) },
        renderContent: Function
    },
    data() {
        return {
            rootTree: this,
            activeKey: null,
            treeData: [],
            checkedKeys: this.defaultCheckedKeys,
        };
    },
    computed: {
        innerFieldNames() {
            return { ...defaultFieldNames, ...this.fieldNames };
        },
        getTreeData() {
            return this.dataSource instanceof Array ? () => Promise.resolve(this.dataSource) : this.dataSource
        },
        nodeList() {
            // 设置每个节点的基本属性
            const list = tools.deepAdvance(this.treeData, (node, index, extOption) => utils.initNode(node, extOption, this.defaultExpandAll), { fieldNames: this.innerFieldNames });
            // 设置每个节点的选中状态
            utils.initNodesChecked(list, this.checkedKeys);
            return list;
        }
    },
    watch: {
        // 监听数据加载函数的变化，重新加载数据
        getTreeData(_getTreeData) {
            this.getTreeData().then(res => this.treeData = res)
        }
    },
    /** 注册事件监听函数 */
    created() {
        // 初始加载数据
        this.getTreeData().then(res => this.treeData = res)
        // 监听节点点击：记录当前被点击的节点
        treeBus.$on('activeNode', (key) => {
            this.activeKey = key;
        });
        // 监听节点选中状态变化：更新该节点及其相关节点的选中状态,触发用户onChecked事件
        treeBus.$on('checkedNode', (node, checked) => {
            const nodePath = tools.deepFindPath(this.nodeList, (item) => item.nodeKey === node.nodeKey);
            utils.setNodeChecked(nodePath, checked);

            // 更新checkedKeys列表,触发用户onChecked事件
            const checkedNodes = tools.deepFilter(this.nodeList, (item) => item.checked)
            const _checkedKeys = checkedNodes.map((item) => item.propsNode.key);
            this.checkedKeys = _checkedKeys
            this.$emit('onChecked', checked, node, _checkedKeys, checkedNodes);
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
