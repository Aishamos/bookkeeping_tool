const AVATAR_COLORS = ['#4CAF50', '#FF9800', '#2196F3', '#9C27B0', '#F44336']

Page({
  data: {
    shopId: '',
    members: [],
    selectedId: '',
    selectedName: ''
  },

  onLoad(options) {
    const { shopId } = options
    this.setData({ shopId })
    this.loadMembers()
  },

  loadMembers() {
    wx.cloud.callFunction({
      name: 'getShopInfo',
      data: { shopId: this.data.shopId }
    }).then(res => {
      const members = res.result.members
        .filter(m => m.role !== 'owner')
        .map((m, i) => ({
          ...m,
          firstChar: m.nickName.charAt(0),
          avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length]
        }))
      this.setData({ members })
    })
  },

  selectMember(e) {
    const id = e.currentTarget.dataset.id
    const member = this.data.members.find(m => m.userId === id)
    this.setData({
      selectedId: id,
      selectedName: member ? member.nickName : ''
    })
  },

  confirmTransfer() {
    const { selectedId, selectedName, shopId } = this.data
    if (!selectedId) return

    wx.showModal({
      title: '确认转让',
      content: `确定将店主转让给${selectedName}吗？转让后你将变为普通成员，无法撤销。`,
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '转让中...' })

          wx.cloud.callFunction({
            name: 'transferOwner',
            data: {
              shopId,
              newOwnerId: selectedId
            }
          }).then(res => {
            wx.hideLoading()
            if (res.result.error) {
              wx.showToast({ title: res.result.error, icon: 'none' })
              return
            }
            wx.showToast({ title: '转让成功', icon: 'success' })
            setTimeout(() => {
              wx.navigateBack()
            }, 1000)
          }).catch(err => {
            wx.hideLoading()
            wx.showToast({ title: '转让失败', icon: 'none' })
            console.error(err)
          })
        }
      }
    })
  }
})