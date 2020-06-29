<template>
  <div class="thirdparty-button">
    or connet with
    <a href="#" @click="githubLogin" >
      <svg-icon icon-class="github" class-name="github-icon" />
    </a>
  </div>
</template>

<script>
import qs from 'qs'
export default {
  data() {
    return {
      client_id: '2b0fe16de4597db23a12',
      client_secret: '8fed4616eaf29b3252ff5d730817a390512525b3',
      scope: 'read:user',
      state: 'sunafei',
      getCodeURL: 'https://github.com/login/oauth/authorize',
      code: null,
      loginLoading: null
    }
  },
  created: function() {
    this.getCode()
    if (this.code) {
      this.loginLoading = this.$loading({
        lock: true,
        text: '正在登陆 请稍后.......',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      this.excLogin()
    }
  },
  methods: {
    githubLogin: function() {
      location.href = this.getCodeURL
    },
    getCode: function() {
      this.getCodeURL = this.getCodeURL + ('?' + qs.stringify({
        client_id: this.client_id,
        scope: this.scope,
        state: this.state
      }))
      const codeUrl = qs.parse(location.search)
      if (codeUrl.state === this.state) {
        this.code = codeUrl['?code']
        history.pushState(null, null, '/')
      }
    },
    excLogin: function() {
      const tokenInfo = { 'code': this.code }
      this.$store.dispatch('GithHubLogin', tokenInfo).then(() => {
        this.loading = false
        if (this.loginLoading) {
          this.loginLoading.close()
        }
        this.$router.push({
          path: '/'
        })
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>
<style>
  .github-icon {
     font-size: 30px;
     color: #ffffff;
  }
  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
    color: #EEEEEE
  }
</style>
