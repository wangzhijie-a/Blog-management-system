import request from "@/utils/request"

export default {
    // 角色列表分页接口
    getList(query,current = 1,size = 20) {
        return request({
            url:`/system/role/search`,
            method:'post',
            data:{
                ...query,
                current,
                size
            }
        })
    },
    add(data) {
        return request({
            url:`/system/role`,
            method:'post',
            data
        })
    },
    getById(id) {
        return request({
            url:`/system/role/${id}`,
            method:'get'
        })
    },
    update(data) {
        return request({
            url:`/system/role`,
            method:'put',
            data
        })
    },
    deleteById(id) {
        return request({
            url:`/system/role/${id}`,
            method:'delete'
        })
    },
    // 获取指定角色id所拥有的权限菜单ids
    getMenuIdsByRoleId(id) {
        return request({
            url:`/system/role/${id}/menu/ids`,
            method:'get'
        })
    },
    // 调用新增角色权限接口
    saveRoleMenu(id,menuIds) {
        return request({
            url:`/system/role/${id}/menu/save`,
            method:'post',
            data:menuIds
        })
    }
}