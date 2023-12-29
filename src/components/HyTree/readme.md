# HyTree 组件使用说明

#### 属性

| 参数             | 说明                             | 类型    | 是否必选 | 可选值 | 默认值   |
| :--------------- | :------------------------------- | :------ | :------: | :----: | :------- |
| data             | 展示数据                         | array   |    否    |   —    | —        |
| fieldNames       | node 节点的配置选项，具体看下表  | object  |    否    |   —    | 参见下表 |
| defaultExpandAll | 是否默认展开全部                 | boolean |    否    |   —    | false    |
| checkedKeys      | 选中的节点 keys 列表（受控模式） | array   |    是    |   —    | —        |
| border           | 是否显示边框                     | boolean |    否    |   —    | false    |

#### 事件

| 事件名称  | 说明               | 声明格式                         | 回调参数                                                                               |
| :-------- | :----------------- | -------------------------------- | :------------------------------------------------------------------------------------- |
| onChecked | 点击复选框时的回调 | (value,node,checkedKeys) => void | value:复选框选中值，node:触发该事件的节点对象，checkedKeys:当前所有选中节点的 key 列表 |

#### node 节点配置

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
            <HyTree class="test-tree" :data="data" :checkedKeys="checkedKeys" @onChecked="onChecked" />
        </el-card>
    </div>
</template>

<script>
import HyTree from '@/components/HyTree/index.vue';
export default {
    name: 'HomeView',
    components: { HyTree },
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
                    children: [
                        {
                            label: '二级 2-1',
                            key: '10021',
                            children: [
                                {
                                    label: '三级 2-1-1',
                                    key: '100211'
                                }
                            ]
                        },
                        {
                            label: '二级 2-2',
                            key: '10022',
                            children: [
                                {
                                    label: '三级 2-2-1',
                                    key: '100221'
                                }
                            ]
                        }
                    ]
                },
                {
                    label: '一级 3',
                    key: '1003',
                    children: [
                        {
                            label: '二级 3-1',
                            key: '10031',
                            children: [
                                {
                                    label: '三级 3-1-1',
                                    key: '100311'
                                }
                            ]
                        },
                        {
                            label: '二级 3-2',
                            key: '10032',
                            children: [
                                {
                                    label: '三级 3-2-1',
                                    key: '100321'
                                },
                                {
                                    label: '三级 3-2-2',
                                    key: '100322',
                                    children: [{ label: '四级级 3-2-2-1', key: '1003221' }]
                                }
                            ]
                        }
                    ]
                }
            ],
            checkedKeys: ['1001', '100111', '100322', '1003221']
        };
    },
    methods: {
        onChecked(checked, node, checkedKeys) {
            this.checkedKeys = checkedKeys;
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
