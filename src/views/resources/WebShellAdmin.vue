<template>
  <div>
    <el-container>
      <el-header>
        <div>
          <div class="session-header">
            SSH 会话
            <sup style="color: red">实时</sup>
          </div>
          <div>
            <img class="img-screen-class" :src="logo" >
            <div class="acname-title" style="margin-top: 2px">{{ this.hostinfo.host + ':' + this.hostinfo.port }}</div>
          </div>
          <div>
            <img class="img-date-class" :src="dateIcon" >
            <div class="acdesc" >{{this.date}}</div>
          </div>
        </div>
      </el-header>
      <el-container>
        <el-main>
          <div id='terminal'></div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import Terminal from './Xterm'
import { getResourceUsereById } from '@/api/resource'
import screen from '@/assets/screen.png'
import date from '@/assets/date.png'

export default {
  name: 'WebShellAdmin',
  data() {
    return {
      terminal: null,
      websocket: null,
      hostinfo: {
        host: '',
        port: '',
        username: '',
        passwd: ''
      },
      params: '',
      date: new Date(),
      logo: screen,
      dateIcon: date
    }
  },
  mounted() {
    this.terminal = new Terminal({
      cursorBlink: 5,
      scrollback: 200,
      tabStopWidth: 4,
      cols: 40,
      rows: 44
    })
    this.terminal.open(document.getElementById('terminal'))
    this.terminal.fit()
    this.terminal.on('data', (data) => {
      if (!data) return
      this.websocket.send(data)
    })
    const _this = this
    this.timer = setInterval(function() {
      _this.date = new Date().toLocaleString()
    })
    this.connect()
  },
  methods: {
    fetchData() {
      const url = window.location.href
      this.params = url.split('?')[1]
      getResourceUsereById(this.params).then(
        res => {
          this.hostinfo.host = res.manage_ip
          this.hostinfo.port = res.port
          this.hostinfo.username = res.user_name
          this.hostinfo.passwd = res.user_password
          this.hostinfo.private_key = res.private_key
        },
      )
    },
    connect() {
      this.websocket = new WebSocket('ws://192.168.234.128:8000/ws/ssh')
      this.websocket.onopen = () => {
        this.websocket.send(JSON.stringify(this.hostinfo))
      }
      this.websocket.onmessage = (message) => {
        this.terminal.write(message.data)
      }
      this.websocket.onerror = () => {
        this.terminal.write('something error, disconnected')
        this.websocket = null
      }
      this.websocket.onclose = () => {
        this.terminal.write('disconnected')
        this.websocket = null
      }
    }
  },
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer)
    }
  },
  created() {
    this.fetchData()
  }
}
</script>

<style lang="scss" scoped>
  .el-header, .el-footer {
    background-color: #E0E0E0;
    color: #333;
    /*text-align: center;*/
    line-height: 30px;
    height: 200px;
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

  .session-header {
    font-size: 18px;
    font-family: Open Sans;
    display: inline-block;
    padding: 12px;
    float: left;
  }
  .ssh-bor {
    /*border-left: 1px solid rebeccapurple;*/
    /*border-left: 2px red;*/
    border-width: 1px;
    background-color: red;
    display: inline-block;
    float: left;
    height: 100px;
  }
  .acname-title {
    color: #E66B11;
    font: 16px/38px Open Sans;
    width: 500px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .acdesc {
    color: #999;
    display: inline-block;
    font-family: Open Sans;
    float: left;
    margin-right: 15px;
    margin-bottom: 3px;
    font-size: 12px;
    line-height: 20px;
  }
  .flleft {
    float: left;
  }
  .sshIcon {
    /*font-size: 20px;*/
    float: left;
    /*margin: 1px 1px 1px 2px;*/
    margin-bottom: 10px;
    color: #333;
  }
  .img-screen-class {
    float: left;
    margin-top: 8px;
    margin-right: 5px;
    height: 20px;
    width: 20px;
  }
  .img-date-class {
    float: left;
    margin-left: 2px;
    margin-right: 8px;
    margin-bottom: 10px;
    height: 15px;
    width: 15px;
  }
</style>
