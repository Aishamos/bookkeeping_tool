const shopUtil = require('../../utils/shop')

Page({
  onLoad() {
    const shopId = shopUtil.getCurrentShopId()
    if (shopId) {
      wx.switchTab({ url: '/pages/index/index' })
    }
  },

  goCreate() {
    wx.navigateTo({ url: '/pages/createShop/createShop' })
  },

  goJoin() {
    wx.navigateTo({ url: '/pages/joinShop/joinShop' })
  }
})
