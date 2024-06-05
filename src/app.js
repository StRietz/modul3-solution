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

        controller.getMenuItems = function () {
            console.log("das zu suchende Objekt soll enthalten: " & controller.searchTerm)
            var promise = MenuSearchService.getMatchedMenuItems(controller.searchTerm);

            promise.then(function (result) {
                console.log("Controller Ergebis: " + result)
                controller.found = result;
                return controller.found;
            })
                .catch(function (error) {
                    console.log("es gab einen Fehler im Controller: " + error);
                });
        }

        controller.removeMenuItem = function (index) {
            controller.found.splice(index, 1);
        }
    }

    MenuSearchService.$inject = ["$http", "ApiBasePath"]

    function MenuSearchService($http, ApiBasePath) {
        var service = this;

        service.getMatchedMenuItems = function (searchTerm) {
            return $http({
                method: "GET",
                url: (ApiBasePath + "/menu_items.json"),
            })
                .then(function (result) {
                    var filteredItems = [];
                    console.log("Was steht in result im Service: " + result.data);
                    var foundItems = result.data;//[{name: "katze"}, {short_name: "katzenfutte"},{description:"lekere Katze"}];//
                    console.log("Was steht in foundItems im Service: " + foundItems);
                    for (var category in foundItems) {
                        filteredItems.push(foundItems[category].menu_items.filter(item => item.description.toLowerCase().includes(searchTerm.toLowerCase())))
                    }

                    console.log("Was steht in filteresItems im Service: " + filteredItems)
                    return filteredItems.flat();
                })
                .catch(function (result) {
                    console.error("es gab einen Fehler im Service: " + result);
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
                onRemote: '&'
            },
            controller: NarrowItDownController,
            controllerAs: "controller",
            bindToController: true
        };
        return ddo;
    };
})
();
