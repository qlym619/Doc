const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { appointmentId, status } = event
    
    if (!appointmentId || !status) {
      return {
        success: false,
        errMsg: '参数不完整'
      }
    }
    
    const validStatuses = ['pending', 'confirmed', 'completed', 'cancelled']
    if (!validStatuses.includes(status)) {
      return {
        success: false,
        errMsg: '无效的状态值'
      }
    }
    
    const result = await db.collection('appointments').doc(appointmentId).update({
      data: {
        status: status,
        updatedAt: new Date()
      }
    })
    
    if (result.stats.updated === 0) {
      return {
        success: false,
        errMsg: '预约不存在或更新失败'
      }
    }
    
    return {
      success: true,
      data: result
    }
  } catch (err) {
    console.error('更新预约状态失败:', err)
    return {
      success: false,
      errMsg: '更新预约状态失败，请稍后重试'
    }
  }
}
