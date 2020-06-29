<template>
  <div :class="className" :style="{height:height,width:width}"></div>
</template>

<script>
  import echarts from 'echarts'
  require('echarts/theme/macarons') // echarts theme

  export default {
    props: {
      className: {
        type: String,
        default: 'chart'
      },
      width: {
        type: String,
        default: '100%'
      },
      height: {
        type: String,
        default: '350px'
      },
      timeline: {
        type: Object
      }
    },
    data() {
      return {
        chart: null
      }
    },
    mounted() {
      this.initChart()
      this.__resizeHanlder = () => {
        this.chart.resize()
      }
      // 监听侧边栏的变化
      const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
      sidebarElm.addEventListener('transitionend', this.__resizeHanlder)
    },
    beforeDestroy() {
      if (!this.chart) {
        return
      }
      window.removeEventListener('resize', this.__resizeHanlder)
      const sidebarElm = document.getElementsByClassName('sidebar-container')[0]
      sidebarElm.removeEventListener('transitionend', this.__resizeHanlder)
      this.chart.dispose()
      this.chart = null
    },
    watch: {
      timeline: {
        deep: true,
        handler(val) {
          this.setOptions(val)
        }
      }
    },
    methods: {
      setOptions(timelineData = {}) {
        const names = timelineData.names || []
        const level1 = timelineData.level1 || []
        const level2 = timelineData.level2 || []
        const level3 = timelineData.level3 || []
        this.chart.setOption({
          backgroundColor: new echarts.graphic.RadialGradient(0.3, 0.3, 0.8, [{
            offset: 0,
            color: '#f7f8fa'
          }]),
          grid: [{
            x: '0',
            x2: '0'
          }],
          // backgroundColor: '#404a59',
          title: {
            text: '时间线',
            x: 'center'
          },
          animation: true,
          tooltip: {
            formatter: function(params, ticket, callback) {
              return params.data[0] + '<br>' + params.data[3]
            }
          },
          xAxis: {
            type: 'category',
            splitLine: {
              show: false
            },
            data: names
          },
          yAxis: {
            type: 'value',
            show: false
          },
          dataZoom: [{
            type: 'slider',
            show: true,
            handleSize: 8
          }, {
            type: 'inside'
          }],
          series: [{
            name: 'level1',
            type: 'scatter',
            symbolSize: function(val) {
              return val[2] * 20
            },
            data: level1,
            itemStyle: {
              normal: {
                shadowBlur: 10,
                shadowColor: 'rgba(255, 245, 230, 0.5)',
                shadowOffsetY: 5,
                color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                  offset: 0,
                  color: 'rgb(255, 255, 123)'
                }, {
                  offset: 1,
                  color: 'rgb(255, 185, 15)'
                }])
              }
            }
          }, {
            name: 'level2',
            type: 'scatter',
            symbolSize: function(val) {
              return val[2] * 20
            },
            itemStyle: {
              normal: {
                shadowBlur: 10,
                shadowColor: 'rgba(25, 100, 150, 0.5)',
                shadowOffsetY: 5,
                color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                  offset: 0,
                  color: 'rgb(129, 227, 238)'
                }, {
                  offset: 1,
                  color: 'rgb(25, 183, 207)'
                }])
              }
            },
            data: level2
          }, {
            name: 'level3',
            type: 'scatter',
            symbolSize: function(val) {
              return val[2] * 20
            },
            data: level3,
            itemStyle: {
              normal: {
                shadowBlur: 10,
                shadowColor: 'rgba(120, 36, 50, 0.5)',
                shadowOffsetY: 5,
                color: new echarts.graphic.RadialGradient(0.4, 0.3, 1, [{
                  offset: 0,
                  color: 'rgb(251, 118, 123)'
                }, {
                  offset: 1,
                  color: 'rgb(204, 46, 72)'
                }])
              }
            }
          }]
        })
      },
      initChart() {
        this.chart = echarts.init(this.$el, 'macarons')
        this.setOptions(this.timeline)
      }
    }
  }
</script>
