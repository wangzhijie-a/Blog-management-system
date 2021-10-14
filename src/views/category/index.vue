<template>
    <div class="app-container">
        <!-- 行内表单(搜索框) -->
        <el-form :inline="true" :model="query">
            <el-form-item label="分类名称">
                <el-input v-model="query.name"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <!-- clearable清空 filterable是否可搜索 -->
                <el-select v-model="query.status" clearable filterable style="width: 85px">
                <el-option v-for="item in statusOptions" :key="item.code" :label="item.name" :value="item.code"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button icon='el-icon-search' type="primary" @click="queryData">查询</el-button>
                <el-button icon='el-icon-refresh' class="filter-item" @click="reload">重置</el-button>
                <el-button type="primary" @click="openAdd">添加</el-button>
            </el-form-item>
        </el-form>

        <!-- 列表 -->
        <el-table
            :data="list"
            stripe
            border
            style="width: 100%">
            <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
            <el-table-column align="center" prop="name" label="姓名" ></el-table-column>
            <el-table-column align="center" prop="sort" label="排序" ></el-table-column>
            <el-table-column align="center" prop="remark" label="备注" ></el-table-column>
            <el-table-column align="center" prop="status" label="状态" >
                <template slot-scope="scope">
                    <!-- scope可以获取行内的信息 -->
                    <el-tag :type="scope.row.status | statusFilter">
                        {{scope.row.status ? '正常' : '禁用'}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="createDate" label="创建日期"></el-table-column>
            <el-table-column align="center" label="操作">
                <template slot-scope="scope">
                    <el-button
                    size="mini"
                    @click="handleEdit(scope.row.id)">编辑</el-button>
                    <el-button
                    size="mini"
                    type="danger"
                    @click="handleDelete(scope.row.id)">删除</el-button>
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

        <!-- 子组件(新增和编辑) -->
        <edit :title="edit.title" :visible="edit.visible" :formData="edit.formData" :remoteClose="remoteClose"/>
    </div>
</template>
<script>
import api from "@/api/category"
import Edit from './edit'
// 用于下拉框
const statusOptions = [
    {code:0,name:'禁用'},
    {code:1,name:'正常'}
]
export default {
    name:'Category',
    components:{Edit},
    data(){
        return {
            list:[],
            page:{     //分页相关
                total:0,
                current:1,
                size:20
            },
            query:{},  //查询条件
            statusOptions,
            edit :{
                title:'',
                visible:false,
                formData:{
                    id:null,
                    name:'',
                    sort:null,
                    remark:''
                }
            }
        }
    },
    created() {
        this.fetchData()
    },
    // 定义过滤器转换状态样式
    filters:{
        statusFilter(status) {
            const statusMap = {0:'danger',1:'success'}
            return statusMap[status]
        }
    },
    methods:{
        fetchData() {
            api.getList(this.query,this.page.current,this.page.size).then(response => {
                console.log(response)
                this.list = response.data.records,
                this.page.total = response.data.total
            })
        },
        // 编辑
        handleEdit(id){
            api.getById(id).then(response=>{
                if(response.code === 20000){
                    //将查询的数据传递
                    this.edit.formData = response.data,
                    this.edit.title = "编辑",
                    this.edit.visible = true
                }
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
        handleSizeChange(val) {
            this.page.size = val
            this.fetchData()
        },
        handleCurrentChange(val){
            this.page.current = val
            this.fetchData()
        },
        // 查询
        queryData() {
            // 把页码变为第一页
            this.page.current = 1
            this.fetchData()
        },
        // 重置
        reload() {
            this.query = {}
            this.fetchData()
        },
        // 触发关闭弹出的新增修改子组件窗口
        remoteClose() {
            // 一定要加上这个，不然有时候表单输入不了值
            this.edit.formData={}
            this.edit.visible = false
            this.fetchData()
        },
        openAdd() {
            this.edit.title = "新增",
            this.edit.visible = true
        }
    }
}
</script>