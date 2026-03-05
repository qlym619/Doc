const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { prescriptionId } = event
    
    if (!prescriptionId) {
      return {
        success: false,
        errMsg: '处方ID不能为空'
      }
    }
    
    const prescription = await db.collection('prescriptions').doc(prescriptionId).get()
    
    if (!prescription.data) {
      return {
        success: false,
        errMsg: '处方不存在'
      }
    }
    
    return {
      success: true,
      data: prescription.data
    }
  } catch (err) {
    console.error('获取处方详情失败:', err)
    return {
      success: false,
      errMsg: '获取处方详情失败，请稍后重试'
    }
  }
}
