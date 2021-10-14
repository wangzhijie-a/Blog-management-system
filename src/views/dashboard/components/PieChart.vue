<template>
    <div ref="main" :class="className" :style="{height:height,width:width}">

        aaa
    </div>
</template>
<script>
import * as echart from 'echarts'
require('echarts/theme/macarons') // echarts theme
// 自适应
import resize from "./mixins/resize"
export default {
    mixins:[resize],
    props:{
        className:{
            type:String,
            default:'chart'
        },
        height:{
            type:String,
            default:'400px'
        },
        width:{
            type:String,
            default:'100%'
        },
        seriesData:{
            type:Array,
            // 注意：数组的默认返回值是函数
            default:()=>[
                {value:335,name:'前端'},
                {value:310,name:'java'},
                {value:200,name:'大数据'},
                {value:500,name:'python'},
                {value:100,name:'vue'},
            ]
        }
    },
    data() {
        return {
            chart:null
        }
    },
    // 当加载dom后，调用this.initChart()来初始化echarts实例
    mounted() {
        this.$nextTick(()=>{
            this.initChart()
        })
    },
    // 组件销毁前调用此钩子
    beforeDestroy() {
        if(!this.chart) {
            return 
        }
        // 注销实例
        this.chart.dispose()
        this.chart = null
    },
    methods: {
        initChart() {
            // 初始化实例
            this.chart = echart.init(this.$refs.main)
            this.chart.setOption({
                title: {  //标题
                    text: '各技术频道文章统计',
                    left: 'center'
                },
                tooltip: {  //提示框
                    trigger: 'item'
                },
                legend: {  //左上角的数据
                    orient: 'vertical',
                    left: 'left'
                },
                series: [  //图数据
                    {
                        name: '统计内容',//鼠标放上去显示文字
                        type: 'pie',  //饼图
                        radius: '50%',  //图的大小
                        data:this.seriesData,
                        emphasis: {
                            itemStyle: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            })
        }
    },
}
</script>