import 'package:flutter/material.dart';

class AboutSheet extends StatelessWidget {
  const AboutSheet({super.key});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: const [
          Text('Acerca de', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
          SizedBox(height: 12),
          Text('Zippy Passenger MVP para Firmat.'),
          SizedBox(height: 12),
          Text('Zippy — developer: Matias Speratti'),
        ],
      ),
    );
  }
}
