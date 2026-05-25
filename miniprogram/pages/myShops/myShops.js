const shopUtil = require('../../utils/shop')

const SHOP_COLORS = ['#07C160', '#4CAF50', '#FF9800', '#2196F3', '#9C27B0']

Page({
  data: {
    shops: [],
    currentShopId: ''
  },

  onShow() {
    this.setData({ currentShopId: shopUtil.getCurrentShopId() })
    this.loadMyShops()
  },

  loadMyShops() {
    wx.showLoading({ title: '加载中...' })

    wx.cloud.callFunction({
      name: 'getMyShops'
    }).then(res => {
      wx.hideLoading()
      const shops = res.result.shops.map((s, i) => ({
        ...s,
        iconColor: SHOP_COLORS[i % SHOP_COLORS.length]
      }))
      this.setData({ shops })
    }).catch(err => {
      wx.hideLoading()
      console.error(err)
    })
  },

  switchShop(e) {
    const shopId = e.currentTarget.dataset.id
    if (shopId === this.data.currentShopId) return

    shopUtil.setCurrentShopId(shopId)
    this.setData({ currentShopId: shopId })
    wx.showToast({ title: '已切换', icon: 'success' })
    setTimeout(() => {
      wx.switchTab({ url: '/pages/index/index' })
    }, 500)
  },

  goCreate() {
    wx.navigateTo({ url: '/pages/createShop/createShop' })
  },

  goJoin() {
    wx.navigateTo({ url: '/pages/joinShop/joinShop' })
  }
})