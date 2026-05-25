function generateInviteCode() {
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += Math.floor(Math.random() * 10).toString()
  }
  return code
}

function setCurrentShopId(shopId) {
  wx.setStorageSync('currentShopId', shopId)
}

function getCurrentShopId() {
  return wx.getStorageSync('currentShopId') || ''
}

function clearCurrentShopId() {
  wx.removeStorageSync('currentShopId')
}

// 退出/解散后跳转：有其他店铺去选择，没有才去创建/加入
function goAfterLeaveShop() {
  wx.cloud.callFunction({
    name: 'getMyShops'
  }).then(res => {
    const shops = res.result.shops || []
    if (shops.length > 0) {
      clearCurrentShopId()
      wx.redirectTo({ url: '/pages/myShops/myShops' })
    } else {
      clearCurrentShopId()
      wx.redirectTo({ url: '/pages/launch/launch' })
    }
  }).catch(() => {
    clearCurrentShopId()
    wx.redirectTo({ url: '/pages/launch/launch' })
  })
}

module.exports = {
  generateInviteCode,
  setCurrentShopId,
  getCurrentShopId,
  clearCurrentShopId,
  goAfterLeaveShop
}
