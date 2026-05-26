const shopUtil = require('../../utils/shop')

const AVATAR_COLORS = ['#07C160', '#4CAF50', '#FF9800', '#2196F3', '#9C27B0', '#F44336']

Page({
  data: {
    shopId: '',
    shopName: '',
    inviteCode: '',
    inviteCodeFormatted: '',
    members: [],
    currentRole: 'owner',
    myUserId: '',
    loading: true
  },

  onShow() {
    const shopId = shopUtil.getCurrentShopId()
    if (!shopId) {
      wx.redirectTo({ url: '/pages/launch/launch' })
      return
    }
    if (shopId === this.data.shopId && this.data.shopName) {
      return
    }
    this.setData({ shopId, loading: true })
    this.loadShopInfo()
  },

  loadShopInfo() {
    wx.cloud.callFunction({
      name: 'getShopInfo',
      data: { shopId: this.data.shopId }
    }).then(res => {
      const { shop, members, currentRole } = res.result
      const inviteCode = shop.inviteCode

      const myMember = members.find(m => m.role === currentRole)

      this.setData({
        shopName: shop.name,
        inviteCode,
        inviteCodeFormatted: inviteCode.substring(0, 3) + ' ' + inviteCode.substring(3),
        members: members.map((m, i) => ({
          ...m,
          firstChar: m.nickName.charAt(0),
          avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length]
        })),
        currentRole,
        myUserId: myMember ? myMember.userId : '',
        loading: false
      })
    }).catch(() => {
      shopUtil.clearCurrentShopId()
      wx.redirectTo({ url: '/pages/launch/launch' })
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

  goMyShops() {
    wx.navigateTo({ url: '/pages/myShops/myShops' })
  },

  goTransfer(e) {
    const { id, name } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/transferOwner/transferOwner?shopId=${this.data.shopId}&newOwnerId=${id}&newOwnerName=${name}`
    })
  },

  dissolveShop() {
    wx.showModal({
      title: '确认解散',
      content: '解散后店铺所有数据将被删除，无法恢复，确定解散吗？',
      confirmColor: '#ff4d4f',
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '解散中...' })
          wx.cloud.callFunction({
            name: 'dissolveShop',
            data: { shopId: this.data.shopId }
          }).then(res => {
            wx.hideLoading()
            if (res.result.error) {
              wx.showToast({ title: res.result.error, icon: 'none' })
              return
            }
            wx.showToast({ title: '已解散', icon: 'success' })
            setTimeout(() => {
              shopUtil.goAfterLeaveShop()
            }, 1000)
          }).catch(() => {
            wx.hideLoading()
            wx.showToast({ title: '操作失败', icon: 'none' })
          })
        }
      }
    })
  },

  exitShop() {
    wx.showModal({
      title: '确认退出',
      content: '退出后将无法查看该店铺数据，确定退出吗？',
      success: (res) => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'exitShop',
            data: { shopId: this.data.shopId }
          }).then(res => {
            if (res.result.error) {
              wx.showToast({ title: res.result.error, icon: 'none' })
              return
            }
            wx.showToast({ title: '已退出', icon: 'success' })
            setTimeout(() => {
              shopUtil.goAfterLeaveShop()
            }, 1000)
          })
        }
      }
    })
  }
})
