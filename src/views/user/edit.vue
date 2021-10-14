<template>
    <el-dialog
        :title="title"
        :visible.sync="visible"
        width="500px"
        :before-close="handleClose">
        <!-- status-icon当表单校验不通过时，有图标显示 -->
    <el-form :rules="rules" status-icon ref="formData" :model="formData" label-width="100px" label-position="right" style="width:400px">
        <el-form-item label="用户名" prop="username">
            <el-input v-model="formData.username"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickName">
            <el-input v-model="formData.nickName"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
            <el-input v-model="formData.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
            <el-input v-model="formData.email"></el-input>
        </el-form-item>
        <el-form-item label="账号过期" prop="isAccountNonExpired">
            <el-radio-group v-model="formData.isAccountNonExpired">
                <el-radio :label="1" border>未过期</el-radio>
                <el-radio :label="0" border>已过期</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="密码过期" prop="isCredentialsNonExpired">
            <el-radio-group v-model="formData.isCredentialsNonExpired">
                <el-radio :label="1" border>未过期</el-radio>
                <el-radio :label="0" border>已过期</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="账号锁定" prop="isAccountNonLocked">
            <el-radio-group v-model="formData.isAccountNonLocked">
                <el-radio :label="1" border>未锁定</el-radio>
                <el-radio :label="0" border>已锁定</el-radio>
            </el-radio-group>
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
        visible:{
            type:Boolean,
            default:false
        },
        title:{
            type:String,
            default:''
        },
        formData: {
            type:Object,
            default:{}
        },
        remoteClose:Function
    },
    data() {
        return {
            rules:{
                username:[
                    {required:true,message:'请输入用户名',trigger:'blur'}
                ]
            }
        }
    },
    methods:{
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
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
                // 默认密码和用户名一致
                this.formData.password = this.formData.username
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
        },
        handleClose() {
            this.$refs['formData'].resetFields()
            this.remoteClose()
        }
    }
}
</script>