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
                console.log("Controller Ergebis: " + result)
                controller.found=result;
                return controller.found;
            })
                .catch(function (error) {
                    console.log("es gab einen Fehler im Controller: " + error);
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
                console.log("Was steht in result im Service: " + result)
                var foundItems = [{name: "katze"}, {short_name: "katzenfutte"},{description:"lekere Katze"}];//result.data.menu_items;
                console.log("Was steht in foundItems: " + foundItems)
                foundItems.forEach(function (item){
                    if(item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase())){
                        filteredItems.push(item);
                    }
                });
                console.log("Was steht in filteresItems: "+ filteredItems)
                return filteredItems;
            })
            .catch(function (result){
                console.error("es gab einen Fehler im Service: " +result);
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
