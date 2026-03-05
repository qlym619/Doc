Page({
  data: {
    prescriptions: [],
    searchKeyword: ''
  },

  onLoad: function () {
    this.loadPrescriptions();
  },

  loadPrescriptions: function() {
    wx.showLoading({ title: '加载中...' });
    
    wx.cloud.callFunction({
      name: 'getPrescriptions',
      data: {
        doctorId: wx.getStorageSync('doctorInfo')._id,
        keyword: this.data.searchKeyword
      },
      success: res => {
        wx.hideLoading();
        if (res.result.success) {
          this.setData({ prescriptions: res.result.data });
        } else {
          wx.showToast({ title: res.result.errMsg, icon: 'none' });
        }
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({ title: '获取处方列表失败，请稍后重试', icon: 'none' });
        console.error('获取处方列表失败:', err);
      }
    });
  },

  bindSearchInput: function(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  search: function() {
    this.loadPrescriptions();
  },

  addPrescription: function() {
    wx.navigateTo({
      url: './addPrescription/addPrescription'
    });
  },

  viewPrescriptionDetail: function(e) {
    const prescriptionId = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: './prescriptionDetail/prescriptionDetail?id=' + prescriptionId
    });
  }
});
