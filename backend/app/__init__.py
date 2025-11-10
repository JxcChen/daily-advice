# -*- coding: utf-8 -*-
"""Flask应用工厂"""

import os
from flask import Flask
from dotenv import load_dotenv

from app.extensions import db, jwt, cors, migrate, limiter
from app.config import config
from app.utils import setup_logger

# 加载环境变量
load_dotenv()


def create_app(config_name=None):
    """
    创建Flask应用

    Args:
        config_name: 配置名称（development/production/testing）

    Returns:
        Flask应用实例
    """
    if config_name is None:
        config_name = os.getenv('FLASK_ENV', 'development')

    app = Flask(__name__)
    app.config.from_object(config[config_name])

    # 初始化扩展
    init_extensions(app)

    # 注册蓝图
    register_blueprints(app)

    # 配置日志
    setup_logger(app)

    # 注册错误处理器
    register_error_handlers(app)

    return app


def init_extensions(app):
    """初始化Flask扩展"""
    db.init_app(app)
    jwt.init_app(app)
    cors.init_app(app)
    migrate.init_app(app, db)
    limiter.init_app(app)

    # 创建数据库表
    with app.app_context():
        db.create_all()


def register_blueprints(app):
    """注册蓝图"""
    from app.api import auth_bp, quote_bp, user_bp

    app.register_blueprint(auth_bp)
    app.register_blueprint(quote_bp)
    app.register_blueprint(user_bp)


def register_error_handlers(app):
    """注册错误处理器"""

    @app.errorhandler(404)
    def not_found(error):
        return {'code': 404, 'message': '资源不存在'}, 404

    @app.errorhandler(500)
    def internal_error(error):
        return {'code': 500, 'message': '服务器内部错误'}, 500

    @jwt.unauthorized_loader
    def unauthorized_callback(callback):
        return {'code': 401, 'message': '未提供认证令牌'}, 401

    @jwt.invalid_token_loader
    def invalid_token_callback(callback):
        return {'code': 401, 'message': '无效的认证令牌'}, 401

    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_data):
        return {'code': 401, 'message': '认证令牌已过期'}, 401

    @app.errorhandler(429)
    def ratelimit_handler(e):
        return {'code': 429, 'message': '请求过于频繁，请稍后重试'}, 429
