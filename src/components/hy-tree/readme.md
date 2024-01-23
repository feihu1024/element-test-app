# HyTree 组件使用说明

#### 属性

| 参数             | 说明                             | 类型    | 是否必选 | 可选值 | 默认值   |
| :--------------- | :------------------------------- | :------ | :------: | :----: | :------- |
| data             | 展示数据                         | Array   |    否    |   —    | —        |
| fieldNames       | node 节点的字段映射配置，具体看[下表](#fieldNames)  | Object  |    否    |   —    | 参见下表 |
| defaultExpandAll | 是否默认展开全部节点                 | Boolean |    否    |   —    | false    |
| defaultCheckedKeys      | 默认选中的节点数组 | Array   |    否    |   —    | —        |
| border           | 是否显示边框                     | Boolean |    否    |   —    | false    |
| renderContent           | node节点内容区自定义渲染函数                     | Function(h, { node }) |    否    |   —    | false    |

#### 事件

| 事件名称  | 说明               | 声明格式                         | 回调参数                                                                               |
| :-------- | :----------------- | -------------------------------- | :------------------------------------------------------------------------------------- |
| onChecked | 点击复选框时的回调 | (value, node, checkedKeys,checkedNodes) => void | value:当前选中节点的值，node:当前选中节点的对象，checkedKeys:当前所有选中节点的key数组，当前所有选中节点的对象数组 |

#### fieldNames 字段映射说明

| 参数      | 说明                                | 类型   | 是否必选 | 可选值 | 默认值      |
| :-------- | :---------------------------------- | :----- | :------: | :----: | :---------- |
| label     | 展示文本                            | string |    否    |   —    | "label"     |
| key       | node 节点的 key，在整个树中应当唯一 | string |    否    |   —    | "key"       |
| checkable | 是否支持选中                        | string |    否    |   —    | "checkable" |
| isLeafe   | 是否叶子节点                        | string |    否    |   —    | "isLeafe"   |
| children  | 子节点                              | string |    否    |   —    | "children"  |

##### 示例 1：基本用法

```
<template>
    <div class="home">
        <el-card>
            <div><span>基本用法</span></div>
            <HyTree class="test-tree" :data="data" :defaultCheckedKeys="checkedKeys" @onChecked="onChecked" />
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
            data: [
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
        margin-top: 40px;
    }
}
</style>

```

##### 示例2：自定义渲染(插槽方式)
```
<template>
    <div class="home">
        <el-card>
            <div><span>基本用法</span></div>
            <HyTree class="test-tree" :data="data">
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
```

##### 示例2：自定义渲染(renderContent方式)
```
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
```