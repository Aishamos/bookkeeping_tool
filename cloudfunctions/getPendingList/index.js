const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { shopId } = event

  const shopCheck = await db.collection('shops').doc(shopId).get().catch(() => null)
  if (!shopCheck) {
    return { error: '店铺不存在' }
  }

  const result = await db.collection('sales').where({
    shopId,
    status: 'pending'
  }).orderBy('createTime', 'asc').limit(100).get()

  let totalAmount = 0
  result.data.forEach(sale => {
    totalAmount += sale.amount
  })

  return {
    list: result.data,
    totalAmount: Math.round(totalAmount * 100) / 100,
    count: result.data.length
  }
}
