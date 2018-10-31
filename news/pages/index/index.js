//index.js

Page({
  data: {

  },
  onLoad: function () {
    wx.request({
      url: 'https://test-miniprogram.com/api/news/list',
      data: {
        city: this.data.result
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        let result = res.data.result
        console.log(result)
      }
    })
  }
})