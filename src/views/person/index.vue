<template>
  <div class="app-container">
    <el-form :rules="rules" ref="dataForm" :model="obj" label-position="left" label-width="70px" style='margin-left:50px;width: 400px;'>
      <el-input v-model="obj.id" type="hidden"></el-input>
      <el-form-item label="姓名">
        <el-input v-model="obj.name" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="用户名">
        <el-input v-model="obj.username" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="手机号" prop="mobile">
        <el-input v-model="obj.mobile"></el-input>
      </el-form-item>
      <el-form-item label="email" prop="email">
        <el-input v-model="obj.email"></el-input>
      </el-form-item>
      <el-form-item label="头像">
        <el-upload class="avatar-uploader" action="/api/uploadFile" :headers="headers" :show-file-list="false" :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer" style="margin-left:50px;">
      <el-button type="primary" @click="save('dataForm')">确认</el-button>
    </div>
  </div>
</template>
<script>
  import { get, save } from '@/api/person'
  import { getToken } from '@/utils/auth'

  export default {
    data() {
      return {
        id: undefined,
        obj: {
          id: undefined,
          name: '',
          username: '',
          photoId: '',
          email: '',
          mobile: ''
        },
        imageUrl: '',
        rules: {
          mobile: [{
            required: true,
            message: 'mobile is required',
            trigger: 'change'
          }],
          email: [{
            required: true,
            message: 'email is required',
            trigger: 'blur'
          },
          {
            type: 'email',
            message: 'email is error',
            trigger: ['blur', 'change']
          }]
        }
      }
    },
    created() {
      this.fetchData()
    },
    computed: {
      headers() {
        return {
          'Authorization': 'bearer ' + getToken()
        }
      }
    },
    methods: {
      handleAvatarSuccess(res, file) {
        const result = JSON.parse(res.data)
        this.obj.photoId = result.url
        this.imageUrl = result.url
      },
      beforeAvatarUpload(file) {
        const isJPG = file.type === 'image/jpeg'
        const isLt2M = file.size / 1024 / 1024 < 2
        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!')
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!')
        }
        return isJPG && isLt2M
      },
      save(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            const objData = Object.assign({}, this.obj)
            save(objData).then((result) => {
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
        get().then(response => {
          this.obj = response.data
          this.imageUrl = response.data.photoId
        })
      }
    }
  }
</script>
<style scoped>
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
