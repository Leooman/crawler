const fs = require("fs")
const config = require("./src/config")
const crawl = require("./src/crawl")
const ora = require('ora')
const chalk = require('chalk')
const frame = ["[    ]","[=   ]","[==  ]","[=== ]","[ ===]","[  ==]","[   =]","[    ]","[   =]","[  ==]","[ ===]","[====]","[=== ]","[==  ]","[=   ]"]
let spinner = null

const main = async pageNum => {
  crawl.mkdirSaveFolder()
  spinner = ora({
    text:chalk.cyan(`正在连接目标地址... ...`),
    color:"cyan",
    spinner:{
      frames:frame
    }
  }).start()
  // 根据页码获取页面对象
  let pageUrl = `${config.originPath}${pageNum}.html`
  const page = await crawl.getPage(pageUrl)
  spinner.info(`==========================当前页码：第${pageNum}页==========================`)
  // 获取页面内的相册list
  let albumList = crawl.getAlbumList(page)
  downloadAlbumList(albumList)
}

// 下载本页面的所有相册
const downloadAlbumList = async (list) => {
  let index = 0
  for (let i = 0; i < list.length; i++) {
    // 下载相册
    await downloadAlbum(list[i])
    index++
  }
  // 判断本页相册是否下载完毕 
  if (index === list.length) {
    console.log(`==========================第${config.currentPage}页下载完成，共${index}个图集========================== `)
    if (config.hasNext) {
      // 进行下一页的相册爬取
      main(++config.currentPage)
    }
  }
}

// 下载相册
const downloadAlbum = async album => {
  // 过滤相册名称中不符合命名规则的部分字符
  album.name = album.name.replace(/[:"\*\|\/]/g, '')
  // 判断相册是否存在
  let folderPath = `${config.savePath}/${album.name}`
  if (fs.existsSync(folderPath)) {
    
  } else {
    fs.mkdirSync(folderPath)
    spinner = ora({
      text:chalk.cyan(`正在下载图集：${album.name}`),
      color:"cyan",
      spinner:{
        frames:frame
      }
    }).start()
    // 获取图片所在页面
    while (config.hasPicNext) {
      let url = config.hasNextPic == 1 ? album.url : album.url.replace(/(.*).html/,`$1_${config.hasNextPic}.html`)
      let imagePage = await crawl.getPage(url)
      let imageSrc = crawl.getImageSrc(imagePage)
      await crawl.downloadImage(album, imageSrc, `${folderPath}/${config.hasNextPic}.jpg`)
    }
    config.hasNextPic = 1
    config.hasPicNext=true
    spinner.succeed(chalk.green(`${album.name}下载完成!`))
  }
}

main(config.currentPage)