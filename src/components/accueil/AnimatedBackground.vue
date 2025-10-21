<template>
    <div class="absolute inset-0 overflow-hidden">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
      <div class="blob blob-4"></div>
      <div class="blob blob-5"></div>
    </div>
  </template>
  
  <style scoped>
  /* ANIMATIONS DE BLOBS */
  .blob {
    position: absolute;
    border-radius: 50%;
    filter: blur(40px);
    mix-blend-mode: multiply;
    animation: blob 7s infinite;
    opacity: 0.8;
  }
  
  .blob-1 {
    top: -50px;
    right: -50px;
    width: 300px;
    height: 300px;
    background: linear-gradient(45deg, #22c55e, #16a34a);
    animation-delay: 0s;
  }
  
  .blob-2 {
    bottom: -50px;
    left: -50px;
    width: 350px;
    height: 350px;
    background: linear-gradient(45deg, #10b981, #059669);
    animation-delay: 2s;
  }
  
  .blob-3 {
    top: 20%;
    left: 10%;
    width: 250px;
    height: 250px;
    background: linear-gradient(45deg, #14b8a6, #0d9488);
    animation-delay: 4s;
  }
  
  .blob-4 {
    top: 60%;
    right: 20%;
    width: 200px;
    height: 200px;
    background: linear-gradient(45deg, #84cc16, #65a30d);
    animation-delay: 6s;
  }
  
  .blob-5 {
    bottom: 30%;
    left: 30%;
    width: 280px;
    height: 280px;
    background: linear-gradient(45deg, #06b6d4, #0891b2);
    animation-delay: 8s;
  }
  
  @keyframes blob {
    0% {
      transform: translate(0px, 0px) scale(1);
    }
    33% {
      transform: translate(30px, -50px) scale(1.1);
    }
    66% {
      transform: translate(-20px, 20px) scale(0.9);
    }
    100% {
      transform: translate(0px, 0px) scale(1);
    }
  }
  </style>
  