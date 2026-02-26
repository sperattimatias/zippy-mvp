import 'dart:async';
import 'package:flutter/material.dart';
import '../services/api_service.dart';

class TripActiveScreen extends StatefulWidget {
  final String tripId;
  final ApiService apiService;
  final String token;
  final String driverId;

  const TripActiveScreen({
    super.key,
    required this.tripId,
    required this.apiService,
    required this.token,
    required this.driverId,
  });

  @override
  State<TripActiveScreen> createState() => _TripActiveScreenState();
}

class _TripActiveScreenState extends State<TripActiveScreen> {
  Timer? _timer;
  String _status = 'En viaje';
  double _lat = -33.4512;
  double _lng = -61.4921;

  @override
  void initState() {
    super.initState();
    _timer = Timer.periodic(const Duration(seconds: 5), (_) async {
      _lat += 0.0001;
      _lng -= 0.0001;
      await widget.apiService.sendLocation(
        tripId: widget.tripId,
        token: widget.token,
        driverId: widget.driverId,
        lat: _lat,
        lng: _lng,
        heading: 180,
        speed: 32,
      );
      if (mounted) setState(() {});
    });
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Trip activo ${widget.tripId}')),
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(_status, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 10),
            Text('Location updates cada 5s: $_lat, $_lng'),
            const Spacer(),
            FilledButton.tonal(
              onPressed: () async {
                await widget.apiService.completeTrip(tripId: widget.tripId, token: widget.token, driverId: widget.driverId);
                if (!mounted) return;
                setState(() => _status = 'Completado');
                ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('Trip completado')));
              },
              child: const Text('Complete'),
            ),
          ],
        ),
      ),
    );
  }
}
