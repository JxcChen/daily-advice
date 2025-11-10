# -*- coding: utf-8 -*-
"""测试JWT Token"""

import sys
sys.path.insert(0, '/Users/chnjx/ai-project/daily-advice/backend')

from app import create_app
from flask_jwt_extended import decode_token

app = create_app()

token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTc2MjE4MjQwOSwianRpIjoiNzBjNjc2NGItNjc2MS00MjVmLWE1MDMtNzU5NTgzYzdiYzExIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6MSwibmJmIjoxNzYyMTgyNDA5LCJleHAiOjE3NjI3ODcyMDl9.t01RG4j7YLI4aHYcxPUsBsjfb0mM8J01hSc9UpuW-1U"

with app.app_context():
    try:
        decoded = decode_token(token)
        print("Token is valid!")
        print(f"User ID: {decoded['sub']}")
    except Exception as e:
        print(f"Token error: {e}")
