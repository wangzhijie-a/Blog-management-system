<template>
    <el-dialog
        :title="title"
        :visible.sync="visible"
        width="500px"
        :before-close="handleClose">

        <el-form v-loading="loading" label-width="80px">
            <!--data 数据集合，default-checked-keys 默认勾选
             props 配置响应数据中对应展示的属性名
             node-key 每个树节点用来作为唯一标识的属性 
             show-checkbox 显示勾选框 
             accordion 每次只打开一个同级树节点展开
             highlight-current 高亮当前选中节点
             :default-checked-keys 默认勾选的集合
             accordion 对于同一级的节点，每次只能展开一个 -->
            <el-tree
                :data="menuList"
                :props="{children:'children',label:'name'}"
                show-checkbox
                node-key="id"
                ref="tree"
                accordion
                :default-checked-keys="menuIds"
                >
            </el-tree>
        
            <el-form-item>
                <el-button type="primary" @click="submitForm('formData')" size="mini">确定</el-button>
                <el-button @click="handleClose" size="mini">取消</el-button>
            </el-form-item>

        </el-form>
    </el-dialog>
    
</template>
<script>
import menuApi from "@/api/menu"
import roleApi from "@/api/role"

  export default {
    props:{
        title:{
            type:String,
            default:''
        },
        visible:{
            type:Boolean,
            default:false
        },
        remoteClose:Function,
        roleId:null
    },

    data() {
      return {
          menuList:[],
          loading:true,  //loading为true表示加载中
          menuIds:[]     //角色之前拥有的权限菜单ids
      }
    },
    watch: {
        // 监听 visible 变化
        visible(val) {
            if(val) {
                this.getMenuList()
                this.getMenuIdsByRoleId()
            }
        }
    },
    methods:{
        getMenuList() {
            // 加载中
            this.loading = true
            menuApi.getList( {} ).then(response => {
                // console.log('response.data',response.data)
                this.menuList = response.data
                // 查询角色之前所拥有的菜单ids，然后进行回显
                
            })
            // 加载完成
            this.loading = false
        },
        async getMenuIdsByRoleId() {
            const {data} = await roleApi.getMenuIdsByRoleId(this.roleId)
            this.menuIds = data
        },
        submitForm(formName) {
            // 1. 获取所有选中节点的菜单 id
            const checkedMenuIds = this.$refs.tree.getCheckedKeys()
            // 2、调用保存角色菜单的接口
            roleApi.saveRoleMenu(this.roleId,checkedMenuIds).then(response=>{
                if(response.code === 20000) {
                    this.$message({
                        type:"success",
                        message:"保存成功"
                    })
                    this.remoteClose()
                }else{
                    this.$message({
                        type:'error',
                        message:"保存失败"
                    })
                }
            })
        },
        handleClose() {
            this.menuList = []
            this.menuIds = []
            this.remoteClose()
        }
    }
  };
</script>           