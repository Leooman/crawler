var express = require('express');
var router = express.Router();
var cheerio=require('cheerio')
var request=require('request')
var fs=require('fs')
var url='http://sou.zhaopin.com/jobs/searchresult.ashx' +
    '?bj=160000&sj=864&jl=%E5%8C%97%E4%BA%AC&sm=0&ct=-1&we=-1&isfilter=1&p=1&sf=-1&st=-1'
request(url,function(error,response,body){
    if(!error && response.statusCode==200){
        var $=cheerio.load(body)
        var tables=$('table:not(:first-child)')
        var zpdata=[]
        tables.map(function(){
            var item=$(this)
            var position=item.find('.zwmc').text().trim()
            var positionURL=item.find('.zwmc a').attr('href')
            var company=item.find('.gsmc').text().trim()
            var price=item.find('.zwyx').text().trim()
            var address=item.find('.gzdd').text().trim()
            var time=item.find('.gxsj').text().trim()
            var detail=item.find('.newlist_deatil_last').text().trim()
            var data={
                position:position,
                positionURL:positionURL,
                company:company,
                price:price,
                address:address,
                time:time,
                detail:detail
            }
            zpdata.push(data)
        })
        var writeStream=fs.createWriteStream('public/data.json');
        writeStream.write(JSON.stringify(zpdata))
        writeStream.end();
    }
})
/* GET home page. */
router.get('/', function(req, res) {
  res.render('index');
});

module.exports = router;
