<style>
  .panel {
    transform: translateY(100%);
    transition: transform .3s ease;
    height: 2.7rem;
    line-height: 2.7rem;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: white;
    box-shadow: 0 0 3px #ccc;
    text-align: center;
  }
  .btn-round {
    width: 100px;
    height: 1.7rem;
    line-height: 1.7rem;
    margin: .5rem 0;
    background-color: #00C4FF;
    border: none;
    display: inline-block;
    outline: none;
    font-size: 1rem;
    cursor: pointer;
    color: white;
    &:not(:last-child) {
      margin-right: 30px;
    }
    &:disabled {
      background-color: gray;
      cursor: default;
    }
  }
</style>

<template>
  <div class="panel">
    <button
      class="btn-round nav-back"
      @click="back">
      返回
    </button>
    <button
      class="btn-round nav-forward"
      @click="forward">
      前进
    </button>
  </div>
</template>

<script>  
  export default {
    methods: {
      back() {
        weiboWebview.goBack()
      },
      forward() {
        weiboWebview.goForward()
      }
    }
  }
</script>
