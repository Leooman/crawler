angular.module('directives',[])
	.directive('picture',function($window){
		return {
			restrict:'A',
			transclude:true,
			link:function(scope,ele,attr){
				scope.parent=ele.parent();
				scope.img_width=document.querySelector('.box').offsetWidth;
				scope.client_width=document.documentElement.clientWidth || document.body.clientWidth;			
				scope.column=Math.floor(scope.client_width/scope.img_width);
				scope.parent.css({
					width:scope.img_width*scope.column+'px'
				})
				scope.num=parseInt(attr.num)+1;
				scope.scroll=function(){
					scope.img_html='';
					scope.client_height=document.documentElement.clientHeight || document.body.clientHeight;
					scope.scroll_top=document.documentElement.scrollTop || document.body.scrollTop;
					scope.container_height=document.querySelector('#container').offsetHeight;
					if(scope.container_height==scope.scroll_top+scope.client_height){
						for(var i=0;i<scope.column;i++){
							scope.img_html+='<div class="box"><div class="box_img"><img src="/images/'+scope.num+'.jpg"></div></div>';
							scope.num++;
						}
						scope.parent.append(scope.img_html);
					}
					return scope.num;
				}
				$window.onscroll=function(){
					if(scope.num>180){
						return false;
					}else{
						scope.scroll();
					}

				}
				
			}
		}
	})