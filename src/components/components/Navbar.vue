<template>
  <nav class="navbar">
    <div class="navbar-left">
      <div class="logo">
        <div class="logo-icon">🔄</div>
        <span class="logo-text">AutomatePro</span>
      </div>
      
      <div class="breadcrumb">
        <span>Projects</span>
        <span class="separator">›</span>
        <span>Adrian Bert - CRM Dashboard</span>
      </div>
    </div>
    
    <div class="navbar-center">
      <div class="view-tabs">
        <button class="tab-btn active">
          <span class="tab-icon">📊</span>
          Spreadsheet
        </button>
        <button class="tab-btn">
          <span class="tab-icon">📅</span>
          Timeline
        </button>
        <button class="tab-btn">
          <span class="tab-icon">📆</span>
          Calendar
        </button>
        <button class="tab-btn">
          <span class="tab-icon">📋</span>
          Board
        </button>
        <button class="add-view-btn">+</button>
      </div>
    </div>
    
    <div class="navbar-right">
      <div class="search-container">
        <input type="text" placeholder="Search task..." class="search-input">
        <span class="search-icon">🔍</span>
      </div>
      
      <button class="filter-btn">
        <span class="filter-icon">🔽</span>
        Filter
      </button>
      
      <div class="notification-badge">
        <span class="badge">1</span>
      </div>
      
      <button class="share-btn">
        <span class="share-icon">📤</span>
        Share
      </button>
      
      <button class="more-btn">⋯</button>
    </div>
  </nav>
</template>

<script setup>
</script>

<style scoped>
.navbar {
  background: white;
  border-bottom: 1px solid #e1e5e9;
  padding: 12px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 64px;
  position: relative;
  z-index: 100;
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: 24px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.logo-icon {
  width: 24px;
  height: 24px;
  background: #6366f1;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
}

.logo-text {
  font-weight: 600;
  font-size: 16px;
  color: #1f2937;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #6b7280;
  font-size: 14px;
}

.separator {
  color: #9ca3af;
}

.navbar-center {
  flex: 1;
  display: flex;
  justify-content: center;
}

.view-tabs {
  display: flex;
  align-items: center;
  gap: 4px;
  background: #f3f4f6;
  border-radius: 8px;
  padding: 4px;
}

.tab-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: none;
  background: transparent;
  border-radius: 6px;
  font-size: 14px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
}

.tab-btn.active {
  background: white;
  color: #1f2937;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
}

.tab-btn:hover:not(.active) {
  color: #374151;
}

.tab-icon {
  font-size: 12px;
}

.add-view-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s;
}

.add-view-btn:hover {
  background: #e5e7eb;
}

.navbar-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.search-container {
  position: relative;
}

.search-input {
  width: 200px;
  padding: 8px 12px 8px 36px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
  background: white;
}

.search-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #9ca3af;
  font-size: 14px;
}

.filter-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-btn:hover {
  background: #f9fafb;
}

.notification-badge {
  position: relative;
}

.badge {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #ef4444;
  color: white;
  font-size: 12px;
  padding: 2px 6px;
  border-radius: 10px;
  min-width: 18px;
  text-align: center;
}

.share-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  background: white;
  border-radius: 6px;
  font-size: 14px;
  color: #374151;
  cursor: pointer;
  transition: all 0.2s;
}

.share-btn:hover {
  background: #f9fafb;
}

.more-btn {
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: all 0.2s;
}

.more-btn:hover {
  background: #f3f4f6;
}
</style>