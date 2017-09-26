var cheerio=require('cheerio')
var request=require('request')
var fs=require('fs')
var Iconv=require('iconv-lite')
var url='https://m.fang.com/zhishi/?c=zhishi&a=ajaxBuyTest&src=client&cityname='
/*function requestData(url,id){
	var p = new Promise(function(resolve, reject){
		var city=result[id]['city'];
		var encode=result[id]['encode'];
		if(id<result.length){
			request({
        		uri:url+result[id]['encode'],
        		method:'GET',
        		encoding:'binary'
        	},function(error,response,body){
        		if(!error && response.statusCode==200){
        			body = new Buffer(body, 'binary');
			    	var result = Iconv.decode(body,'gbk');
			        var $=cheerio.load(result);
			        var item={
			        	city:name,
			        	encode:encode,
						header:'',
						detail:[]
					};
					
					item['header']=$('.gfcs-h p').text();
					var li=$('.gfcs-c li a');
					for(var k=0;k<li.length;k++){
						item['detail'].push($(li[k]).text())
					}
					row.push(item)
					var writeStream=fs.createWriteStream('row.json');
					writeStream.write(JSON.stringify(row))
    				writeStream.end();
		        }
		    })
			resolve(count+=1)
		}else{

			reject('none');
		}
	})
}*/

var result=JSON.parse(fs.readFileSync('./row.json'));
var row=[],count=0,zone=[];
for(var i=0;i<result.length;i++){
	console.log(result[i].detail)
	zone.concat(result[i].detail)
}
// console.log(zone)
/*for(var i=0;i<result.length;i++){	
	requestData(url,i)
		
}*/

        		