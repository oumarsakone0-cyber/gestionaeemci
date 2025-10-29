<template>
  <main class="main-content">
    <!-- Section In Progress -->
    <div class="task-section">
      <div class="section-header">
        <div class="section-title">
          <span class="status-indicator in-progress"></span>
          <span class="title-text">In Progress</span>
          <span class="task-count">2</span>
        </div>
      </div>

      <div class="task-table">
        <div class="table-header">
          <div class="col-task">Task</div>
          <div class="col-description">Description</div>
          <div class="col-assignee">Assignee</div>
          <div class="col-date">Due Date</div>
          <div class="col-priority">Priority</div>
          <div class="col-progress">Progress</div>
          <div class="col-created">Created</div>
          <div class="col-actions"></div>
        </div>

        <div class="task-row">
          <div class="col-task">
            <div class="task-info">
              <span class="task-icon">🔲</span>
              <span class="task-name">Wireframing</span>
              <span class="task-number">3</span>
            </div>
          </div>
          <div class="col-description">-</div>
          <div class="col-assignee">
            <div class="assignee-avatars">
              <div class="avatar avatar-1"></div>
              <div class="avatar avatar-2"></div>
            </div>
          </div>
          <div class="col-date">February 12, 2024</div>
          <div class="col-priority">
            <span class="priority urgent">🔴 Urgent</span>
          </div>
          <div class="col-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: 85%"></div>
            </div>
            <span class="progress-text">85%</span>
          </div>
          <div class="col-created">
            <span class="created-icon">👤</span>
          </div>
          <div class="col-actions">
            <button class="action-btn">⋯</button>
          </div>
        </div>

        <div class="task-row">
          <div class="col-task">
            <div class="task-info">
              <span class="task-icon">📊</span>
              <span class="task-name">Dashboard</span>
            </div>
          </div>
          <div class="col-description">Create wireframe for Dashboard page</div>
          <div class="col-assignee">
            <div class="assignee-avatars">
              <div class="avatar avatar-3"></div>
              <div class="avatar avatar-4"></div>
            </div>
          </div>
          <div class="col-date">February 12, 2024</div>
          <div class="col-priority">
            <span class="priority urgent">🔴 Urgent</span>
          </div>
          <div class="col-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: 95%"></div>
            </div>
            <span class="progress-text">95%</span>
          </div>
          <div class="col-created">
            <span class="created-icon">👤</span>
          </div>
          <div class="col-actions">
            <button class="action-btn">⋯</button>
          </div>
        </div>

        <!-- Plus de tâches... -->
        <div class="task-row">
          <div class="col-task">
            <div class="task-info">
              <span class="task-icon">📈</span>
              <span class="task-name">Analytics</span>
            </div>
          </div>
          <div class="col-description">Create wireframe for analytics page</div>
          <div class="col-assignee">
            <div class="assignee-avatars">
              <div class="avatar avatar-1"></div>
              <div class="avatar avatar-2"></div>
              <div class="avatar avatar-5"></div>
            </div>
          </div>
          <div class="col-date">February 12, 2024</div>
          <div class="col-priority">
            <span class="priority urgent">🔴 Urgent</span>
          </div>
          <div class="col-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: 100%"></div>
            </div>
            <span class="progress-text">100%</span>
          </div>
          <div class="col-created">
            <span class="created-icon">👤</span>
          </div>
          <div class="col-actions">
            <button class="action-btn">⋯</button>
          </div>
        </div>

        <button class="add-task-btn">+ Add task</button>
      </div>
    </div>

    <!-- Section Ready to check by PM -->
    <div class="task-section">
      <div class="section-header">
        <div class="section-title">
          <span class="status-indicator ready"></span>
          <span class="title-text">Ready to check by PM</span>
          <span class="task-count">2</span>
        </div>
      </div>

      <div class="task-table">
        <div class="table-header">
          <div class="col-task">Task</div>
          <div class="col-description">Description</div>
          <div class="col-assignee">Assignee</div>
          <div class="col-date">Due Date</div>
          <div class="col-priority">Priority</div>
          <div class="col-progress">Progress</div>
          <div class="col-created">Created</div>
          <div class="col-actions"></div>
        </div>

        <div class="task-row">
          <div class="col-task">
            <div class="task-info">
              <span class="task-icon">🔲</span>
              <span class="task-name">Wireframing</span>
              <span class="task-number">3</span>
            </div>
          </div>
          <div class="col-description">-</div>
          <div class="col-assignee">
            <div class="assignee-avatars">
              <div class="avatar avatar-1"></div>
              <div class="avatar avatar-2"></div>
            </div>
          </div>
          <div class="col-date">February 9, 2024</div>
          <div class="col-priority">
            <span class="priority urgent">🔴 Urgent</span>
          </div>
          <div class="col-progress">
            <div class="progress-bar">
              <div class="progress-fill" style="width: 100%"></div>
            </div>
            <span class="progress-text">100%</span>
          </div>
          <div class="col-created">
            <span class="created-icon">👤</span>
          </div>
          <div class="col-actions">
            <button class="action-btn">⋯</button>
          </div>
        </div>

        <button class="add-task-btn">+ Add task</button>
      </div>
    </div>
  </main>
