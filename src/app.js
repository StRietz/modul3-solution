(function () {
    'use strict';

    angular.module('NarrowItDownApp', [])
        .controller('NarrowItDownController', NarrowItDownController)
        .service('MenuSearchService', MenuSearchService)
        .directive("foundItems", FoundItemsDirective)
        .constant('ApiBasePath', "https://coursera-jhu-default-rtdb.firebaseio.com");

    NarrowItDownController.$inject = ['MenuSearchService'];

    function NarrowItDownController(MenuSearchService) {
        var controller = this;
        controller.searchTerm = "";
        controller.found = null;
        
        controller.getMenueItem =function ()
        {
            var promise = MenuSearchService.getMatchedMenuItems(controller.searchTerm);

            promise.then(function (result) {
                controller.found=result;
                console.log(result.data)
                return controller.found;
            })
                .catch(function (error) {
                    console.log(error);
                });
        }
        
        controller.removeMenueItem = function(index) {
            controller.found.splice(index,1);
        }
    }

    MenuSearchService.$inject=["$http", "ApiBasePath"]
    function MenuSearchService($http, ApiBasePath) {
        var service = this;
        
        service.getMatchedMenuItems = function (searchTerm) {
            return $http({
                method: "GET",
                url: (ApiBasePath + "/menu_items.json"),
            })
            .then(function (result){
                var filteredItems = [];
                var foundItems = result.data.menu_items;
                
                foundItems.forEach(function (item){
                    if(item.description.toLowerCase().includes(searchTerm.toLowerCase())){
                        filteredItems.push(item);
                    }
                });
                return filteredItems;
            })
            .catch(function (result){
                console.error(result);
            });
            return service;
        }
    }

    FoundItemsDirective.$inject = [];

    function FoundItemsDirective() {
        var ddo = {
            restrict: "E",
            templateUrl: "foundItems.html",
            scope: {
                items: "<",
            },
            controller: NarrowItDownController,
            controllerAs: "controller",
            bindToController: true
        };
        return ddo;
    };
})();
