const BLOOD_COMPATIBILITY = {
    'A+': ['A+', 'A-', 'O+', 'O-'],
    'O+': ['O+', 'O-'],
    'B+': ['B+', 'B-', 'O+', 'O-'],
    'AB+': ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    'A-': ['A-', 'O-'],
    'O-': ['O-'],
    'B-': ['B-', 'O-'],
    'AB-': ['AB-', 'A-', 'B-', 'O-']
};

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    
    const a = 
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
}

function findMatches(request, donors, maxRadiusKm = 50) {
    const compatibleTypes = BLOOD_COMPATIBILITY[request.requiredType];
    const urgencyWeights = { 'Critical': 100, 'Moderate': 50, 'Routine': 10 };
    const requestWeight = urgencyWeights[request.urgency] || 10;

    return donors
        .filter(donor => {
            const isCompatible = compatibleTypes.includes(donor.bloodType);
            const isAvailable = donor.status === 'Available';
            return isCompatible && isAvailable;
        })
        .map(donor => {
            const distance = calculateDistance(
                request.latitude, request.longitude, 
                donor.latitude, donor.longitude
            );
            const score = requestWeight - (distance * 1.5); 
            return { 
                ...donor, 
                distance: parseFloat(distance.toFixed(2)), 
                score: parseFloat(score.toFixed(2)) 
            };
        })
        .filter(donor => donor.distance <= maxRadiusKm)
        .sort((a, b) => b.score - a.score);
}

module.exports = { findMatches };