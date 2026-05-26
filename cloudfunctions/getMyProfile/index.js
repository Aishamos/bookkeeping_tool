const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  const result = await db.collection('members').where({
    userId: openid
  }).limit(1).get()

  if (result.data.length > 0) {
    const member = result.data[0]
    return {
      nickName: member.nickName || '',
      avatarUrl: member.avatarUrl || '',
      hasProfile: !!(member.nickName && member.avatarUrl)
    }
  }

  return { nickName: '', avatarUrl: '', hasProfile: false }
}
