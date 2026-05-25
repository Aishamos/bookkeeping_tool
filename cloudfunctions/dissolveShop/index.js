const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { shopId } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  // 验证是否是店主
  const memberResult = await db.collection('members').where({
    shopId,
    userId: openid
  }).get()

  if (memberResult.data.length === 0 || memberResult.data[0].role !== 'owner') {
    return { error: '只有店主才能解散店铺' }
  }

  // 验证是否只有自己一个人
  const allMembers = await db.collection('members').where({ shopId }).count()
  if (allMembers.total > 1) {
    return { error: '店铺还有其他成员，无法解散' }
  }

  // 删除店铺相关的所有数据
  await db.collection('members').where({ shopId }).remove()
  await db.collection('sales').where({ shopId }).remove()
  await db.collection('shops').doc(shopId).remove()

  return { success: true }
}
