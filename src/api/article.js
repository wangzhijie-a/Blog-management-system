import request from "@/utils/request"

export default {
    // 文章列表分页接口
    getList(query,current = 1,size = 20) {
        return request({
            url:`/article/article/search`,
            method:'post',
            data:{
                ...query,
                current,
                size
            }
        })
    },
    // 根据文章id查询文章
    getById(id) {
        return request({
            url:`/article/article/${id}`,
            method:'get'
        })
    },
    // 审核通过
    auditSuccess(id) {
        return request({
            url:`/article/article/audit/success/${id}`,
            method:'get'
        })
    },
    // 审核不通过
    auditFail(id) {
        return request({
            url:`/article/article/audit/fail/${id}`,
            method:'get'
        })
    },
    // 删除文章
    deleteById(id) {
        return request({
            url:`/article/article/${id}`,
            method:'delete'
        })
    }
}