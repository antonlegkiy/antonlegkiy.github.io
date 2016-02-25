var app = angular.module('RecipesApp', ['ngRoute', 'ngStorage', 'ngSanitize']);

    app.config(['$routeProvider',
        function($routeProvider) {
            $routeProvider.when('/recipes', {
                templateUrl: 'pages/page-my-recipes.html',
                controller: 'StorageCtrl'
            });
            $routeProvider.when('/list', {
                templateUrl: 'pages/page-recipes-list.html',
                controller: 'StorageCtrl'
            });
            $routeProvider.when('/create', {
                templateUrl: 'pages/page-create-recipe.html',
                controller: 'StorageCtrl'
            });
            $routeProvider.when('/page-recipe', {
                templateUrl: 'pages/page-recipe.html',
                controller: 'StorageCtrl'
            });
            $routeProvider.when('/', {
                templateUrl: 'pages/page-ideas-carousel.html',
                controller: 'Carousel'
            });
            $routeProvider.when('/page-recipe/:item', {
                templateUrl: 'pages/page-recipe.html',
                controller: 'StorageCtrl'
            });
            $routeProvider.when('/page-edit/:item', {
                templateUrl: 'pages/page-edit.html',
                controller: 'editCtrl'
            });
            $routeProvider.when('/ideas-edit/:item', {
                templateUrl: 'pages/page-ideas-edit.html',
                controller: 'ideasEditCtrl'
            });
            $routeProvider.otherwise({
                redirectTo: '/'
            });
        }]);

    app.controller('Carousel', function($scope, $http) {

        $http.get("https://jsonblob.com/api/jsonBlob/56c089b3e4b01190df4ef1ce").then(function(response) {
            $scope.myData = response.data.recipes;
            $scope.myData[0].active = true;
        });
    });

    app.controller('StorageCtrl', function ($scope, $localStorage, $routeParams) {

        var recipe = {};
        $scope.inputIngredients = [{}];
        $scope.listOfRecipes = [];

        for (var i=0,key,value; i < localStorage.length; i++) {
            key = localStorage.key(i);
            value = JSON.parse(localStorage.getItem(key));
            $scope.listOfRecipes.push(value);
        }

        $scope.saveRecipe = function () {
            var recipeId = new Date().getTime();
           recipe = {
                id : recipeId,
                name : $scope.name,
                description : $scope.description,
                photo : $scope.photo,
                time : $scope.time,
                ingredients : $scope.inputIngredients,
                instruction : $scope.instruction
            };
            if($scope.recipeForm.$valid){
                //$localStorage.recipe = recipe;
                localStorage.setItem(recipeId, JSON.stringify(recipe));
                alert('Рецепт сохранен')
            }
        };

        $scope.loadRecipe = function (key) {
                //$scope.recipe = $localStorage.recipe;
                $scope.recipe = JSON.parse(localStorage.getItem(key));
            };


        $scope.$on('$viewContentLoaded', function() {
            $scope.loadRecipe(location.href.split(':')[3]);
        });

        $scope.like = function () {
            var thisItem = location.href.split(':')[3];
            if($scope.recipe.like === 1){
               delete $scope.recipe.like;
                localStorage.setItem(thisItem, JSON.stringify($scope.recipe));
            } else {
                $scope.recipe.like = 1;
                localStorage.setItem(thisItem, JSON.stringify($scope.recipe));
            }
        };

        $scope.plane = function () {
            var thisItem = location.href.split(':')[3];
            if($scope.recipe.plane === 1){
                delete $scope.recipe.plane;
                localStorage.setItem(thisItem, JSON.stringify($scope.recipe));
            } else {
                $scope.recipe.plane = 1;
                localStorage.setItem(thisItem, JSON.stringify($scope.recipe));
            }
        };

        $scope.purchase = function () {
            var thisItem = location.href.split(':')[3];
            if($scope.recipe.purchase === 1){
                delete $scope.recipe.purchase;
                localStorage.setItem(thisItem, JSON.stringify($scope.recipe));
            } else {
                $scope.recipe.purchase = 1;
                localStorage.setItem(thisItem, JSON.stringify($scope.recipe));
            }
        };

        $scope.addInput = function(){
            $scope.inputIngredients.push({})
            console.log($scope.inputIngredients)
        };

    });

    app.controller('editCtrl', function($scope, $localStorage){
        var thisItem = location.href.split(':')[3];
        $scope.ingredientsList = [];
        $scope.inputIngredients = [];

        $scope.saveRecipe = function(){
            if($scope.recipeForm.$valid) {
                localStorage.setItem(thisItem, JSON.stringify($scope.recipe));
                alert('Изменения сохранены')
            }
        };

        $scope.loadRecipe = function (key) {
            $scope.recipe = JSON.parse(localStorage.getItem(key));
        };
        $scope.$on('$viewContentLoaded', function() {
            $scope.loadRecipe(location.href.split(':')[3]);
        });

        $scope.deleteRecipe = function () {
            localStorage.removeItem(location.href.split(':')[3]);
            alert('Рецепт удален')
        };
    });

        app.controller('ideasEditCtrl', function($scope, $localStorage, $http){
            $http.get("https://jsonblob.com/api/jsonBlob/56c089b3e4b01190df4ef1ce").then(function(response) {
                var thisItem = new Date().getTime();
                $scope.myData = response.data.recipes;
                $scope.ideas = $scope.myData[location.href.split(':')[3]];
                var recipeId = new Date().getTime();

                $scope.saveRecipe = function(){
                    recipe = {
                        id : recipeId,
                        name : $scope.ideas.title,
                        description : $scope.ideas.description,
                        photo : $scope.ideas.photoUrl,
                        ingredients :$scope.ideas.ingredients ,
                        instruction : $scope.ideas.instruction
                    };
                    if($scope.recipeForm.$valid) {
                        localStorage.setItem(thisItem, JSON.stringify(recipe));
                        alert('Рецепт сохранен в "Мои рецепты"')
                    }
                };
            });
        });

    app.filter('cut', function () {
        return function (value, wordwise, max, tail) {
            if (!value) return '';

            max = parseInt(max, 10);
            if (!max) return value;
            if (value.length <= max) return value;

            value = value.substr(0, max);
            if (wordwise) {
                var lastspace = value.lastIndexOf(' ');
                if (lastspace != -1) {
                    value = value.substr(0, lastspace);
                };
            };
            return value + (tail || ' …');
        };
    });

