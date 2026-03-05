const cloud = require("wx-server-sdk");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

// 医生登录
exports.main = async (event) => {
  try {
    const { phone, password } = event;
    
    if (!phone || phone.trim() === '') {
      return {
        success: false,
        errMsg: "手机号不能为空"
      };
    }
    
    if (!password || password.trim() === '') {
      return {
        success: false,
        errMsg: "密码不能为空"
      };
    }
    
    const doctor = await db.collection("doctors").where({
      phone: phone
    }).get();
    
    if (doctor.data.length === 0) {
      return {
        success: false,
        errMsg: "医生不存在"
      };
    }
    
    const doctorInfo = doctor.data[0];
    
    if (doctorInfo.password !== password) {
      return {
        success: false,
        errMsg: "密码错误"
      };
    }
    
    return {
      success: true,
      data: doctorInfo
    };
  } catch (e) {
    console.error('doctorLogin error:', e);
    return {
      success: false,
      errMsg: "登录失败，请稍后重试"
    };
  }
};
