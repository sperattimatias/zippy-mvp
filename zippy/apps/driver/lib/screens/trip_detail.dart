import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';
import '../models/trip_offer.dart';
import '../services/api_service.dart';
import 'trip_active.dart';

class TripDetailScreen extends StatelessWidget {
  final TripOffer offer;
  final Map<String, dynamic> acceptedData;
  final ApiService apiService;
  final String token;
  final String driverId;

  const TripDetailScreen({
    super.key,
    required this.offer,
    required this.acceptedData,
    required this.apiService,
    required this.token,
    required this.driverId,
  });

  Future<void> _openGoogleMaps() async {
    final url = Uri.parse('https://www.google.com/maps/search/?api=1&query=${offer.pickupLat},${offer.pickupLng}');
    await launchUrl(url, mode: LaunchMode.externalApplication);
  }

  Future<void> _openWaze() async {
    final url = Uri.parse('https://waze.com/ul?ll=${offer.pickupLat},${offer.pickupLng}&navigate=yes');
    await launchUrl(url, mode: LaunchMode.externalApplication);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Trip ${offer.tripId}')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Estado: ${acceptedData['status']}', style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w600)),
            const SizedBox(height: 8),
            Text('Pickup: ${offer.pickupLat}, ${offer.pickupLng}'),
            const SizedBox(height: 12),
            Wrap(
              spacing: 10,
              children: [
                OutlinedButton.icon(onPressed: _openGoogleMaps, icon: const Icon(Icons.map), label: const Text('Abrir en Google Maps')),
                OutlinedButton.icon(onPressed: _openWaze, icon: const Icon(Icons.navigation), label: const Text('Abrir en Waze')),
              ],
            ),
            const Spacer(),
            FilledButton(
              onPressed: () async {
                await apiService.startTrip(tripId: offer.tripId, token: token, driverId: driverId);
                if (!context.mounted) return;
                Navigator.of(context).pushReplacement(
                  MaterialPageRoute(
                    builder: (_) => TripActiveScreen(
                      tripId: offer.tripId,
                      apiService: apiService,
                      token: token,
                      driverId: driverId,
                    ),
                  ),
                );
              },
              child: const Text('Start'),
            ),
          ],
        ),
      ),
    );
  }
}
