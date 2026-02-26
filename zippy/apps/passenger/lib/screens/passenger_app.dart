import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../services/realtime_service.dart';
import 'login_screen.dart';

class PassengerApp extends StatelessWidget {
  const PassengerApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Zippy Passenger',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        useMaterial3: true,
        colorSchemeSeed: const Color(0xFF2D7EFF),
      ),
      home: LoginScreen(
        apiService: ApiService(),
        realtimeService: RealtimeService(),
      ),
    );
  }
}
