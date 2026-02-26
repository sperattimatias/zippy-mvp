import 'dart:async';
import 'package:socket_io_client/socket_io_client.dart' as io;

class RealtimeService {
  io.Socket? _socket;
  final _events = StreamController<Map<String, dynamic>>.broadcast();

  Stream<Map<String, dynamic>> get events => _events.stream;

  void connect(String token) {
    _socket = io.io(
      'http://localhost:3000/realtime',
      io.OptionBuilder()
          .setTransports(['websocket'])
          .setAuth({'token': token})
          .disableAutoConnect()
          .build(),
    );

    _socket!.onConnect((_) {});
    _socket!.on('trip:offer', (d) => _events.add({'event': 'trip:offer', 'data': d}));
    _socket!.on('trip:driver_assigned', (d) => _events.add({'event': 'trip:driver_assigned', 'data': d}));
    _socket!.on('trip:status_changed', (d) => _events.add({'event': 'trip:status_changed', 'data': d}));
    _socket!.on('trip:driver_location', (d) => _events.add({'event': 'trip:driver_location', 'data': d}));
    _socket!.connect();
  }

  void dispose() {
    _socket?.dispose();
    _events.close();
  }
}
