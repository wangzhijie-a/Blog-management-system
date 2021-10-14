<template>
    <div class="app-container">
        <!-- 行内表单(搜索框) -->
        <el-form :inline="true" :model="query">
            <el-form-item label="文章标题">
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
            </el-form-item>
        </el-form>

        <!-- 列表 -->
        <el-table
            :data="list"
            stripe
            border
            style="width: 100%">
            <el-table-column align="center" type="index" label="序号" width="60"></el-table-column>
            <el-table-column align="center" prop="title" label="标题" ></el-table-column>
            <el-table-column align="center" prop="viewCount" label="浏览量" ></el-table-column>
            <el-table-column align="center" prop="thumhup" label="点赞数" ></el-table-column>
            <el-table-column align="center" prop="ispublic" label="是否公开 " >
                <template slot-scope="scope">
                    <!-- scope可以获取行内的信息 -->
                    <el-tag v-if="scope.row.ispublic === 0" type="danger">不公开</el-tag>
                    <el-tag v-if="scope.row.ispublic === 1" type="warning">公开</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="status" label="状态 " >
                <template slot-scope="scope">
                    <!-- scope可以获取行内的信息 -->
                    <el-tag v-if="scope.row.status === 0" type="danger">已删除</el-tag>
                    <el-tag v-if="scope.row.status === 1" >未审核</el-tag>
                    <el-tag v-if="scope.row.status === 2" type="success">审核通过</el-tag>
                    <el-tag v-if="scope.row.status === 3" type="warning">审核未通过</el-tag>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="updateDate" label="修改日期" min-width="90px">
                <template slot-scope="scope">
                    {{getFormat(scope.row.updateDate)}}
                </template>
            </el-table-column>
            <el-table-column align="left" label="操作" width="210px">
                <!-- 审核：只有status===1时才显示 ，删除：只有status!==0是才显示 -->
                <template slot-scope="scope">
                    <el-button size="mini" @click="openView(scope.row.id)">查看</el-button>
                    <el-button
                    v-if="scope.row.status===1"
                    size="mini"
                    type="primary"
                    @click="openAudit(scope.row.id)">审核</el-button>
                    <el-button
                    v-if="scope.row.status!==0"
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

        <!-- 审核页 -->
        <audit :id="audit.id" :isAudit="audit.isAudit" :title="audit.title" 
        :visible="audit.visible" :remoteClose="remoteClose"/>
    </div>
    
</template>
<script>
import api from "@/api/article"
import {dateFormat} from "@/utils/date"
import Audit from "./audit"
// 用于下拉框
const statusOptions = [
    {code:0,name:'已删除'},
    {code:1,name:'未审核'},
    {code:2,name:'审核通过'},
    {code:3,name:'审核未通过'}
]
export default {
    name:'Article',
    components:{
        Audit
    },
    data() {
        return {
            list:[],
            page:{
                total:0,
                current:1,
                size:20
            },
            query:{},
            statusOptions,  //下拉框选项
            audit:{
                id:null,
                isAudit:true,
                visible:false,
                title:''
            }
        }
    },
    created() {
        this.fetchData()
    },
    methods:{
        async fetchData() {
            // const { data } = response  解构赋值 ，从response中获取data
            const {data} = await api.getList(this.query,this.page.current,this.page.size)
            this.list = data.records
            this.page.total = data.total
        },
        // 格式化日期
        getFormat(date) {
            return dateFormat(date)
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
        queryData(){
            // 将页面变为1
            this.page.current = 1
            this.fetchData()
        },
        reload() {
            this.query = {}
            this.fetchData()
        },
        // 审核
        openAudit(id) {
            this.audit.id=id
            this.audit.isAudit = true
            this.audit.title="审核页面"
            this.audit.visible = true
        },
        // 关闭子组件弹出窗
        remoteClose() {
            this.audit.visible = false
            this.fetchData()
        },
        // 查看
        openView(id) {
            this.audit.id=id
            this.audit.isAudit = false
            this.audit.title="查看页面"
            this.audit.visible = true
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