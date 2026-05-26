const shopUtil = require('../../utils/shop')

Page({
  data: {
    needProfile: true,
    profileReady: false,
    nickName: '',
    avatarUrl: ''
  },

  onLoad() {
    const shopId = shopUtil.getCurrentShopId()
    if (shopId) {
      wx.switchTab({ url: '/pages/index/index' })
      return
    }
    this.checkProfile()
  },

  checkProfile() {
    wx.cloud.callFunction({
      name: 'getMyProfile'
    }).then(res => {
      const { hasProfile, nickName, avatarUrl } = res.result
      if (hasProfile) {
        this.setData({
          needProfile: false,
          profileReady: true,
          nickName,
          avatarUrl
        })
      } else {
        this.setData({ needProfile: true, profileReady: false })
      }
    }).catch(() => {
      this.setData({ needProfile: true, profileReady: false })
    })
  },

  onChooseAvatar(e) {
    const avatarUrl = e.detail.avatarUrl
    this.setData({
      avatarUrl,
      profileReady: !!(avatarUrl && this.data.nickName)
    })
  },

  onInputNickName(e) {
    const nickName = e.detail.value
    this.setData({
      nickName,
      profileReady: !!(nickName && this.data.avatarUrl)
    })
  },

  goCreate() {
    const { nickName, avatarUrl } = this.data
    wx.navigateTo({
      url: `/pages/createShop/createShop?nickName=${encodeURIComponent(nickName)}&avatarUrl=${encodeURIComponent(avatarUrl)}`
    })
  },

  goJoin() {
    const { nickName, avatarUrl } = this.data
    wx.navigateTo({
      url: `/pages/joinShop/joinShop?nickName=${encodeURIComponent(nickName)}&avatarUrl=${encodeURIComponent(avatarUrl)}`
    })
  }
})
