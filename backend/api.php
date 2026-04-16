<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Content-Type: application/json; charset=UTF-8");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$inputData = json_decode(file_get_contents('php://input'), true);

if (!isset($inputData['lat1']) || !isset($inputData['lon1']) || !isset($inputData['lat2']) || !isset($inputData['lon2'])) {
    http_response_code(400);    
    echo json_encode(["error" => "Brak wymaganych współrzędnych geograficznych."]);
    exit();
}

$lat1 = floatval($inputData['lat1']);
$lon1 = floatval($inputData['lon1']);
$lat2 = floatval($inputData['lat2']);
$lon2 = floatval($inputData['lon2']);

function calculateDistance($lat1, $lon1, $lat2, $lon2) {
    $earthRadiusMeters = 6371000; 

    $lat1Rad = deg2rad($lat1);
    $lat2Rad = deg2rad($lat2);
    $deltaLat = deg2rad($lat2 - $lat1);
    $deltaLon = deg2rad($lon2 - $lon1);

    $a = sin($deltaLat / 2) * sin($deltaLat / 2) +
         cos($lat1Rad) * cos($lat2Rad) *
         sin($deltaLon / 2) * sin($deltaLon / 2);
    $c = 2 * atan2(sqrt($a), sqrt(1 - $a));

    return $earthRadiusMeters * $c;
}

$distanceMeters = calculateDistance($lat1, $lon1, $lat2, $lon2);
$distanceKilometers = $distanceMeters / 1000;
$kilometersToMiles = 0.621371;
$distanceMiles = $distanceKilometers * $kilometersToMiles;

echo json_encode([
    "success" => true,
    "distance_meters" => round($distanceMeters, 5),
    "distance_kilometers" => round($distanceKilometers, 5),
    "distance_miles" => round($distanceMiles, 5)
]);