<template>
  <div id="app">
    <transition name="fade-transform" mode="out-in">
     <router-view></router-view>
    </transition>
  </div>
</template>

<style lang="less">
.size{
  width: 100%;
  height: 100%;
}
html,body{
  .size;
  overflow: hidden;
  margin: 0;
  padding: 0;
}
#app {
  .size;
}

</style>
<style >


</style>