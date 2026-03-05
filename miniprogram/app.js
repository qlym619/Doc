// app.js
const isDev = true;
const logger = {
  log: function(...args) {
    if (isDev) {
      console.log(...args);
    }
  },
  error: function(...args) {
    if (isDev) {
      console.error(...args);
    }
  }
};

App({
  onLaunch: function () {
    this.globalData = {
      env: wx.cloud.DYNAMIC_CURRENT_ENV,
      doctorInfo: null
    };
    if (!wx.cloud) {
      logger.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        env: this.globalData.env,
        traceUser: true,
      });
    }
  }
});
