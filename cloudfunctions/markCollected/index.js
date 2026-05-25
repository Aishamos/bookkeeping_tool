const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { saleId } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  const saleResult = await db.collection('sales').doc(saleId).get()
  const sale = saleResult.data

  const memberResult = await db.collection('members').where({
    shopId: sale.shopId,
    userId: openid
  }).get()

  if (memberResult.data.length === 0) {
    return { error: '你不是该店铺成员' }
  }

  await db.collection('sales').doc(saleId).update({
    data: {
      status: 'collected',
      collectedTime: db.serverDate()
    }
  })

  return { success: true }
}
