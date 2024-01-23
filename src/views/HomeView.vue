<template>
    <div class="home">
        <el-card>
            <div><span>基本用法</span></div>
            <div class="action-bar">
                <ElButton size="mini" @click="getDataByType('folder')">folder类型</ElButton>
                <ElButton size="mini" @click="getDataByType('file')">file类型</ElButton>
                <ElButton size="mini" @click="getDataByType()">全部类型</ElButton>
            </div>
            <HyTree class="test-tree" :data-source="dataSource"></HyTree>
        </el-card>
    </div>
</template>

<script>
import { Card as ElCard, Button as ElButton } from 'element-ui'
import HyTree from '@/components/hy-tree/index.vue';

const treeList = [
    {
        label: '一级 1',
        key: '1001',
        type: 'folder',
        children: [
            {
                label: '二级 1-1',
                key: '10011',
                type: 'folder',
            },
            {
                label: '二级 1-2',
                key: '10012',
                type: 'file',
            }
        ]
    },
    {
        label: '一级 2',
        key: '1002',
        type: 'file',
    },
    {
        label: '一级 3',
        key: '1003',
        type: 'file',
    }
]

// 模拟后端接口
const getTreeListAsync = (params) => {
    const { type } = params || {}
    return Promise.resolve(type === undefined ? treeList : treeList.filter(item => item.type === type))
}

export default {
    name: 'HomeView',
    components: { ElCard, ElButton, HyTree },
    data() {
        return {
            dataSource: treeList,
        };
    },
    methods: {
        getDataByType(type) {
            this.dataSource = () => getTreeListAsync({ type })
        }
    }
};
</script>
<style >
.home {
    width: 100%;
    padding: 12px;

    .test-tree {
        margin-top: 12px;

        .custom-content {
            width: 100%;
            display: flex;
            align-items: center;
            justify-content: space-between;
        }
    }

    .action-bar {
        margin-top: 12px;
    }
}
</style>
