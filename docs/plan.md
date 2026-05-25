# 卖鱼记账小程序实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个微信小程序，支持多店铺卖鱼记账、收款管理和成员协作

**Architecture:** 原生微信小程序 + 微信云开发。前端使用 WXML/WXSS/JS，后端使用云函数处理业务逻辑，云数据库存储 shops/members/sales 三个集合的数据。

**Tech Stack:** 微信小程序原生框架、微信云开发（云函数 + 云数据库）、JavaScript

---

## 文件结构

```
sum/
├── miniprogram/
│   ├── pages/
│   │   ├── launch/           # 启动页
│   │   │   ├── launch.wxml
│   │   │   ├── launch.wxss
│   │   │   ├── launch.js
│   │   │   └── launch.json
│   │   ├── createShop/       # 创建店铺页
│   │   │   ├── createShop.wxml
│   │   │   ├── createShop.wxss
│   │   │   ├── createShop.js
│   │   │   └── createShop.json
│   │   ├── joinShop/         # 加入店铺页
│   │   │   ├── joinShop.wxml
│   │   │   ├── joinShop.wxss
│   │   │   ├── joinShop.js
│   │   │   └── joinShop.json
│   │   ├── index/            # 首页（待收款）
│   │   │   ├── index.wxml
│   │   │   ├── index.wxss
│   │   │   ├── index.js
│   │   │   └── index.json
│   │   ├── summary/          # 汇总页
│   │   │   ├── summary.wxml
│   │   │   ├── summary.wxss
│   │   │   ├── summary.js
│   │   │   └── summary.json
│   │   ├── detail/           # 记录详情页
│   │   │   ├── detail.wxml
│   │   │   ├── detail.wxss
│   │   │   ├── detail.js
│   │   │   └── detail.json
│   │   ├── shopSettings/     # 店铺设置页
│   │   │   ├── shopSettings.wxml
│   │   │   ├── shopSettings.wxss
│   │   │   ├── shopSettings.js
│   │   │   └── shopSettings.json
│   │   ├── myShops/          # 我的店铺页
│   │   │   ├── myShops.wxml
│   │   │   ├── myShops.wxss
│   │   │   ├── myShops.js
│   │   │   └── myShops.json
│   │   └── transferOwner/    # 转让店主页
│   │       ├── transferOwner.wxml
│   │       ├── transferOwner.wxss
│   │       ├── transferOwner.js
│   │       └── transferOwner.json
│   ├── utils/
│   │   ├── date.js           # 日期格式化工具
│   │   └── shop.js           # 店铺相关工具函数
│   ├── app.js
│   ├── app.json
│   └── app.wxss
├── cloudfunctions/
│   ├── createShop/
│   │   ├── index.js
│   │   └── package.json
│   ├── joinShop/
│   │   ├── index.js
│   │   └── package.json
│   ├── addSale/
│   │   ├── index.js
│   │   └── package.json
│   ├── markCollected/
│   │   ├── index.js
│   │   └── package.json
│   ├── getPendingList/
│   │   ├── index.js
│   │   └── package.json
│   ├── getSummary/
│   │   ├── index.js
│   │   └── package.json
│   ├── getShopInfo/
│   │   ├── index.js
│   │   └── package.json
│   ├── getMyShops/
│   │   ├── index.js
│   │   └── package.json
│   ├── transferOwner/
│   │   ├── index.js
│   │   └── package.json
│   ├── exitShop/
│   │   ├── index.js
│   │   └── package.json
│   └── genInviteCode/
│       ├── index.js
│       └── package.json
└── project.config.json
```

---

## Task 1: 项目初始化

**Files:**
- Create: `project.config.json`
- Create: `miniprogram/app.js`
- Create: `miniprogram/app.json`
- Create: `miniprogram/app.wxss`
- Create: `miniprogram/utils/date.js`
- Create: `miniprogram/utils/shop.js`

- [ ] **Step 1: 创建项目配置文件**

```json
// project.config.json
{
  "miniprogramRoot": "miniprogram/",
  "cloudfunctionRoot": "cloudfunctions/",
  "setting": {
    "urlCheck": true,
    "es6": true,
    "enhance": true,
    "postcss": true,
    "preloadBackgroundData": false,
    "minified": true,
    "newFeature": true,
    "autoAudits": false,
    "coverView": true
  },
  "appid": "你的小程序appid",
  "projectname": "fish-sales-tracker",
  "compileType": "miniprogram",
  "condition": {}
}
```

- [ ] **Step 2: 创建 app.js**

```javascript
// miniprogram/app.js
App({
  onLaunch() {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
      return
    }
    wx.cloud.init({
      traceUser: true
    })
  },
  globalData: {
    currentShopId: '',
    userInfo: null
  }
})
```

- [ ] **Step 3: 创建 app.json**

```json
// miniprogram/app.json
{
  "pages": [
    "pages/launch/launch",
    "pages/createShop/createShop",
    "pages/joinShop/joinShop",
    "pages/index/index",
    "pages/summary/summary",
    "pages/detail/detail",
    "pages/shopSettings/shopSettings",
    "pages/myShops/myShops",
    "pages/transferOwner/transferOwner"
  ],
  "window": {
    "backgroundTextStyle": "light",
    "navigationBarBackgroundColor": "#07C160",
    "navigationBarTitleText": "卖鱼记账",
    "navigationBarTextStyle": "white",
    "backgroundColor": "#f5f5f5"
  },
  "tabBar": {
    "color": "#999999",
    "selectedColor": "#07C160",
    "backgroundColor": "#ffffff",
    "borderStyle": "black",
    "list": [
      {
        "pagePath": "pages/index/index",
        "text": "记账",
        "iconPath": "images/tab-record.png",
        "selectedIconPath": "images/tab-record-active.png"
      },
      {
        "pagePath": "pages/summary/summary",
        "text": "汇总",
        "iconPath": "images/tab-summary.png",
        "selectedIconPath": "images/tab-summary-active.png"
      },
      {
        "pagePath": "pages/shopSettings/shopSettings",
        "text": "设置",
        "iconPath": "images/tab-settings.png",
        "selectedIconPath": "images/tab-settings-active.png"
      }
    ]
  },
  "sitemapLocation": "sitemap.json",
  "style": "v2"
}
```

- [ ] **Step 4: 创建 app.wxss 全局样式**

```css
/* miniprogram/app.wxss */
page {
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, 'PingFang SC', sans-serif;
  font-size: 14px;
  color: #333;
}

.container {
  padding: 0 12px;
}

.btn-primary {
  width: 100%;
  background: #07C160;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  font-weight: bold;
}

.btn-primary::after {
  border: none;
}

.card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 10px;
}
```

- [ ] **Step 5: 创建日期工具函数**

```javascript
// miniprogram/utils/date.js

// 获取当前日期字符串 YYYY-MM-DD
function getToday() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

// 获取当前时间字符串 HH:mm
function getCurrentTime() {
  const now = new Date()
  const h = String(now.getHours()).padStart(2, '0')
  const m = String(now.getMinutes()).padStart(2, '0')
  return `${h}:${m}`
}

// 格式化日期为 MM月DD日
function formatDate(dateStr) {
  const parts = dateStr.split('-')
  return `${parseInt(parts[1])}月${parseInt(parts[2])}日`
}

// 格式化日期为 MM月DD日（今天）
function formatDateWithToday(dateStr) {
  const today = getToday()
  if (dateStr === today) {
    return `${formatDate(dateStr)}（今天）`
  }
  return formatDate(dateStr)
}

// 获取本月第一天
function getMonthStart() {
  const now = new Date()
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  return `${y}-${m}-01`
}

module.exports = {
  getToday,
  getCurrentTime,
  formatDate,
  formatDateWithToday,
  getMonthStart
}
```

- [ ] **Step 6: 创建店铺工具函数**

```javascript
// miniprogram/utils/shop.js

// 生成6位随机邀请码
function generateInviteCode() {
  let code = ''
  for (let i = 0; i < 6; i++) {
    code += Math.floor(Math.random() * 10).toString()
  }
  return code
}

// 保存当前店铺ID到本地缓存
function setCurrentShopId(shopId) {
  wx.setStorageSync('currentShopId', shopId)
}

// 获取当前店铺ID
function getCurrentShopId() {
  return wx.getStorageSync('currentShopId') || ''
}

// 清除当前店铺ID
function clearCurrentShopId() {
  wx.removeStorageSync('currentShopId')
}

module.exports = {
  generateInviteCode,
  setCurrentShopId,
  getCurrentShopId,
  clearCurrentShopId
}
```

