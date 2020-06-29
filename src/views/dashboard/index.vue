<template>
  <div class="dashboard-editor-container">
    <github-corner></github-corner>
    <el-row class="panel-group" :gutter="40">
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col" >
        <a href="#/anniversary/index">
          <div class='card-panel'>
            <div class="card-panel-icon-wrapper icon-people">
              <svg-icon icon-class="date" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">重要日期</div>
              <div class="card-panel-num">{{cardPanel.firstDate}}</div>
              <div class="card-panel-num">{{cardPanel.secondDate}}</div>
            </div>
          </div>
        </a>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <a href="#/cashflow/index">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-money">
              <svg-icon icon-class="money" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">出入账</div>
              +
              <count-to class="card-panel-num" :startVal="0" :endVal="cardPanel.incomeFee" :duration="2000"></count-to><br />
              -&nbsp;
              <count-to class="card-panel-num" :startVal="0" :endVal="cardPanel.outFee" :duration="2000"></count-to>
            </div>
          </div>
        </a>
      </el-col>
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <a href="#/timeline/index">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-message">
              <svg-icon icon-class="shalou" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">时间线</div>
                                  ★★★
              <count-to class="card-panel-num" :startVal="0" :endVal="cardPanel.star3Timeline" :duration="2000"></count-to><br />
                                   ★★&nbsp;&nbsp;&nbsp;
              <count-to class="card-panel-num" :startVal="0" :endVal="cardPanel.star2Timeline" :duration="2000"></count-to><br />
            </div>
          </div>
        </a>
      </el-col>
<!--      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">-->
<!--        <a href="#/note/index">-->
<!--          <div class="card-panel">-->
<!--            <div class="card-panel-icon-wrapper icon-shoppingCard">-->
<!--              <svg-icon icon-class="note" class-name="card-panel-icon" />-->
<!--            </div>-->
<!--            <div class="card-panel-description">-->
<!--              <div class="card-panel-text">记事本</div>-->
<!--                                  ★★★-->
<!--              <count-to class="card-panel-num" :startVal="0" :endVal="cardPanel.star3Note" :duration="2000"></count-to><br />-->
<!--                                   ★★&nbsp;&nbsp;&nbsp;-->
<!--              <count-to class="card-panel-num" :startVal="0" :endVal="cardPanel.star2Note" :duration="2000"></count-to><br />-->
<!--            </div>-->
<!--          </div>-->
<!--        </a>-->
<!--      </el-col>-->
      <el-col :xs="12" :sm="12" :lg="6" class="card-panel-col">
        <a href="#/password/index">
          <div class="card-panel">
            <div class="card-panel-icon-wrapper icon-shoppingCard">
              <svg-icon icon-class="note" class-name="card-panel-icon" />
            </div>
            <div class="card-panel-description">
              <div class="card-panel-text">密码本</div>
            </div>
          </div>
        </a>
      </el-col>
    </el-row>
    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">
      <timeline-chart :timeline="timelineChartData"></timeline-chart>
    </el-row>
<!--    <el-row style="background:#fff;padding:16px 16px 0;margin-bottom:32px;">-->
<!--      <wage-chart :chart-data="wageChartData"></wage-chart>-->
<!--    </el-row>-->
    <!--<div class="dashboard-text">name:{{name}}</div>
    <div class="dashboard-text">roles:<span v-for='role in roles' :key='role'>{{role}}</span></div>-->
  </div>
</template>

<script>
  import GithubCorner from '@/components/GithubCorner'
  // import WageChart from './components/WageChart'
  import TimelineChart from './components/TimelineChart'
  import { getList } from '@/api/homepage'
  import countTo from 'vue-count-to'
  export default {
    components: {
      GithubCorner,
      // WageChart,
      TimelineChart,
      countTo
    },
    data() {
      return {
        // wageChartData: [],
        timelineChartData: {},
        cardPanel: {}
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        getList().then(response => {
          // this.wageChartData = response.data.wages
          this.timelineChartData = response.data.timeline
          this.cardPanel = response.data.cardPanel
          this.listLoading = false
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  .dashboard {
    &-container {
      margin: 30px;
    }
    &-text {
      font-size: 30px;
      line-height: 46px;
    }
  }

  .dashboard-editor-container {
    padding: 32px;
    background-color: rgb(240, 242, 245);
    .chart-wrapper {
      background: #fff;
      padding: 16px 16px 0;
      margin-bottom: 32px;
    }
  }

  .card-panel-num {
    font-size: 10px !important;
    color: rgba(0, 0, 0, 0.45);
  }

  .panel-group {
    margin-top: 18px;
    .card-panel-col {
      margin-bottom: 32px;
    }
    .card-panel {
      height: 108px;
      cursor: pointer;
      font-size: 12px;
      position: relative;
      overflow: hidden;
      color: #666;
      background: #fff;
      box-shadow: 4px 4px 40px rgba(0, 0, 0, .05);
      border-color: rgba(0, 0, 0, .05);
      &:hover {
        .card-panel-icon-wrapper {
          color: #fff;
        }
        .icon-people {
          background: #40c9c6;
        }
        .icon-message {
          background: #36a3f7;
        }
        .icon-money {
          background: #f4516c;
        }
        .icon-shoppingCard {
          background: #34bfa3
        }
      }
      .icon-people {
        color: #40c9c6;
      }
      .icon-message {
        color: #36a3f7;
      }
      .icon-money {
        color: #f4516c;
      }
      .icon-shoppingCard {
        color: #34bfa3
      }
      .card-panel-icon-wrapper {
        float: left;
        margin: 14px 0 0 14px;
        padding: 16px;
        transition: all 0.38s ease-out;
        border-radius: 6px;
      }
      .card-panel-icon {
        float: left;
        font-size: 48px;
      }
      .card-panel-description {
        float: right;
        font-weight: bold;
        margin: 26px;
        margin-left: 0px;
        .card-panel-text {
          line-height: 18px;
          color: rgba(0, 0, 0, 0.45);
          font-size: 16px;
          margin-bottom: 20px;
        }
        .card-panel-num {
          font-size: 20px;
        }
      }
    }
  }
</style>
