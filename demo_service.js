require('dotenv').config()

module.exports = {
  url: process.env.DEMO_URL,

  get: function (path) {
    return fetch(`${this.url}/${path}`, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    })
  },
  post: function (path, data) {
    return fetch(`${this.url}/${path}`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
  },
}
