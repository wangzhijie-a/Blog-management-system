<template>
    <div class="app-container">
        <!-- 行内表单(搜索框) -->
        <el-form :inline="true" :model="query">
            <el-form-item label="广告标题">
                <el-input v-model="query.title"></el-input>
            </el-form-item>
            <el-form-item label="状态">
                <!-- clearable清空 filterable是否可搜索 -->
                <el-select v-model="query.status" clearable filterable>
                <el-option v-for="item in statusOptions" :key="item.code" :label="item.name" :value="item.code"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button icon='el-icon-search' type="primary" @click="queryData">查询</el-button>
                <el-button icon='el-icon-refresh' class="filter-item" @click="reload">重置</el-button>
                <el-button icon='el-icon-circle-plus-outline' type="primary" @click="openAdd">新增</el-button>
            </el-form-item>
        </el-form>

        <!-- 列表 -->
        <el-table
            :data="list"
            stripe
            border
            style="width: 100%">
            <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
            <el-table-column align="center" prop="title" label="广告标题" ></el-table-column>
            <el-table-column align="center" label="广告图片" >
                <!-- 图片预览 需要使用这一行的某一个内容时，用template包起来，并写上slot-scope, scope.row.需要的属性 -->
                <!-- preview-src-list="[scope.row.imageUrl]" 放大后的图片url，是数组,不要少了[] -->
                <template slot-scope="scope">
                    <el-image 
                        style="width: 90px; height: 60px"
                        :src="scope.row.imageUrl"
                        :preview-src-list="[scope.row.imageUrl]"
                        >
                    </el-image>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="advertUrl" label="广告链接" ></el-table-column>
            <el-table-column align="center" prop="status" label="状态 " >
                <template slot-scope="scope">
                    <!-- scope可以获取行内的信息 -->
                    <el-tag v-if="scope.row.status === 0" type="danger">禁用</el-tag>
                    <el-tag v-if="scope.row.status === 1" type="success">正常</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="sort" label="排序" ></el-table-column>
            <el-table-column align="center" label="操作" width="210px">
                <!-- 审核：只有status===1时才显示 ，删除：只有status!==0是才显示 -->
                <template slot-scope="scope">
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

        <!-- 子组件(新增弹框) -->
        <edit :title="edit.title" :visible="edit.visible" :formData="edit.formData" :oldImageUrl="edit.oldImageUrl" :remoteClose="remoteClose" />
    </div>
</template>
<script>
import api from "@/api/advert"
import Edit from "./edit"
const statusOptions = [
    {code:0,name:'禁用'},
    {code:1,name:'正常'}
]
export default {
    name:'Advert',  //和路由表中的name一致
    components:{Edit},
    data() {
        return {
            list:[],
            page:{
                total:0,
                current:1,
                size:20
            },
            query:{},
            statusOptions,
            edit:{
                title:'',
                visible:false,
                oldImageUrl:null,  //是编辑时查询出来的原始图片
                formData:{
                    imageUrl:null  //必须在里面声明，不然上传新图片不能立即预览
                }

            }
        }
    },
    created() {
        this.fetchData()
    },
    methods:{
        async fetchData() {
            const {data} =  await api.getList(this.query,this.page.current,this.page.size)
            this.page.total = data.total
            this.list = data.records
        },

        // 编辑
        handleEdit(id){
            // 通过id查询数据
            api.getById(id).then(response=>{
                if(response.code === 20000){
                    this.edit.formData = response.data
                    this.edit.oldImageUrl = response.data.imageUrl  //修改前的照片url
                }
            })
            // 弹出窗口
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
            // 将列表页设为1
            this.page.current = 1
            this.fetchData()
        },
        // 重置
        reload() {
            this.query = {},
            this.fetchData()
        },
        // 新增
        openAdd() {
            this.edit.title = "新增",
            this.edit.visible = true
        },
        // 关闭窗口
        remoteClose() {
            // // 一定要加上这个，不然有时候表单输入不了值
            this.edit.formData = {imageUrl:null},
            this.edit.visible = false,
            this.fetchData()
        }
    }
}
</script>