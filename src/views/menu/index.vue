<template>
    <div class="app-container">
        <!-- 行内表单(搜索框) -->
        <el-form :inline="true" :model="query">
            <el-form-item label="菜单名称">
                <el-input v-model="query.name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button icon='el-icon-search' type="primary" @click="fetchData">查询</el-button>
                <el-button icon='el-icon-refresh' class="filter-item" @click="reload">重置</el-button>
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd(0)">添加</el-button>
            </el-form-item>
        </el-form>
        <!-- 列表 -->
        <!-- 渲染树形数据时，必须要指定 row-key, list集合中的 id属性 -->
        <el-table
            row-key="id"
            :data="list"
            stripe
            border
            style="width: 100%">
            <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
            <el-table-column align="center" prop="name" label="名称" ></el-table-column>
            <el-table-column align="center" prop="url" label="请求地址" ></el-table-column>
            <el-table-column align="center" prop="code" label="权限标识" ></el-table-column>
            <el-table-column align="center" prop="type" label="类型" >
                <template slot-scope="scope">
                    <!-- scope可以获取行内的信息 -->
                    <span v-if="scope.row.type === 1">目录</span>
                    <span v-if="scope.row.type === 2">菜单</span>
                    <span v-if="scope.row.type === 3">按钮</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="icon" label="图标" >
                <template slot-scope="scope">
                    <!-- scope可以获取行内的信息 -->
                    <i :class="scope.row.icon"></i>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="sort" label="排序"></el-table-column>
            <el-table-column align="center" label="操作" width="260">
                <template slot-scope="scope">
                    <el-button type="primary" size="mini" @click="handleAdd(scope.row.id)">添加</el-button>
                    <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>     
        </el-table>

        <!-- 新增弹框 -->
        <edit :title="edit.title" :visible="edit.visible" :formData="edit.formData" :remoteClose="remoteClose"/>
    </div>
</template>
<script>
import api from "@/api/menu"
import Edit from "./edit"
export default {
    name:'Menu',
    components:{ Edit },
    data() {
        return {
            list:[],
            query:{},
            edit:{
                title:'',
                visible:false,
                formData:{}
            }
        }
    },
    created() {
        this.fetchData()
    },
    methods:{
        async fetchData() {
            const response = await api.getList(this.query)
            this.list = response.data
        },
        // 添加
        handleAdd(id) {
            // // id=0 是新增一级菜单，其他值是新增到此id下的作为子菜单
            this.edit.formData.parentId = id
            this.edit.title = "新增"
            this.edit.visible = true    
        },
        //编辑
        handleEdit(id) {
            api.getById(id).then(response=>{
                if(response.code === 20000) {
                    this.edit.formData = response.data
                    this.edit.title = '编辑'
                    this.edit.visible = true
                }
            })
        },
        //删除
        handleDelete(id) {
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 确认删除
                api.deleteById(id).then(response => {
                    this.$message({
                        type: response.code === 20000 ? 'success' : 'error',
                        message: response.message
                    });
                    this.fetchData()
                })
               
            }).catch(() => {
                // 取消
            });
        },
        // 重置
        reload() {
            this.query = {}
            this.fetchData()
        },
        // 触发关闭弹出的新增修改子组件窗口
        remoteClose() {
            this.edit.formData = {}
            this.edit.visible = false
            this.fetchData()
        }
    }

}
</script>