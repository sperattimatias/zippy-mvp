class TripOffer {
  final String tripId;
  final double pickupLat;
  final double pickupLng;
  final int proposedPrice;

  TripOffer({
    required this.tripId,
    required this.pickupLat,
    required this.pickupLng,
    required this.proposedPrice,
  });

  factory TripOffer.fromMap(Map<String, dynamic> map) {
    final pickup = (map['pickup'] ?? {}) as Map<String, dynamic>;
    return TripOffer(
      tripId: map['tripId']?.toString() ?? '',
      pickupLat: (pickup['lat'] as num?)?.toDouble() ?? 0,
      pickupLng: (pickup['lng'] as num?)?.toDouble() ?? 0,
      proposedPrice: (map['proposed_price'] as num?)?.toInt() ?? 0,
    );
  }
}
