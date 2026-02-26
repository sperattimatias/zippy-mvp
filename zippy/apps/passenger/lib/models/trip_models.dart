enum TripUiState {
  idle,
  requested,
  accepted,
  inProgress,
  completed,
}

class TripRequest {
  final String origin;
  final String destination;
  final List<String> tags;

  TripRequest({required this.origin, required this.destination, required this.tags});

  Map<String, dynamic> toJson() => {
        'origin': {'lat': -33.46, 'lng': -61.48},
        'destination': {'lat': -33.44, 'lng': -61.50},
        'proposed_price': 2100,
        'notes': tags.join(','),
      };
}
