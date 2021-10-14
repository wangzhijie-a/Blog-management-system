import request from "@/utils/request"

export default {
    // 列表分页接口
    getList(query,current = 1,size = 20) {
        return request({
            url:`/article/label/search`,
            method:'post',
            data:{
                ...query,
                current,
                size
            }
        })
    },

    // 新增
    add(data) {
        return request({
            url:`/article/label`,
            method:'post',
            data:data
        })
    },

    // 编辑(根据标签id查询数据)
    getById(id) {
        return request({
            url:`/article/label/${id}`,
            method:'get',
        })
    },

    // 更新
    update(data) {
        return request({
            url:`/article/label`,
            method:'put',
            data
        })
    },

    // 删除
    deleteById(id) {
        return request({
            url:`/article/label/${id}`,
            method:'delete'
        })
    }
}