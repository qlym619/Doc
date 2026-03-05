const cloud = require("wx-server-sdk");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

// 获取医生统计数据
exports.main = async (event) => {
  try {
    const { doctorId } = event;
    
    if (!doctorId || doctorId.trim() === '') {
      return {
        success: false,
        errMsg: "医生ID不能为空"
      };
    }
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    const todayAppointmentsResult = await db.collection("appointments").where({
      doctorId: doctorId,
      appointmentTime: {
        $gte: today,
        $lt: tomorrow
      }
    }).count();
    
    const totalPrescriptionsResult = await db.collection("prescriptions").where({
      doctorId: doctorId
    }).count();
    
    return {
      success: true,
      data: {
        todayAppointments: todayAppointmentsResult.total,
        totalPrescriptions: totalPrescriptionsResult.total
      }
    };
  } catch (e) {
    console.error('getDoctorStats error:', e);
    return {
      success: false,
      errMsg: "获取统计数据失败，请稍后重试"
    };
  }
};
