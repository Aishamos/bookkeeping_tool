const shopUtil = require('../../utils/shop')

Page({
  data: {
    code: ['', '', '', '', '', ''],
    focusIndex: 0,
    nickName: '',
    avatarUrl: ''
  },

  onChooseAvatar(e) {
    this.setData({ avatarUrl: e.detail.avatarUrl })
  },

  onInputNickName(e) {
    this.setData({ nickName: e.detail.value })
  },

  onInput(e) {
    const index = parseInt(e.currentTarget.dataset.index)
    const value = e.detail.value
    const code = [...this.data.code]

    code[index] = value
    this.setData({ code })

    if (value && index < 5) {
      this.setData({ focusIndex: index + 1 })
    }
  },

  joinShop() {
    const inviteCode = this.data.code.join('')
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
