<style src="./main"></style>
<style>
  .app {
    &.show-panel {
      & .panel {
        transform: translateY(0);
      }
      & webview {
        height: calc(100% - 40px);  
      }
    }
    & webview {
      height: 100%;
    }
  }
</style>

<template>
  <div class="app" :class="{'show-panel': showPanel}">
    <panel></panel>
    <webview
      id="weibo-webview"
      tabindex="-1"
      useragent="Mozilla/5.0 (iPhone; CPU iPhone OS 9_1 like Mac OS X) AppleWebKit/601.1.46 (KHTML, like Gecko) Version/9.0 Mobile/13B143 Safari/601.1"
      src="http://m.weibo.cn">
    </webview>
  </div>
</template>

<script>
  import panel from './panel'
  
  export default {
    data() {
      return {
        showPanel: true
      }
    },
    ready() {
      window.addEventListener('keydown', e => {
        console.log(e.which)
        if ((e.metaKey || e.ctrlKey) && e.which === 73) {
          this.showPanel = !this.showPanel
        }
      }, false)
    },
    components: {
      panel
    }
  }
</script>
