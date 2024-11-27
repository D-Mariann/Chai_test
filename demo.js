const express = require('express')
var bodyParser = require('body-parser')

// создаем объект приложения
const app = express()
// parse application/json
app.use(bodyParser.json())

const port = 3000

let users = [
  {
    id: 1,
    name: 'John',
    balance: 100.0,
  },
]
exports.users = users;

// список юзеров
app.get('/users', (req, res) => {
  res.send({ status: 'ok', users:users })
})

// информация об одном юзере
app.get('/users/:id', (req, res) => {
  const id = req.params.id
  const idx = id - 1
  if (idx in users) {
    res.send({ user: users[idx] })
  } else {
    res.status(404)
    res.send({ status: 'not found' })
  }
})

// регистрация нового юзера
app.post('/users', (req, res) => {
  const user = {
    id: users.length + 1,
    name: req.body.name,
    balance: 0.0,
  }
  users.push(user)
  res.send({ status: 'ok', user: user })
})

// юзер совершает покупку стоимостью price
app.post('/users/:id/buy/:price', (req, res) => {
  const id = parseInt(req.params.id)
  const idx = id - 1
  if (!(idx in users)) {
    res.send({ status: 'error', text: 'user not found' })
    return
  }
  const user = users[idx]
  const price = parseFloat(req.params.price)
  if (user.balance < price) {
    res.send({ status: 'error', text: 'not enough money' })
    return
  }
  user.balance -= price
  res.send({
    status: 'ok',
    user: user,
  })
})

// дать юзеру денег безвозмездно
app.post('/users/:id/faucet/:amount', (req, res) => {
  const id = parseInt(req.params.id)
  const idx = id - 1
  if (!(idx in users)) {
    res.send({ status: 'error', text: 'user not found' })
    return
  }
  const user = users[idx]
  const amount = parseFloat(req.params.amount)

  user.balance += amount
  res.send({
    status: 'ok',
    user: user,
  })
})

// пинг системы
app.get('/ping', (req, res) => {
  res.send({status: 'ok', text: 'pong'})
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

