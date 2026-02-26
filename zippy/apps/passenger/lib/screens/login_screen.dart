import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../services/realtime_service.dart';
import 'home_screen.dart';

class LoginScreen extends StatefulWidget {
  final ApiService apiService;
  final RealtimeService realtimeService;

  const LoginScreen({super.key, required this.apiService, required this.realtimeService});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _phone = TextEditingController(text: '+5493465000001');
  final _otp = TextEditingController(text: '123456');
  bool _loading = false;
  String? _error;

  Future<void> _login() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final result = await widget.apiService.loginOtp(phone: _phone.text, otp: _otp.text);
      final token = result['accessToken'] as String;
      widget.realtimeService.connect(token);
      if (!mounted) return;
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (_) => HomeScreen(apiService: widget.apiService, realtimeService: widget.realtimeService, token: token),
        ),
      );
    } catch (e) {
      setState(() => _error = 'No se pudo iniciar sesión');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SafeArea(
        child: Center(
          child: SizedBox(
            width: 360,
            child: Padding(
              padding: const EdgeInsets.all(20),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('Zippy Passenger', style: TextStyle(fontSize: 28, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 20),
                  TextField(controller: _phone, decoration: const InputDecoration(labelText: 'Teléfono')),
                  const SizedBox(height: 12),
                  TextField(controller: _otp, decoration: const InputDecoration(labelText: 'OTP (dev)')),
                  const SizedBox(height: 16),
                  if (_error != null) Text(_error!, style: const TextStyle(color: Colors.red)),
                  FilledButton(onPressed: _loading ? null : _login, child: Text(_loading ? 'Ingresando...' : 'Ingresar')),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
