const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { inviteCode } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  const shopResult = await db.collection('shops').where({ inviteCode }).get()
  if (shopResult.data.length === 0) {
    return { error: '邀请码无效' }
  }

  const shop = shopResult.data[0]

  const memberResult = await db.collection('members').where({
    shopId: shop._id,
    userId: openid
  }).get()

  if (memberResult.data.length > 0) {
    return { error: '你已经是该店铺成员', shopId: shop._id }
  }

  await db.collection('members').add({
    data: {
      shopId: shop._id,
      userId: openid,
      nickName: event.nickName || '成员',
      role: 'member',
      joinTime: db.serverDate()
    }
  })

  return {
    shopId: shop._id,
    shopName: shop.name
  }
}
