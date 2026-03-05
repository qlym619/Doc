Page({
  data: {
    doctorInfo: {},
    todayAppointments: 0,
    totalPrescriptions: 0
  },

  onLoad: function () {
    this.checkLogin();
    this.loadDoctorInfo();
    this.loadStats();
  },

  checkLogin: function() {
    const doctorInfo = wx.getStorageSync('doctorInfo');
    if (!doctorInfo) {
      wx.redirectTo({
        url: '../login/login'
      });
    }
  },

  loadDoctorInfo: function() {
    const doctorInfo = wx.getStorageSync('doctorInfo');
    this.setData({ doctorInfo });
  },

  loadStats: function() {
    wx.showLoading({ title: '加载中...' });
    wx.cloud.callFunction({
      name: 'getDoctorStats',
      data: {
        doctorId: this.data.doctorInfo._id
      },
      success: res => {
        wx.hideLoading();
        if (res.result.success) {
          this.setData({
            todayAppointments: res.result.data.todayAppointments,
            totalPrescriptions: res.result.data.totalPrescriptions
          });
        } else {
          wx.showToast({ title: res.result.errMsg, icon: 'none' });
        }
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({ title: '获取统计数据失败，请稍后重试', icon: 'none' });
        console.error('获取统计数据失败:', err);
      }
    });
  },

  navigateToPrescriptions: function() {
    wx.navigateTo({
      url: '../prescriptions/prescriptions'
    });
  },

  navigateToAppointments: function() {
    wx.navigateTo({
      url: '../appointments/appointments'
    });
  },

  navigateToSettings: function() {
    wx.navigateTo({
      url: '../settings/settings'
    });
  },

  logout: function() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出登录吗？',
      success: res => {
        if (res.confirm) {
          wx.removeStorageSync('doctorInfo');
          wx.redirectTo({
            url: '../login/login'
          });
        }
      }
    });
  }
});
