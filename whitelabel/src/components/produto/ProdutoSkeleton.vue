<template>
    <div class="skeleton-container">
      <div class="skeleton-title"></div>
      <div class="skeleton-info"></div>
      <div class="skeleton-image"></div>
      <div class="skeleton-details"></div>
      <div class="skeleton-price"></div>
    </div>
  </template>
  
  <style scoped>
  .skeleton-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 1500px;
  margin: 0 auto; 
  padding: 0 20px; 
}
  
  .skeleton-title,
  .skeleton-info,
  .skeleton-image,
  .skeleton-details,
  .skeleton-price {
    background-color: #e0e0e0;
    border-radius: 4px;
    animation: pulse 1.5s infinite;
  }
  
  .skeleton-title {
    width: 60%;
    height: 24px;
  }
  
  .skeleton-info {
    width: 40%;
    height: 20px;
  }
  
  .skeleton-image {
    width: 100%;
    height: 300px;
  }
  
  .skeleton-details {
    width: 100%;
    height: 150px;
  }
  
  .skeleton-price {
    width: 30%;
    height: 28px;
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
  