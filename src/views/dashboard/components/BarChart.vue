<template>
    <div ref="main" :class="className" :style="{height:height,width:width}"></div>
</template>
<script>
import * as echarts from "echarts"
require('echarts/theme/macarons')   //主题，加在echarts.init(this.$refs.main,'macarons')
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
        xAxisData:{   //x轴显示的数据
            type:Array,
            default:()=>['2021-01', '2021-02', '2021-03', '2021-04', '2021-05', '2021-06']
        },
        seriesData:{
            type:Array,
            // 注意：数组的默认返回值是函数
            default:()=>[10, 52, 200, 334, 390, 330]
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
    methods:{
        initChart() {
            this.chart = echarts.init(this.$refs.main)
            this.chart.setOption({
                title: {  //标题
                    text: '近六个月发布的文章数',
                    left: 'center'
                },
                tooltip: {  //提示框组件
                    trigger: 'axis',  //鼠标放柱子上的事件
                    axisPointer: {
                        type: 'shadow'// 默认为直线（line），shadow（灰色背景） 可选 为：'line' | 'shadow'
                    }
                },
                grid: {   //柱状图整体位置
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [   //x轴
                    {
                    type: 'category',
                    data: this.xAxisData,
                    axisTick: {
                        alignWithLabel: true
                    }
                    }
                ],
                yAxis: [  //y轴
                    {
                    type: 'value'
                    }
                ],
                series: [
                    {
                    name: 'Direct',
                    type: 'bar',
                    barWidth: '60%',
                    data: this.seriesData
                    }
                ]
            })
        }
    }
}
</script>