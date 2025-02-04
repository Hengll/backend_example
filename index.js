import 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import { StatusCodes } from 'http-status-codes'
import routerUser from './routers/user.js'
import routerProduct from './routers/product.js'
import routerOrder from './routers/order.js'
import cors from 'cors'
import './passport.js'

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log('資料庫連線成功')
    mongoose.set('sanitizeFilter', true)
  })
  .catch((error) => {
    console.log('資料庫連線失敗')
    console.log(error)
  })

const app = express()

app.use(
  cors({
    // origin = 請求來源網域
    // callback(錯誤, 使否允許通過)
    origin(origin, callback) {
      if (
        // postman 的 origin 預設是 undefined
        origin === undefined ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1') ||
        origin.includes('github.io')
      ) {
        callback(null, true)
      } else {
        callback(new Error('CORS'), false)
      }
    },
  }),
)

// app.use(cors())

app.use(express.json())
// eslint-disable-next-line no-unused-vars
app.use((error, req, res, next) => {
  res.status(StatusCodes.BAD_REQUEST).json({
    success: false,
    message: 'requestFormatError',
  })
})

app.use('/user', routerUser)
app.use('/product', routerProduct)
app.use('/order', routerOrder)

app.listen(process.env.PORT || 4000, () => {
  console.log('伺服器啟動')
})
