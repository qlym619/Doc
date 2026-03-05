const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { appointmentId } = event
    
    if (!appointmentId) {
      return {
        success: false,
        errMsg: '预约ID不能为空'
      }
    }
    
    const appointment = await db.collection('appointments').doc(appointmentId).get()
    
    if (!appointment.data) {
      return {
        success: false,
        errMsg: '预约不存在'
      }
    }
    
    return {
      success: true,
      data: appointment.data
    }
  } catch (err) {
    console.error('获取预约详情失败:', err)
    return {
      success: false,
      errMsg: '获取预约详情失败，请稍后重试'
    }
  }
}
