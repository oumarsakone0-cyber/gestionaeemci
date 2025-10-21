<template>
  <div id="app">
    <!-- Container pour sidebar + corps -->
    <div class="main-container">
      <MainContent />
    </div>
  </div>
</template>

<script setup>
import MainContent from '../components/MainContent.vue'
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f8f9fa;
  color: #333;
}

#app {
  height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-container {
  flex: 1;
  display: flex;
  overflow: hidden;
}
</style>