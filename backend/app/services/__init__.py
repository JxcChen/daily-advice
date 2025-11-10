# -*- coding: utf-8 -*-
"""服务模块"""

from .auth_service import AuthService
from .ai_service import AIService
from .weather_service import WeatherService
from .quote_service import QuoteService

__all__ = ['AuthService', 'AIService', 'WeatherService', 'QuoteService']
