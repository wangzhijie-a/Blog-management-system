<template>
    <div class="app-container">
         <!-- 行内表单(搜索框) -->
        <el-form :inline="true" :model="query">
            <el-form-item label="角色名称">
                <el-input v-model="query.name"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button icon='el-icon-search' type="primary" @click="queryData">查询</el-button>
                <el-button icon='el-icon-refresh' class="filter-item" @click="reload">重置</el-button>
                <el-button v-if="!roleIds" type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">新增</el-button>
                <el-button v-if="roleIds" type="success" icon="el-icon-circle-plus-outline" @click="handleUserRole">设置角色</el-button>
            </el-form-item>
        </el-form>

        <!-- 列表 -->
        <!-- 多选时加上row-key和ref属性 -->
        <el-table
            :data="list"
            row-key="id"
            @selection-change="handleSelectionChange"
            ref="dataTable"
            stripe
            border
            style="width: 100%">
            <!-- 勾选框 -->
            <el-table-column
                v-if="roleIds"
                type="selection"
                reserve-selection
                align="center"
                width="55">
            </el-table-column>
            <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
            <el-table-column align="center" prop="name" label="角色名称" ></el-table-column>
            <el-table-column align="center" prop="remark" label="备注" ></el-table-column>
            <el-table-column align="center" label="操作" v-if="!roleIds">
                <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handlePermission(scope.row.id)">分配权限</el-button>
                    <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>     
        </el-table>

        <!-- 分页 -->
        <el-pagination
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="page.current"
            :page-sizes="[10,20,50]"
            :page-size="page.size"
            layout="total, sizes, prev, pager, next, jumper"
            :total="page.total">
        </el-pagination>

        <!-- 弹出框 -->
        <edit :title="edit.title" :visible="edit.visible" :formData="edit.formData" :remoteClose="remoteClose"/>

        <permission title="分配权限" :visible="pre.visible" :roleId="pre.roleId" :remoteClose="remotePreClose"/>
    </div>
</template>
<script>
import api from "@/api/role"
import Edit from "./edit"
import Permission from "./permission"
export default {
    name:'Role',
    components:{Edit,Permission},
    // 当用户管理模块，将当前这个组件文件作为子组件时。进行接收父组件传递过来的值
    // 子组件接收父组件传过来的roleIds，判断是否显示新增和操作
    props:{
        roleIds:{
            type:Array,
            default:null
        }
    },
    data(){
        return {
            list:[],
            page:{
                total:0,
                current:1,
                size:20
            },
            query:{},
            edit:{
                title:'',
                visible:false,
                formData:{} 
            },
            pre:{
                visible:false,
                roleId:null
            },
            checkedRoleList:[]  //存储选中对象角色
        }
    },
    created() {
        this.fetchData()
    },
    methods:{
        fetchData() {
            api.getList(this.query,this.page.current,this.page.size).then(response=>{
                if(response.code === 20000) {
                    this.list = response.data.records
                    this.page.total = response.data.total
                    // 列表有数据后，勾选用户角色
                    this.checkedRoles()
                }
            })
        },
        // 勾选用户角色
        checkedRoles() {
            //清空上一次的选择
            this.$refs.dataTable.clearSelection();
            if(this.roleIds) {
                // 取出列表中每一个角色，与用户角色ids进行匹配，匹配上了则选中
                this.list.forEach(item=>{
                    // 匹配上了
                    if(this.roleIds.indexOf(item.id) !== -1) {
                        this.$refs.dataTable.toggleRowSelection(item);
                    }
                })
            }

        },
        // 编辑
        handleEdit(id) {
            api.getById(id).then(response => {
                if(response.code === 20000) {
                    this.edit.formData = response.data
                }
                this.edit.title = "编辑"
                this.edit.visible = true
            })
        },
        // 删除
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
        // 分页
        handleSizeChange(val) {
            this.page.size = val
            this.fetchData()
        },
        handleCurrentChange(val) {
            this.page.current = val
            this.fetchData()
        },
        // 查询
        queryData() {
            this.page.current = 1
            this.fetchData()
        },
        reload() {
            this.query = {}
            this.fetchData()
        },
        // 新增
        handleAdd() {
            this.edit.title = "新增"
            this.edit.visible = true
        },
        // 关闭弹出框
        remoteClose() {
            this.edit.formData = {}
            this.edit.visible = false
            this.fetchData()
        },
        // 分配权限
        handlePermission(id) {
            this.pre.visible = true
            // 将点击那个角色id传递给子组件，进行查询当前角色已经拥有的
            this.pre.roleId = id
        },
        //关闭分配权限弹窗
        remotePreClose() {
            this.pre.visible = false
            this.pre.roleId = null
            this.fetchData()
        },
        // 每次勾选框变化时，会触发该事件，收集选中数据。
        handleSelectionChange(val){
            // 是一个role对象数组
            this.checkedRoleList = val
        },
        // 设置角色
        handleUserRole() {
            const checkedRoleIds = []
            // 遍历获取已选中的角色id
            this.checkedRoleList.forEach(item=>{
                checkedRoleIds.push(item.id)
            })
            // 触发父组件的saveUserRole事件保存用户角色id
            this.$emit("saveUserRole",checkedRoleIds)
        }
    },
    //使用 watch 选项对 roleIds 属性的监听，当 roleIds 属性改变后 ，也就是重新打开窗口后就重新查询数据。
    watch:{
        roleIds() {
            this.query = []
            this.queryData()
        }
    }
}
</script>