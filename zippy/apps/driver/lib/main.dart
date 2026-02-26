import 'package:flutter/material.dart';
import 'screens/login.dart';
import 'services/api_service.dart';
import 'services/realtime_service.dart';

void main() {
  runApp(const DriverApp());
}

class DriverApp extends StatelessWidget {
  const DriverApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      title: 'Zippy Driver',
      theme: ThemeData(useMaterial3: true, colorSchemeSeed: const Color(0xFF0068FF)),
      home: LoginScreen(apiService: ApiService(), realtimeService: RealtimeService()),
    );
  }
}
