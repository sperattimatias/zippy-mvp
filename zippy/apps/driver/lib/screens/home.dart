import 'dart:async';
import 'package:flutter/material.dart';
import '../models/trip_offer.dart';
import '../services/api_service.dart';
import '../services/realtime_service.dart';
import 'about.dart';
import 'trip_detail.dart';

class HomeScreen extends StatefulWidget {
  final ApiService apiService;
  final RealtimeService realtimeService;
  final String token;
  final String driverId;

  const HomeScreen({
    super.key,
    required this.apiService,
    required this.realtimeService,
    required this.token,
    required this.driverId,
  });

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  bool _online = false;
  String _status = 'Offline';
  TripOffer? _offer;
  StreamSubscription<Map<String, dynamic>>? _sub;

  @override
  void initState() {
    super.initState();
    _sub = widget.realtimeService.events.listen((e) {
      if (!_online) return;
      if (e['event'] == 'trip:offer') {
        final data = Map<String, dynamic>.from(e['data'] as Map);
        setState(() {
          _offer = TripOffer.fromMap(data);
          _status = 'Nueva oferta recibida';
        });
      }
    });
  }

  @override
  void dispose() {
    _sub?.cancel();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Driver Home'),
        actions: [
          IconButton(
            icon: const Icon(Icons.info_outline),
            onPressed: () => Navigator.of(context).push(MaterialPageRoute(builder: (_) => const AboutScreen())),
          )
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          SwitchListTile.adaptive(
            title: Text(_online ? 'Online' : 'Offline'),
            subtitle: Text(_status),
            value: _online,
            onChanged: (v) => setState(() {
              _online = v;
              _status = v ? 'Esperando trip:offer...' : 'Offline';
              if (!v) _offer = null;
            }),
          ),
          const SizedBox(height: 12),
          if (_offer == null)
            const Card(child: ListTile(title: Text('Sin ofertas'), subtitle: Text('Ponete online para recibir trips.')))
          else
            Card(
              child: ListTile(
                title: Text('Trip ${_offer!.tripId}'),
                subtitle: Text('Pickup: ${_offer!.pickupLat}, ${_offer!.pickupLng} | $${_offer!.proposedPrice}'),
                trailing: FilledButton(
                  onPressed: () async {
                    final accepted = await widget.apiService.acceptTrip(
                      tripId: _offer!.tripId,
                      token: widget.token,
                      driverId: widget.driverId,
                    );
                    if (!mounted) return;
                    Navigator.of(context).push(
                      MaterialPageRoute(
                        builder: (_) => TripDetailScreen(
                          offer: _offer!,
                          acceptedData: accepted,
                          apiService: widget.apiService,
                          token: widget.token,
                          driverId: widget.driverId,
                        ),
                      ),
                    );
                  },
                  child: const Text('Aceptar'),
                ),
              ),
            ),
        ],
      ),
    );
  }
}
