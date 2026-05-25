const dateUtil = require('../../utils/date')
const shopUtil = require('../../utils/shop')

Page({
  data: {
    shopId: '',
    todayAmount: '0.00',
    todayCount: 0,
    startDate: '',
    endDate: '',
    tabType: 'daily',
    dailyList: [],
    monthlyList: [],
    todayRecords: []
  },

  onShow() {
    const shopId = shopUtil.getCurrentShopId()
    if (!shopId) {
      wx.cloud.callFunction({ name: 'getMyShops' }).then(res => {
        const shops = res.result.shops || []
        if (shops.length > 0) {
          wx.redirectTo({ url: '/pages/myShops/myShops' })
        } else {
          wx.redirectTo({ url: '/pages/launch/launch' })
        }
      }).catch(() => {
        wx.redirectTo({ url: '/pages/launch/launch' })
      })
      return
    }

    this.setData({
      shopId,
      startDate: dateUtil.getMonthStart(),
      endDate: dateUtil.getToday()
    })
    this.loadSummary()
  },

  onStartDateChange(e) {
    this.setData({ startDate: e.detail.value })
  },

  onEndDateChange(e) {
    this.setData({ endDate: e.detail.value })
  },

  switchTab(e) {
    this.setData({ tabType: e.currentTarget.dataset.type })
  },

  loadSummary() {
    const { shopId, startDate, endDate } = this.data

    wx.cloud.callFunction({
      name: 'getSummary',
      data: { shopId, startDate, endDate }
    }).then(res => {
      const { todayAmount, todayCount, todayRecords, dailyList, monthlyList } = res.result

      this.setData({
        todayAmount: todayAmount.toFixed(2),
        todayCount,
        todayRecords,
        dailyList: dailyList.map(d => ({
          ...d,
          dateFormatted: dateUtil.formatDateWithToday(d.date),
          amountFixed: d.amount.toFixed(2)
        })),
        monthlyList: monthlyList.map(m => ({
          ...m,
          amountFixed: m.amount.toFixed(2)
        }))
      })
    })
  },

  goDetail(e) {
    const date = e.currentTarget.dataset.date
    wx.navigateTo({
      url: `/pages/detail/detail?date=${date}&shopId=${this.data.shopId}`
    })
  }
})
