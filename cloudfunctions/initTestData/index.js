const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()

exports.main = async (event, context) => {
  try {
    const results = {
      doctors: [],
      appointments: [],
      prescriptions: []
    }

    // 1. 创建测试医生账号
    const testDoctors = [
      {
        name: "张医生",
        phone: "13800138001",
        password: "123456",
        department: "内科",
        title: "主任医师",
        avatarUrl: "https://via.placeholder.com/100",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "李医生",
        phone: "13800138002",
        password: "123456",
        department: "外科",
        title: "副主任医师",
        avatarUrl: "https://via.placeholder.com/100",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: "王医生",
        phone: "13800138003",
        password: "123456",
        department: "儿科",
        title: "主治医师",
        avatarUrl: "https://via.placeholder.com/100",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ]

    for (const doctor of testDoctors) {
      // 检查是否已存在
      const existing = await db.collection('doctors').where({
        phone: doctor.phone
      }).get()

      if (existing.data.length === 0) {
        const result = await db.collection('doctors').add({
          data: doctor
        })
        results.doctors.push({
          id: result._id,
          name: doctor.name,
          phone: doctor.phone,
          department: doctor.department
        })
      } else {
        results.doctors.push({
          id: existing.data[0]._id,
          name: doctor.name,
          phone: doctor.phone,
          department: doctor.department,
          note: '已存在'
        })
      }
    }

    // 2. 创建测试预约数据
    const testAppointments = [
      {
        patientName: "测试患者1",
        patientPhone: "test_openid_1",
        doctorId: results.doctors[0]?.id || 'default_doctor',
        doctorName: "张医生",
        department: "内科",
        subDepartment: "呼吸内科",
        appointmentDate: "2026-03-05",
        appointmentTime: "上午 09:00-09:30",
        area: "主院区",
        status: 'pending',
        createdAt: new Date(),
        bookingNo: generateBookingNo()
      },
      {
        patientName: "测试患者2",
        patientPhone: "test_openid_2",
        doctorId: results.doctors[1]?.id || 'default_doctor',
        doctorName: "李医生",
        department: "外科",
        subDepartment: "普外科",
        appointmentDate: "2026-03-05",
        appointmentTime: "下午 14:00-14:30",
        area: "分院区",
        status: 'confirmed',
        createdAt: new Date(Date.now() - 86400000),
        bookingNo: generateBookingNo()
      },
      {
        patientName: "测试患者3",
        patientPhone: "test_openid_3",
        doctorId: results.doctors[2]?.id || 'default_doctor',
        doctorName: "王医生",
        department: "儿科",
        subDepartment: "小儿内科",
        appointmentDate: "2026-03-06",
        appointmentTime: "上午 10:00-10:30",
        area: "主院区",
        status: 'completed',
        createdAt: new Date(Date.now() - 172800000),
        bookingNo: generateBookingNo()
      }
    ]

    for (const appointment of testAppointments) {
      const result = await db.collection('appointments').add({
        data: appointment
      })
      results.appointments.push({
        id: result._id,
        patientName: appointment.patientName,
        doctorName: appointment.doctorName,
        status: appointment.status
      })
    }

    // 3. 创建测试处方数据
    const testPrescriptions = [
      {
        patientName: "测试患者1",
        patientPhone: "test_openid_1",
        patientGender: "male",
        patientAge: "35",
        diagnosis: "上呼吸道感染",
        medicines: [
          { name: "阿莫西林胶囊", dosage: "0.5g/次，每日3次" },
          { name: "感冒灵颗粒", dosage: "1袋/次，每日3次" }
        ],
        advice: "多喝水，注意休息，避免辛辣刺激食物",
        doctorId: results.doctors[0]?.id || 'default_doctor',
        doctorName: "张医生",
        createdAt: new Date(Date.now() - 86400000),
        status: 'active'
      },
      {
        patientName: "测试患者2",
        patientPhone: "test_openid_2",
        patientGender: "female",
        patientAge: "28",
        diagnosis: "急性肠胃炎",
        medicines: [
          { name: "蒙脱石散", dosage: "1袋/次，每日3次" },
          { name: "益生菌", dosage: "2粒/次，每日2次" },
          { name: "口服补液盐", dosage: "1袋溶于250ml温水，按需服用" }
        ],
        advice: "清淡饮食，避免油腻生冷食物，多喝温水",
        doctorId: results.doctors[1]?.id || 'default_doctor',
        doctorName: "李医生",
        createdAt: new Date(Date.now() - 172800000),
        status: 'active'
      },
      {
        patientName: "测试患者3",
        patientPhone: "test_openid_3",
        patientGender: "male",
        patientAge: "8",
        diagnosis: "小儿感冒",
        medicines: [
          { name: "小儿感冒颗粒", dosage: "半袋/次，每日3次" },
          { name: "布洛芬混悬液", dosage: "5ml/次，发热时服用" }
        ],
        advice: "注意保暖，多休息，体温超过38.5度及时就医",
        doctorId: results.doctors[2]?.id || 'default_doctor',
        doctorName: "王医生",
        createdAt: new Date(Date.now() - 259200000),
        status: 'active'
      }
    ]

    for (const prescription of testPrescriptions) {
      const result = await db.collection('prescriptions').add({
        data: prescription
      })
      results.prescriptions.push({
        id: result._id,
        patientName: prescription.patientName,
        doctorName: prescription.doctorName,
        diagnosis: prescription.diagnosis
      })
    }

    return {
      success: true,
      message: '测试数据初始化成功',
      data: results
    }

  } catch (err) {
    console.error('初始化测试数据失败:', err)
    return {
      success: false,
      errMsg: '初始化测试数据失败: ' + err.message
    }
  }
}

function generateBookingNo() {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
  return `BH${timestamp}${random}`
}