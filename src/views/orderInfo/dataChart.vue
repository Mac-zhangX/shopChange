<template>
  <div style="padding:1rem">
    <el-col :span="24" class="toolbar" style="padding-bottom: 0">
      <el-form :inline="true" :model="filters">
        <el-form-item label="账户查询:">
          <el-autocomplete
            v-model="filters.username"
            :fetch-suggestions="querySearchAsync"
            size="small"
            @select="handleSelect"
            icon="circle-close"
            :on-icon-click="handleOrderIconClick"
            @keyup.enter.native="drawLine"
          ></el-autocomplete>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="small" icon="el-icon-search" @click="drawLine()">查询</el-button>
        </el-form-item>
      </el-form>
    </el-col>

    <el-col :span="5" style="position: absolute;right: 0;top: 5rem">
      所有省份号码总计：<span style="color: red">{{total}}</span>
    </el-col>
    <el-col :span="24">
      <div id="myChart" style="width: 100%;height: 50rem"></div>
    </el-col>

  </div>
</template>

<script>
    import echarts from 'echarts'
    import '../../../node_modules/echarts/map/js/china.js' // 引入中国地图数据
    import {dataAll, unclearOrderList} from '../../api/modeList'

    export default {
        name: "dataChart",
        data() {
            return {
                filters: {
                    username: '',
                },
                chartreuse: null,
                listLoading: false,
                list: [],
                total: '',
                restaurants: [],
            }
        },
        mounted() {
            this.drawLine()
        },
        methods: {
            querySearchAsync(queryString, cb) {
                let param = {
                    username: this.filters.username
                };
                unclearOrderList(param).then((res) => {
                    if (res.data.code === 0) {
                        this.restaurants = res.data.Data;
                        this.restaurants.map((val) => {
                            val.value = val.username
                        });
                        clearTimeout(this.timeout);
                        this.timeout = setTimeout(() => {
                            cb(this.restaurants);
                        }, 1000 * Math.random());
                    }
                })

            },
            drawLine() {
                let params = {
                    username: this.filters.username,
                    operator: 1
                };
                dataAll(params).then((res) => {
                    if (res.data.code === 0) {
                        // 基于准备好的dom，初始化echarts实例
                        let myChart = this.$echarts.init(document.getElementById('myChart'));
                        window.onresize = myChart.resize;
                        //绘制图表
                        var xData = [];
                        var y1Data = [];
                        let totals = 0;
                        res.data.list.map(val => {
                            xData.push(val.provinceName);
                            y1Data.push(val.totalCount)
                        });
                        for (let i = 0; i < y1Data.length; i++) {
                            totals = parseInt(totals) + parseInt(y1Data[i]);
                            this.total = totals
                        }
                        myChart.setOption(
                            {
                                background: '',
                                title: {text: '号码省份统计'},
                                tooltip: {
                                    trigger: 'axis',
                                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                                    }
                                },
                                grid: {
                                    left: '7%',
                                    right: '5%',
                                    top: '25%',
                                    bottom: '19%',
                                },
                                legend: {
                                    data: ['x', '监控密度'],
                                    right: '3%',
                                    top: '10%',
                                    itemWidth: 11,
                                    itemHeight: 11,
                                    textStyle: {
                                        color: '#191E40',
                                        fontSize: 13
                                    }
                                },
                                toolbox: {
                                    show: false,
                                },
                                xAxis: [
                                    {
                                        type: 'category',
                                        boundaryGap: true,
                                        show: true,
                                        axisTick: {
                                            show: false
                                        },
                                        axisLabel: {
                                            fontSize: 15,
                                            fontWeight: 600,
                                            color: '#ff0000',    //横坐标颜色
                                            margin: 8,
                                            interval: 0,
                                            formatter: function (val) {
                                                return val.split("").join("\n");
                                            }
                                        },
                                        axisLine: {
                                            lineStyle: {
                                                type: 'solid',
                                                color: '#4e608b',//左边线的颜色
                                                width: '1'//坐标线的宽度
                                            }
                                        },
                                        data: xData
                                    }
                                ],
                                yAxis: [
                                    {
                                        type: 'value',
                                        scale: true,
                                        name: '',
                                        axisLine: {
                                            show: false
                                        },
                                        splitNumber: 4,
                                        axisTick: {
                                            show: false
                                        },
                                        splitLine: {
                                            lineStyle: {
                                                // 使用深浅的间隔色
                                                color: '#4e608b'
                                            }
                                        },
                                        axisLabel: {
                                            fontSize: 16,
                                            color: '#333333',
                                            margin: 12,
                                        },
                                        min: 0,
                                        boundaryGap: [0.2, 0.2]
                                    },
                                    {
                                        type: 'value',
                                        scale: true,
                                        axisLine: {
                                            show: false
                                        },
                                        splitNumber: 3,
                                        axisTick: {
                                            show: false
                                        },
                                        axisLabel: {
                                            fontSize: 13,
                                            color: '#d0d0d0',
                                            margin: 12,
                                        },
                                        splitLine: {
                                            lineStyle: {
                                                // 使用深浅的间隔色
                                                color: '#4e608b'
                                            }
                                        },
                                        name: '',
                                        // max: 30,
                                        // min: 0,
                                        boundaryGap: [0.2, 0.2]
                                    },

                                ],
                                series: [
                                    {
                                        name: '号码数量',
                                        type: 'bar',
                                        label: {
                                            normal: {
                                                show: true,
                                                position: 'top',
                                                textStyle: {
                                                    color: '#1dacfe'
                                                }
                                            }
                                        },
                                        itemStyle: {
                                            normal: {
                                                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                                                    {offset: 0, color: "#4889fb"},// 0% 处的颜色
                                                    {offset: 1, color: "#15b3ff"}// 100% 处的颜色
                                                ], false)
                                            }
                                        },
                                        barWidth: '40%',
                                        scale: true,
                                        yAxisIndex: 0,
                                        data: y1Data
                                    }
                                ]
                            }
                        )
                    } else {
                        this.$message({
                            type: 'error',
                            message: res.data.msg,
                            duration: 1000
                        })
                    }
                });


            },
            handleSelect(item) {

            },
            handleOrderIconClick() {

            },
        },
    }
</script>

<style scoped>

</style>
