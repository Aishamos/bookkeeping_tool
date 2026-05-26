const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { shopId } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  const [shopResult, membersResult] = await Promise.all([
    db.collection('shops').doc(shopId).get(),
    db.collection('members').where({ shopId }).orderBy('joinTime', 'asc').get()
  ])
  const shop = shopResult.data

  const currentMember = membersResult.data.find(m => m.userId === openid)
  if (!currentMember) {
    return { error: '你不是该店铺成员' }
  }

  return {
    shop,
    members: membersResult.data,
    currentRole: currentMember.role
  }
}
