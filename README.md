# 卖鱼记账小程序

一款专为卖鱼生意设计的微信小程序，用于销售记账和收款管理。支持多店铺独立运营，店主可邀请家庭成员协作记账。

## 核心功能

- **快速记账**：输入金额即可记录待收账款，自动获取日期时间
- **收款管理**：左滑标记已收，清晰区分待收/已收状态
- **数据汇总**：日汇总、月汇总，支持日期筛选
- **多店铺支持**：一个用户可加入多个店铺，数据完全隔离
- **团队协作**：通过6位邀请码邀请家庭成员加入店铺

## 技术栈

- **前端**：微信小程序原生开发（WXML + WXSS + JavaScript）
- **后端**：微信云开发
- **数据库**：微信云数据库
- **云函数**：Node.js

## 项目结构

```
sum/
├── miniprogram/              # 小程序前端
│   ├── pages/
│   │   ├── launch/           # 启动页（创建/加入选择）
│   │   ├── createShop/       # 创建店铺页
│   │   ├── joinShop/         # 加入店铺页
│   │   ├── index/            # 首页（待收款）
│   │   ├── summary/          # 汇总页
│   │   ├── detail/           # 记录详情页
│   │   ├── shopSettings/     # 店铺设置页
│   │   ├── myShops/          # 我的店铺页
│   │   └── transferOwner/    # 转让店主页
│   ├── components/           # 公共组件
│   ├── utils/                # 工具函数
│   ├── app.js
│   ├── app.json
│   └── app.wxss
├── cloudfunctions/           # 云函数
│   ├── createShop/           # 创建店铺
│   ├── joinShop/             # 加入店铺
│   ├── addSale/              # 添加记录
│   ├── markCollected/        # 标记已收
│   ├── getPendingList/       # 获取未收列表
│   ├── getSummary/           # 获取汇总数据
│   ├── getShopInfo/          # 获取店铺信息和成员
│   ├── getMyShops/           # 获取用户加入的所有店铺
│   ├── transferOwner/        # 转让店主
│   ├── exitShop/             # 退出店铺
│   └── genInviteCode/        # 生成邀请码/二维码
├── docs/                     # 项目文档
├── project.config.json
└── README.md
```

## 使用流程

### 首次使用

1. 打开小程序，微信自动登录
2. 选择"创建店铺"或"加入店铺"
3. 创建店铺后获得6位邀请码，分享给家人
4. 家人输入邀请码即可加入店铺

### 日常使用

1. **记账**：在首页输入金额，点击"记录"
2. **收款**：顾客付款后，左滑记录点击"已收"
3. **查看汇总**：切换到汇总页，查看日/月收入统计
4. **查看详情**：点击某天的汇总记录，查看详细收款列表

### 店铺管理

- **切换店铺**：设置 → 我的店铺 → 点击其他店铺
- **转让店主**：设置 → 成员列表 → 转让店主
- **退出店铺**：设置 → 退出店铺（店主需先转让）

## 数据模型

### shops 集合（店铺）
| 字段 | 类型 | 说明 |
|------|------|------|
| name | String | 店铺名称 |
| inviteCode | String | 6位邀请码 |
| ownerId | String | 创建者的微信 openid |
| createTime | Number | 创建时间戳 |

### members 集合（成员关系）
| 字段 | 类型 | 说明 |
|------|------|------|
| shopId | String | 所属店铺 id |
| userId | String | 微信 openid |
| nickName | String | 微信昵称 |
| role | String | owner=店主，member=成员 |

### sales 集合（销售记录）
| 字段 | 类型 | 说明 |
|------|------|------|
| shopId | String | 所属店铺 id |
| amount | Number | 销售金额（元） |
| note | String | 备注（可选） |
| date | String | 日期，格式 YYYY-MM-DD |
| time | String | 时间，格式 HH:mm |
| status | String | pending=未收款，collected=已收款 |

## 开发说明

### 环境要求

- 微信开发者工具
- 微信云开发环境

### 部署步骤

1. 使用微信开发者工具打开项目
2. 开通云开发环境
3. 上传并部署所有云函数
4. 在云开发控制台创建以下集合：
   - shops
   - members
   - sales
5. 预览或上传小程序

### 配置说明

- `project.config.json`：项目配置文件
- `appid`：wx84815a317dc3602（当前配置的AppID）

## 设计文档

详细的架构设计和页面设计请参考 [docs/design.md](docs/design.md)

## 许可证

本项目仅供个人学习使用
