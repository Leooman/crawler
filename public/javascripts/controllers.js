angular.module('picApp',['directives'])
        .controller('picController',function($scope,$http){
            $http.get('url.json').success(function(res){
                $scope.urls=res;
            }).error(function(){
                console.log('error!')
            })
        })