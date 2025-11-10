# -*- coding: utf-8 -*-
"""统一响应格式工具"""

from flask import jsonify


def success_response(data=None, message="success", code=200):
    """
    成功响应

    Args:
        data: 响应数据
        message: 响应消息
        code: HTTP状态码

    Returns:
        Flask响应对象
    """
    response = {
        'code': code,
        'message': message,
        'data': data
    }
    return jsonify(response), code


def error_response(message="error", code=400, errors=None):
    """
    错误响应

    Args:
        message: 错误消息
        code: HTTP状态码
        errors: 详细错误信息

    Returns:
        Flask响应对象
    """
    response = {
        'code': code,
        'message': message
    }
    if errors:
        response['errors'] = errors
    return jsonify(response), code
