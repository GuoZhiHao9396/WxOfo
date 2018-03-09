// pages/index/index.js
var mapCtx = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    longitude: 0,
    latitude: 0,
  },
  onReady: function (res) {
    mapCtx = wx.createMapContext("map");
    console.log("初始位置", mapCtx);
  },
  bindcontroltap: function (e) {
    switch (e.controlId) {
      case 1:
        this.movetoCenter();
        break;
      case 2:
        if (this.timer) {
          wx.navigateBack({
            delta: 1
          })
        } else {
          wx.scanCode({
            success: () => {
              wx.showLoading({
                title: '正在获取密码',
              })
              wx.request({
                url: 'https://www.easy-mock.com/mock/5963172d9adc231f357c8ab1/ofo/getname',

                success: (res) => {
                  console.log(res);
                  wx.hideLoading();
                  wx.redirectTo({
                    url: '../scanResult/index?password=' + res.data.data.password + '&number=' + res.data.data.number,
                    success: () => {
                      wx.showToast({
                        title: '获取密码成功',
                        duration: 1000
                      })
                    }
                  })
                }
              })
            }
          })
        }
        break;
      case 3:
        wx.navigateTo({
          url: '../my/index',
        })
        break;
      case 4:
        wx.navigateTo({
          url: '../warn/index',
        })
        break;

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.timer = options.timer;
    wx.getLocation({
      success: (res) => {
        this.setData({
          longitude: res.longitude,
          latitude: res.latitude
        })
      },
    })
    wx.getSystemInfo({
      success: (res) => {
        this.setData({
          controls: [{
            id: 1,
            iconPath: "/images/location.png",
            position: {
              width: 40,
              height: 40,
              left: 20,
              top: res.windowHeight - 80
            },
            clickable: true
          }, {
            id: 2,
            iconPath: "/images/use.png",
            position: {
              width: 100,
              left: res.windowWidth / 2 - 50,
              top: res.windowHeight - 120
            },
            clickable: true
          }, {
            id: 3,
            iconPath: "/images/avatar.png",
            position: {
              width: 35,
              height: 35,
              left: res.screenWidth - 50,
              top: res.windowHeight - 80
            },
            clickable: true
          }, {
            id: 4,
            iconPath: "/images/warn.png",
            position: {
              width: 40,
              height: 40,
              left: res.screenWidth - 50,
              top: res.windowHeight - 175
            },
            clickable: true
          }, {
            id: 5,
            iconPath: "/images/marker.png",
            position: {
              width: 20,
              left: res.windowWidth / 2 - 10,
              top: res.windowHeight / 2 - 30
            }
          }]
        })
      },
    })
  },
  movetoCenter: function () {
    this.mapctx.moveToLocation();
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.mapctx = wx.createMapContext("map");
    this.movetoCenter();
  },
  bindtap: function (res) {
    console.log("点击了地图", res);
  },
  bindupdated: function (res) {
    console.log("地图渲染完成", res);
  },
  /**
   * 视野发生变化时触发
   */
  bindregionchange: function (res) {
    // 动作结束
    if(res.type=="end"){
      // 获取屏幕中心的经纬度
      mapCtx.getCenterLocation({
        success: function (res) {
          console.log("中心点经纬度", res);
          var latitude = res.latitude;
          var longitude = res.longitude;
          // 将经纬度转换成具体位置
          wx.request({
            url: 'http://apis.map.qq.com/ws/geocoder/v1/?location=' + latitude + ',' + longitude + '&key=腾讯地图key',
            success: (res) => {
              console.log("具体位置", res);
              wx.showModal({
                title: '当前位置',
                content: res.data.result.address,
                showCancel: false
              })
            }
          })

        }
      })
    }
   
  }
})