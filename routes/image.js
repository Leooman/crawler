var express = require('express');
var router = express.Router();

var fs = require('fs');
var request = require("request");
var cheerio = require("cheerio");
var mkdirp = require('mkdirp');

var url = 'http://www.ivsky.com/bizhi/nvxing/index_';
var dir = './public/images';

mkdirp(dir, function(err) {
    if(err){
        console.log(err);
    }
});

var num=1;
var urlData=[];
for(var i=1;i<=10;i++){
    request(url+i+'.html', function(error, response, body) {
        if(!error && response.statusCode == 200) {
            var $ = cheerio.load(body);
            $('.il_img img').each(function() {
                var src = $(this).attr('src');
                var url=  num +src.substr(-4,4);
                var data={address:url};
                console.log('正在下载' + src);
                download(src, dir,url);
                console.log('下载完成');
                urlData.push(data);
                num++;
                return urlData;
            });
        }
        var ws=fs.createWriteStream("./public/url.json");
		ws.write(JSON.stringify(urlData));
		ws.end();
    });
}
var download = function(url, dir, filename){
    request.head(url, function(err, res, body){
        request(url).pipe(fs.createWriteStream(dir + "/" + filename));
    });
};
/* GET image page. */
router.get('/', function(req, res) {
  res.render('image', { title: 'Image Crawler' });
});

module.exports = router;
