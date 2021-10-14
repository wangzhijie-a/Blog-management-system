<template>
    <div class="app-container">
        <!-- 行内表单(搜索框) -->
        <el-form :inline="true" :model="query">
            <el-form-item label="用户名">
                <el-input v-model="query.username"></el-input>
            </el-form-item>
            <el-form-item label="手机号">
                <el-input v-model="query.mobile"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button icon='el-icon-search' type="primary" @click="queryData">查询</el-button>
                <el-button icon='el-icon-refresh' class="filter-item" @click="reload">重置</el-button>
                <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">添加</el-button>
            </el-form-item>
        </el-form>

        <!-- 列表 -->
        <el-table
            :data="list"
            highlight-current-row
            border
            style="width: 100%">
            <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
            <el-table-column align="center" prop="username" label="用户名" ></el-table-column>
            <el-table-column align="center" prop="mobile" label="手机号" ></el-table-column>
            <el-table-column align="center" prop="email" label="邮箱" ></el-table-column>
            <el-table-column align="center" prop="isAccountNonExpired" label="账号过期" >
                <template slot-scope="scope">
                    <!-- scope可以获取行内的信息 -->
                    <el-tag v-if="scope.row.isAccountNonExpired === 0" type="danger">过期</el-tag>
                    <el-tag v-if="scope.row.isAccountNonExpired === 1" type="success">正常</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="isAccountNonLocked" label="账号锁定" >
                <template slot-scope="scope">
                    <!-- scope可以获取行内的信息 -->
                    <el-tag v-if="scope.row.isAccountNonLocked === 0" type="danger">锁定</el-tag>
                    <el-tag v-if="scope.row.isAccountNonLocked === 1" type="success">正常</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="isCredentialsNonExpired" label="密码过期" >
                <template slot-scope="scope">
                    <!-- scope可以获取行内的信息 -->
                    <el-tag v-if="scope.row.isCredentialsNonExpired === 0" type="danger">过期</el-tag>
                    <el-tag v-if="scope.row.isCredentialsNonExpired === 1" type="success">正常</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="isEnabled" label="是否可用" >
                <template slot-scope="scope">
                    <!-- scope可以获取行内的信息 -->
                    <el-tag v-if="scope.row.isEnabled === 0" type="danger">已删除</el-tag>
                    <el-tag v-if="scope.row.isEnabled === 1" type="success">可用</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" label="操作" width="340">
                <template slot-scope="scope" v-if="scope.row.isEnabled == 1">
                    <el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
                    <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
                    <el-button size="mini" type="success" @click="handleRole(scope.row.id)">设置角色</el-button>
                    <el-button size="mini" type="success" @click="handlePwd(scope.row.id)">设置密码</el-button>
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

        <edit :title="edit.title" :visible="edit.visible" :formData="edit.formData" :remoteClose="remoteClose" />

        <!-- 设置角色 -->
        <el-dialog
            title="设置角色"
            :visible.sync="role.visible"
            width="65%"
        >
        <!-- role.roleIds是当前用户所拥有的角色id -->
            <role :roleIds="role.roleIds" @saveUserRole="saveUserRole"/>
        </el-dialog>

        <!-- 修改密码 -->
        <password title="修改密码" :userId="pwd.userId" :visible="pwd.visible" :remoteClose="remotePwdClose"/>
        
    </div>
</template>
<script>
import * as api from "@/api/user"
import Edit from "./edit"
import Role from "../role"
import Password from "./password"
export default {
    name:'User',
    components:{ Edit,Role,Password },
    data() {
        return {
            list:[],  //列表数据
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
            role:{
                visible:false,
                // 传递到子组件时，至少会传递一个空数组[],子组件判断是否有roleIds值
                roleIds:[],  //// 封装用户拥有角色ids，传递给角色列表子组件
                userId:null
            },
            pwd:{
                userId:null,
                visible:false
            }
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
                }
            })
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
        // 编辑
        handleEdit(id) {
            // 通过id查询数据
            api.getById(id).then(response=>{
                if(response.code === 20000) {
                    this.edit.formData = response.data
                }
            })
            this.edit.title = '编辑'
            this.edit.visible = true
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
        // 设置角色
        handleRole(id) {
            this.role.userId = id
            api.getRoleIdsByUserId(id).then(response=>{
                if(response.code === 20000) {
                    this.role.roleIds = response.data
                    this.role.visible = true
                }
            })
            
        },
        // 查询
        queryData() {
            this.page.current = 1
            this.fetchData()
        },
        // 重置
        reload() {
            this.query = {}
            this.fetchData()
        },
        // 新增
        handleAdd() {
            this.edit.visible = true
            this.edit.title = "新增-默认密码和用户名一致"
        },
        remoteClose() {
            this.edit.formData = {}
            this.edit.visible = false
            this.fetchData()
        },
        //@saveUserRole="saveUserRole" 声明事件函数，子组件 Role 通过 this.$emit('saveUserRole') 触发此事
        //件，调用当前 user/index.vue 中的 saveUserRole 方法来保存选中的用户角色。
        saveUserRole(roleIds) {
            api.saveUserRole(this.role.userId,roleIds).then(response=>{
                if(response.code === 20000) {
                    this.$message({
                        type:'success',
                        message:"保存成功"
                    })
                    this.role.visible = false
                }else{
                    this.$message({
                        type:'error',
                        message:'保存失败'
                    })
                }
            })
        },

        // 设置密码
        handlePwd(id) {
            this.pwd.userId = id
            this.pwd.visible = true
        },
        // 关闭修改密码窗口
        remotePwdClose() {
            this.pwd.userId = null
            this.pwd.visible = false
            this.fetchData()
        }
    }
}
</script>