const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { shopId, newOwnerId } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  const shopResult = await db.collection('shops').doc(shopId).get()
  if (shopResult.data.ownerId !== openid) {
    return { error: '只有店主才能转让' }
  }

  await db.collection('shops').doc(shopId).update({
    data: { ownerId: newOwnerId }
  })

  await db.collection('members').where({
    shopId,
    userId: openid
  }).update({
    data: { role: 'member' }
  })

  await db.collection('members').where({
    shopId,
    userId: newOwnerId
  }).update({
    data: { role: 'owner' }
  })

  return { success: true }
}
