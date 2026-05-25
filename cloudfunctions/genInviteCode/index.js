const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { shopId } = event

  const shopResult = await db.collection('shops').doc(shopId).get()
  return {
    inviteCode: shopResult.data.inviteCode
  }
}
