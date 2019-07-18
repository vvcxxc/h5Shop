/**
 * cookie
 */
export let Cookie = {
  set(name, val, expires, path) {
    var str = name + '=' + val
    if (expires) {
      str += ';expires=' + expires.toUTCString()
    }
    if (path) {
      str += ';path=' + path
    }
    document.cookie = str
  },
  remove(name, path) {
    var now = new Date()
    now.setDate(now.getDate() - 7)
    this.set(name, 'null', now, path)
  },
  get(name) {
    var res = ''
    var cookies = document.cookie
    if (!cookies.length) return res
    cookies = cookies.split('; ')
    for (var i = 0; i < cookies.length; i++) {
      var arr = cookies[i].split('=')
      if (arr[0] === name) {
        res = arr[1]
        break
      }
    }
    return res
  }
}
