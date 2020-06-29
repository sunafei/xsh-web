<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="名称" v-model="listQuery.name">
      </el-input>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">新增</el-button>
    </div>

    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row style="width: 100%;margin-top: 20px">
      <el-table-column label="名称">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="借入/借出">
        <template slot-scope="scope">
          {{scope.row.type}}
        </template>
      </el-table-column>
      <el-table-column label="金额(元)">
        <template slot-scope="scope">
          {{scope.row.fee}}
        </template>
      </el-table-column>
      <el-table-column label="日期">
        <template slot-scope="scope">
          <i class="el-icon-time"></i> {{scope.row.dateVal | time}}
        </template>
      </el-table-column>
      <el-table-column label="状态">
        <template slot-scope="scope">
          <el-tag :type="scope.row.done | statusFilter">{{scope.row.done | isDone}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="230">
        <template slot-scope="scope">
          <el-button @click="handleUpdate(scope.row)" type="primary" size="mini">编辑</el-button>
          <el-button v-if="scope.row.done == false" @click="done(scope.row)" type="success" size="mini">完结</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pagination.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pagination.size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-drawer :visible.sync="dialogFormVisible" size="40%">
      <el-form :rules="rules" ref="dataForm" :model="obj" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
        <el-input v-model="obj.id" type="hidden"></el-input>
        <el-form-item label="名称" prop="name">
          <el-input v-model="obj.name" placeholder="Please input"></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select class="filter-item" v-model="obj.type" placeholder="Please select">
            <el-option v-for="item in typeOptions" :key="item.key" :label="item.label" :value="item.key">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="金额" prop="fee">
          <el-input v-model="obj.fee" placeholder="Please input"></el-input>
        </el-form-item>
        <el-form-item label="日期" prop="dateVal">
          <el-date-picker v-model="obj.dateVal" type="date" format="yyyy 年 MM 月 dd 日" value-format="timestamp" placeholder="Please pick a date">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="Please input" v-model="obj.content">
          </el-input>
        </el-form-item>
      </el-form>
      <div class="dialog-footer" style="text-align: right;margin-right: 20px;">
<!--        <el-button @click="dialogFormVisible = false">取消</el-button>-->
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData('dataForm')">确认</el-button>
        <el-button v-else type="primary" @click="updateData('dataForm')">确认</el-button>
      </div>
    </el-drawer>
  </div>
</template>

<script>
  import { getList, saveOrUpdate, del, done } from '@/api/cashflow'

  export default {
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          pagination: {
            page: 1,
            size: 10,
            orderName: 'done',
            orderType: 0
          },
          queryCriteria: {},
          name: undefined
        },
        typeOptions: [{
          key: '借入',
          label: '借入'
        }, {
          key: '借出',
          label: '借出'
        }],
        obj: {
          id: undefined,
          name: 1,
          type: '',
          fee: '',
          dateVal: new Date().getTime(),
          content: ''
        },
        dialogFormVisible: false,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新增'
        },
        dialogPvVisible: false,
        pvData: [],
        rules: {
          name: [{
            required: true,
            message: 'name is required',
            trigger: 'change'
          }],
          type: [{
            required: true,
            message: 'type is required',
            trigger: 'change'
          }],
          fee: [{
            required: true,
            message: 'fee is required',
            trigger: 'change'
          }]
        }
      }
    },
    filters: {
      time(val) {
        if (!val) return null
        const date = new Date(val)
        const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
        const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        return date.getFullYear() + '-' + month + '-' + day
      },
      statusFilter(status) {
        const statusMap = {
          true: 'success',
          false: 'danger'
        }
        return statusMap[status]
      },
      isDone(status) {
        const statusMap = {
          true: '已结',
          false: '未结'
        }
        return statusMap[status]
      }
    },
    created() {
      this.fetchData()
    },

    methods: {
      handleFilter() {
        if (this.listQuery.name) {
          this.listQuery.pagination.page = 1
          this.listQuery.queryCriteria.name = 'name'
          this.listQuery.queryCriteria.exp = 'like'
          this.listQuery.queryCriteria.val = this.listQuery.name
        }
        this.fetchData()
      },
      handleCreate() {
        this.resetObj()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleUpdate(row) {
        this.obj = Object.assign({}, row) // copy obj
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            saveOrUpdate(this.obj).then((result) => {
              this.list.unshift(result.data)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '创建成功',
                type: 'success',
                duration: 2000
              })
            })
          } else {
            return false
          }
        })
      },
      handleDelete(row) {
        this.$confirm('是否删除', '警告', { type: 'warning' })
          .then(() => {
            del(row.id).then(() => {
              const index = this.list.indexOf(row)
              this.list.splice(index, 1)
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '删除成功',
                type: 'success',
                duration: 2000
              })
            })
          })
      },
      resetObj() {
        this.obj = {
          id: undefined,
          name: '',
          type: '',
          dateVal: new Date().getTime(),
          content: ''
        }
      },
      handleCurrentChange(val) {
        this.listQuery.pagination.page = val
        this.fetchData()
      },
      handleSizeChange(val) {
        this.listQuery.pagination.size = val
        this.fetchData()
      },

      updateData(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const objData = Object.assign({}, this.obj)
            objData.realDate = null
            saveOrUpdate(objData).then((result) => {
              for (const v of this.list) {
                if (v.id === result.data.id) {
                  const index = this.list.indexOf(v)
                  this.list.splice(index, 1, result.data)
                  break
                }
              }
              this.dialogFormVisible = false
              this.$notify({
                title: '成功',
                message: '更新成功',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      },
      done(row) {
        done(row.id).then(() => {
          row.done = true
          this.$notify({
            title: '成功',
            message: '操作成功',
            type: 'success',
            duration: 2000
          })
        })
      },
      fetchData() {
        this.listLoading = true
        getList(this.listQuery).then(response => {
          this.list = response.data.items
          this.total = response.data.total
          this.listLoading = false
        })
      }
    }
  }
</script>
