const dateUtil = require('../../utils/date')
const shopUtil = require('../../utils/shop')

Page({
  data: {
    shopId: '',
    today: '',
    totalAmount: '0.00',
    count: 0,
    amount: '',
    list: [],
    startX: 0
  },

  onShow() {
    const shopId = shopUtil.getCurrentShopId()
    if (!shopId) {
      // 没有当前店铺，检查是否有其他店铺
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
      today: dateUtil.getToday()
    })
    this.loadPendingList()
  },

  loadPendingList() {
    wx.cloud.callFunction({
      name: 'getPendingList',
      data: { shopId: this.data.shopId }
    }).then(res => {
      const { list, totalAmount, count } = res.result
      this.setData({
        list: list.map(item => ({ ...item, slideRight: 0 })),
        totalAmount: totalAmount.toFixed(2),
        count
      })
    })
  },

  onInputAmount(e) {
    this.setData({ amount: e.detail.value })
  },

  addSale() {
    const { amount, shopId } = this.data
    if (!amount || parseFloat(amount) <= 0) {
      wx.showToast({ title: '请输入金额', icon: 'none' })
      return
    }

    wx.showLoading({ title: '记录中...' })

    const now = new Date()
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
    const time = `${date} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

    wx.cloud.callFunction({
      name: 'addSale',
      data: {
        shopId,
        amount: parseFloat(amount),
        date,
        time
      }
    }).then(res => {
      wx.hideLoading()
      if (res.result.error) {
        wx.showToast({ title: res.result.error, icon: 'none' })
        return
      }
      this.setData({ amount: '' })
      wx.showToast({ title: '已记录', icon: 'success' })
      this.loadPendingList()
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({ title: '记录失败', icon: 'none' })
      console.error(err)
    })
  },

  onTouchStart(e) {
    this.setData({ startX: e.touches[0].clientX })
  },

  onTouchMove(e) {
    const startX = this.data.startX
    const moveX = e.touches[0].clientX
    const diff = startX - moveX
    const index = e.currentTarget.dataset.index
    const list = [...this.data.list]
    const item = list[index]
    let newRight = item.slideRight

    if (item.slideRight === 160) {
      newRight = Math.min(160, Math.max(0, 160 + diff * 2))
    } else {
      newRight = Math.min(160, Math.max(0, diff * 2))
    }

    list[index].slideRight = newRight
    this.setData({ list })
  },

  onTouchEnd(e) {
    const index = e.currentTarget.dataset.index
    const list = [...this.data.list]
    const item = list[index]

    if (item.slideRight > 100) {
      item.slideRight = 160
    } else {
      item.slideRight = 0
    }
    this.setData({ list })
  },

  markCollected(e) {
    const saleId = e.currentTarget.dataset.id

    wx.showLoading({ title: '处理中...' })

    wx.cloud.callFunction({
      name: 'markCollected',
      data: { saleId }
    }).then(res => {
      wx.hideLoading()
      if (res.result.error) {
        wx.showToast({ title: res.result.error, icon: 'none' })
        return
      }
      wx.showToast({ title: '已收款', icon: 'success' })
      this.loadPendingList()
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({ title: '操作失败', icon: 'none' })
      console.error(err)
    })
  }
})
