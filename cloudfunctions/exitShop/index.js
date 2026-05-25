const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { shopId } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  const shopResult = await db.collection('shops').doc(shopId).get()
  if (shopResult.data.ownerId === openid) {
    return { error: '店主不能退出，请先转让店主' }
  }

  await db.collection('members').where({
    shopId,
    userId: openid
  }).remove()

  return { success: true }
}
