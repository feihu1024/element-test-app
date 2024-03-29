<template>
    <div class="hy-tree-node-wrapper">
        <div :class="isActive ? 'tree-node active' : 'tree-node'" :style="`padding-left: ${node.level * 20}px;`" @click="onNodeClick">
            <span class="node-expanded-icon"><i v-if="!node.isLeafe" class="el-icon-caret-right" :style="`transform: rotate(${expanded ? 90 : 0}deg);`"></i></span>
            <el-checkbox v-if="node.enable" class="node-checkbox" v-model="node.checked" :indeterminate="node.indeterminate" @change="onCheckedChange" />
            <node-content></node-content>
        </div>
        <el-collapse-transition v-if="!node.isLeafe">
            <div v-show="expanded">
                <tree-node v-for="node in node.children" :key="node.nodeKey" :node="node" :rootTree="rootTree" :activeKey="activeKey" :renderContent="renderContent"></tree-node>
            </div>
        </el-collapse-transition>
    </div>
</template>
<script>
import ElCollapseTransition from 'element-ui/lib/transitions/collapse-transition';
import { Checkbox as ElCheckbox } from 'element-ui';
import treeBus from './tree-bus';

export default {
    name: 'TreeNode',
    components: {
        ElCollapseTransition,
        ElCheckbox,
        NodeContent: {
            render(h) {
                const parent = this.$parent;
                const { renderContent, _renderProxy: renderProxy, node, rootTree } = parent;
                const defaultSlot = rootTree.$scopedSlots.default;

                // 优先使用renderContent渲染，其次使用默认插槽渲染，最后使用默认值渲染
                const content = renderContent ? renderContent.call(renderProxy, h, { node }) : defaultSlot?.({ node }) || <span class="node-content">{node.label}</span>;
                return content;
            }
        }
    },
    props: {
        node: { nodeKey: String, expanded: Boolean, label: String, level: Number, children: Array },
        rootTree: Object,
        activeKey: String,
        renderContent: Function
    },
    data() {
        return {
            expanded: this.node.expanded
        };
    },
    computed: {
        isActive() {
            return this.activeKey === this.node.nodeKey;
        }
    },
    methods: {
        onNodeClick() {
            this.expanded = !this.expanded;
            treeBus.$emit('activeNode', this.node.nodeKey);
        },
        onCheckedChange(checked) {
            treeBus.$emit('checkedNode', this.node, checked);
        }
    }
};
</script>
<style>
.hy-tree-node-wrapper {
    .tree-node {
        display: flex;
        align-items: center;
        padding: 6px 12px;
        cursor: pointer;

        .node-expanded-icon {
            width: 16px;

            i {
                position: relative;
                top: -1px;
                font-size: 12px;
                color: #c0c4cc;
                transition: transform 0.3s;
            }
        }

        .node-checkbox {
            margin-right: 8px;
        }

        .node-content {
            color: #606266;
        }
    }

    .tree-node.active,
    .tree-node:hover {
        background-color: #f5f7fa;
    }
}
</style>
