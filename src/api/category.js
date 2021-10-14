import request from "@/utils/request"

export default {
    // 分页条件查询分类列表
    getList(query,current = 1,size = 20) {
        return request({
            url:`/article/category/search`,
            method:'post',
            data:{
                ...query,
                current,
                size
            }
        })
    },
    // 新增接口
    add(data) {
        return request({
            url:`/article/category`,
            method:'post',
            data:data
        })
    },
    // 通过id查询数据
    getById(id) {
        return request({
            url:`/article/category/${id}`,
            mehtod:'get'
        })
    },
    // 更新
    update(data) {
        return request({
            url:`/article/category`,
            method:'put',
            data:data  //可以简写为data
        })
    },
    // 删除
    deleteById(id) {
        return request({
            url:`/article/category/${id}`,
            method:'delete'
        })
    },
    // 获取所有正常状态的分类
    getNormalList(){
        return request({
            url:`/article/category/list`,
            method:'get'
        })
    },
    // 获取所有正常状态下的分类和标签(用于级联下拉框)
    getCategoryAndLabel() {
        return request({
            url:`/article/category/label/list`,
            method:'get'
        })
    }
}