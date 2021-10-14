<template>
<!-- class="app-container" 加上会有表格 -->
    <div class="app-container">
        <!-- 行内表单(搜索框) -->
        <el-form :inline="true" :model="query">
            <el-form-item label="标签名称">
                <el-input v-model="query.name"></el-input>
            </el-form-item>
            <el-form-item label="分类名称">
                <!-- clearable清空 filterable是否可搜索 -->
                <el-select v-model="query.categoryId" clearable filterable>
                    <!-- :label是显示的值  :value是提交的值 -->
                <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
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
            <el-table-column align="center" prop="name" label="标签名称" ></el-table-column>
            <el-table-column align="center" prop="categoryName" label="标签分类" ></el-table-column>
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

        <!-- 新增 -->
        <edit :title="edit.title" :visible="edit.visible" 
        :categoryList="categoryList"
        :formData="edit.formData"
        :remoteClose="remoteClose"/>
    </div>
</template>
<script>
import api from "@/api/label"
import categoryApi from "@/api/category"
import Edit from "./edit"
export default {
    name:'Label',
    components:{Edit},
    data() {
        return {
            list:[],
            // 分页相关
            page:{
                total:0,
                current:1,
                size:20
            },
            // 查询条件
            query:{},
            // 数组存储正常状态的分类
            categoryList:[],
            // 子组件引用对象
            edit:{
                title:'',
                visible:false,
                formData:{}  //点击编辑时，将数据传递给子组件
            }
        }
    },
    created() {
        this.fetchData(),
        this.getCategoryList()
    },
    methods:{
        fetchData(){
            api.getList(this.query,this.page.current,this.page.size).then(response=>{
                if(response.code===20000){
                    this.list = response.data.records
                    this.page.total = response.data.total
                }
            })
        },
        handleSizeChange(val) {
            this.page.size = val
            this.fetchData()
        },
        handleCurrentChange(val){
            this.page.current = val
            this.fetchData()
        },
        getCategoryList() {
            categoryApi.getNormalList().then(response => {
                if(response.code === 20000) {
                    this.categoryList = response.data
                }
            })
        },
        // 查询
        queryData() {
            // 将页码变为第一页，并且刷新数据
            this.page.current = 1
            this.fetchData()
        },
        reload() {
            this.query = {}
            this.fetchData()
        },
        openAdd() {
            // 打开时重新查询正常的分类状态
            this.getCategoryList()
            this.edit.title="新增",
            this.edit.visible = true
        },
        // 关闭弹窗
        remoteClose() {
            this.edit.formData = {}
            this.edit.visible = false
            this.fetchData()
        },
        // 编辑
        handleEdit(id) {
            api.getById(id).then(response=>{
                if(response.code === 20000) {
                    // 回显数据
                    this.edit.formData = response.data
                    // 打开弹出窗
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
        }  
    }
}
</script>