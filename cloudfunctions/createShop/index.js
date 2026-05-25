const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { name } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  let inviteCode = ''
  for (let i = 0; i < 6; i++) {
    inviteCode += Math.floor(Math.random() * 10).toString()
  }

  const existing = await db.collection('shops').where({ inviteCode }).get()
  if (existing.data.length > 0) {
    inviteCode = ''
    for (let i = 0; i < 6; i++) {
      inviteCode += Math.floor(Math.random() * 10).toString()
    }
  }

  const shopResult = await db.collection('shops').add({
    data: {
      name,
      inviteCode,
      ownerId: openid,
      createTime: db.serverDate()
    }
  })

  const shopId = shopResult._id

  await db.collection('members').add({
    data: {
      shopId,
      userId: openid,
      nickName: event.nickName || '店主',
      role: 'owner',
      joinTime: db.serverDate()
    }
  })

  return {
    shopId,
    inviteCode
  }
}
