import 'package:dio/dio.dart';
import '../models/trip_models.dart';

class ApiService {
  final Dio _dio = Dio(BaseOptions(baseUrl: 'http://localhost:3000/api/v1'));

  Future<Map<String, dynamic>> loginOtp({required String phone, required String otp}) async {
    final res = await _dio.post('/auth/login', data: {'phone': phone, 'otp': otp});
    return Map<String, dynamic>.from(res.data as Map);
  }

  Future<Map<String, dynamic>> createTrip({required String token, required TripRequest request}) async {
    final res = await _dio.post(
      '/trips',
      data: request.toJson(),
      options: Options(headers: {'Authorization': 'Bearer $token', 'x-role': 'passenger', 'x-user-id': 'p1'}),
    );
    return Map<String, dynamic>.from(res.data as Map);
  }

  Future<Map<String, dynamic>> rateTrip({required String token, required String tripId, required int score, required List<String> tags}) async {
    final res = await _dio.post(
      '/trips/$tripId/rate',
      data: {'score': score, 'tags': tags},
      options: Options(headers: {'Authorization': 'Bearer $token', 'x-role': 'passenger', 'x-user-id': 'p1'}),
    );
    return Map<String, dynamic>.from(res.data as Map);
  }
}
