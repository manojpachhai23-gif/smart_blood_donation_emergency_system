const { findMatches } = require('./matcher');

const urgentRequest = {
    id: "REQ-992",
    requiredType: "A-",
    urgency: "Critical",
    latitude: 40.7128,
    longitude: -74.0060
};

const donorRegistry = [
    { id: "D-01", name: "Alice Smith", bloodType: "A-", status: "Available", latitude: 40.7306, longitude: -73.9352 },
    { id: "D-02", name: "Bob Jones", bloodType: "O-", status: "Available", latitude: 40.6500, longitude: -73.9500 },
    { id: "D-03", name: "Charlie Brown", bloodType: "AB+", status: "Available", latitude: 40.7128, longitude: -74.0060 },
    { id: "D-04", name: "Diana Prince", bloodType: "A-", status: "Available", latitude: 41.8781, longitude: -87.6298 },
    { id: "D-05", name: "Evan Wright", bloodType: "A-", status: "Deferred", latitude: 40.7120, longitude: -74.0050 }
];

const matches = findMatches(urgentRequest, donorRegistry, 50);

console.log(`--- MATCH RESULTS FOR REQUEST ${urgentRequest.id} (${urgentRequest.requiredType}) ---`);
if (matches.length === 0) {
    console.log("No compatible donors found nearby.");
} else {
    matches.forEach((donor, index) => {
        console.log(`${index + 1}. ${donor.name} | Type: ${donor.bloodType} | Distance: ${donor.distance} km | Match Score: ${donor.score}`);
    });
}