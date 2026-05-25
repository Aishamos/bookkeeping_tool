const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { shopId, startDate, endDate, type } = event

  const result = await db.collection('sales').where({
    shopId,
    status: 'collected',
    date: _.gte(startDate).and(_.lte(endDate))
  }).orderBy('date', 'desc').orderBy('createTime', 'desc').limit(1000).get()

  const list = result.data

  const dailyMap = {}
  list.forEach(sale => {
    if (!dailyMap[sale.date]) {
      dailyMap[sale.date] = { date: sale.date, amount: 0, count: 0 }
    }
    dailyMap[sale.date].amount += sale.amount
    dailyMap[sale.date].count += 1
  })

  const dailyList = Object.values(dailyMap).sort((a, b) => b.date.localeCompare(a.date))

  const monthlyMap = {}
  list.forEach(sale => {
    const month = sale.date.substring(0, 7)
    if (!monthlyMap[month]) {
      monthlyMap[month] = { month, amount: 0, count: 0 }
    }
    monthlyMap[month].amount += sale.amount
    monthlyMap[month].count += 1
  })

  const monthlyList = Object.values(monthlyMap).sort((a, b) => b.month.localeCompare(a.month))

  const now = new Date()
  const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const todayRecords = list.filter(s => s.date === today)
  let todayAmount = 0
  todayRecords.forEach(s => { todayAmount += s.amount })

  return {
    todayAmount: Math.round(todayAmount * 100) / 100,
    todayCount: todayRecords.length,
    todayRecords,
    dailyList,
    monthlyList,
    totalAmount: Math.round(list.reduce((sum, s) => sum + s.amount, 0) * 100) / 100,
    totalCount: list.length
  }
}
