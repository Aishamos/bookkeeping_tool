const shopUtil = require('../../utils/shop')

Page({
  data: {
    code: ['', '', '', '', '', ''],
    focusIndex: 0,
    inputValue: '',
    inputFocus: true,
    nickName: '',
    avatarUrl: ''
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

  focusInput() {
    this.setData({ inputFocus: true })
  },

  onInput(e) {
    const value = e.detail.value.replace(/[^0-9]/g, '').slice(0, 6)
    const code = ['', '', '', '', '', '']
    for (let i = 0; i < value.length; i++) {
      code[i] = value[i]
    }
    this.setData({
      code,
      inputValue: value,
      focusIndex: value.length
    })
  },

  joinShop() {
    const inviteCode = this.data.inputValue
    if (inviteCode.length < 6) return

    wx.showLoading({ title: '加入中...' })

    wx.cloud.callFunction({
      name: 'joinShop',
      data: {
        inviteCode,
        nickName: this.data.nickName || '成员',
        avatarUrl: this.data.avatarUrl
      }
    }).then(res => {
      wx.hideLoading()
      if (res.result.error) {
        wx.showToast({ title: res.result.error, icon: 'none' })
        return
      }

      const { shopId } = res.result
      shopUtil.setCurrentShopId(shopId)
      wx.showToast({ title: '加入成功', icon: 'success' })
      setTimeout(() => {
        wx.switchTab({ url: '/pages/index/index' })
      }, 1000)
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({ title: '加入失败', icon: 'none' })
      console.error(err)
    })
  }
})