- [ ] **Step 7: 初始化 git 并提交**

```bash
cd D:/ccProject/sum
git init
git add .
git commit -m "feat: 初始化项目结构和工具函数"
```

---

## Task 2: 云函数 - 店铺管理

**Files:**
- Create: `cloudfunctions/createShop/index.js`
- Create: `cloudfunctions/createShop/package.json`
- Create: `cloudfunctions/joinShop/index.js`
- Create: `cloudfunctions/joinShop/package.json`
- Create: `cloudfunctions/getMyShops/index.js`
- Create: `cloudfunctions/getMyShops/package.json`
- Create: `cloudfunctions/getShopInfo/index.js`
- Create: `cloudfunctions/getShopInfo/package.json`
- Create: `cloudfunctions/genInviteCode/index.js`
- Create: `cloudfunctions/genInviteCode/package.json`

- [ ] **Step 1: 创建 createShop 云函数**

```javascript
// cloudfunctions/createShop/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { name } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  // 生成6位邀请码
  let inviteCode = ''
  for (let i = 0; i < 6; i++) {
    inviteCode += Math.floor(Math.random() * 10).toString()
  }

  // 检查邀请码是否重复
  const existing = await db.collection('shops').where({ inviteCode }).get()
  if (existing.data.length > 0) {
    // 重新生成
    inviteCode = ''
    for (let i = 0; i < 6; i++) {
      inviteCode += Math.floor(Math.random() * 10).toString()
    }
  }

  // 创建店铺
  const shopResult = await db.collection('shops').add({
    data: {
      name,
      inviteCode,
      ownerId: openid,
      createTime: db.serverDate()
    }
  })

  const shopId = shopResult._id

  // 把创建者加为店主
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
```

```json
// cloudfunctions/createShop/package.json
{
  "name": "createShop",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "wx-server-sdk": "~2.6.3"
  }
}
```

- [ ] **Step 2: 创建 joinShop 云函数**

```javascript
// cloudfunctions/joinShop/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { inviteCode } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  // 查找店铺
  const shopResult = await db.collection('shops').where({ inviteCode }).get()
  if (shopResult.data.length === 0) {
    return { error: '邀请码无效' }
  }

  const shop = shopResult.data[0]

  // 检查是否已经是成员
  const memberResult = await db.collection('members').where({
    shopId: shop._id,
    userId: openid
  }).get()

  if (memberResult.data.length > 0) {
    return { error: '你已经是该店铺成员', shopId: shop._id }
  }

  // 添加为成员
  await db.collection('members').add({
    data: {
      shopId: shop._id,
      userId: openid,
      nickName: event.nickName || '成员',
      role: 'member',
      joinTime: db.serverDate()
    }
  })

  return {
    shopId: shop._id,
    shopName: shop.name
  }
}
```

```json
// cloudfunctions/joinShop/package.json
{
  "name": "joinShop",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "wx-server-sdk": "~2.6.3"
  }
}
```

- [ ] **Step 3: 创建 getMyShops 云函数**

```javascript
// cloudfunctions/getMyShops/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  // 获取用户加入的所有成员记录
  const memberResult = await db.collection('members').where({
    userId: openid
  }).get()

  const memberships = memberResult.data
  if (memberships.length === 0) {
    return { shops: [] }
  }

  // 获取所有店铺信息
  const shopIds = memberships.map(m => m.shopId)
  const shopResult = await db.collection('shops').where({
    _id: db.command.in(shopIds)
  }).get()

  // 获取每个店铺的成员数
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
```

```json
// cloudfunctions/getMyShops/package.json
{
  "name": "getMyShops",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "wx-server-sdk": "~2.6.3"
  }
}
```

- [ ] **Step 4: 创建 getShopInfo 云函数**

```javascript
// cloudfunctions/getShopInfo/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { shopId } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  // 获取店铺信息
  const shopResult = await db.collection('shops').doc(shopId).get()
  const shop = shopResult.data

  // 获取成员列表
  const membersResult = await db.collection('members').where({
    shopId
  }).orderBy('joinTime', 'asc').get()

  // 检查当前用户角色
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
```

```json
// cloudfunctions/getShopInfo/package.json
{
  "name": "getShopInfo",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "wx-server-sdk": "~2.6.3"
  }
}
```

- [ ] **Step 5: 创建 genInviteCode 云函数**

```javascript
// cloudfunctions/genInviteCode/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { shopId } = event

  // 获取店铺当前邀请码
  const shopResult = await db.collection('shops').doc(shopId).get()
  return {
    inviteCode: shopResult.data.inviteCode
  }
}
```

```json
// cloudfunctions/genInviteCode/package.json
{
  "name": "genInviteCode",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "wx-server-sdk": "~2.6.3"
  }
}
```

- [ ] **Step 6: 安装云函数依赖并提交**

```bash
cd D:/ccProject/sum
# 每个云函数目录都需要安装依赖
cd cloudfunctions/createShop && npm install && cd ../..
cd cloudfunctions/joinShop && npm install && cd ../..
cd cloudfunctions/getMyShops && npm install && cd ../..
cd cloudfunctions/getShopInfo && npm install && cd ../..
cd cloudfunctions/genInviteCode && npm install && cd ../..
git add .
git commit -m "feat: 添加店铺管理相关云函数"
```

---

## Task 3: 云函数 - 销售记录管理

**Files:**
- Create: `cloudfunctions/addSale/index.js`
- Create: `cloudfunctions/addSale/package.json`
- Create: `cloudfunctions/markCollected/index.js`
- Create: `cloudfunctions/markCollected/package.json`
- Create: `cloudfunctions/getPendingList/index.js`
- Create: `cloudfunctions/getPendingList/package.json`
- Create: `cloudfunctions/getSummary/index.js`
- Create: `cloudfunctions/getSummary/package.json`

- [ ] **Step 1: 创建 addSale 云函数**

```javascript
// cloudfunctions/addSale/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { shopId, amount, note } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  // 验证是否是店铺成员
  const memberResult = await db.collection('members').where({
    shopId,
    userId: openid
  }).get()

  if (memberResult.data.length === 0) {
    return { error: '你不是该店铺成员' }
  }

  // 获取当前日期和时间
  const now = new Date()
  const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`

  // 添加记录
  const result = await db.collection('sales').add({
    data: {
      shopId,
      amount: parseFloat(amount),
      note: note || '',
      date,
      time,
      createTime: db.serverDate(),
      status: 'pending'
    }
  })

  return { saleId: result._id }
}
```

```json
// cloudfunctions/addSale/package.json
{
  "name": "addSale",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "wx-server-sdk": "~2.6.3"
  }
}
```

- [ ] **Step 2: 创建 markCollected 云函数**

```javascript
// cloudfunctions/markCollected/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { saleId } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  // 获取记录
  const saleResult = await db.collection('sales').doc(saleId).get()
  const sale = saleResult.data

  // 验证是否是店铺成员
  const memberResult = await db.collection('members').where({
    shopId: sale.shopId,
    userId: openid
  }).get()

  if (memberResult.data.length === 0) {
    return { error: '你不是该店铺成员' }
  }

  // 更新状态为已收
  await db.collection('sales').doc(saleId).update({
    data: {
      status: 'collected',
      collectedTime: db.serverDate()
    }
  })

  return { success: true }
}
```

```json
// cloudfunctions/markCollected/package.json
{
  "name": "markCollected",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "wx-server-sdk": "~2.6.3"
  }
}
```

- [ ] **Step 3: 创建 getPendingList 云函数**

```javascript
// cloudfunctions/getPendingList/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { shopId } = event

  // 获取所有未收记录
  const result = await db.collection('sales').where({
    shopId,
    status: 'pending'
  }).orderBy('createTime', 'desc').limit(100).get()

  // 计算待收总额
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
```

```json
// cloudfunctions/getPendingList/package.json
{
  "name": "getPendingList",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "wx-server-sdk": "~2.6.3"
  }
}
```

- [ ] **Step 4: 创建 getSummary 云函数**

```javascript
// cloudfunctions/getSummary/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()
const _ = db.command

