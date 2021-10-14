<template>
    <el-dialog
        :title="title"
        :visible.sync="visible"
        width="500px"
        :before-close="handleClose">
        <!-- status-icon当表单校验不通过时，有图标显示 -->
        <el-form :rules="rules" status-icon ref="formData" :model="formData" label-width="100px" label-position="right" style="width:400px">
            <el-form-item  label="新密码" prop="newPassword">
                <el-input type="password" v-model="formData.newPassword"></el-input>
            </el-form-item>
            <el-form-item label="确认密码" prop="repPassword">
                <el-input type="password" v-model="formData.repPassword"></el-input>
            </el-form-item> 
            
            <el-form-item>
                <el-button type="primary" @click="submitForm('formData')" size="mini">确定</el-button>
                <el-button @click="handleClose" size="mini">取消</el-button>
            </el-form-item>
        </el-form>      
    </el-dialog> 
</template>
<script>
import * as api from "@/api/user"
export default {
    props:{
        userId:null,
        visible:{
            type:Boolean,
            default:false
        },
        title:{
            type:String,
            default:''
        },
        remoteClose:Function
    },
    data() {
        // 校验两次密码是否一致
        var validateRepPassword = (rule, value, callback) => {
            // value是确认密码
            if (value !== this.formData.newPassword) {
                callback(new Error('两次输入密码不一致!'));
            } else {
                callback();
            }
        };


        return {
            formData:{},
            rules:{
                newPassword:[{required:true,message:'密码不能为空',trigger:'blur'}],
                repPassword:[
                    {required:true,message:'确认密码不能为空',trigger:'blur'},
                    { validator: validateRepPassword, trigger: 'blur' }
                ]
            }
        }
    },
    methods:{
        // 关闭窗口
        handleClose() {
            // 表单清空
            this.$refs['formData'].resetFields()
            this.remoteClose()
        },
        // 提交表单
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if(valid) {
                    // 验证通过，发送请求更新
                    this.formData.userId = this.userId
                    api.updatePassword(this.formData).then(response => {
                        if(response.code === 20000) {
                            // 提交成功
                            this.$message({
                                type:'success',
                                message:'修改成功'
                            })
                            // 关闭窗口
                            this.handleClose()
                        }else {
                            this.message({
                                type:'error',
                                message:response.message
                            })
                        }
                    })
                }else{
                    // 验证不通过
                    return false
                }
            })   
        }
    }
}
</script>