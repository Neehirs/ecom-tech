<template>
    <div class="skeleton-specs-container">
      <div class="skeleton-spec-title"></div>
      <div class="skeleton-table">
        <div v-for="n in 5" :key="n" class="skeleton-row">
          <div class="skeleton-cell skeleton-name"></div>
          <div class="skeleton-cell skeleton-value"></div>
        </div>
      </div>
    </div>
  </template>
  
  <style scoped>
  .skeleton-specs-container {
    background-color: #ffffff;
    border-radius: 12px;
    padding: 20px;
  }
  
  .skeleton-spec-title {
    width: 30%;
    height: 24px;
    background-color: #e0e0e0;
    border-radius: 4px;
    margin-bottom: 20px;
    animation: pulse 1.5s infinite;
  }
  
  .skeleton-table {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .skeleton-row {
    display: flex;
    justify-content: space-between;
  }
  
  .skeleton-cell {
    background-color: #e0e0e0;
    border-radius: 4px;
    height: 20px;
    animation: pulse 1.5s infinite;
  }
  
  .skeleton-name {
    width: 45%;
  }
  
  .skeleton-value {
    width: 25%;
  }
  
  @keyframes pulse {
    0% {
      opacity: 1;
    }
    50% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }
  </style>
  