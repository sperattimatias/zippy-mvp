import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../services/realtime_service.dart';
import 'home.dart';

class LoginScreen extends StatefulWidget {
  final ApiService apiService;
  final RealtimeService realtimeService;

  const LoginScreen({super.key, required this.apiService, required this.realtimeService});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _phone = TextEditingController(text: '+5493465000002');
  final _otp = TextEditingController(text: '123456');
  bool _loading = false;
  String? _error;

  Future<void> _login() async {
    if (_otp.text.trim() != '123456') {
      setState(() => _error = 'OTP inválido (dev: 123456)');
      return;
    }
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final result = await widget.apiService.loginOtp(phone: _phone.text.trim(), otp: _otp.text.trim());
      final token = result['accessToken'] as String;
      const driverId = 'd1';
      widget.realtimeService.connect(token);
      if (!mounted) return;
      Navigator.of(context).pushReplacement(
        MaterialPageRoute(
          builder: (_) => HomeScreen(
            apiService: widget.apiService,
            realtimeService: widget.realtimeService,
            token: token,
            driverId: driverId,
          ),
        ),
      );
    } catch (_) {
      setState(() => _error = 'Error iniciando sesión');
    } finally {
      if (mounted) setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 360),
          child: Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Text('Zippy Driver', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 28)),
                const SizedBox(height: 18),
                TextField(controller: _phone, decoration: const InputDecoration(labelText: 'Teléfono')),
                const SizedBox(height: 10),
                TextField(controller: _otp, decoration: const InputDecoration(labelText: 'OTP (dev)')),
                const SizedBox(height: 14),
                if (_error != null) Text(_error!, style: const TextStyle(color: Colors.red)),
                FilledButton(onPressed: _loading ? null : _login, child: Text(_loading ? 'Ingresando...' : 'Ingresar')),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
