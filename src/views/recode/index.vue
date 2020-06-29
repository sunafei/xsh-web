<template>
  <div class="app-container">
    <div class="filter-container">
      <!--<el-input v-if="buttonStatus==true" @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="名称" v-model="listQuery.name">
      </el-input>
      <el-button v-if="buttonStatus==true" class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>-->
      <el-button v-if="buttonStatus==true" class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">新增</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handlePwd" type="primary" icon="el-icon-info">查看密码</el-button>
    </div>

    <el-table :data="list" v-loading.body="listLoading" element-loading-text="Loading" border fit highlight-current-row style="width: 100%;margin-top: 20px">
      <el-table-column label="名称">
        <template slot-scope="scope">
          {{scope.row.name}}
        </template>
      </el-table-column>
      <el-table-column label="内容">
        <template slot-scope="scope">
          {{scope.row.content}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="handleUpdate(scope.row)" type="primary" size="small">编辑</el-button>
          <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <div class="pagination-container" v-if="buttonStatus==true">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pagination.page" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pagination.size" layout="total, sizes, prev, pager, next, jumper" :total="total">
      </el-pagination>
    </div>

    <el-drawer :visible.sync="dialogFormVisible" size="60%">
<!--    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" :fullscreen="true">-->
      <el-form :rules="rules" ref="dataForm" :model="obj" label-position="left" label-width="70px" style="margin-left:50px;margin-right: 30px;">
        <el-input v-model="obj.id" type="hidden"></el-input>
        <el-form-item label="名称" prop="name">
          <el-input v-model="obj.name"></el-input>
        </el-form-item>
        <el-form-item label="内容">
          <el-input type="textarea" :autosize="{ minRows: 4, maxRows: 8}" placeholder="Please input" v-model="obj.content">
          </el-input>
        </el-form-item>
        <el-form-item label="附件">
          <el-upload :action="uploadAddr" :headers="headers" :file-list="fileIds" list-type="picture-card" :on-success="handleUploadSuccess" :on-preview="handlePictureCardPreview" :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-dialog :visible.sync="dialogVisible" append-to-body>
          <a :href="downImageUrl">点击下载</a>
          <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
      </el-form>
      <div class="dialog-footer" style="text-align: right;margin-right: 20px;">
<!--        <el-button @click="dialogFormVisible = false">取消</el-button>-->
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData('dataForm')">确认</el-button>
        <el-button v-else type="primary" @click="updateData('dataForm')">确认</el-button>
      </div>
<!--    </el-dialog>-->
    </el-drawer>
    <el-dialog title="密码验证"  :visible.sync="dialogPwdVisible">
      <el-form ref="checkForm" label-position="left" @submit.native.prevent>
        <el-form-item prop="pwd">
          <el-input placeholder="请输入二级密码" v-model="pwd" autocomplete="off" autofocus="true" show-password @keyup.enter.native="checkPwdData('checkForm')">
<!--            <template slot="prepend">输入二级密码</template>-->
            <el-button slot="append" icon="el-icon-search" @click="checkPwdData('checkForm')"></el-button>
          </el-input>
<!--          <el-input type="password" v-model="pwd" auto-complete="off"></el-input>-->
        </el-form-item>
      </el-form>
<!--      <div slot="footer" class="dialog-footer">-->
<!--        <el-button @click="dialogPwdVisible = false">取消</el-button>-->
<!--        <el-button type="primary" @click="checkPwdData('checkForm')">确认</el-button>-->
<!--      </div>-->
    </el-dialog>
  </div>
</template>

<script>
  import { getList, saveOrUpdate, del } from '@/api/recode'
  import { checkPwd } from '@/api/login'
  import { getToken } from '@/utils/auth'

  export default {
    data() {
      return {
        list: null,
        total: null,
        listLoading: false,
        listQuery: {
          pagination: {
            page: 1,
            size: 10,
            orderName: 'id',
            orderType: 1
          },
          queryCriteria: {}
        },
        obj: {
          id: undefined,
          name: '',
          content: '',
          fileId: ''
        },
        dialogFormVisible: false,
        dialogPwdVisible: true,
        dialogStatus: '',
        textMap: {
          update: '编辑',
          create: '新增'
        },
        dialogPvVisible: false,
        rules: {
          // name: [{
          //   required: true,
          //   message: 'name is required',
          //   trigger: 'change'
          // }]
        },
        fileIds: [],
        dialogImageUrl: '',
        dialogVisible: false,
        downImageUrl: '',
        buttonStatus: false,
        pwd: undefined,
        uploadAddr: process.env.BASE_API + '/api/uploadFile'
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
      //    this.fetchData()
    },
    computed: {
      headers() {
        return {
          'Authorization': 'bearer ' + getToken()
        }
      }
    },
    methods: {
      handleUploadSuccess(response, file, fileList) { // 图片上传成功
        var result = JSON.parse(response.data)
        this.fileIds.push(result)
      },
      handleRemove(file, fileList) {
        this.fileIds.splice(this.fileIds.indexOf(file), 1)
      },
      handlePictureCardPreview(file) {
        this.dialogImageUrl = file.url
        this.downImageUrl = file.url
        this.dialogVisible = true
      },
      handleFilter() {
        this.listQuery.pagination.page = 1
        this.listQuery.queryCriteria.name = 'name'
        this.listQuery.queryCriteria.exp = 'like'
        this.listQuery.queryCriteria.val = this.listQuery.name
        this.fetchData()
      },
      handlePwd() {
        this.dialogPwdVisible = true
        this.pwd = undefined
        this.$nextTick(() => {
          this.$refs['checkForm'].clearValidate()
        })
      },
      handleCreate() {
        this.resetObj()
        this.fileIds = []
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      handleUpdate(row) {
        this.obj = Object.assign({}, row) // copy obj
        this.fileIds = JSON.parse('[' + this.obj.fileId + ']')
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      createData(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.obj.fileId = JSON.stringify(this.fileIds).replace('[', '').replace(']', '')
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
          content: '',
          fileId: ''
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
            objData.fileId = JSON.stringify(this.fileIds).replace('[', '').replace(']', '')
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
      checkPwdData(formName) {
        if (this.pwd) {
          checkPwd(this.pwd).then((result) => {
            if (result.data === 1) {
              this.buttonStatus = true
              this.dialogPwdVisible = false
              this.$notify({
                title: '验证成功',
                message: '加载数据中',
                type: 'success',
                duration: 2000
              })
              this.fetchData()
            } else {
              this.$notify({
                title: '验证失败',
                message: '密码错误',
                type: 'error',
                duration: 2000
              })
            }
          })
        }
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

<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }

  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
