<template>
    <el-dialog
        :title="title"
        :visible.sync="visible"
        width="500px"
        :before-close="handleClose">
        <!-- status-icon当表单校验不通过时，有图标显示 -->
    <el-form :rules="rules" status-icon ref="formData" :model="formData" label-width="100px" label-position="right" style="width:400px">
        <el-form-item label="名称分类" prop="name">
            <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
            <el-radio-group v-model="formData.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
            <el-input-number v-model="formData.sort" :min="1" :max="10" style="width:300px"></el-input-number>
        </el-form-item> 
        <el-form-item label="备注" prop="remark">
            <el-input type="textarea" v-model="formData.remark"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('formData')" size="mini">确定</el-button>
            <el-button @click="handleClose" size="mini">取消</el-button>
        </el-form-item>
        </el-form>
          
    </el-dialog> 
    
</template>

<script>
import api from "@/api/category"
export default {
    data() {
        return {
            rules:{
                name:[{  //对应prop值
                    required:true,message:'请输入分类名称',trigger:'blur'
                }],
                status:[
                    {required:true,message:'请选择状态',trigger:'change'}
                ]
            }
        }
    },
    props:{
        title:{  //弹窗的标题
            type:String,
            default:''
        },
        visible: {  //染出窗口
            type:Boolean,
            default:false
        },
        remoteClose:Function,  //用于关闭窗口刷新数据
        formData:{
            type:Object,
            default:{}
        }
    },
    methods:{
        // 关闭窗口
        handleClose(){
            // 表单清空
            this.$refs['formData'].resetFields()
            // 因为visible是父组件的值，子组件不能直接修改
            this.remoteClose()
        },
        // 提交表单
        submitForm(formData) {
            this.$refs[formData].validate((valid) => {
                if (valid) {
                    // alert('submit!');
                    // 校验通过，提交表单数据
                    this.submitData()
                } else {
                    // console.log('error submit!!');
                    return false;
                }
            });
        },
        async submitData() {
            let response = null
            if(this.formData.id){
                response = await api.update(this.formData)
            }else {
                response = await api.add(this.formData)
            }
            if(response.code === 20000) {
                this.$message({
                    message: '提交成功',
                    type: 'success'
                });
                // 关闭窗口
                this.handleClose()
            }else {
                this.$message({
                    message:'提交失败',
                    type:'error'
                })
            }
        }
    }
}
</script>