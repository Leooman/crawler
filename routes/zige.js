var express = require('express');
var router = express.Router();
var leo=require('./common');
var connection=require('./dbconfig')
var url = 'https://m.fang.com/zhishi/?c=zhishi&a=ajaxBuyTest';


leo.requestData(url,function($){
	$('.tcity').map(function(){
    	var cityName=$(this).text()
        var sql="INSERT INTO city (cityname)  VALUES (?)";
        connection.query(sql,[cityName])

        var zonelink=url+"&src=client&cityname="+leo.encodeToGb2312(cityName)
        leo.requestData(zonelink,function($){
            var currentRow=$('#row').val()
            var currentStartNum=$('#startNum').val()
            var currentEndNum=$('#endNum').val()
            var title=$('.gfcs-h p').text()
            $('.answerBtn').map(function(){
                var field=$(this).text()
                getPage(cityName,title,field,currentRow,currentStartNum,currentEndNum)
            })
        }) 
    })
})    

function getPage(cityName,title,field,currentRow,currentStartNum,currentEndNum){
    var steplink="https://m.fang.com/zhishi/?c=zhishi&a=ajaxGetPage&cityname="+encodeURI(cityName)+"&field="+encodeURI(field)+"&row="+currentRow+"&startNum="+currentStartNum+"&endNum="+currentEndNum
    leo.request(steplink,function($){
        var nextRow=$('#row').val()
        var nextStartNum=$('#startNum').val()
        var nextEndNum=$('#endNum').val()

        var sql="INSERT INTO process (cityname,title,field,currentRow,currentStartNum,currentEndNum,nextRow,nextStartNum,nextEndNum)  VALUES (?,?,?,?,?,?,?,?,?)";
        connection.query(sql,[cityName,title,field,currentRow,currentStartNum,currentEndNum,nextRow,nextStartNum,nextEndNum],function(err,res){
            if(res){
                console.log(cityName+"："+field+"crawl success")
            }
        })

        if(nextStartNum==nextEndNum){
            var result=encodeURIComponent($('.gfnum2 p').html())
            var conditions=[]
            $('.gfcondition li').map(function(){
                conditions.push($(this).text())
            })
            var sql="INSERT INTO result (cityname,result,conditions,row,startNum,endNum)  VALUES (?,?,?,?,?,?)";
            connection.query(sql,[cityName,result,conditions.join(';'),nextRow,nextStartNum,nextEndNum],function(err,res){
                if(res){
                    console.log(cityName+field+"：final result crawl success")
                }
            })
        }else{
            $('.answerBtn').map(function(){
                currentRow=nextRow
                currentStartNum=nextStartNum
                currentEndNum=nextEndNum
                var field=$(this).text()
                var title=$('.gfcs-h p').text()
                getPage(cityName,title,field,currentRow,currentStartNum,currentEndNum)
            })
        }
    })
}
/* GET zige page. */
router.get('/', function(req, res) {
  res.render('zige', { title: 'zige Crawler' });
});

module.exports = router;
