const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { shopId, amount, note } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  const memberResult = await db.collection('members').where({
    shopId,
    userId: openid
  }).get()

  if (memberResult.data.length === 0) {
    return { error: '你不是该店铺成员' }
  }

  const now = new Date()
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const time = `${date} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  const result = await db.collection('sales').add({
    data: {
      shopId,
      amount: parseFloat(amount),
      date,
      time,
      createTime: db.serverDate(),
      status: 'pending'
    }
  })

  return { saleId: result._id }
}
