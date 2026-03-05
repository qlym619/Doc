Page({
  data: {
    prescription: {}
  },

  onLoad: function (options) {
    const prescriptionId = options.id;
    if (prescriptionId) {
      this.loadPrescriptionDetail(prescriptionId);
    }
  },

  loadPrescriptionDetail: function(prescriptionId) {
    wx.showLoading({ title: '加载中...' });
    
    wx.cloud.callFunction({
      name: 'getPrescriptionDetail',
      data: {
        prescriptionId: prescriptionId
      },
      success: res => {
        wx.hideLoading();
        if (res.result.success) {
          this.setData({ prescription: res.result.data });
        } else {
          wx.showToast({ title: res.result.errMsg, icon: 'none' });
        }
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({ title: '获取处方详情失败，请稍后重试', icon: 'none' });
        console.error('获取处方详情失败:', err);
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
  }
});