exports.main = async (event, context) => {
  const { shopId, startDate, endDate, type } = event

  // 获取指定日期范围内的已收记录
  const result = await db.collection('sales').where({
    shopId,
    status: 'collected',
    date: _.gte(startDate).and(_.lte(endDate))
  }).orderBy('date', 'desc').orderBy('createTime', 'desc').limit(1000).get()

  const list = result.data

  // 按日汇总
  const dailyMap = {}
  list.forEach(sale => {
    if (!dailyMap[sale.date]) {
      dailyMap[sale.date] = { date: sale.date, amount: 0, count: 0 }
    }
    dailyMap[sale.date].amount += sale.amount
    dailyMap[sale.date].count += 1
  })

  const dailyList = Object.values(dailyMap).sort((a, b) => b.date.localeCompare(a.date))

  // 按月汇总
  const monthlyMap = {}
  list.forEach(sale => {
    const month = sale.date.substring(0, 7) // YYYY-MM
    if (!monthlyMap[month]) {
      monthlyMap[month] = { month, amount: 0, count: 0 }
    }
    monthlyMap[month].amount += sale.amount
    monthlyMap[month].count += 1
  })

  const monthlyList = Object.values(monthlyMap).sort((a, b) => b.month.localeCompare(a.month))

  // 今日汇总
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
```

```json
// cloudfunctions/getSummary/package.json
{
  "name": "getSummary",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "wx-server-sdk": "~2.6.3"
  }
}
```

- [ ] **Step 5: 安装依赖并提交**

```bash
cd D:/ccProject/sum
cd cloudfunctions/addSale && npm install && cd ../..
cd cloudfunctions/markCollected && npm install && cd ../..
cd cloudfunctions/getPendingList && npm install && cd ../..
cd cloudfunctions/getSummary && npm install && cd ../..
git add .
git commit -m "feat: 添加销售记录管理云函数"
```

---

## Task 4: 云函数 - 店铺管理操作

**Files:**
- Create: `cloudfunctions/transferOwner/index.js`
- Create: `cloudfunctions/transferOwner/package.json`
- Create: `cloudfunctions/exitShop/index.js`
- Create: `cloudfunctions/exitShop/package.json`

- [ ] **Step 1: 创建 transferOwner 云函数**

```javascript
// cloudfunctions/transferOwner/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { shopId, newOwnerId } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  // 验证当前用户是店主
  const shopResult = await db.collection('shops').doc(shopId).get()
  if (shopResult.data.ownerId !== openid) {
    return { error: '只有店主才能转让' }
  }

  // 更新店铺所有者
  await db.collection('shops').doc(shopId).update({
    data: { ownerId: newOwnerId }
  })

  // 更新原店主为普通成员
  await db.collection('members').where({
    shopId,
    userId: openid
  }).update({
    data: { role: 'member' }
  })

  // 更新新店主角色
  await db.collection('members').where({
    shopId,
    userId: newOwnerId
  }).update({
    data: { role: 'owner' }
  })

  return { success: true }
}
```

```json
// cloudfunctions/transferOwner/package.json
{
  "name": "transferOwner",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "wx-server-sdk": "~2.6.3"
  }
}
```

- [ ] **Step 2: 创建 exitShop 云函数**

```javascript
// cloudfunctions/exitShop/index.js
const cloud = require('wx-server-sdk')
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV })
const db = cloud.database()

exports.main = async (event, context) => {
  const { shopId } = event
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID

  // 检查是否是店主
  const shopResult = await db.collection('shops').doc(shopId).get()
  if (shopResult.data.ownerId === openid) {
    return { error: '店主不能退出，请先转让店主' }
  }

  // 删除成员记录
  await db.collection('members').where({
    shopId,
    userId: openid
  }).remove()

  return { success: true }
}
```

```json
// cloudfunctions/exitShop/package.json
{
  "name": "exitShop",
  "version": "1.0.0",
  "main": "index.js",
  "dependencies": {
    "wx-server-sdk": "~2.6.3"
  }
}
```

- [ ] **Step 3: 安装依赖并提交**

```bash
cd D:/ccProject/sum
cd cloudfunctions/transferOwner && npm install && cd ../..
cd cloudfunctions/exitShop && npm install && cd ../..
git add .
git commit -m "feat: 添加转让店主和退出店铺云函数"
```

---

## Task 5: 启动页和创建店铺页

**Files:**
- Create: `miniprogram/pages/launch/launch.wxml`
- Create: `miniprogram/pages/launch/launch.wxss`
- Create: `miniprogram/pages/launch/launch.js`
- Create: `miniprogram/pages/launch/launch.json`
- Create: `miniprogram/pages/createShop/createShop.wxml`
- Create: `miniprogram/pages/createShop/createShop.wxss`
- Create: `miniprogram/pages/createShop/createShop.js`
- Create: `miniprogram/pages/createShop/createShop.json`

- [ ] **Step 1: 创建启动页 launch.wxml**

```html
<!-- miniprogram/pages/launch/launch.wxml -->
<view class="container">
  <view class="welcome">
    <text class="icon">🐟</text>
    <text class="title">卖鱼记账</text>
    <text class="desc">轻松管理你的销售收入</text>
  </view>
  <view class="actions">
    <button class="btn-primary" bindtap="goCreate">创建我的店铺</button>
    <button class="btn-outline" bindtap="goJoin">加入已有店铺</button>
  </view>
</view>
```

- [ ] **Step 2: 创建启动页 launch.wxss**

```css
/* miniprogram/pages/launch/launch.wxss */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 40px 24px;
}

.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;
}

.icon {
  font-size: 56px;
  margin-bottom: 20px;
}

.title {
  font-size: 24px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.desc {
  font-size: 14px;
  color: #999;
}

.actions {
  width: 100%;
}

.btn-outline {
  width: 100%;
  background: #fff;
  color: #07C160;
  border: 2px solid #07C160;
  border-radius: 10px;
  padding: 14px;
  font-size: 16px;
  font-weight: bold;
  margin-top: 12px;
}

.btn-outline::after {
  border: none;
}
```

- [ ] **Step 3: 创建启动页 launch.js**

```javascript
// miniprogram/pages/launch/launch.js
const shopUtil = require('../../utils/shop')

Page({
  onLoad() {
    // 检查是否已有店铺
    const shopId = shopUtil.getCurrentShopId()
    if (shopId) {
      wx.switchTab({ url: '/pages/index/index' })
    }
  },

  goCreate() {
    wx.navigateTo({ url: '/pages/createShop/createShop' })
  },

  goJoin() {
    wx.navigateTo({ url: '/pages/joinShop/joinShop' })
  }
})
```

- [ ] **Step 4: 创建启动页 launch.json**

```json
// miniprogram/pages/launch/launch.json
{
  "navigationBarTitleText": "卖鱼记账",
  "navigationStyle": "custom"
}
```

- [ ] **Step 5: 创建创建店铺页 createShop.wxml**

```html
<!-- miniprogram/pages/createShop/createShop.wxml -->
<view class="container">
  <view class="card">
    <text class="card-title">给你的店铺取个名字</text>
    <input class="shop-name-input" placeholder="例如：老王鱼摊" value="{{shopName}}" bindinput="onInputName" />
    <button class="btn-primary" bindtap="createShop" disabled="{{!shopName}}">创建店铺</button>
  </view>

  <view class="card result-card" wx:if="{{created}}">
    <text class="success-text">✅ 店铺创建成功！邀请码：</text>
    <text class="invite-code">{{inviteCodeFormatted}}</text>
    <text class="hint">分享邀请码给家人，输入即可加入</text>
    <button class="btn-copy" bindtap="copyCode">复制邀请码</button>
    <button class="btn-primary" bindtap="enterShop">进入店铺</button>
  </view>
</view>
```

- [ ] **Step 6: 创建创建店铺页 createShop.wxss**

```css
/* miniprogram/pages/createShop/createShop.wxss */
.container {
  padding: 16px 12px;
}

.shop-name-input {
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 12px;
  font-size: 16px;
  margin: 12px 0;
}

.card-title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}

.result-card {
  text-align: center;
  background: #f0f9f0;
  margin-top: 16px;
}

.success-text {
  font-size: 14px;
  color: #666;
  display: block;
  margin-bottom: 8px;
}

.invite-code {
  font-size: 36px;
  font-weight: bold;
  color: #07C160;
  letter-spacing: 6px;
  display: block;
  margin: 16px 0;
}

.hint {
  font-size: 13px;
  color: #999;
  display: block;
  margin-bottom: 16px;
}

.btn-copy {
  background: #f0f9f0;
  color: #07C160;
  border: 1px solid #07C160;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  margin-bottom: 12px;
}

.btn-copy::after {
  border: none;
}
```

- [ ] **Step 7: 创建创建店铺页 createShop.js**

```javascript
// miniprogram/pages/createShop/createShop.js
const shopUtil = require('../../utils/shop')

