# -*- coding: utf-8 -*-
"""天气服务 - 和风天气API集成"""

import requests
from flask import current_app


class WeatherService:
    """和风天气API调用服务"""

    @staticmethod
    def get_current_weather(city='北京'):
        """
        获取当前天气

        Args:
            city: 城市名称

        Returns:
            天气信息字典
            {
                'condition': '晴',
                'temperature': 25,
                'city': '北京'
            }
        """
        try:
            api_key = current_app.config.get('QWEATHER_API_KEY')

            # 如果没有配置API Key，返回默认天气
            if not api_key or api_key == 'your-qweather-api-key':
                current_app.logger.warning('未配置和风天气API Key，使用默认天气')
                return WeatherService._get_default_weather(city)

            # 1. 先获取城市的location_id
            location_id = WeatherService._get_location_id(city, api_key)

            if not location_id:
                current_app.logger.warning(f'无法获取城市 {city} 的location_id，使用默认天气')
                return WeatherService._get_default_weather(city)

            # 2. 获取实时天气
            weather_url = current_app.config['QWEATHER_API_URL']
            params = {
                'location': location_id,
                'key': api_key
            }

            response = requests.get(weather_url, params=params, timeout=5)

            if response.status_code == 200:
                data = response.json()

                if data.get('code') == '200':
                    now = data.get('now', {})
                    return {
                        'condition': now.get('text', '晴'),
                        'temperature': int(now.get('temp', 20)),
                        'city': city
                    }
                else:
                    current_app.logger.warning(f'和风天气API返回错误码：{data.get("code")}')
                    return WeatherService._get_default_weather(city)
            else:
                current_app.logger.error(f'和风天气API调用失败：{response.status_code}')
                return WeatherService._get_default_weather(city)

        except requests.exceptions.Timeout:
            current_app.logger.error('和风天气API调用超时')
            return WeatherService._get_default_weather(city)
        except Exception as e:
            current_app.logger.error(f'获取天气信息失败：{str(e)}')
            return WeatherService._get_default_weather(city)

    @staticmethod
    def _get_location_id(city, api_key):
        """
        获取城市的location_id

        Args:
            city: 城市名称
            api_key: API密钥

        Returns:
            location_id字符串，失败返回None
        """
        try:
            geo_url = current_app.config['QWEATHER_GEO_URL']
            params = {
                'location': city,
                'key': api_key
            }

            response = requests.get(geo_url, params=params, timeout=5)

            if response.status_code == 200:
                data = response.json()
                if data.get('code') == '200' and data.get('location'):
                    return data['location'][0]['id']

            return None

        except Exception as e:
            current_app.logger.error(f'获取location_id失败：{str(e)}')
            return None

    @staticmethod
    def _get_default_weather(city):
        """
        返回默认天气信息

        Args:
            city: 城市名称

        Returns:
            默认天气信息字典
        """
        return {
            'condition': '晴',
            'temperature': 20,
            'city': city
        }
