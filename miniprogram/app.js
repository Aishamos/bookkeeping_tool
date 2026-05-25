App({
  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      return
    }
    wx.cloud.init({
      env: 'cloud1-d2g6a7ne2b7c7978c',
      traceUser: true
    })
  },
  globalData: {
    currentShopId: '',
    userInfo: null
  }
})