Page({
  data: {
    shopName: '',
    created: false,
    inviteCode: '',
    inviteCodeFormatted: '',
    shopId: ''
  },

  onInputName(e) {
    this.setData({ shopName: e.detail.value })
  },

  createShop() {
    if (!this.data.shopName) return

    wx.showLoading({ title: '创建中...' })

    wx.cloud.callFunction({
      name: 'createShop',
      data: {
        name: this.data.shopName,
        nickName: '店主'
      }
    }).then(res => {
      wx.hideLoading()
      const { shopId, inviteCode } = res.result
      this.setData({
        created: true,
        shopId,
        inviteCode,
        inviteCodeFormatted: inviteCode.substring(0, 3) + ' ' + inviteCode.substring(3)
      })
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({ title: '创建失败', icon: 'none' })
      console.error(err)
    })
  },

  copyCode() {
    wx.setClipboardData({
      data: this.data.inviteCode,
      success() {
        wx.showToast({ title: '已复制', icon: 'success' })
      }
    })
  },

  enterShop() {
    shopUtil.setCurrentShopId(this.data.shopId)
    wx.switchTab({ url: '/pages/index/index' })
  }
})
```

- [ ] **Step 8: 创建 createShop.json**

```json
// miniprogram/pages/createShop/createShop.json
{
  "navigationBarTitleText": "创建店铺"
}
```

- [ ] **Step 9: 提交**

```bash
git add miniprogram/pages/launch/ miniprogram/pages/createShop/
git commit -m "feat: 添加启动页和创建店铺页"
```

---

## Task 6: 加入店铺页

**Files:**
- Create: `miniprogram/pages/joinShop/joinShop.wxml`
- Create: `miniprogram/pages/joinShop/joinShop.wxss`
- Create: `miniprogram/pages/joinShop/joinShop.js`
- Create: `miniprogram/pages/joinShop/joinShop.json`

- [ ] **Step 1: 创建加入店铺页 joinShop.wxml**

```html
<!-- miniprogram/pages/joinShop/joinShop.wxml -->
<view class="container">
  <view class="welcome">
    <text class="icon">🔗</text>
    <text class="title">输入邀请码加入店铺</text>
    <text class="desc">向店铺创建者获取6位邀请码</text>
  </view>

  <view class="code-inputs">
    <input class="code-input {{code[0] ? 'filled' : ''}}" maxlength="1" type="number" value="{{code[0]}}" bindinput="onInput" data-index="0" focus="{{focusIndex === 0}}" />
    <input class="code-input {{code[1] ? 'filled' : ''}}" maxlength="1" type="number" value="{{code[1]}}" bindinput="onInput" data-index="1" focus="{{focusIndex === 1}}" />
    <input class="code-input {{code[2] ? 'filled' : ''}}" maxlength="1" type="number" value="{{code[2]}}" bindinput="onInput" data-index="2" focus="{{focusIndex === 2}}" />
    <input class="code-input {{code[3] ? 'filled' : ''}}" maxlength="1" type="number" value="{{code[3]}}" bindinput="onInput" data-index="3" focus="{{focusIndex === 3}}" />
    <input class="code-input {{code[4] ? 'filled' : ''}}" maxlength="1" type="number" value="{{code[4]}}" bindinput="onInput" data-index="4" focus="{{focusIndex === 4}}" />
    <input class="code-input {{code[5] ? 'filled' : ''}}" maxlength="1" type="number" value="{{code[5]}}" bindinput="onInput" data-index="5" focus="{{focusIndex === 5}}" />
  </view>

  <button class="btn-primary" bindtap="joinShop" disabled="{{code.join('').length < 6}}">加入店铺</button>
</view>
```

- [ ] **Step 2: 创建加入店铺页 joinShop.wxss**

```css
/* miniprogram/pages/joinShop/joinShop.wxss */
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px 24px;
}

.welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 30px;
}

.icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.title {
  font-size: 16px;
  font-weight: bold;
  color: #333;
  margin-bottom: 8px;
}

.desc {
  font-size: 13px;
  color: #999;
}

.code-inputs {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin: 24px 0;
}

.code-input {
  width: 46px;
  height: 54px;
  border: 2px solid #e0e0e0;
  border-radius: 10px;
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  background: #fff;
}

.code-input.filled {
  border-color: #07C160;
}
```

- [ ] **Step 3: 创建加入店铺页 joinShop.js**

```javascript
// miniprogram/pages/joinShop/joinShop.js
const shopUtil = require('../../utils/shop')

Page({
  data: {
    code: ['', '', '', '', '', ''],
    focusIndex: 0
  },

  onInput(e) {
    const index = parseInt(e.currentTarget.dataset.index)
    const value = e.detail.value
    const code = [...this.data.code]

    code[index] = value
    this.setData({ code })

    // 自动跳到下一个输入框
    if (value && index < 5) {
      this.setData({ focusIndex: index + 1 })
    }
  },

  joinShop() {
    const inviteCode = this.data.code.join('')
    if (inviteCode.length < 6) return

    wx.showLoading({ title: '加入中...' })

    wx.cloud.callFunction({
      name: 'joinShop',
      data: {
        inviteCode,
        nickName: '成员'
      }
    }).then(res => {
      wx.hideLoading()
      if (res.result.error) {
        wx.showToast({ title: res.result.error, icon: 'none' })
        return
      }

      const { shopId } = res.result
      shopUtil.setCurrentShopId(shopId)
      wx.showToast({ title: '加入成功', icon: 'success' })
      setTimeout(() => {
        wx.switchTab({ url: '/pages/index/index' })
      }, 1000)
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({ title: '加入失败', icon: 'none' })
      console.error(err)
    })
  }
})
```

- [ ] **Step 4: 创建 joinShop.json**

```json
// miniprogram/pages/joinShop/joinShop.json
{
  "navigationBarTitleText": "加入店铺"
}
```

- [ ] **Step 5: 提交**

```bash
git add miniprogram/pages/joinShop/
git commit -m "feat: 添加加入店铺页"
```

---

## Task 7: 首页（待收款）

**Files:**
- Create: `miniprogram/pages/index/index.wxml`
- Create: `miniprogram/pages/index/index.wxss`
- Create: `miniprogram/pages/index/index.js`
- Create: `miniprogram/pages/index/index.json`

- [ ] **Step 1: 创建首页 index.wxml**

```html
<!-- miniprogram/pages/index/index.wxml -->
<view class="header">
  <text class="header-label">今日待收</text>
  <text class="header-amount">¥ {{totalAmount}}</text>
  <text class="header-info">{{today}} · {{count}}笔未收</text>
</view>

<view class="container">
  <view class="card input-card">
    <view class="input-row">
      <text class="symbol">¥</text>
      <input class="amount-input" placeholder="输入金额" type="digit" value="{{amount}}" bindinput="onInputAmount" />
    </view>
    <input class="note-input" placeholder="备注（可选）" value="{{note}}" bindinput="onInputNote" />
    <button class="btn-primary" bindtap="addSale">记 录</button>
  </view>

  <view class="section-header">
    <text class="section-title">待收记录</text>
    <text class="section-hint">← 左滑标记已收</text>
  </view>

  <view class="list">
    <view class="record-item" wx:for="{{list}}" wx:key="_id" bindtouchstart="onTouchStart" bindtouchmove="onTouchMove" bindtouchend="onTouchEnd" data-id="{{item._id}}" data-index="{{index}}">
      <view class="record-content">
        <view class="record-left">
          <text class="record-amount">¥ {{item.amount}}</text>
          <text class="record-note" wx:if="{{item.note}}">{{item.note}}</text>
        </view>
        <view class="record-right">
          <text class="record-time">{{item.time}}</text>
          <text class="record-status">待收</text>
        </view>
      </view>
      <view class="record-actions" style="right: {{item.slideRight || 0}}rpx;">
        <view class="action-collect" bindtap="markCollected" data-id="{{item._id}}">已收</view>
      </view>
    </view>

    <view class="empty" wx:if="{{list.length === 0}}">
      <text class="empty-text">暂无待收记录</text>
    </view>
  </view>
