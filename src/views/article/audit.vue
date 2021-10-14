<template>
    <el-dialog :title="title" :visible.sync="visible" :before-close="handleClose" width="70%">
        <el-form ref="formData" :model="formData" label-width="100px" label-position="right">
            <el-form-item label="标题">
                <el-input v-model="formData.title" readonly></el-input>
            </el-form-item>
            <el-form-item label="标签">
                <!-- 级联下拉框 -->
                <el-cascader
                    disabled
                    :options="labelOptions"
                    style="display:block"
                    v-model="formData.labelIds"
                    :props="{multiple: true , emitPath:false, 'children':'labelList' , 'value':'id' , 'label':'name'}"
                    clearable>
                </el-cascader>
            </el-form-item>
            <el-form-item label="主图">
                <img :src="formData.imageUrl" style="width:178px; height:178px; display:block">
            </el-form-item> 
            <el-form-item label="是否公开">
                <el-radio-group v-model="formData.ispublic" disabled>
                    <el-radio :label="1">公开</el-radio>
                    <el-radio :label="0">不公开</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="简介">
                <el-input type="textarea" v-model="formData.summary" readonly></el-input>
            </el-form-item>
            <el-form-item label="内容">
                <mavon-editor v-model="formData.mdContent" :editable="false"></mavon-editor>
            </el-form-item>
            <el-form-item align="center" v-if="isAudit">
                <el-button type="primary" @click="auditSuccess()">审核通过</el-button>
                <el-button type="danger" @click="auditFail()">审核不通过</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script>
import api from "@/api/article"
import categoryApi from "@/api/category"
// 引入 mavon-editor 组件与样式
import {mavonEditor} from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

export default {
    components:{mavonEditor},
    props:{
        id:null,  //文章id
        isAudit:true,  //是否为审核页面，false是详情页
        title:{  //弹窗的标题
            type:String,
            default:''
        },
        visible: {  //染出窗口
            type:Boolean,
            default:false
        },
        remoteClose:Function,  //用于关闭窗口刷新数据
    },
    data() {
        return {
            formData:{},
            labelOptions:[]
        }
    },
    // 侦听器，监听visible属性，如果为true，就调用接口
    watch:{
        visible(val) {  //监听visible的变化，将改变之后的值作为参数传递过去
            if(val){
                this.getLabelOptions()
                this.getArticleById()
            }
        }
    },
    methods:{
        handleClose() {
            // 在父组件中关闭
            this.remoteClose()
        },
        // 审核通过
        auditSuccess() {
            this.$confirm('确认审核通过吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 确认删除
                api.auditSuccess(this.id).then(response=>{
                    this.$message({
                        type:'success',
                        message:"审核通过"
                    })
                    // 关闭窗口
                    this.remoteClose()
                })
            }).catch(() => {
                // 取消
            });
        },
        // 审核不通过
        auditFail() {
            this.$confirm('确认审核不通过吗?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                // 确认删除
                api.auditFail(this.id).then(response=>{
                    this.$message({
                        type:'success',
                        message:"审核未通过"
                    })
                    // 关闭窗口
                    this.remoteClose()
                })
            }).catch(() => {
                // 取消
            });
        },
        // 查询文章详情
        async getArticleById() {
            const {data} = await api.getById(this.id)
            this.formData = data
        },
        // 获取所有分类与标签
        async getLabelOptions() {
            const {data} = await categoryApi.getCategoryAndLabel()
            this.labelOptions = data
        }

    }
}
</script>