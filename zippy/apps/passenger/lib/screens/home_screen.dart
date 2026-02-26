import 'dart:async';
import 'package:flutter/material.dart';
import '../models/trip_models.dart';
import '../services/api_service.dart';
import '../services/realtime_service.dart';
import '../widgets/about_sheet.dart';

class HomeScreen extends StatefulWidget {
  final ApiService apiService;
  final RealtimeService realtimeService;
  final String token;

  const HomeScreen({super.key, required this.apiService, required this.realtimeService, required this.token});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final _origin = TextEditingController(text: 'Casa');
  final _destination = TextEditingController(text: 'Trabajo');
  final _chipLabels = ['mascota', 'equipaje', 'asistencia', 'otro'];
  final Set<String> _selected = {};

  TripUiState _state = TripUiState.idle;
  String? _tripId;
  String _statusText = 'Listo para pedir viaje';
  String _tracking = 'Sin tracking';
  StreamSubscription<Map<String, dynamic>>? _sub;

  @override
  void initState() {
    super.initState();
    _sub = widget.realtimeService.events.listen(_onRealtimeEvent);
  }

  void _onRealtimeEvent(Map<String, dynamic> e) {
    final event = e['event'];
    final data = (e['data'] ?? {}) as dynamic;
    if (!mounted) return;

    if (event == 'trip:driver_assigned') {
      setState(() {
        _statusText = 'Conductor asignado';
        _state = TripUiState.accepted;
      });
    } else if (event == 'trip:status_changed') {
      final status = data['status']?.toString() ?? '';
      setState(() {
        _statusText = 'Estado: $status';
        if (status == 'in_progress') _state = TripUiState.inProgress;
        if (status == 'completed') _state = TripUiState.completed;
      });
    } else if (event == 'trip:driver_location') {
      setState(() {
        _tracking = 'Driver: ${data['lat']}, ${data['lng']} vel=${data['speed']}';
      });
    } else if (event == 'trip:offer') {
      setState(() => _statusText = 'Buscando conductor...');
    }
  }

  Future<void> _createTrip() async {
    final req = TripRequest(origin: _origin.text, destination: _destination.text, tags: _selected.toList());
    final res = await widget.apiService.createTrip(token: widget.token, request: req);
    setState(() {
      _tripId = res['tripId']?.toString();
      _state = TripUiState.requested;
      _statusText = 'Buscando conductor...';
    });
  }

  Future<void> _rateTrip() async {
    if (_tripId == null) return;
    await widget.apiService.rateTrip(token: widget.token, tripId: _tripId!, score: 5, tags: ['safe_driving', 'on_time']);
    if (!mounted) return;
    ScaffoldMessenger.of(context).showSnackBar(const SnackBar(content: Text('¡Gracias por calificar!')));
  }

  @override
  void dispose() {
    _sub?.cancel();
    _origin.dispose();
    _destination.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Zippy Passenger'),
        actions: [
          IconButton(
            icon: const Icon(Icons.info_outline),
            onPressed: () => showModalBottomSheet(context: context, builder: (_) => const AboutSheet()),
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Container(
            height: 180,
            decoration: BoxDecoration(color: Colors.blueGrey.shade100, borderRadius: BorderRadius.circular(16)),
            alignment: Alignment.center,
            child: const Text('Mapa (placeholder)', style: TextStyle(fontSize: 18)),
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              Expanded(child: TextField(controller: _origin, decoration: const InputDecoration(labelText: 'Origen'))),
              const SizedBox(width: 8),
              Expanded(child: TextField(controller: _destination, decoration: const InputDecoration(labelText: 'Destino'))),
            ],
          ),
          const SizedBox(height: 10),
          Wrap(
            spacing: 8,
            children: _chipLabels
                .map((e) => FilterChip(
                      label: Text(e),
                      selected: _selected.contains(e),
                      onSelected: (v) => setState(() => v ? _selected.add(e) : _selected.remove(e)),
                    ))
                .toList(),
          ),
          const SizedBox(height: 12),
          FilledButton(onPressed: _createTrip, child: const Text('Crear trip')),
          const SizedBox(height: 12),
          Card(
            child: ListTile(
              title: Text(_statusText),
              subtitle: Text(_tracking),
            ),
          ),
          const SizedBox(height: 8),
          if (_state == TripUiState.completed)
            FilledButton.tonal(onPressed: _rateTrip, child: const Text('Finalizar + rating rápido')),
          const SizedBox(height: 10),
          const Text('Favoritos: Casa / Trabajo', style: TextStyle(fontWeight: FontWeight.w600)),
        ],
      ),
    );
  }
}
