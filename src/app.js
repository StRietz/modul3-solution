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
        controller.found = [];
        controller.message = "";

        controller.getMenuItems = function () {
            if (controller.searchTerm.trim() !== "") {
                var promise = MenuSearchService.getMatchedMenuItems(controller.searchTerm);

                promise.then(function (result) {
                    if (result && result.length > 0) {
                        console.log("Controller Ergebis: " + result)
                        controller.found = result;
                        controller.message = "";
                    } else {
                        console.log("Nothing Found!");
                        controller.found = [];
                        controller.message = "Nothing Found!";
                    }
                })
                    .catch(function (error) {
                        console.log("Something went wrong: " + error);
                        controller.found = [];
                        controller.message = "Nothing Found!";
                    });
            } else {
                controller.found = [];
                controller.message = "Nothing Found!";
            }
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
                    var foundItems = result.data;

                    for (var category in foundItems) {
                        filteredItems.push(foundItems[category].menu_items.filter(item =>
                            item.description.toLowerCase().includes(searchTerm.toLowerCase())))
                    }
                    return filteredItems.flat();
                })
                .catch(function (result) {
                    console.error("Something went wrong: " + result);
                });
        }
    }

    function FoundItemsDirective() {
        var ddo = {
            restrict: 'E',
            templateUrl: "foundItems.html",
            scope: {
                items: '<',
                onRemove: '&',
            },
            controller: NarrowItDownController,
            controllerAs: 'controller',
            bindToController: true
        };
        return ddo;
    }
})();
