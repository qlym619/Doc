Page({
  data: {
    doctorInfo: {}
  },

  onLoad: function () {
    this.checkLogin();
    this.loadDoctorInfo();
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
