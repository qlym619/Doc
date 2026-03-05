Page({
  data: {
    formData: {
      patientName: '',
      patientPhone: '',
      patientGender: 'male',
      patientAge: '',
      diagnosis: '',
      medicines: [{
        name: '',
        dosage: ''
      }],
      advice: ''
    },
    canSubmit: false
  },

  onLoad: function (options) {
    this.checkLogin();
    
    if (options.patientName) {
      this.setData({
        'formData.patientName': options.patientName
      });
    }
    
    if (options.patientPhone) {
      this.setData({
        'formData.patientPhone': options.patientPhone
      });
    }
  },

  checkLogin: function() {
    const doctorInfo = wx.getStorageSync('doctorInfo');
    if (!doctorInfo) {
      wx.redirectTo({
        url: '../../login/login'
      });
    }
  },

  bindInput: function(e) {
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    this.setData({
      [`formData.${field}`]: value
    });
    this.checkForm();
  },

  bindGenderChange: function(e) {
    this.setData({
      'formData.patientGender': e.detail.value
    });
  },

  bindMedicineInput: function(e) {
    const index = e.currentTarget.dataset.index;
    const field = e.currentTarget.dataset.field;
    const value = e.detail.value;
    const medicines = [...this.data.formData.medicines];
    medicines[index][field] = value;
    this.setData({
      'formData.medicines': medicines
    });
    this.checkForm();
  },

  addMedicine: function() {
    const medicines = [...this.data.formData.medicines];
    medicines.push({ name: '', dosage: '' });
    this.setData({
      'formData.medicines': medicines
    });
  },

  removeMedicine: function(e) {
    const index = e.currentTarget.dataset.index;
    const medicines = [...this.data.formData.medicines];
    if (medicines.length > 1) {
      medicines.splice(index, 1);
      this.setData({
        'formData.medicines': medicines
      });
    }
  },

  checkForm: function() {
    const { patientName, patientAge, diagnosis, medicines } = this.data.formData;
    const hasValidMedicines = medicines.some(med => med.name && med.dosage);
    const canSubmit = patientName && patientAge && diagnosis && hasValidMedicines;
    this.setData({ canSubmit });
  },

  submitForm: function(e) {
    wx.showLoading({ title: '提交中...' });
    
    const doctorInfo = wx.getStorageSync('doctorInfo');
    const prescriptionData = {
      ...this.data.formData,
      doctorId: doctorInfo._id,
      doctorName: doctorInfo.name,
      createdAt: new Date(),
      status: 'active'
    };

    wx.cloud.callFunction({
      name: 'addPrescription',
      data: prescriptionData,
      success: res => {
        wx.hideLoading();
        if (res.result.success) {
          wx.showToast({ title: '处方添加成功', icon: 'success' });
          setTimeout(() => {
            wx.navigateBack();
          }, 1000);
        } else {
          wx.showToast({ title: res.result.errMsg, icon: 'none' });
        }
      },
      fail: err => {
        wx.hideLoading();
        wx.showToast({ title: '提交失败，请稍后重试', icon: 'none' });
        console.error('添加处方失败:', err);
      }
    });
  }
});