</template>

<script setup>
</script>

<style scoped>
.main-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background: #f8f9fa;
}

.task-section {
  background: white;
  border-radius: 8px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.section-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.status-indicator {
  width: 12px;
  height: 12px;
  border-radius: 50%;
}

.status-indicator.in-progress {
  background: #f59e0b;
}

.status-indicator.ready {
  background: #8b5cf6;
}

.title-text {
  font-size: 16px;
  font-weight: 600;
  color: #1f2937;
}

.task-count {
  background: #f3f4f6;
  color: #6b7280;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.task-table {
  padding: 0 24px 24px;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr 1fr 1fr 80px 40px;
  gap: 16px;
  padding: 12px 0;
  border-bottom: 1px solid #e5e7eb;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.task-row {
  display: grid;
  grid-template-columns: 2fr 2fr 1fr 1fr 1fr 1fr 80px 40px;
  gap: 16px;
  padding: 16px 0;
  border-bottom: 1px solid #f3f4f6;
  align-items: center;
}

.task-row:hover {
  background: #f9fafb;
}

.task-info {
  display: flex;
  align-items: center;
  gap: 8px;
}

.task-icon {
  font-size: 16px;
}

.task-name {
  font-size: 14px;
  font-weight: 500;
  color: #1f2937;
}

.task-number {
  background: #f3f4f6;
  color: #6b7280;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 11px;
  font-weight: 500;
}

.col-description {
  font-size: 14px;
  color: #6b7280;
}

.assignee-avatars {
  display: flex;
  gap: -4px;
}

.avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid white;
  margin-left: -4px;
}

.avatar:first-child {
  margin-left: 0;
}

.avatar-1 { background: #ef4444; }
.avatar-2 { background: #3b82f6; }
.avatar-3 { background: #10b981; }
.avatar-4 { background: #f59e0b; }
.avatar-5 { background: #8b5cf6; }

.col-date {
  font-size: 13px;
  color: #6b7280;
}

.priority {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  font-weight: 500;
}

.priority.urgent {
  color: #dc2626;
}

.priority.normal {
  color: #059669;
}

.priority.low {
  color: #6b7280;
}

.col-progress {
  display: flex;
  align-items: center;
  gap: 8px;
}

.progress-bar {
  flex: 1;
  height: 6px;
  background: #e5e7eb;
  border-radius: 3px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: #6366f1;
  border-radius: 3px;
  transition: width 0.3s ease;
}

.progress-text {
  font-size: 12px;
  color: #6b7280;
  font-weight: 500;
  min-width: 32px;
}

.created-icon {
  font-size: 16px;
}

.action-btn {
  width: 24px;
  height: 24px;
  border: none;
  background: transparent;
  border-radius: 4px;
  color: #9ca3af;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #f3f4f6;
  color: #6b7280;
}

.add-task-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border: 1px dashed #d1d5db;
  background: transparent;
  border-radius: 6px;
  color: #6b7280;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
  margin-top: 16px;
  width: 100%;
  justify-content: center;
}

.add-task-btn:hover {
  border-color: #6366f1;
  color: #6366f1;
  background: #f8faff;
}
</style>