</view>
```

- [ ] **Step 2: 创建首页 index.wxss**

```css
/* miniprogram/pages/index/index.wxss */
.header {
  background: linear-gradient(135deg, #07C160, #06AD56);
  color: #fff;
  padding: 24px 20px;
  text-align: center;
}

.header-label {
  font-size: 14px;
  opacity: 0.9;
  display: block;
}

.header-amount {
  font-size: 42px;
  font-weight: bold;
  margin: 8px 0;
  display: block;
}

.header-info {
  font-size: 13px;
  opacity: 0.8;
  display: block;
}

.container {
  padding: 12px;
}

.input-card {
  margin-bottom: 10px;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.symbol {
  font-size: 18px;
  color: #333;
  font-weight: bold;
}

.amount-input {
  flex: 1;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 18px;
}

.note-input {
  width: 100%;
  border: 1px solid #e8e8e8;
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  margin-bottom: 10px;
  box-sizing: border-box;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 16px 0 10px;
}

.section-title {
  font-size: 15px;
  font-weight: bold;
  color: #333;
}

.section-hint {
  font-size: 12px;
  color: #999;
}

.record-item {
  position: relative;
  overflow: hidden;
  margin-bottom: 8px;
  border-radius: 10px;
}

.record-content {
  background: #fff;
  padding: 14px 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  z-index: 1;
  transition: right 0.2s;
}

.record-left {
  display: flex;
  flex-direction: column;
}

.record-amount {
  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.record-note {
  font-size: 13px;
  color: #888;
  margin-top: 4px;
}

.record-right {
  text-align: right;
}

.record-time {
  font-size: 14px;
  color: #666;
  display: block;
}

.record-status {
  font-size: 11px;
  color: #07C160;
  margin-top: 4px;
  display: block;
}

.record-actions {
  position: absolute;
  top: 0;
  right: -160rpx;
  width: 160rpx;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 0;
}

.action-collect {
  background: #07C160;
  color: #fff;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
}

.empty {
  text-align: center;
  padding: 40px 0;
}

.empty-text {
  font-size: 14px;
  color: #999;
}
```

- [ ] **Step 3: 创建首页 index.js**

```javascript
// miniprogram/pages/index/index.js
const dateUtil = require('../../utils/date')
const shopUtil = require('../../utils/shop')

Page({
  data: {
    shopId: '',
    today: '',
    totalAmount: '0.00',
    count: 0,
    amount: '',
    note: '',
    list: [],
    startX: 0
  },

  onShow() {
    const shopId = shopUtil.getCurrentShopId()
    if (!shopId) {
      wx.redirectTo({ url: '/pages/launch/launch' })
      return
    }
    this.setData({
      shopId,
      today: dateUtil.getToday()
    })
    this.loadPendingList()
  },

  loadPendingList() {
    wx.cloud.callFunction({
      name: 'getPendingList',
      data: { shopId: this.data.shopId }
    }).then(res => {
      const { list, totalAmount, count } = res.result
      this.setData({
        list: list.map(item => ({ ...item, slideRight: 0 })),
        totalAmount: totalAmount.toFixed(2),
        count
      })
    })
  },

  onInputAmount(e) {
    this.setData({ amount: e.detail.value })
  },

  onInputNote(e) {
    this.setData({ note: e.detail.value })
  },

  addSale() {
    const { amount, note, shopId } = this.data
    if (!amount || parseFloat(amount) <= 0) {
      wx.showToast({ title: '请输入金额', icon: 'none' })
      return
    }

    wx.showLoading({ title: '记录中...' })

    wx.cloud.callFunction({
      name: 'addSale',
      data: {
        shopId,
        amount: parseFloat(amount),
        note
      }
    }).then(res => {
      wx.hideLoading()
      if (res.result.error) {
        wx.showToast({ title: res.result.error, icon: 'none' })
        return
      }
      this.setData({ amount: '', note: '' })
      wx.showToast({ title: '已记录', icon: 'success' })
      this.loadPendingList()
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({ title: '记录失败', icon: 'none' })
      console.error(err)
    })
  },

  onTouchStart(e) {
    this.setData({ startX: e.touches[0].clientX })
  },

  onTouchMove(e) {
    const startX = this.data.startX
    const moveX = e.touches[0].clientX
    const diff = startX - moveX
    const index = e.currentTarget.dataset.index
    const list = [...this.data.list]

    if (diff > 0 && diff < 160) {
      list[index].slideRight = diff * 2
      this.setData({ list })
    }
  },

  onTouchEnd(e) {
    const index = e.currentTarget.dataset.index
    const list = [...this.data.list]
    const item = list[index]

    if (item.slideRight > 100) {
      item.slideRight = 160
    } else {
      item.slideRight = 0
    }
    this.setData({ list })
  },

  markCollected(e) {
    const saleId = e.currentTarget.dataset.id

    wx.showLoading({ title: '处理中...' })

    wx.cloud.callFunction({
      name: 'markCollected',
      data: { saleId }
    }).then(res => {
      wx.hideLoading()
      if (res.result.error) {
        wx.showToast({ title: res.result.error, icon: 'none' })
        return
      }
      wx.showToast({ title: '已收款', icon: 'success' })
      this.loadPendingList()
    }).catch(err => {
      wx.hideLoading()
      wx.showToast({ title: '操作失败', icon: 'none' })
      console.error(err)
    })
  }
})
```

- [ ] **Step 4: 创建首页 index.json**

```json
// miniprogram/pages/index/index.json
{
  "navigationBarTitleText": "卖鱼记账"
}
```

- [ ] **Step 5: 提交**

```bash
git add miniprogram/pages/index/
git commit -m "feat: 添加首页待收款功能"
```

---

## Task 8: 汇总页和详情页

**Files:**
- Create: `miniprogram/pages/summary/summary.wxml`
- Create: `miniprogram/pages/summary/summary.wxss`
- Create: `miniprogram/pages/summary/summary.js`
- Create: `miniprogram/pages/summary/summary.json`
- Create: `miniprogram/pages/detail/detail.wxml`
- Create: `miniprogram/pages/detail/detail.wxss`
- Create: `miniprogram/pages/detail/detail.js`
- Create: `miniprogram/pages/detail/detail.json`

- [ ] **Step 1: 创建汇总页 summary.wxml**

```html
<!-- miniprogram/pages/summary/summary.wxml -->
<view class="header">
  <text class="header-label">今日已收</text>
  <text class="header-amount">¥ {{todayAmount}}</text>
  <text class="header-info">{{todayCount}}笔收款</text>
</view>

<view class="container">
  <view class="card filter-card">
    <text class="filter-label">从</text>
    <picker mode="date" value="{{startDate}}" bindchange="onStartDateChange">
      <view class="date-box">{{startDate}}</view>
    </picker>
    <text class="filter-label">至</text>
    <picker mode="date" value="{{endDate}}" bindchange="onEndDateChange">
      <view class="date-box">{{endDate}}</view>
    </picker>
    <view class="btn-filter" bindtap="loadSummary">查询</view>
  </view>

  <view class="card">
    <view class="tab-switch">
      <view class="tab {{tabType === 'daily' ? 'active' : ''}}" bindtap="switchTab" data-type="daily">日汇总</view>
      <view class="tab {{tabType === 'monthly' ? 'active' : ''}}" bindtap="switchTab" data-type="monthly">月汇总</view>
    </view>

    <!-- 日汇总 -->
    <view wx:if="{{tabType === 'daily'}}">
      <view class="summary-item" wx:for="{{dailyList}}" wx:key="date" bindtap="goDetail" data-date="{{item.date}}">
        <text class="summary-date">{{item.dateFormatted}}</text>
        <view class="summary-right">
          <text class="summary-amount">¥ {{item.amountFixed}}</text>
          <text class="summary-count">{{item.count}}笔</text>
        </view>
      </view>
      <view class="empty" wx:if="{{dailyList.length === 0}}">
        <text class="empty-text">暂无数据</text>
      </view>
    </view>

    <!-- 月汇总 -->
    <view wx:if="{{tabType === 'monthly'}}">
      <view class="summary-item" wx:for="{{monthlyList}}" wx:key="month">
        <text class="summary-date">{{item.month}}</text>
        <view class="summary-right">
          <text class="summary-amount">¥ {{item.amountFixed}}</text>
          <text class="summary-count">{{item.count}}笔</text>
        </view>
      </view>
      <view class="empty" wx:if="{{monthlyList.length === 0}}">
        <text class="empty-text">暂无数据</text>
      </view>
    </view>
  </view>
</view>
```

- [ ] **Step 2: 创建汇总页 summary.wxss**

```css
/* miniprogram/pages/summary/summary.wxss */
.header {
  background: linear-gradient(135deg, #07C160, #06AD56);
  color: #fff;
  padding: 24px 20px;
  text-align: center;
}

.header-label { font-size: 14px; opacity: 0.9; display: block; }
.header-amount { font-size: 42px; font-weight: bold; margin: 8px 0; display: block; }
.header-info { font-size: 13px; opacity: 0.8; display: block; }

.container { padding: 12px; }

.filter-card {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-label { font-size: 13px; color: #666; }

.date-box {
  flex: 1;
  border: 1px solid #e8e8e8;
  border-radius: 6px;
  padding: 8px;
  font-size: 13px;
  text-align: center;
  background: #fafafa;
}

.btn-filter {
  background: #07C160;
  color: #fff;
  border-radius: 6px;
  padding: 8px 12px;
  font-size: 13px;
}

.tab-switch {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 8px;
}

.tab {
  flex: 1;
  text-align: center;
  padding: 12px;
  font-size: 14px;
  color: #999;
}

.tab.active {
  color: #07C160;
  font-weight: bold;
  border-bottom: 2px solid #07C160;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #f5f5f5;
}

.summary-date { font-size: 15px; font-weight: bold; color: #333; }
.summary-right { text-align: right; }
.summary-amount { font-size: 16px; font-weight: bold; color: #333; display: block; }
.summary-count { font-size: 12px; color: #999; display: block; }

.empty { text-align: center; padding: 30px 0; }
.empty-text { font-size: 14px; color: #999; }
```

- [ ] **Step 3: 创建汇总页 summary.js**

```javascript
// miniprogram/pages/summary/summary.js
const dateUtil = require('../../utils/date')
const shopUtil = require('../../utils/shop')

Page({
  data: {
    shopId: '',
    todayAmount: '0.00',
    todayCount: 0,
    startDate: '',
    endDate: '',
    tabType: 'daily',
    dailyList: [],
    monthlyList: [],
    todayRecords: []
  },

  onShow() {
    const shopId = shopUtil.getCurrentShopId()
    if (!shopId) {
      wx.redirectTo({ url: '/pages/launch/launch' })
      return
    }

    this.setData({
      shopId,
      startDate: dateUtil.getMonthStart(),
      endDate: dateUtil.getToday()
    })
    this.loadSummary()
  },

  onStartDateChange(e) {
    this.setData({ startDate: e.detail.value })
  },

  onEndDateChange(e) {
    this.setData({ endDate: e.detail.value })
  },

  switchTab(e) {
    this.setData({ tabType: e.currentTarget.dataset.type })
  },

  loadSummary() {
    const { shopId, startDate, endDate } = this.data

    wx.cloud.callFunction({
      name: 'getSummary',
      data: { shopId, startDate, endDate }
    }).then(res => {
      const { todayAmount, todayCount, todayRecords, dailyList, monthlyList } = res.result

      this.setData({
        todayAmount: todayAmount.toFixed(2),
        todayCount,
        todayRecords,
        dailyList: dailyList.map(d => ({
          ...d,
          dateFormatted: dateUtil.formatDateWithToday(d.date),
          amountFixed: d.amount.toFixed(2)
        })),
        monthlyList: monthlyList.map(m => ({
          ...m,
          amountFixed: m.amount.toFixed(2)
        }))
      })
    })
  },

  goDetail(e) {
    const date = e.currentTarget.dataset.date
    wx.navigateTo({
      url: `/pages/detail/detail?date=${date}&shopId=${this.data.shopId}`
    })
  }
})
```

- [ ] **Step 4: 创建汇总页 summary.json**

```json
// miniprogram/pages/summary/summary.json
{
  "navigationBarTitleText": "汇总统计"
}
```

- [ ] **Step 5: 创建详情页 detail.wxml**

```html
<!-- miniprogram/pages/detail/detail.wxml -->
<view class="header">
  <text class="header-label">{{date}} 已收</text>
  <text class="header-amount">¥ {{totalAmount}}</text>
  <text class="header-info">共{{count}}笔收款</text>
</view>

<view class="container">
  <view class="record-item" wx:for="{{list}}" wx:key="_id">
    <view class="record-left">
      <text class="record-amount">¥ {{item.amount}}</text>
      <text class="record-note" wx:if="{{item.note}}">{{item.note}}</text>
    </view>
    <view class="record-right">
      <text class="record-time">{{item.time}}</text>
      <text class="record-status">已收</text>
    </view>
  </view>

  <view class="empty" wx:if="{{list.length === 0}}">
    <text class="empty-text">暂无记录</text>
  </view>
</view>
```

- [ ] **Step 6: 创建详情页 detail.wxss**

```css
/* miniprogram/pages/detail/detail.wxss */
.header {
  background: linear-gradient(135deg, #07C160, #06AD56);
  color: #fff;
  padding: 20px;
  text-align: center;
}

.header-label { font-size: 14px; opacity: 0.9; display: block; }
.header-amount { font-size: 36px; font-weight: bold; margin: 6px 0; display: block; }
.header-info { font-size: 13px; opacity: 0.8; display: block; }

.container { padding: 12px; }

.record-item {
  background: #fff;
  border-radius: 10px;
  padding: 14px 16px;
  margin-bottom: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.record-left { display: flex; flex-direction: column; }
.record-amount { font-size: 20px; font-weight: bold; color: #333; }
.record-note { font-size: 13px; color: #888; margin-top: 4px; }
.record-right { text-align: right; }
.record-time { font-size: 14px; color: #666; display: block; }
.record-status { font-size: 11px; color: #999; margin-top: 4px; display: block; }

.empty { text-align: center; padding: 40px 0; }
.empty-text { font-size: 14px; color: #999; }
```

- [ ] **Step 7: 创建详情页 detail.js**

```javascript
// miniprogram/pages/detail/detail.js
Page({
  data: {
    date: '',
    shopId: '',
    totalAmount: '0.00',
    count: 0,
    list: []
  },

  onLoad(options) {
    const { date, shopId } = options
    this.setData({ date, shopId })
    this.loadDetail(date, shopId)
  },

  loadDetail(date, shopId) {
    wx.cloud.callFunction({
      name: 'getSummary',
      data: {
        shopId,
        startDate: date,
        endDate: date
      }
    }).then(res => {
      const { todayRecords, todayAmount, todayCount } = res.result
      this.setData({
        list: todayRecords,
        totalAmount: todayAmount.toFixed(2),
        count: todayCount
      })
    })
  }
})
```

- [ ] **Step 8: 创建详情页 detail.json**

```json
// miniprogram/pages/detail/detail.json
{
  "navigationBarTitleText": "记录详情"
}
```

- [ ] **Step 9: 提交**

```bash
git add miniprogram/pages/summary/ miniprogram/pages/detail/
git commit -m "feat: 添加汇总页和详情页"
```

---

## Task 9: 店铺设置页

**Files:**
- Create: `miniprogram/pages/shopSettings/shopSettings.wxml`
- Create: `miniprogram/pages/shopSettings/shopSettings.wxss`
- Create: `miniprogram/pages/shopSettings/shopSettings.js`
- Create: `miniprogram/pages/shopSettings/shopSettings.json`

- [ ] **Step 1: 创建店铺设置页 shopSettings.wxml**

```html
<!-- miniprogram/pages/shopSettings/shopSettings.wxml -->
<view class="container">
  <view class="card">
    <text class="card-title">店铺名称</text>
    <text class="card-value">{{shopName}}</text>
  </view>

  <view class="card">
    <text class="card-title">邀请码</text>
    <view class="invite-row">
      <text class="invite-code">{{inviteCodeFormatted}}</text>
      <view class="btn-copy" bindtap="copyCode">复制</view>
    </view>
    <text class="hint">分享给家人，输入即可加入</text>
  </view>

  <view class="card">
    <text class="card-title">成员（{{members.length}}人）</text>
    <view class="member-item" wx:for="{{members}}" wx:key="_id">
      <view class="avatar" style="background: {{item.avatarColor}};">{{item.firstChar}}</view>
      <view class="member-info">
        <text class="member-name">{{item.nickName}}</text>
        <text class="member-role">{{item.role === 'owner' ? '店主' : '成员'}}</text>
      </view>
      <view wx:if="{{item.userId === myUserId}}" class="tag-me">我</view>
      <view wx:elif="{{currentRole === 'owner' && item.role !== 'owner'}}" class="btn-transfer" bindtap="goTransfer" data-id="{{item.userId}}" data-name="{{item.nickName}}">转让店主</view>
    </view>
  </view>

  <view class="card">
    <text class="card-title">其他操作</text>
    <view class="action-item" bindtap="goMyShops">
      <text class="action-text">🏪 我的店铺</text>
      <text class="action-arrow">›</text>
    </view>
    <view class="action-item" bindtap="genQRCode">
      <text class="action-text">📋 生成二维码</text>
      <text class="action-arrow">›</text>
    </view>
    <view class="action-item action-exit" bindtap="exitShop" wx:if="{{currentRole !== 'owner'}}">
      <text class="action-text-exit">🚪 退出店铺</text>
      <text class="action-arrow">›</text>
    </view>
  </view>
</view>
```

- [ ] **Step 2: 创建店铺设置页 shopSettings.wxss**

```css
/* miniprogram/pages/shopSettings/shopSettings.wxss */
.container { padding: 12px; }

.card-title { font-size: 13px; color: #999; margin-bottom: 6px; display: block; }
.card-value { font-size: 18px; font-weight: bold; color: #333; display: block; }

.invite-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.invite-code {
  font-size: 28px;
  font-weight: bold;
  color: #07C160;
  letter-spacing: 4px;
}

.btn-copy {
  background: #f0f9f0;
  color: #07C160;
  border: none;
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 13px;
}

.hint { font-size: 12px; color: #999; margin-top: 8px; display: block; }

.member-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #f5f5f5;
}

.member-item:last-child { border-bottom: none; }

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
  flex-shrink: 0;
}

.member-info { flex: 1; }
.member-name { font-size: 15px; color: #333; display: block; }
.member-role { font-size: 12px; color: #999; display: block; }

.tag-me {
  background: #f0f9f0;
  color: #07C160;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 12px;
}

.btn-transfer {
  background: #fff3f3;
  color: #ff4d4f;
  border: none;
  border-radius: 6px;
  padding: 4px 10px;
  font-size: 12px;
}

.action-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 14px 0;
  border-bottom: 1px solid #f5f5f5;
}

.action-item:last-child { border-bottom: none; }
.action-text { font-size: 15px; color: #333; }
.action-text-exit { font-size: 15px; color: #ff4d4f; }
.action-arrow { font-size: 14px; color: #ccc; }
```

- [ ] **Step 3: 创建店铺设置页 shopSettings.js**

```javascript
// miniprogram/pages/shopSettings/shopSettings.js
const shopUtil = require('../../utils/shop')

const AVATAR_COLORS = ['#07C160', '#4CAF50', '#FF9800', '#2196F3', '#9C27B0', '#F44336']

Page({
  data: {
    shopId: '',
    shopName: '',
    inviteCode: '',
    inviteCodeFormatted: '',
    members: [],
    currentRole: '',
    myUserId: ''
  },

  onShow() {
    const shopId = shopUtil.getCurrentShopId()
    if (!shopId) {
      wx.redirectTo({ url: '/pages/launch/launch' })
      return
    }
    this.setData({ shopId })
    this.loadShopInfo()
  },

  loadShopInfo() {
    wx.cloud.callFunction({
      name: 'getShopInfo',
      data: { shopId: this.data.shopId }
    }).then(res => {
      const { shop, members, currentRole } = res.result
      const inviteCode = shop.inviteCode

      const wxContext = wx.cloud.getCurrentEnvInfo ? {} : {}
      // 获取当前用户openid通过members匹配
      const myMember = members.find(m => m.role === currentRole)

      this.setData({
        shopName: shop.name,
        inviteCode,
        inviteCodeFormatted: inviteCode.substring(0, 3) + ' ' + inviteCode.substring(3),
        members: members.map((m, i) => ({
          ...m,
          firstChar: m.nickName.charAt(0),
          avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length]
        })),
        currentRole,
        myUserId: myMember ? myMember.userId : ''
      })
    })
  },

  copyCode() {
    wx.setClipboardData({
      data: this.data.inviteCode,
      success() {
        wx.showToast({ title: '已复制', icon: 'success' })
      }
    })
  },

  goMyShops() {
    wx.navigateTo({ url: '/pages/myShops/myShops' })
  },

  genQRCode() {
    // 使用微信接口生成小程序码
    wx.cloud.callFunction({
      name: 'genInviteCode',
      data: { shopId: this.data.shopId }
    }).then(res => {
      wx.showToast({ title: '邀请码: ' + res.result.inviteCode, icon: 'none', duration: 3000 })
    })
  },

  goTransfer(e) {
    const { id, name } = e.currentTarget.dataset
    wx.navigateTo({
      url: `/pages/transferOwner/transferOwner?shopId=${this.data.shopId}&newOwnerId=${id}&newOwnerName=${name}`
    })
  },

  exitShop() {
    wx.showModal({
      title: '确认退出',
      content: '退出后将无法查看该店铺数据，确定退出吗？',
      success: (res) => {
        if (res.confirm) {
          wx.cloud.callFunction({
            name: 'exitShop',
            data: { shopId: this.data.shopId }
          }).then(res => {
            if (res.result.error) {
              wx.showToast({ title: res.result.error, icon: 'none' })
              return
            }
            shopUtil.clearCurrentShopId()
            wx.showToast({ title: '已退出', icon: 'success' })
            setTimeout(() => {
              wx.redirectTo({ url: '/pages/launch/launch' })
            }, 1000)
          })
        }
      }
    })
  }
})
```

- [ ] **Step 4: 创建 shopSettings.json**

```json
// miniprogram/pages/shopSettings/shopSettings.json
{
  "navigationBarTitleText": "店铺设置"
}
```

- [ ] **Step 5: 提交**

```bash
git add miniprogram/pages/shopSettings/
git commit -m "feat: 添加店铺设置页"
```

---

## Task 10: 我的店铺页和转让店主页

**Files:**
- Create: `miniprogram/pages/myShops/myShops.wxml`
- Create: `miniprogram/pages/myShops/myShops.wxss`
- Create: `miniprogram/pages/myShops/myShops.js`
- Create: `miniprogram/pages/myShops/myShops.json`
- Create: `miniprogram/pages/transferOwner/transferOwner.wxml`
- Create: `miniprogram/pages/transferOwner/transferOwner.wxss`
- Create: `miniprogram/pages/transferOwner/transferOwner.js`
- Create: `miniprogram/pages/transferOwner/transferOwner.json`

- [ ] **Step 1: 创建我的店铺页 myShops.wxml**

```html
<!-- miniprogram/pages/myShops/myShops.wxml -->
<view class="container">
  <view class="card shop-list">
    <view class="shop-item {{item._id === currentShopId ? 'active' : ''}}" wx:for="{{shops}}" wx:key="_id" bindtap="switchShop" data-id="{{item._id}}">
      <view class="shop-icon" style="background: {{item.iconColor}};">🐟</view>
      <view class="shop-info">
        <text class="shop-name">{{item.name}}</text>
        <text class="shop-desc">{{item.role === 'owner' ? '店主' : '成员'}} · {{item.memberCount}}人</text>
      </view>
      <view class="current-tag" wx:if="{{item._id === currentShopId}}">当前</view>
    </view>

    <view class="empty" wx:if="{{shops.length === 0}}">
      <text class="empty-text">暂无店铺</text>
    </view>
  </view>

  <view class="action-row">
    <view class="action-box create" bindtap="goCreate">
      <text class="action-icon">+</text>
      <text class="action-text">创建店铺</text>
    </view>
    <view class="action-box join" bindtap="goJoin">
      <text class="action-icon">🔗</text>
      <text class="action-text">加入店铺</text>
    </view>
  </view>

  <view class="note-box">
    <text class="note-text"><text class="note-bold">说明：</text>点击店铺可切换当前使用的店铺。每个店铺的数据完全独立，互不影响。</text>
  </view>
</view>
```

- [ ] **Step 2: 创建我的店铺页 myShops.wxss**

```css
/* miniprogram/pages/myShops/myShops.wxss */
.container { padding: 12px; }

.shop-list { padding: 0; overflow: hidden; }

.shop-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  border-bottom: 1px solid #f5f5f5;
}

.shop-item:last-child { border-bottom: none; }
.shop-item.active { background: #f0f9f0; }

.shop-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 20px;
  flex-shrink: 0;
}

.shop-info { flex: 1; }
.shop-name { font-size: 16px; font-weight: bold; color: #333; display: block; }
.shop-desc { font-size: 12px; color: #999; margin-top: 2px; display: block; }

.current-tag {
  background: #07C160;
  color: #fff;
  border-radius: 4px;
  padding: 2px 8px;
  font-size: 11px;
}

.action-row { display: flex; gap: 10px; margin-top: 16px; }

.action-box {
  flex: 1;
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  text-align: center;
}

.action-box.create { border: 2px dashed #07C160; }
.action-box.join { border: 2px dashed #999; }
.action-icon { font-size: 22px; display: block; margin-bottom: 4px; }
.action-text { font-size: 14px; font-weight: bold; }
.action-box.create .action-text { color: #07C160; }
.action-box.join .action-text { color: #666; }

.note-box {
  margin-top: 16px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
}

.note-text { font-size: 13px; color: #666; line-height: 1.6; }
.note-bold { font-weight: bold; color: #333; }

.empty { text-align: center; padding: 30px 0; }
.empty-text { font-size: 14px; color: #999; }
```

- [ ] **Step 3: 创建我的店铺页 myShops.js**

```javascript
// miniprogram/pages/myShops/myShops.js
const shopUtil = require('../../utils/shop')

const SHOP_COLORS = ['#07C160', '#4CAF50', '#FF9800', '#2196F3', '#9C27B0']

Page({
  data: {
    shops: [],
    currentShopId: ''
  },

  onShow() {
    this.setData({ currentShopId: shopUtil.getCurrentShopId() })
    this.loadMyShops()
  },

  loadMyShops() {
    wx.showLoading({ title: '加载中...' })

    wx.cloud.callFunction({
      name: 'getMyShops'
    }).then(res => {
      wx.hideLoading()
      const shops = res.result.shops.map((s, i) => ({
        ...s,
        iconColor: SHOP_COLORS[i % SHOP_COLORS.length]
      }))
      this.setData({ shops })
    }).catch(err => {
      wx.hideLoading()
      console.error(err)
    })
  },

  switchShop(e) {
    const shopId = e.currentTarget.dataset.id
    if (shopId === this.data.currentShopId) return

    shopUtil.setCurrentShopId(shopId)
    this.setData({ currentShopId: shopId })
    wx.showToast({ title: '已切换', icon: 'success' })
    setTimeout(() => {
      wx.switchTab({ url: '/pages/index/index' })
    }, 500)
  },

  goCreate() {
    wx.navigateTo({ url: '/pages/createShop/createShop' })
  },

  goJoin() {
    wx.navigateTo({ url: '/pages/joinShop/joinShop' })
  }
})
```

- [ ] **Step 4: 创建 myShops.json**

```json
// miniprogram/pages/myShops/myShops.json
{
  "navigationBarTitleText": "我的店铺"
}
```

- [ ] **Step 5: 创建转让店主页 transferOwner.wxml**

```html
<!-- miniprogram/pages/transferOwner/transferOwner.wxml -->
<view class="container">
  <view class="warning-box">
    <text class="warning-title">⚠️ 转让须知</text>
    <text class="warning-desc">转让后你将变为普通成员，无法撤销。请确认选择的新店主是可信任的成员。</text>
  </view>

  <text class="section-title">选择新店主</text>

  <view class="card member-list">
    <view class="member-item {{item.userId === selectedId ? 'selected' : ''}}" wx:for="{{members}}" wx:key="_id" bindtap="selectMember" data-id="{{item.userId}}">
      <view class="avatar" style="background: {{item.avatarColor}};">{{item.firstChar}}</view>
      <view class="member-info">
        <text class="member-name">{{item.nickName}}</text>
        <text class="member-role">成员</text>
      </view>
      <view class="check-icon {{item.userId === selectedId ? 'checked' : ''}}">✓</view>
    </view>
  </view>

  <button class="btn-confirm" bindtap="confirmTransfer" disabled="{{!selectedId}}">确认转让给{{selectedName}}</button>
</view>
```

- [ ] **Step 6: 创建转让店主页 transferOwner.wxss**

```css
/* miniprogram/pages/transferOwner/transferOwner.wxss */
.container { padding: 20px; }

.warning-box {
  background: #fff3f3;
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 16px;
}

.warning-title { font-size: 14px; color: #ff4d4f; font-weight: bold; display: block; margin-bottom: 8px; }
.warning-desc { font-size: 13px; color: #666; line-height: 1.6; }

.section-title { font-size: 14px; color: #333; font-weight: bold; margin-bottom: 12px; display: block; }

.member-list { padding: 0; }

.member-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: 2px solid transparent;
  border-radius: 12px;
  margin: 8px;
}

.member-item.selected { border-color: #07C160; }

.avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 16px;
  flex-shrink: 0;
}

.member-info { flex: 1; }
.member-name { font-size: 16px; font-weight: bold; color: #333; display: block; }
.member-role { font-size: 12px; color: #999; display: block; }

.check-icon {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 2px solid #ddd;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ddd;
  font-size: 14px;
}

.check-icon.checked {
  background: #07C160;
  border-color: #07C160;
  color: #fff;
}

.btn-confirm {
  width: 100%;
  background: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 10px;
  padding: 14px;
  font-size: 16px;
  font-weight: bold;
  margin-top: 24px;
}

.btn-confirm::after { border: none; }
```

- [ ] **Step 7: 创建转让店主页 transferOwner.js**

```javascript
// miniprogram/pages/transferOwner/transferOwner.js
const AVATAR_COLORS = ['#4CAF50', '#FF9800', '#2196F3', '#9C27B0', '#F44336']

Page({
  data: {
    shopId: '',
    members: [],
    selectedId: '',
    selectedName: ''
  },

  onLoad(options) {
    const { shopId } = options
    this.setData({ shopId })
    this.loadMembers()
  },

  loadMembers() {
    wx.cloud.callFunction({
      name: 'getShopInfo',
      data: { shopId: this.data.shopId }
    }).then(res => {
      const members = res.result.members
        .filter(m => m.role !== 'owner')
        .map((m, i) => ({
          ...m,
          firstChar: m.nickName.charAt(0),
          avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length]
        }))
      this.setData({ members })
    })
  },

  selectMember(e) {
    const id = e.currentTarget.dataset.id
    const member = this.data.members.find(m => m.userId === id)
    this.setData({
      selectedId: id,
      selectedName: member ? member.nickName : ''
    })
  },

  confirmTransfer() {
    const { selectedId, selectedName, shopId } = this.data
    if (!selectedId) return

    wx.showModal({
      title: '确认转让',
      content: `确定将店主转让给${selectedName}吗？转让后你将变为普通成员，无法撤销。`,
      success: (res) => {
        if (res.confirm) {
          wx.showLoading({ title: '转让中...' })

          wx.cloud.callFunction({
            name: 'transferOwner',
            data: {
              shopId,
              newOwnerId: selectedId
            }
          }).then(res => {
            wx.hideLoading()
            if (res.result.error) {
              wx.showToast({ title: res.result.error, icon: 'none' })
              return
            }
            wx.showToast({ title: '转让成功', icon: 'success' })
            setTimeout(() => {
              wx.navigateBack()
            }, 1000)
          }).catch(err => {
            wx.hideLoading()
            wx.showToast({ title: '转让失败', icon: 'none' })
            console.error(err)
          })
        }
      }
    })
  }
})
```

- [ ] **Step 8: 创建 transferOwner.json**

```json
// miniprogram/pages/transferOwner/transferOwner.json
{
  "navigationBarTitleText": "转让店主"
}
```

- [ ] **Step 9: 提交**

```bash
git add miniprogram/pages/myShops/ miniprogram/pages/transferOwner/
git commit -m "feat: 添加我的店铺页和转让店主页"
```

---

## Task 11: Tab 图标和最终测试

**Files:**
- Create: `miniprogram/images/` (tab 图标文件)

- [ ] **Step 1: 创建 Tab 图标**

需要准备 6 个 tab 图标文件（3 个普通 + 3 个选中状态），放入 `miniprogram/images/` 目录：
- `tab-record.png` / `tab-record-active.png`（记账）
- `tab-summary.png` / `tab-summary-active.png`（汇总）
- `tab-settings.png` / `tab-settings-active.png`（设置）

可以使用微信开发者工具的图标库，或者用简单的文字图标临时替代。

- [ ] **Step 2: 在微信开发者工具中测试**

1. 打开微信开发者工具，导入项目
2. 在云开发控制台创建三个集合：`shops`、`members`、`sales`
3. 上传所有云函数
4. 测试完整流程：
   - 创建店铺 → 获取邀请码
   - 用另一个账号加入店铺
   - 记账 → 左滑标记已收
   - 查看汇总统计
   - 测试转让店主和退出店铺

- [ ] **Step 3: 最终提交**

```bash
git add .
git commit -m "feat: 完成卖鱼记账小程序全部功能"
```
