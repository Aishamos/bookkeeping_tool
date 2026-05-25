Page({
  data: {
    date: '',
    shopId: '',
    totalAmount: '0.00',
    count: 0,
    list: []
  },

  onLoad(options) {
    const { date, shopId } = options
    this.setData({ date, shopId })
    this.loadDetail(date, shopId)
  },

  loadDetail(date, shopId) {
    wx.cloud.callFunction({
      name: 'getSummary',
      data: {
        shopId,
        startDate: date,
        endDate: date
      }
    }).then(res => {
      const { todayRecords, todayAmount, todayCount } = res.result
      this.setData({
        list: todayRecords,
        totalAmount: todayAmount.toFixed(2),
        count: todayCount
      })
    })
  }
})
