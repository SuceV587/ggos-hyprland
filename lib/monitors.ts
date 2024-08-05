import * as Utils from 'resource:///com/github/Aylur/ags/utils.js'
import env from '../env.js'
import Gtk from "gi://Gtk?version=3.0"
import Gdk from "gi://Gdk"
import GLib from "gi://GLib?version=2.0"

interface monitorType {
  id: never
}

class Monitors {
  mainMonitorId = 0
  mainMonitorWidth = 0
  mainMonitorHeight = 0
  allMonitorId = []
  constructor() {
    const { mainMonitorId, mainMonitorWidth, mainMonitorHeight, allMonitorId } = this.setMonitorInfo()

    this.mainMonitorId = mainMonitorId
    this.mainMonitorWidth = mainMonitorWidth
    this.mainMonitorHeight = mainMonitorHeight
    this.allMonitorId = allMonitorId

  }


  setMonitorInfo = () => {
    const monitorInfo = JSON.parse(Utils.exec(`hyprctl monitors -j`))

    //获取主屏幕id
    const mainMonitorIdSet = env['mainMonitorIdSet'] || -1

    const mainMonitorId = this.getMainMonitorId(monitorInfo, mainMonitorIdSet)

    const mainMonitorWidth = this.getMainMonitorWidth(monitorInfo, mainMonitorId)

    const mainMonitorHeight = this.getMainMonitorheight(monitorInfo, mainMonitorId)

    const allMonitorId = this.getAllMonitorId(monitorInfo)

    return { mainMonitorId, mainMonitorWidth, mainMonitorHeight, allMonitorId }

  }

  getAllMonitorId = (monitorInfo) => {

    const monitorId = []
    monitorInfo.map(item => {
      monitorId.push((item as monitorType).id)
    })
    return monitorId
  }


  getMainMonitorId = (monitorInfo, mainMonitorIdSet) => {

    //如果是单显示器,则主显示器就是单显示器
    if (monitorInfo.length == 1) {
      const monitor = monitorInfo[0]
      return monitor['id']
    }


    //多显示器,先寻找是否存在mainMonitorId的显示器,有就设置为主显示器。
    if (mainMonitorIdSet) {
      const isSet = monitorInfo.find(item => {
        return item.id == mainMonitorIdSet
      })

      if (isSet) {
        return mainMonitorIdSet
      }
    }


    //没有就选择分辨率最大的作为主显示器
    let maxWidth = 0
    let maxWidthMonitorId = 0

    monitorInfo.map(item => {
      if (item.width > maxWidth) {
        maxWidth = item.width
        maxWidthMonitorId = item.id
      }
    })

    return maxWidthMonitorId
  }

  getMainMonitorWidth = (monitorInfo, mainMonitorId) => {

    const isSet = monitorInfo.find(item => {
      return item.id == mainMonitorId
    })


    if (isSet) {
      return isSet['width']
    }

    return 1920
  }

  getMainMonitorheight = (monitorInfo, mainMonitorId) => {

    const isSet = monitorInfo.find(item => {
      return item.id == mainMonitorId
    })


    if (isSet) {
      return isSet['height']
    }

    return 1440
  }


  forMonitors = (widget) => {
    const n = Gdk.Display.get_default()?.get_n_monitors() || 1
    return this.range(n, 0).map(widget).flat(1)
  }


  range = (length, start = 1) => {
    return Array.from({ length }, (_, i) => i + start)
  }

}

export default new Monitors()
