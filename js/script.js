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
            $routeProvider.when('/recipes/create', {
                templateUrl: 'pages/page-create-recipe.html',
                controller: 'StorageCtrl'
            });
            $routeProvider.when('/ideas', {
                templateUrl: 'pages/page-ideas-carousel.html',
                controller: 'Carousel'
            });
            $routeProvider.when('/recipes/page-recipe/:item', {
                templateUrl: 'pages/page-recipe.html',
                controller: 'StorageCtrl'
            });
            $routeProvider.when('/recipes/page-edit/:item', {
                templateUrl: 'pages/page-edit.html',
                controller: 'editCtrl'
            });
            $routeProvider.when('/ideas-edit/:item', {
                templateUrl: 'pages/page-ideas-edit.html',
                controller: 'ideasEditCtrl'
            });
            $routeProvider.otherwise({
                redirectTo: '/ideas'
            });
        }]);

    app.controller('Carousel', function($scope, $http) {

        $http.get("https://jsonblob.com/api/jsonBlob/56d5dccfe4b01190df523cce").then(function(response) {
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
                localStorage.setItem(recipeId, JSON.stringify(recipe));
                alert('Рецепт сохранен')
            }
        };

        $scope.loadRecipe = function (key) {
                $scope.recipe = JSON.parse(localStorage.getItem(key));
            };


        $scope.$on('$viewContentLoaded', function() {
            if($routeParams.item){
                $scope.loadRecipe($routeParams.item.split(':')[1]);
            }
        });

        $scope.like = function () {
            var thisItem = $routeParams.item.split(':')[1];
            if($scope.recipe.like === 1){
               delete $scope.recipe.like;
                localStorage.setItem(thisItem, JSON.stringify($scope.recipe));
            } else {
                $scope.recipe.like = 1;
                localStorage.setItem(thisItem, JSON.stringify($scope.recipe));
            }
        };

        $scope.plane = function () {
            var thisItem = $routeParams.item.split(':')[1];
            if($scope.recipe.plane === 1){
                delete $scope.recipe.plane;
                localStorage.setItem(thisItem, JSON.stringify($scope.recipe));
            } else {
                $scope.recipe.plane = 1;
                localStorage.setItem(thisItem, JSON.stringify($scope.recipe));
            }
        };

        $scope.purchase = function () {
            var thisItem = $routeParams.item.split(':')[1];
            if($scope.recipe.purchase === 1){
                delete $scope.recipe.purchase;
                localStorage.setItem(thisItem, JSON.stringify($scope.recipe));
            } else {
                $scope.recipe.purchase = 1;
                localStorage.setItem(thisItem, JSON.stringify($scope.recipe));
            }
        };

        $scope.addInput = function(){
            $scope.inputIngredients.push({});
        };

    });

    app.controller('editCtrl', function($scope, $localStorage, $routeParams){
        var thisItem = $routeParams.item.split(':')[1];
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
            $scope.loadRecipe($routeParams.item.split(':')[1]);
        });

        $scope.deleteRecipe = function () {
            localStorage.removeItem($routeParams.item.split(':')[1]);
            alert('Рецепт удален')
        };

    });

        app.controller('ideasEditCtrl', function($scope, $localStorage, $http, $routeParams){
            $http.get("https://jsonblob.com/api/jsonBlob/56d5dccfe4b01190df523cce").then(function(response) {
                var thisItem = new Date().getTime();
                $scope.myData = response.data.recipes;
                $scope.ideas = $scope.myData[$routeParams.item.split(':')[1]];
                var recipeId = new Date().getTime();

                $scope.saveRecipe = function(){
                    recipe = {
                        id : recipeId,
                        name : $scope.ideas.name,
                        description : $scope.ideas.description,
                        photo : $scope.ideas.photo,
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

    app.controller('NavigationCtrl', function ($scope, $location) {
        $scope.getClass = function (path) {
            if ($location.path().substr(0, path.length) === path) {
                return 'active-navi';
            } else {
                return '';
            }
        }
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
                }
            }
            return value + (tail || ' …');
        };
    });

