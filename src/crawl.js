const config = require('./config')
const fs = require('fs')
const cheerio = require('cheerio')
const axios = require('axios')

//请求超时时限 我设置500毫秒
axios.defaults.timeout =  500;

//请求次数
axios.defaults.retry = 4;

//请求的间隙
axios.defaults.retryDelay = 1000;


/*添加响应拦截器*/
axios.interceptors.response.use(function(response){
  return response;
  }, function(error){
  //请求超时的之后，抛出 error.code = ECONNABORTED的错误..错误信息是 timeout of  xxx ms exceeded
  if(error.code == 'ECONNABORTED' && error.message.indexOf('timeout')!=-1){
    let config = error.config;
    config.__retryCount = config.__retryCount || 0;
    if(config.__retryCount >= config.retry) {
        // Reject with the error
        //window.location.reload();
        return Promise.reject(error)
    }
    // Increase the retry count
    config.__retryCount += 1

    // Create new promise to handle exponential backoff
    let backoff = new Promise(function(resolve) {
        setTimeout(function() {
            resolve()
        }, config.retryDelay || 1)
    })
    return backoff.then(function() {
        return axios(config);
    })
  }else{
    return Promise.reject(error)
  }
})
module.exports = {
  async getPage (url) {
    return {
      res:await axios.get(url)
    }
  },
  getAlbumList (page) {
    let list = []
    const $ = cheerio.load(page.res.data)
    $('.Left_list_cont .tab_box ul li a').each((index, item) => {
      let album = {
        name: $(item).find('p').text(), // 相册名称
        url: $(item).attr('href'), // 相册地址
        // count:parseInt($(item).find('.shuliang').text().match(/\d+/)[0])// 获取相册中图片总数量
      }
      list.push(album)
    })
    if($('.next').length){
      config.hasNext = true
    }else{
      config.hasNext = false
    }
    return list
  },
  // 获取图片地址
  getImageSrc (page) {
    let $ = cheerio.load(page.res.data)
    let imageSrc = $('.pic-large').attr('src')
    let currCount = parseInt($('.ptitle').find('span').text())
    let totalCount = parseInt($('.ptitle').find('em').text())
    config.hasNextPic = currCount == totalCount ? 1 : currCount+1
    config.hasPicNext = currCount == totalCount ? false : true
    return imageSrc
  },
  // 新建保存图片的文件夹
  mkdirSaveFolder () {
    if (!fs.existsSync(config.savePath)) {
      fs.mkdirSync(config.savePath)
      console.log(`文件保存路径：${config.savePath}`)
    }
  },
  // 下载图片到本地
  async downloadImage (album, imageSrc, fileName) {
    let headers = {
      Referer: album.url,
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/65.0.3325.19 Safari/537.36"
    }
    await axios({
      method: 'get',
      url: imageSrc,
      responseType: 'stream',
      headers
    }).then(function(response) {
      response.data.pipe(fs.createWriteStream(fileName))
    })
  }
}
