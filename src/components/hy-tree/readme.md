# HyTree 组件使用说明

#### 属性

| 参数               | 说明                                                | 类型                     | 是否必选 | 可选值 | 默认值                    |
| :----------------- | :-------------------------------------------------- | :----------------------- | :------: | :----: | :------------------------ |
| dataSource         | 树组件的数据源，支持数组与 Promise 回调函数两种形式 | Array \|\| () => Promise |    否    |   —    | () => Promise.resolve([]) |
| fieldNames         | node 节点的字段映射配置，具体看[下表](#fieldNames)  | Object                   |    否    |   —    | 参见下表                  |
| defaultExpandAll   | 是否默认展开全部节点                                | Boolean                  |    否    |   —    | false                     |
| defaultCheckedKeys | 默认选中的节点数组                                  | Array                    |    否    |   —    | —                         |
| border             | 是否显示边框                                        | Boolean                  |    否    |   —    | false                     |
| renderContent      | node 节点内容区自定义渲染函数                       | Function(h, { node })    |    否    |   —    | —                         |

#### 事件

| 事件名称  | 说明               | 声明格式                                        | 回调参数                                                                                                             |
| :-------- | :----------------- | ----------------------------------------------- | :------------------------------------------------------------------------------------------------------------------- |
| onChecked | 点击复选框时的回调 | (value, node, checkedKeys,checkedNodes) => void | value:当前选中节点的值，node:当前选中节点的对象，checkedKeys:当前所有选中节点的 key 数组，当前所有选中节点的对象数组 |

#### node 节点配置说明

| 参数     | 说明         | 类型    | 是否必选 | 可选值 | 默认值 |
| :------- | :----------- | :------ | :------: | :----: | :----- |
| label    | 展示文本     | String  |    否    |   —    | ""     |
| enable   | 是否支持选中 | Boolean |    否    |   —    | true   |
| isLeafe  | 是否叶子节点 | Boolean |    否    |   —    | —      |
| expanded | 是否展开     | Boolean |    否    |   —    | false  |
| children | 子节点       | Array   |    否    |   —    | —      |

#### fieldNames 字段映射说明

| 参数     | 说明         | 类型   | 是否必选 | 可选值 | 默认值     |
| :------- | :----------- | :----- | :------: | :----: | :--------- |
| label    | 展示文本     | String |    否    |   —    | "label"    |
| enable   | 是否支持选中 | String |    否    |   —    | "enable"   |
| isLeafe  | 是否叶子节点 | String |    否    |   —    | "isLeafe"  |
| expanded | 是否展开     | String |    否    |   —    | "expanded" |
| children | 子节点       | String |    否    |   —    | "children" |

##### 示例 1：基本用法

```
<template>
    <div class="home">
        <el-card>
            <div><span>基本用法</span></div>
            <HyTree class="test-tree" :data-source="dataSource" :defaultCheckedKeys="checkedKeys" @onChecked="onChecked" />
        </el-card>
    </div>
</template>

<script>
import {Card as ElCard} from 'element-ui'
import HyTree from '@/components/hy-tree/index.vue';
export default {
    name: 'HomeView',
    components: { ElCard,HyTree },
    data() {
        return {
            dataSource: [
                {
                    label: '一级 1',
                    key: '1001',
                    children: [
                        {
                            label: '二级 1-1',
                            key: '10011',
                            children: [
                                {
                                    label: '三级 1-1-1',
                                    key: '100111'
                                }
                            ]
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
            checkedKeys: ['1001', '100111', '100322', '1003221']
        };
    },
    methods: {
        onChecked(value, node, checkedKeys,checkedNodes) {
            console.log('选中的节点',checkedKeys,checkedNodes)
        }
    }
};
</script>
<style scoped>
.home {
    width: 100%;
    padding: 12px;
    .test-tree {
        margin-top: 12px;
    }
}
</style>
```

##### 示例 2：异步加载数据

```
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
```

##### 示例 3：自定义渲染(插槽方式)

```
<template>
    <div class="home">
        <el-card>
            <div><span>基本用法</span></div>
            <HyTree class="test-tree" :data-source="dataSource">
                <template v-slot="{ node }">
                    <div class="custom-content">
                        <span>{{ node.label }}</span>
                        <ElButton size="mini" type="text" @click="getNodeInfo($event, node)">选中的节点</ElButton>
                    </div>
                </template>
            </HyTree>
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
            dataSource: [
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
        getNodeInfo(e, node) {
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
        margin-top: 12px;

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
```

##### 示例 4：自定义渲染(renderContent 方式)

```
<template>
    <div class="home">
        <el-card>
            <div><span>基本用法</span></div>
            <HyTree class="test-tree" :data-source="dataSource" :renderContent="renderContent"></HyTree>
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
            dataSource: [
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
        margin-top: 12px;

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
```
