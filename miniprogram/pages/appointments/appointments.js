Page({
  data: {
    appointments: [],
    filterOptions: [
      { label: '全部', value: 'all' },
      { label: '待处理', value: 'pending' },
      { label: '已确认', value: 'confirmed' },
      { label: '已完成', value: 'completed' },
      { label: '已取消', value: 'cancelled' }
    ],
    activeFilter: 'all'
  },

  onLoad: function () {
    this.loadAppointments();
  },

  loadAppointments: function() {
    wx.showLoading({ title: '加载中...' });
    
    wx.cloud.callFunction({
      name: 'getAppointments',
      data: {
        doctorId: wx.getStorageSync('doctorInfo')._id,
        status: this.data.activeFilter === 'all' ? '' : this.data.activeFilter
      },
      success: res => {
        wx.hideLoading();
        if (res.result.success) {
          this.setData({ appointments: res.result.data });
        } else {
          wx.showToast({ title: res.result.errMsg, icon: 'none' });
        }
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({ title: '获取预约列表失败，请稍后重试', icon: 'none' });
        console.error('获取预约列表失败:', err);
      }
    });
  },

  setFilter: function(e) {
    const filter = e.currentTarget.dataset.value;
    this.setData({ activeFilter: filter });
    this.loadAppointments();
  },

  viewAppointmentDetail: function(e) {
    const appointmentId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './appointmentDetail/appointmentDetail?id=' + appointmentId
    });
  }
});
