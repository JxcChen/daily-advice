# -*- coding: utf-8 -*-
"""API路由模块"""

from .auth import auth_bp
from .quote import quote_bp
from .user import user_bp

__all__ = ['auth_bp', 'quote_bp', 'user_bp']
