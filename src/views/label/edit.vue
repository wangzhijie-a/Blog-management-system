<template>
    <el-dialog
        :title="title"
        :visible.sync="visible"
        width="400px"
        :before-close="handleClose">
        <!-- status-icon当表单校验不通过时，有图标显示 -->
    <el-form :rules="rules" status-icon ref="formData" :model="formData" label-width="100px" label-position="right" style="width:300px">
        <el-form-item label="标签名称" prop="name">
            <el-input v-model="formData.name"></el-input>
        </el-form-item>
        <el-form-item label="分类名称" prop="categoryId">
                <!-- clearable清空 filterable是否可搜索 -->
                <el-select v-model="formData.categoryId" clearable filterable>
                    <!-- :label是显示的值  :value是提交的值 -->
                    <el-option v-for="item in categoryList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitForm('formData')" size="mini">确定</el-button>
            <el-button @click="handleClose" size="mini">取消</el-button>
        </el-form-item>
        </el-form>
          
    </el-dialog> 
</template>

<script>
import api from "@/api/label"
export default {
    props:{
        categoryList:{  //所有正常状态的分类
            type:Array,
            default:[]
        },
        title:{
            type:String,
            default:''
        },
        visible:{
            type:Boolean,
            type:false
        },
        formData:{
            type:Object,
            default:{}
        },
        remoteClose:Function
    },
    data() {
        return {
            rules:{
                name:[{
                    required:true,message:'请输入分类名称',trigger:'blur'
                }],
                categoryId:[{
                    required:true,message:'请选择分类名称',trigger:'change'
                }]
            }
        }
    },
    methods:{
        // 提交表单数据
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
        // 关闭弹窗
        handleClose() {
            // 清空数据
            this.$refs['formData'].resetFields()
            // 调用父组件中的方法关闭
            this.remoteClose()
        },
        // 调用接口异步提交数据
        async submitData() {
            let response = null
            // formData中如果有id值就是编辑按钮，没有就是新增
            if(this.formData.id) {
                response = await api.update(this.formData)
            }else{
                response = await api.add(this.formData)
            }
            
            if(response.code === 20000){
                this.$message({
                    type:'success',
                    message:'保存成功'
                })
                // 关闭窗口
                this.handleClose()
            }else{
                this.$message({
                    type:'error',
                    message:"保存失败"
                })
            }
        }
    }
}
</script>