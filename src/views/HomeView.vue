<template>
    <div class="home">
        <el-card>
            <div><span>基本用法</span></div>
            <HyTree class="test-tree" :data="data" :renderContent="renderContent"></HyTree>
            <div class="node-info-text" v-show="nodeInfo">
                <span>节点信息：</span>
                <span>{{ nodeInfo }}</span>
            </div>
        </el-card>
    </div>
</template>

<script>
import { Card as ElCard, Button as ElButton } from 'element-ui'
import HyTree from '@/components/hy-tree/index.vue';
export default {
    name: 'HomeView',
    components: { ElCard, ElButton, HyTree },
    data() {
        return {
            data: [
                {
                    label: '一级 1',
                    key: '1001',
                    children: [
                        {
                            label: '二级 1-1',
                            key: '10011',
                        },
                        {
                            label: '二级 1-2',
                            key: '10012',
                        }
                    ]
                },
                {
                    label: '一级 2',
                    key: '1002',
                },
                {
                    label: '一级 3',
                    key: '1003',
                }
            ],
            nodeInfo: null
        };
    },
    methods: {
        renderContent(h, { node }) {
            return <div class="custom-content" >
                <span>{node.label}</span>
                <ElButton size="mini" type="text" on-click={(e) => this.getNodeInfo(e, node)}>选中的节点</ElButton>
            </div>
        }, getNodeInfo(e, node) {
            e.stopPropagation();
            const { children, ...nodeSelf } = node.propsNode
            this.nodeInfo = nodeSelf
        }
    }
};
</script>
<style >
.home {
    width: 400px;
    padding: 12px;

    .test-tree {
        margin-top: 40px;

        .custom-content {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }

    .node-info-text {
        margin-top: 12px;
    }
}
</style>
