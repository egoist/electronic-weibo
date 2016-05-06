import Vue from 'vue'
import app from './app'

onload = () => {
  window.weiboWebview = document.getElementById('weibo-webview')
  const indicator = document.querySelector('.app-loading')

  const loadstart = () => indicator.classList.remove('done')
  const loadstop = () => indicator.classList.add('done')
  
  weiboWebview.addEventListener('did-start-loading', loadstart)
  weiboWebview.addEventListener('did-stop-loading', loadstop)
}

new Vue({
  el: 'body',
  components: {
    app
  }
})
