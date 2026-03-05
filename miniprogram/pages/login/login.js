Page({
  data: {
    phone: '',
    password: '',
    canLogin: false
  },

  onLoad: function () {
    this.checkLoginStatus();
  },

  checkLoginStatus: function() {
    const doctorInfo = wx.getStorageSync('doctorInfo');
    if (doctorInfo) {
      wx.redirectTo({
        url: '../homepage/homepage'
      });
    }
  },

  bindPhoneInput: function(e) {
    const phone = e.detail.value;
    this.setData({ phone });
    this.checkForm();
  },

  bindPasswordInput: function(e) {
    const password = e.detail.value;
    this.setData({ password });
    this.checkForm();
  },

  checkForm: function() {
    const { phone, password } = this.data;
    const canLogin = phone.length === 11 && password.length >= 6;
    this.setData({ canLogin });
  },

  login: function() {
    const { phone, password } = this.data;
    
    wx.showLoading({ title: '登录中...' });
    
    wx.cloud.callFunction({
      name: 'doctorLogin',
      data: {
        phone,
        password
      },
      success: res => {
        wx.hideLoading();
        if (res.result.success) {
          wx.setStorageSync('doctorInfo', res.result.data);
          wx.showToast({ title: '登录成功', icon: 'success' });
          setTimeout(() => {
            wx.redirectTo({
              url: '../homepage/homepage'
            });
          }, 1000);
        } else {
          wx.showToast({ title: res.result.errMsg, icon: 'none' });
        }
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({ title: '登录失败，请稍后重试', icon: 'none' });
        console.error('登录失败:', err);
      }
    });
  }
});
