<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->group('', ['filter' => 'jwt'], function($routes) {
    $routes->resource('items', ['controller' => 'ItemController']);
    $routes->resource('suppliers', ['controller' => 'SupplierController']);
    $routes->resource('locations', ['controller' => 'LocationController']);
    $routes->resource('stock-movements', ['controller' => 'StockMovementController']);
});