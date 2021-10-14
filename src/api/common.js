import request from "@/utils/request"
// 公共接口
export default {
    // 上传图片
    uploadImg(data = {}) {
        return request({
            url:`/article/file/upload`,
            method:'post',
            data:data
        })
    },
    // 删除图片  /article/file/delete?fileUrl=http://xxxx
    deleteImg(imageUrl) {
        return request({
            url:`/article/file/delete`,
            method:'delete',
            // get和delete请求参数是带在url上的，必须使用params,post不需要
            params:{'fileUrl':imageUrl}
        })
    }
}