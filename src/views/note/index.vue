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
      <el-table-column label="等级">
        <template slot-scope="scope">
          <svg-icon v-for="n in +scope.row.level" icon-class="star" class="meta-item__icon" :key="n"></svg-icon>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="handleUpdate(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pagination.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pagination.size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :fullscreen="true">
      <el-form :rules="rules" ref="dataForm" :model="obj" label-position="left" label-width="70px" style='margin-left:50px;'>
        <el-input v-model="obj.id" type="hidden"></el-input>
        <el-form-item label="名称" prop="name">
          <el-input v-model="obj.name"></el-input>
        </el-form-item>
        <el-form-item label="等级" prop="level">
          <el-rate style="margin-top:8px;" v-model="obj.level" :colors="['#99A9BF', '#F7BA2A', '#FF9900']" :max='3'></el-rate>
        </el-form-item>
        <el-form-item label="内容">
          <!-- <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="Please input" v-model="obj.content">
          </el-input>-->
          <v-editor :data="obj"></v-editor>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取消</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData('dataForm')">确认</el-button>
        <el-button v-else type="primary" @click="updateData('dataForm')">确认</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import Editor from '@/components/Editor'
  import { getList, saveOrUpdate, del } from '@/api/note'

  export default {
    components: {
      'v-editor': Editor
    },
    data() {
      return {
        list: null,
        total: null,
        listLoading: true,
        listQuery: {
          pagination: {
            page: 1,
            size: 10,
            orderName: 'level',
            orderType: 1
          },
          queryCriteria: {},
          name: undefined
        },
        importanceOptions: [1, 2, 3],
        calendarTypeOptions: [{
          key: '阴历',
          label: '阴历'
        }, {
          key: '阳历',
          label: '阳历'
        }],
        obj: {
          id: undefined,
          name: '',
          level: '',
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
          level: [{
            required: true,
            message: 'level is required',
            trigger: 'blur'
          }]
        }
      }
    },
    filters: {
      time(val) {
        const date = new Date(val)
        const month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1)
        const day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
        return date.getFullYear() + '-' + month + '-' + day
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
