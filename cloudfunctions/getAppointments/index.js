const cloud = require("wx-server-sdk");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

// 获取预约列表
exports.main = async (event) => {
  try {
    const { doctorId, status } = event;
    
    if (!doctorId || doctorId.trim() === '') {
      return {
        success: false,
        errMsg: "医生ID不能为空"
      };
    }
    
    let query = db.collection("appointments").where({
      doctorId: doctorId
    });
    
    if (status && status.trim() !== '') {
      query = query.where({
        status: status
      });
    }
    
    const result = await query.orderBy('appointmentTime', 'desc').get();
    
    return {
      success: true,
      data: result.data
    };
  } catch (e) {
    console.error('getAppointments error:', e);
    return {
      success: false,
      errMsg: "获取预约列表失败，请稍后重试"
    };
  }
};
