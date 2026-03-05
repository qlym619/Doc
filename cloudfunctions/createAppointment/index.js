const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { patientName, patientPhone, doctorId, doctorName, department, subDepartment, appointmentDate, appointmentTime, area } = event
    
    if (!patientName || !patientPhone || !doctorId || !doctorName || !department || !appointmentDate || !appointmentTime) {
      return {
        success: false,
        errMsg: '参数不完整'
      }
    }
    
    const result = await db.collection('appointments').add({
      data: {
        patientName,
        patientPhone,
        doctorId,
        doctorName,
        department,
        subDepartment,
        appointmentDate,
        appointmentTime,
        area,
        status: 'pending',
        createdAt: new Date(),
        bookingNo: generateBookingNo()
      }
    })
    
    return {
      success: true,
      data: result
    }
  } catch (err) {
    console.error('创建预约失败:', err)
    return {
      success: false,
      errMsg: '创建预约失败，请稍后重试'
    }
  }
}

function generateBookingNo() {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `BH${timestamp}${random}`
}