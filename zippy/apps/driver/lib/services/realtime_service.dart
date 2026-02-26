import 'dart:async';
import 'package:socket_io_client/socket_io_client.dart' as io;
import '../config.dart';

class RealtimeService {
  io.Socket? _socket;
  final _events = StreamController<Map<String, dynamic>>.broadcast();

  Stream<Map<String, dynamic>> get events => _events.stream;

  void connect(String token) {
    _socket = io.io(
      AppConfig.socketUrl,
      io.OptionBuilder().setTransports(['websocket']).setAuth({'token': token}).disableAutoConnect().build(),
    );

    _socket!.on('trip:offer', (d) => _events.add({'event': 'trip:offer', 'data': d}));
    _socket!.connect();
  }

  void dispose() {
    _socket?.dispose();
    _events.close();
  }
}
