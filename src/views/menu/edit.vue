<template>
    <el-dialog
        :title="title"
        :visible.sync="visible"
        width="500px"
        :before-close="handleClose">
        <!-- status-icon当表单校验不通过时，有图标显示 -->
        <el-form :rules="rules" status-icon ref="formData" :model="formData" label-width="100px" label-position="right" style="width:400px">
            <el-form-item label="类型" prop="type">
                <el-radio-group v-model="formData.type">
                    <el-radio :label="1">目录</el-radio>
                    <el-radio :label="2">菜单</el-radio>
                    <!-- 如果 formData.parentId=0 是根菜单，就不显示按钮，注意是数字0，不是字符串没有引号 -->
                    <el-radio :label="3" v-if="formData.parentId !== 0">按钮</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="名称" prop="name">
                <el-input v-model="formData.name"></el-input>
            </el-form-item>
            <el-form-item label="权限标识" prop="code">
                <el-input v-model="formData.code"></el-input>
            </el-form-item>
            <el-form-item label="请求地址" prop="url" v-if="formData.type != 3">
                <el-input v-model="formData.url"></el-input>
            </el-form-item>
            <el-form-item label="图标" prop="icon" v-if="formData.type != 3">
                <el-input v-model="formData.icon"></el-input>
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
import api from "@/api/menu"
export default {
    data() {
        return {
            rules:{
                name:[{  //对应prop值
                    required:true,message:'请输入分类名称',trigger:'blur'
                }],
                code:[
                    {required:true,message:'请选择状态',trigger:'blur'}
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
        // 提交表单
        submitForm(formName) {
            // 表单校验
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 校验通过，判断下选择的类型，把对应不需要的把它清空
                    if(this.formData.type === 3) {
                        this.formData.url = ''
                        this.formData.icon = ''
                    }
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
            if(this.formData.id) {
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
        },
        // 关闭弹窗
        handleClose() {
            // 清空表单数据
            this.$refs['formData'].resetFields()
            this.remoteClose()
        }
    }
}
</script>