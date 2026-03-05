const cloud = require("wx-server-sdk");
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV,
});

const db = cloud.database();

// 获取处方列表
exports.main = async (event) => {
  try {
    const { doctorId, keyword } = event;
    
    if (!doctorId || doctorId.trim() === '') {
      return {
        success: false,
        errMsg: "医生ID不能为空"
      };
    }
    
    let query = db.collection("prescriptions").where({
      doctorId: doctorId
    });
    
    if (keyword && keyword.trim() !== '') {
      query = query.where({
        $or: [
          {
            patientName: db.RegExp({
              regexp: keyword,
              options: 'i'
            })
          },
          {
            prescriptionId: db.RegExp({
              regexp: keyword,
              options: 'i'
            })
          }
        ]
      });
    }
    
    const result = await query.orderBy('createdAt', 'desc').get();
    
    return {
      success: true,
      data: result.data
    };
  } catch (e) {
    console.error('getPrescriptions error:', e);
    return {
      success: false,
      errMsg: "获取处方列表失败，请稍后重试"
    };
  }
};
