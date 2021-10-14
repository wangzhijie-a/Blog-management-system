<template>
    <el-dialog
        :title="title"
        :visible.sync="visible"
        width="600px"
        :before-close="handleClose">
        <!-- status-icon当表单校验不通过时，有图标显示 -->
    <el-form :rules="rules" status-icon ref="formData" :model="formData" label-width="100px" label-position="right" style="width:400px">
        <el-form-item label="广告图片" prop="imageUrl">
            <!-- action 指定上传地址，但是我们不用它默认的，所以给它空的，不能把它删除，默认这个必须要有
             show-file-list 是否显示已上传文件列表，因为上传的是图片，不是文件，所以不要显示 http-request 自定义上传实现 -->
            <el-upload
                class="avatar-uploader"
                accept="image/*"
                action=""
                :show-file-list="false"
                :http-request="uploadMainImg">
                <img v-if="formData.imageUrl" :src="formData.imageUrl" class="avatar">
                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
        </el-form-item>
        <el-form-item label="广告标题" prop="title">
            <el-input v-model="formData.title"></el-input>
        </el-form-item>
        <el-form-item label="广告链接" prop="advertUrl">
            <el-input v-model="formData.advertUrl"></el-input>
        </el-form-item>
        <el-form-item label="跳转方式" prop="advertTarget">
            <el-select v-model="formData.advertTarget" placeholder="请选择跳转方式">
                <el-option label="当前网页跳转" value="_self"></el-option>
                <el-option label="新网页跳转" value="_blank"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
            <el-radio-group v-model="formData.status">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="广告位置" prop="position">
            <el-input-number v-model="formData.position" :min="1" :max="10" style="width:300px"></el-input-number>
        </el-form-item>
        <el-form-item label="排序" prop="sort">
            <el-input-number v-model="formData.sort" :min="1" :max="10" style="width:300px"></el-input-number>
        </el-form-item> 
        <el-form-item>
            <el-button type="primary" @click="submitForm('formData')" size="mini">确定</el-button>
            <el-button @click="handleClose" size="mini">取消</el-button>
        </el-form-item>
        </el-form>
          
    </el-dialog> 
    
</template>

<script>
import commonApi from "@/api/common"
import api from "@/api/advert"
export default {
    data() {
        return {
            rules:{
                title:[{  //对应prop值
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
        },
        oldImageUrl:String //修改前的照片url
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
        // 图片上传 , file上传的图片对象
        uploadMainImg(file) {
            // console.log("file",file)
            // 封装一个表单对象
            const data = new FormData()
            data.append("file",file.file)
            // 发送请求上传
            commonApi.uploadImg(data).then(response=>{
                // 以防图片多次上传，上传成功后将原来的图片删除
                this.deleteImg()
                this.formData.imageUrl = response.data
            }).catch(()=>{
                this.$message({
                    showClose:true,
                    message:'上传失败',
                    type:'error'
                })
            })
        },
        // 删除主图，上传成功和关闭窗口调用删除上一次上传的图片
        deleteImg(){
            // 以防上传后表单没有提交，这样就不能把进入到修改页面时最初的图片删除，如果删除了下次再点击修改，就找不到图片了
            if(this.formData.imageUrl && this.formData.imageUrl !== this.oldImageUrl){
                // 删除
                commonApi.deleteImg(this.formData.imageUrl)
            }
        },
        async submitData() {
            let response = null
            // 判断是否有id，如果有id，说明是编辑，如果没有，就是新增
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
                    message:'保存失败'
                })
            }
        }
    }
}
</script>

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>