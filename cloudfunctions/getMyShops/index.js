const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  const memberResult = await db.collection('members').where({
    userId: openid
  }).get()

  const memberships = memberResult.data
  if (memberships.length === 0) {
    return { shops: [] }
  }

  const shopIds = memberships.map(m => m.shopId)
  const shopResult = await db.collection('shops').where({
    _id: db.command.in(shopIds)
  }).get()

  const shops = []
  for (const shop of shopResult.data) {
    const memberCount = await db.collection('members').where({
      shopId: shop._id
    }).count()

    const membership = memberships.find(m => m.shopId === shop._id)
    shops.push({
      ...shop,
      role: membership.role,
      memberCount: memberCount.total
    })
  }

  return { shops }
}
