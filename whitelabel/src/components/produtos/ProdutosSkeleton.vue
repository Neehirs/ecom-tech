<template>
    <div class="product-skeleton">
      <div class="skeleton-image"></div>
      <div class="skeleton-info">
        <div class="skeleton-name"></div>
        <div class="skeleton-price"></div>
        <div class="skeleton-code"></div>
      </div>
    </div>
  </template>
  
  <style scoped>
  .product-skeleton {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    max-width: 260px;
    min-width: 220px;
    margin: 10px;
    padding: 15px;
    border-radius: 12px;
    background-color: #f0f0f0;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }
  
  .skeleton-image {
    width: 100%;
    height: 60%;
    background: #e0e0e0;
    border-radius: 8px;
    margin-bottom: 10px;
  }
  
  .skeleton-info {
    height: 40%;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }
  
  .skeleton-name, 
  .skeleton-price,
  .skeleton-code {
    background: #e0e0e0;
    height: 10px;
    border-radius: 4px;
    margin-bottom: 6px;
  }
  
  .skeleton-name {
    width: 80%;
  }
  
  .skeleton-price {
    width: 60%;
  }
  
  .skeleton-code {
    width: 40%;
  }
  </style>
  