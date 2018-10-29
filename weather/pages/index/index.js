const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '雪'
}

const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}

const QQMapWX = require('../../libs/qqmap-wx-jssdk.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    nowTeam:'',
    nowWeather:'',
    nowWeatherBackground:'',
    hourlyWeather:[],
    todayTemp:'',
    todayDate:'',
    city: '广州市',
    locationTipsText: '点击获取当前位置'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad() {
    // 实例化API核心类
    this.qqmapsdk = new QQMapWX({
      key: '7RVBZ-N7AKU-X2XVC-BD3B4-RIJOJ-FDBRY'
    })
    this.getNow()
  },


  /**
     * 获取当前天气
     */
  getNow: function (callback) {
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data: {
        city: this.data.city
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: res => {
        let result = res.data.result
        this.setNow(result)
        this.setHourlyWeather(result)
        this.setToday(result)
      },
      complete:() => {
        callback && callback()
      }
    })
  },

  setNow(result){
    let temp = result.now.temp
    let weather = result.now.weather
    this.setData({
      nowTemp: temp + '°',
      nowWeather: weatherMap[weather],
      nowWeatherBackground: '/images/' + weather + '-bg.png'
    })
    wx.setNavigationBarColor({
      frontColor: '#ffffff',
      backgroundColor: weatherColorMap[weather]
    })
  },

  setHourlyWeather(result){
    //console.log(result)
    let forecast = result.forecast
    let nowHour = new Date().getHours()
    let hourlyWeather = []
    for (let i = 0; i < 8; i += 1) {
      hourlyWeather.push({
        time: (i * 3 + nowHour) % 24 + '时',
        iconPath: '/images/' + forecast[i].weather + '-icon.png',
        temp: forecast[i].temp + '°'
      })
    }
    hourlyWeather[0].time = '现在'
    this.setData({
      hourlyWeather: hourlyWeather
    })
  },

  setToday(result) {
    let date = new Date()
    this.setData({
      todayTemp: `${result.today.minTemp}° - ${result.today.maxTemp}°`,
      todayDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 今天`
    })
  },
    onTapDayWeather() {
    wx.showToast()
  },

  onTapDayWeather(){
    wx.showToast()
    wx.navigateTo({
      url: '/pages/list/list?city='+ this.data.city,
    })
  },

  onTapLocation(){
    wx.getLocation({
      success:res => {
        //console.log(res.latitude,res.longitude)
        this.qqmapsdk.reverseGeocoder({
          location:{
            latitude: res.latitude,
            longitude: res.longitude
          },
          success: res => {
            let city = res.result.address_component.city
            console.log(city)
            this.setData({
              city: city,
              locationTipsText: ""
            })
            this.getNow()
          }
        })
      },
      fail: () => {
        wx.showToast({
          title: 'fail',
        })
      }
    })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.getNow(() => {
      wx.stopPullDownRefresh()
    })
  }

})