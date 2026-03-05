Page({
  data: {
    appointment: {}
  },

  onLoad: function (options) {
    const appointmentId = options.id;
    if (appointmentId) {
      this.loadAppointmentDetail(appointmentId);
    }
  },

  loadAppointmentDetail: function(appointmentId) {
    wx.showLoading({ title: '加载中...' });
    
    wx.cloud.callFunction({
      name: 'getAppointmentDetail',
      data: {
        appointmentId: appointmentId
      },
      success: res => {
        wx.hideLoading();
        if (res.result.success) {
          this.setData({ appointment: res.result.data });
        } else {
          wx.showToast({ title: res.result.errMsg, icon: 'none' });
        }
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({ title: '获取预约详情失败，请稍后重试', icon: 'none' });
        console.error('获取预约详情失败:', err);
      }
    });
  },

  confirmAppointment: function() {
    wx.showModal({
      title: '确认预约',
      content: '确定要确认这个预约吗？',
      success: res => {
        if (res.confirm) {
          this.updateAppointmentStatus('confirmed');
        }
      }
    });
  },

  cancelAppointment: function() {
    wx.showModal({
      title: '取消预约',
      content: '确定要取消这个预约吗？',
      success: res => {
        if (res.confirm) {
          this.updateAppointmentStatus('cancelled');
        }
      }
    });
  },

  updateAppointmentStatus: function(status) {
    wx.showLoading({ title: '处理中...' });
    
    wx.cloud.callFunction({
      name: 'updateAppointmentStatus',
      data: {
        appointmentId: this.data.appointment._id,
        status: status
      },
      success: res => {
        wx.hideLoading();
        if (res.result.success) {
          wx.showToast({ title: '操作成功', icon: 'success' });
          this.setData({
            'appointment.status': status
          });
        } else {
          wx.showToast({ title: res.result.errMsg, icon: 'none' });
        }
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({ title: '操作失败，请稍后重试', icon: 'none' });
        console.error('更新预约状态失败:', err);
      }
    });
  },

  formatDate: function(date) {
    if (!date) return '';
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  },

  getStatusText: function(status) {
    const statusMap = {
      pending: '待处理',
      confirmed: '已确认',
      completed: '已完成',
      cancelled: '已取消'
    };
    return statusMap[status] || status;
  },

  getStatusColor: function(status) {
    const colorMap = {
      pending: '#ff9800',
      confirmed: '#4caf50',
      completed: '#2196f3',
      cancelled: '#f44336'
    };
    return colorMap[status] || '#999';
  },

  createPrescription: function() {
    const appointment = this.data.appointment;
    wx.navigateTo({
      url: `../../prescriptions/addPrescription/addPrescription?patientName=${appointment.patientName}&patientPhone=${appointment.patientPhone}`
    });
  }
});
