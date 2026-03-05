const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const { patientName, patientPhone, patientGender, patientAge, diagnosis, medicines, advice, doctorId, doctorName } = event
    
    if (!patientName || !patientPhone || !patientGender || !patientAge || !diagnosis || !medicines || medicines.length === 0) {
      return {
        success: false,
        errMsg: '参数不完整'
      }
    }
    
    const hasValidMedicines = medicines.some(med => med.name && med.dosage)
    if (!hasValidMedicines) {
      return {
        success: false,
        errMsg: '请至少添加一种有效的药品'
      }
    }
    
    const result = await db.collection('prescriptions').add({
      data: {
        patientName,
        patientPhone,
        patientGender,
        patientAge,
        diagnosis,
        medicines,
        advice,
        doctorId,
        doctorName,
        createdAt: new Date(),
        status: 'active'
      }
    })
    
    return {
      success: true,
      data: result
    }
  } catch (err) {
    console.error('添加处方失败:', err)
    return {
      success: false,
      errMsg: '添加处方失败，请稍后重试'
    }
  }
}
