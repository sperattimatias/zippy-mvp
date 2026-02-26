import 'package:dio/dio.dart';
import '../config.dart';

class ApiService {
  final Dio _dio = Dio(BaseOptions(baseUrl: AppConfig.baseUrl));

  Future<Map<String, dynamic>> loginOtp({required String phone, required String otp}) async {
    final res = await _dio.post('/auth/login', data: {'phone': phone, 'otp': otp});
    return Map<String, dynamic>.from(res.data as Map);
  }

  Future<Map<String, dynamic>> acceptTrip({required String tripId, required String token, required String driverId}) async {
    final res = await _dio.post(
      '/trips/$tripId/accept',
      data: {},
      options: Options(headers: {'Authorization': 'Bearer $token', 'x-role': 'driver', 'x-user-id': driverId}),
    );
    return Map<String, dynamic>.from(res.data as Map);
  }

  Future<Map<String, dynamic>> startTrip({required String tripId, required String token, required String driverId}) async {
    final res = await _dio.post(
      '/trips/$tripId/start',
      data: {},
      options: Options(headers: {'Authorization': 'Bearer $token', 'x-role': 'driver', 'x-user-id': driverId}),
    );
    return Map<String, dynamic>.from(res.data as Map);
  }

  Future<Map<String, dynamic>> completeTrip({required String tripId, required String token, required String driverId}) async {
    final res = await _dio.post(
      '/trips/$tripId/complete',
      data: {},
      options: Options(headers: {'Authorization': 'Bearer $token', 'x-role': 'driver', 'x-user-id': driverId}),
    );
    return Map<String, dynamic>.from(res.data as Map);
  }

  Future<void> sendLocation({
    required String tripId,
    required String token,
    required String driverId,
    required double lat,
    required double lng,
    required double heading,
    required double speed,
  }) async {
    await _dio.post(
      '/trips/$tripId/location',
      data: {
        'lat': lat,
        'lng': lng,
        'heading': heading,
        'speed': speed,
        'timestamp': DateTime.now().toUtc().toIso8601String(),
      },
      options: Options(headers: {'Authorization': 'Bearer $token', 'x-role': 'driver', 'x-user-id': driverId}),
    );
  }
}
