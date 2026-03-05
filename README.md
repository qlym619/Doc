# 医伴医生端小程序

## 项目介绍

这是一个从Yiban小程序中分离出来的医生端小程序，包含医生登录、预约管理、处方管理等功能。

## 项目配置

- **AppID**：wx8fb8cb8211684b51
- **项目名称**：医伴医生端
- **云开发**：使用动态环境配置（wx.cloud.DYNAMIC_CURRENT_ENV）

## 功能模块

- **登录模块**：医生账号登录
- **首页**：显示医生信息和统计数据
- **预约管理**：查看和处理患者预约
- **处方管理**：开具和管理处方
- **设置**：医生个人信息管理

## 技术架构

- **前端**：微信小程序原生开发
- **后端**：微信云开发
- **数据库**：云数据库
- **云函数**：wx-server-sdk ~2.6.3

## 目录结构

```
Doc/
├── cloudfunctions/          # 云函数
│   ├── addPrescription/     # 添加处方
│   ├── createAppointment/   # 创建预约
│   ├── doctorLogin/         # 医生登录
│   ├── getAppointments/     # 获取预约列表
│   ├── getAppointmentDetail/ # 获取预约详情
│   ├── getDoctorStats/      # 获取医生统计数据
│   ├── getPrescriptions/    # 获取处方列表
│   ├── getPrescriptionDetail/ # 获取处方详情
│   ├── initTestData/        # 初始化测试数据
│   └── updateAppointmentStatus/ # 更新预约状态
├── miniprogram/             # 小程序前端
│   ├── pages/               # 页面
│   │   ├── login/           # 登录页面
│   │   ├── homepage/        # 首页
│   │   ├── appointments/    # 预约管理
│   │   │   └── appointmentDetail/ # 预约详情
│   │   ├── prescriptions/   # 处方管理
│   │   │   ├── addPrescription/ # 添加处方
│   │   │   └── prescriptionDetail/ # 处方详情
│   │   └── settings/        # 设置页面
│   ├── components/          # 组件
│   ├── images/              # 图片资源
│   ├── app.js               # 应用入口
│   ├── app.json             # 应用配置
│   ├── app.wxss             # 全局样式
│   └── envList.js           # 环境配置
├── project.config.json      # 项目配置
├── project.private.config.json # 项目私有配置
└── README.md               # 项目说明
```

## 数据库结构

### doctors（医生表）
- name: 医生姓名
- phone: 手机号
- password: 密码
- department: 科室
- title: 职称
- avatarUrl: 头像URL
- createdAt: 创建时间
- updatedAt: 更新时间

### appointments（预约表）
- patientName: 患者姓名
- patientPhone: 患者手机号
- doctorId: 医生ID
- doctorName: 医生姓名
- department: 科室
- subDepartment: 子科室
- appointmentDate: 预约日期
- appointmentTime: 预约时间段
- area: 院区
- status: 状态（pending/confirmed/completed）
- bookingNo: 预约号
- createdAt: 创建时间

### prescriptions（处方表）
- patientName: 患者姓名
- patientPhone: 患者手机号
- patientGender: 患者性别
- patientAge: 患者年龄
- diagnosis: 诊断
- medicines: 药品列表（包含药品名称和用法用量）
- advice: 医嘱
- doctorId: 医生ID
- doctorName: 医生姓名
- createdAt: 创建时间
- status: 状态

## 测试账号

系统提供3个测试医生账号：

| 姓名 | 手机号 | 密码 | 科室 | 职称 |
|------|--------|------|------|------|
| 张医生 | 13800138001 | 123456 | 内科 | 主任医师 |
| 李医生 | 13800138002 | 123456 | 外科 | 副主任医师 |
| 王医生 | 13800138003 | 123456 | 儿科 | 主治医师 |

## 部署说明

### 1. 环境准备
- 下载并安装微信开发者工具
- 登录微信开发者账号
- 确保已开通云开发服务

### 2. 导入项目
1. 打开微信开发者工具
2. 选择「导入项目」
3. 选择项目目录：`d:\Code\Weixin\DOC\Doc`
4. AppID 会自动填充为：wx8fb8cb8211684b51
5. 点击「导入」

### 3. 配置云开发环境
1. 点击左侧菜单栏的「云开发」按钮
2. 如果还没有云开发环境，按照提示创建一个
3. 记录云开发环境ID（如需要）

### 4. 部署云函数
在云函数目录中，按以下顺序部署：

**第一步：部署 initTestData（优先）**
- 右键点击 `cloudfunctions/initTestData` 文件夹
- 选择「上传并部署：云端安装依赖」
- 等待部署完成

**第二步：部署其他云函数**
依次部署以下云函数（右键点击文件夹，选择「上传并部署：云端安装依赖」）：
- doctorLogin
- getAppointments
- getAppointmentDetail
- updateAppointmentStatus
- getDoctorStats
- getPrescriptions
- addPrescription
- getPrescriptionDetail
- createAppointment

### 5. 初始化测试数据
1. 部署完成后，右键点击 `initTestData` 云函数
2. 选择「云端测试」
3. 点击「运行」按钮
4. 确认返回成功消息，测试数据已创建

### 6. 测试运行
1. 点击「编译」按钮
2. 使用测试账号登录（手机号：13800138001，密码：123456）
3. 测试各项功能是否正常

## 功能说明

### 1. 登录
- 输入手机号和密码
- 验证成功后跳转到首页
- 登录信息会保存在本地存储中

### 2. 首页
- 显示医生基本信息
- 显示今日预约数量
- 显示处方总数
- 快速导航到各功能模块

### 3. 预约管理
- 查看预约列表（按状态筛选）
- 查看预约详情
- 确认预约
- 取消预约
- 更新预约状态

### 4. 处方管理
- 查看处方列表
- 开具新处方
- 查看处方详情
- 处方包含患者信息、诊断、药品、医嘱等

### 5. 设置
- 查看个人信息
- 退出登录

## 常见问题

### 云函数调用失败
**问题**：提示 `FunctionName parameter could not be found`
**解决**：
- 确认云函数已部署
- 检查云开发环境是否正常
- 重新部署云函数

### 登录失败
**问题**：提示登录失败或账号不存在
**解决**：
- 确认已运行 initTestData 云函数创建测试数据
- 检查手机号和密码是否正确
- 查看 doctorLogin 云函数日志

### 数据库查询失败
**问题**：提示数据库查询错误
**解决**：
- 确认数据库集合已创建
- 运行 initTestData 云函数创建测试数据
- 检查云函数权限配置

### 云函数部署失败
**问题**：云函数上传失败
**解决**：
- 检查网络连接
- 确保微信开发者工具已登录
- 检查云开发环境是否正常
- 尝试重新部署

## 注意事项

1. 本项目使用微信云开发，需要配置云开发环境
2. 首次使用需要先部署所有云函数
3. 必须先运行 initTestData 云函数创建测试数据
4. 每次修改云函数代码后，需要重新部署
5. 云函数部署可能需要一些时间，请耐心等待
6. 测试账号密码为 123456，生产环境请修改密码

## 开发规范

- 代码风格遵循微信小程序官方规范
- 云函数使用 async/await 处理异步操作
- 错误处理统一使用 try-catch
- 所有云函数都返回统一格式的响应：
  ```javascript
  {
    success: true/false,
    data: {},
    errMsg: ""
  }
  ```

## 更新日志

### v1.0.0
- 初始版本发布
- 实现医生登录功能
- 实现预约管理功能
- 实现处方管理功能
- 实现统计数据展示功能
