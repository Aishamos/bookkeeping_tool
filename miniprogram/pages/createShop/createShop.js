const shopUtil = require('../../utils/shop')

Page({
  data: {
    shopName: '',
    nickName: '',
    avatarUrl: '',
    created: false,
    inviteCode: '',
    inviteCodeFormatted: '',
    shopId: ''
  },

  onLoad(options) {
    if (options.nickName && options.avatarUrl) {
      this.setData({
        nickName: decodeURIComponent(options.nickName),
        avatarUrl: decodeURIComponent(options.avatarUrl)
      })
    } else {
      wx.cloud.callFunction({ name: 'getMyProfile' }).then(res => {
        if (res.result.nickName) this.setData({ nickName: res.result.nickName })
        if (res.result.avatarUrl) this.setData({ avatarUrl: res.result.avatarUrl })
      })
    }
  },

  onInputName(e) {
    this.setData({ shopName: e.detail.value })
  },

  createShop() {
    if (!this.data.shopName) return

    wx.showLoading({ title: '创建中...' })

    wx.cloud.callFunction({
      name: 'createShop',
      data: {
        name: this.data.shopName,
        nickName: this.data.nickName || '店主',
        avatarUrl: this.data.avatarUrl
      }
    }).then(res => {
      wx.hideLoading()
      const { shopId, inviteCode } = res.result
      this.setData({
        created: true,
        shopId,
        inviteCode,
        inviteCodeFormatted: inviteCode.substring(0, 3) + ' ' + inviteCode.substring(3)
      })
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({ title: '创建失败', icon: 'none' })
      console.error(err)
    })
  },

  copyCode() {
    wx.setClipboardData({
      data: this.data.inviteCode,
      success() {
        wx.showToast({ title: '已复制', icon: 'success' })
      }
    })
  },

  enterShop() {
    shopUtil.setCurrentShopId(this.data.shopId)
    wx.switchTab({ url: '/pages/index/index' })
  }
})
