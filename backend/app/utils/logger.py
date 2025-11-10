# -*- coding: utf-8 -*-
"""日志配置"""

import logging
import os
from logging.handlers import RotatingFileHandler


def setup_logger(app):
    """
    配置应用日志

    Args:
        app: Flask应用实例
    """
    # 确保日志目录存在
    if not os.path.exists('logs'):
        os.makedirs('logs')

    # 日志格式
    log_format = '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    formatter = logging.Formatter(log_format)

    # 配置普通日志
    file_handler = RotatingFileHandler(
        'logs/app.log',
        maxBytes=10 * 1024 * 1024,  # 10MB
        backupCount=5
    )
    file_handler.setLevel(logging.INFO)
    file_handler.setFormatter(formatter)

    # 配置错误日志
    error_handler = RotatingFileHandler(
        'logs/error.log',
        maxBytes=10 * 1024 * 1024,  # 10MB
        backupCount=5
    )
    error_handler.setLevel(logging.ERROR)
    error_handler.setFormatter(formatter)

    # 添加处理器
    app.logger.addHandler(file_handler)
    app.logger.addHandler(error_handler)
    app.logger.setLevel(logging.INFO)

    app.logger.info('应用启动')
