<template>
  <div class="page-home" ref="canvas">
    <el-container>
      <el-header>
        <el-row>
          <div>实时Vnc
            <span></span>
            <span style="margin-left: 100px">SERVER: {{ this.hostinfo.host + ':' + this.hostinfo.port }}</span>
            <el-button size="small" style="margin-left: 200px">上传文件</el-button>
          </div>
        </el-row>
      </el-header>
      <el-container>
        <el-main>
          <div id="noVNC_canvas" ></div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
  import RFB from '@novnc/novnc'
  import { getVncHostAndPort, getServerResourceById } from '@/api/server_resource'

  export default {
    name: 'WebVnc',
    data() {
      return {
        terminal: '',
        server: '',
        websocket: '',
        hostinfo: {
          host: '',
          port: '',
          username: '',
          password: ''
        },
        vncInfo: {
          host: '',
          port: ''
        },
        web: '',
        wsPort: '',
        wdHost: '',
        wsServer: '',
        params: ''
      }
    },
    mounted() {
    },
    methods: {
      fetchData() {
        const url = window.location.href
        const id = url.split('?')[1]
        this.params = id
        getServerResourceById(this.params).then(
          res => {
            this.server = res
            this.hostinfo.host = this.server.manage_ip
            this.hostinfo.port = this.server.port
            this.hostinfo.username = this.server.user
            this.hostinfo.passwd = this.server.password
            this.vncInfo.host = this.server.manage_ip
            this.vncInfo.port = this.server.port
            getVncHostAndPort(this.vncInfo).then(
              res => {
                this.websocket = res
                this.wsPort = res.listen_port
                this.connect(this.wsPort)
              }
            )
          }
        )
      },
      connect(wsport) {
        const wsServer = 'ws://192.168.75.138:' + wsport + '/websockify'
        // const wsServer = 'ws://192.168.1.2:' + wsport + '/websockify'
        const rfb = new RFB(document.getElementById('noVNC_canvas'), wsServer,
          { credentials: { password: this.hostinfo.passwd }})
        rfb.connect
        rfb.resizeSession = true
      }
    },
    created() {
      this.fetchData()
    }
  }
</script>

<style lang="scss" scoped>
  .el-header, .el-footer {
    background-color: lightgoldenrodyellow;
    color: #333;
    /*text-align: center;*/
    line-height: 60px;
  }


  .el-main {
    background-color: #f6f6f6;
    color: #333;
    text-align: center;
    line-height: 160px;
  }

  body > .el-container {
    margin-bottom: 40px;
  }

  .el-container:nth-child(5) .el-aside,
  .el-container:nth-child(6) .el-aside {
    line-height: 260px;
  }

  .el-container:nth-child(7) .el-aside {
    line-height: 320px;
  }
</style>
