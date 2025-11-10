# -*- coding: utf-8 -*-
"""语录服务"""

from datetime import datetime, date
from flask import current_app
from app.extensions import db
from app.models import QuoteHistory, User
from app.services.ai_service import AIService
from app.services.weather_service import WeatherService


class QuoteService:
    """语录生成服务"""

    # 情绪表情映射
    EMOTION_MAP = {
        '开心': {'icon': '😊', 'color': '#d4af37', 'type': 'happy'},
        '快乐': {'icon': '😊', 'color': '#d4af37', 'type': 'happy'},
        '高兴': {'icon': '😊', 'color': '#d4af37', 'type': 'happy'},
        '平静': {'icon': '😌', 'color': '#00ced1', 'type': 'calm'},
        '安宁': {'icon': '😌', 'color': '#00ced1', 'type': 'calm'},
        '淡然': {'icon': '😌', 'color': '#00ced1', 'type': 'calm'},
        '疲惫': {'icon': '😔', 'color': '#808080', 'type': 'tired'},
        '累': {'icon': '😔', 'color': '#808080', 'type': 'tired'},
        '辛苦': {'icon': '😔', 'color': '#808080', 'type': 'tired'},
        '焦虑': {'icon': '😰', 'color': '#4169e1', 'type': 'nervous'},
        '担心': {'icon': '😰', 'color': '#4169e1', 'type': 'nervous'},
        '紧张': {'icon': '😰', 'color': '#4169e1', 'type': 'nervous'},
        '愤怒': {'icon': '😤', 'color': '#dc143c', 'type': 'angry'},
        '生气': {'icon': '😤', 'color': '#dc143c', 'type': 'angry'},
        '不爽': {'icon': '😤', 'color': '#dc143c', 'type': 'angry'},
        '伤心': {'icon': '😢', 'color': '#9370db', 'type': 'sad'},
        '难过': {'icon': '😢', 'color': '#9370db', 'type': 'sad'},
        '失落': {'icon': '😢', 'color': '#9370db', 'type': 'sad'},
        '期待': {'icon': '🤩', 'color': '#ff8c00', 'type': 'excited'},
        '兴奋': {'icon': '🤩', 'color': '#ff8c00', 'type': 'excited'},
        '激动': {'icon': '🤩', 'color': '#ff8c00', 'type': 'excited'}
    }

    @staticmethod
    def generate_quote(user_id, event=None, mood=None, city=None):
        """
        生成每日语录

        Args:
            user_id: 用户ID
            event: 今日大事（可选）
            mood: 目前心情（可选）
            city: 城市（可选）

        Returns:
            语录信息字典

        Raises:
            ValueError: 生成失败
        """
        # 获取用户信息
        user = User.query.get(user_id)
        if not user:
            raise ValueError('用户不存在')

        # 准备用户信息
        today = date.today()
        age = today.year - user.birthday.year - ((today.month, today.day) < (user.birthday.month, user.birthday.day))

        user_info = {
            'name': user.name,
            'gender': QuoteService._get_gender_text(user.gender),
            'age': age
        }

        # 准备上下文信息
        now = datetime.now()
        is_birthday = (today.month == user.birthday.month and today.day == user.birthday.day)

        # 计算距离生日的天数
        next_birthday = date(today.year, user.birthday.month, user.birthday.day)
        if next_birthday < today:
            next_birthday = date(today.year + 1, user.birthday.month, user.birthday.day)
        days_to_birthday = (next_birthday - today).days
        birthday_coming = 0 < days_to_birthday <= 3

        # 获取天气信息
        if not city:
            city = '北京'  # 默认城市
        weather_info = WeatherService.get_current_weather(city)

        context_info = {
            'date': today.strftime('%Y年%m月%d日'),
            'weekday': QuoteService._get_weekday_text(today.weekday()),
            'time': now.strftime('%H:%M'),
            'is_birthday': is_birthday,
            'birthday_coming': birthday_coming,
            'days_to_birthday': days_to_birthday,
            'city': weather_info['city'],
            'weather': weather_info['condition'],
            'temperature': weather_info['temperature'],
            'event': event,
            'mood': mood
        }

        # 调用AI生成语录
        try:
            quote_content = AIService.generate_quote(user_info, context_info)
        except Exception as e:
            current_app.logger.error(f'生成语录失败：{str(e)}')
            raise ValueError('语录生成失败，请稍后重试')

        # 保存到数据库
        quote = QuoteHistory(
            user_id=user_id,
            quote_content=quote_content,
            event_input=event,
            mood_input=mood,
            weather=weather_info['condition'],
            temperature=weather_info['temperature'],
            city=weather_info['city'],
            is_birthday=is_birthday
        )

        db.session.add(quote)
        db.session.commit()

        # 获取情绪表情
        emotion_info = QuoteService._get_emotion_info(mood)

        # 返回完整信息
        return {
            'quote_id': quote.id,
            'content': quote_content,
            'emotion': emotion_info['type'],
            'emotion_icon': emotion_info['icon'],
            'emotion_color': emotion_info['color'],
            'weather': {
                'condition': weather_info['condition'],
                'temperature': weather_info['temperature'],
                'city': weather_info['city']
            },
            'is_birthday': is_birthday,
            'created_at': quote.created_at.isoformat()
        }

    @staticmethod
    def get_history(user_id, page=1, per_page=10):
        """
        获取历史语录

        Args:
            user_id: 用户ID
            page: 页码
            per_page: 每页数量

        Returns:
            分页后的语录列表和分页信息
        """
        pagination = QuoteHistory.query.filter_by(user_id=user_id)\
            .order_by(QuoteHistory.created_at.desc())\
            .paginate(page=page, per_page=per_page, error_out=False)

        quotes = [quote.to_dict() for quote in pagination.items]

        return {
            'quotes': quotes,
            'pagination': {
                'page': page,
                'per_page': per_page,
                'total': pagination.total,
                'pages': pagination.pages
            }
        }

    @staticmethod
    def _get_gender_text(gender):
        """获取性别文本"""
        gender_map = {
            'male': '男',
            'female': '女',
            'other': '其他'
        }
        return gender_map.get(gender, '其他')

    @staticmethod
    def _get_weekday_text(weekday):
        """获取星期文本"""
        weekday_map = {
            0: '一',
            1: '二',
            2: '三',
            3: '四',
            4: '五',
            5: '六',
            6: '日'
        }
        return weekday_map.get(weekday, '一')

    @staticmethod
    def _get_emotion_info(mood):
        """
        获取情绪表情信息

        Args:
            mood: 心情文本

        Returns:
            情绪信息字典
        """
        if not mood:
            return {
                'icon': '🧘',
                'color': '#ffffff',
                'type': 'default'
            }

        # 查找匹配的情绪
        for keyword, emotion in QuoteService.EMOTION_MAP.items():
            if keyword in mood:
                return emotion

        # 默认返回
        return {
            'icon': '🧘',
            'color': '#ffffff',
            'type': 'default'
        }
