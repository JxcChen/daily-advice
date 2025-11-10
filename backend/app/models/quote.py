# -*- coding: utf-8 -*-
"""语录历史模型"""

from datetime import datetime
from app.extensions import db


class QuoteHistory(db.Model):
    """语录历史表"""
    __tablename__ = 'quote_history'

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False, index=True)
    quote_content = db.Column(db.Text, nullable=False)
    event_input = db.Column(db.String(200))
    mood_input = db.Column(db.String(100))
    weather = db.Column(db.String(50), nullable=False)
    temperature = db.Column(db.Integer, nullable=False)
    city = db.Column(db.String(50), nullable=False)
    is_birthday = db.Column(db.Boolean, nullable=False, default=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.utcnow, index=True)

    def to_dict(self):
        """转换为字典"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'content': self.quote_content,  # Frontend expects 'content', not 'quote_content'
            'event_input': self.event_input,
            'mood_input': self.mood_input,
            'weather': self.weather,
            'temperature': self.temperature,
            'city': self.city,
            'is_birthday': self.is_birthday,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

    def __repr__(self):
        return f'<QuoteHistory {self.id}>'
