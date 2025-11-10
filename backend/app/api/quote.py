# -*- coding: utf-8 -*-
"""语录API路由"""

from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from marshmallow import ValidationError
from app.services import QuoteService
from app.utils import (
    success_response,
    error_response,
    validate_schema,
    QuoteGenerateSchema
)
from app.extensions import limiter

quote_bp = Blueprint('quote', __name__, url_prefix='/api/v1/quote')


@quote_bp.route('/generate', methods=['POST'])
@jwt_required()
@limiter.limit("10 per minute")  # 每分钟最多10次
def generate():
    """
    生成每日语录

    请求体：
    {
        "event": "今天要参加重要会议",  // 可选
        "mood": "有点紧张",            // 可选
        "city": "北京"                // 可选
    }
    """
    try:
        # 获取当前用户ID (JWT identity is string, convert to int)
        user_id = int(get_jwt_identity())

        # 验证数据
        data = validate_schema(QuoteGenerateSchema, request.json or {})

        # 调用服务
        quote_data = QuoteService.generate_quote(
            user_id=user_id,
            event=data.get('event'),
            mood=data.get('mood'),
            city=data.get('city')
        )

        return success_response(
            data=quote_data,
            message='生成成功'
        )

    except ValidationError as e:
        return error_response(
            message='数据验证失败',
            code=400,
            errors=e.messages
        )
    except ValueError as e:
        return error_response(
            message=str(e),
            code=400
        )
    except Exception as e:
        return error_response(
            message='生成失败',
            code=500
        )


@quote_bp.route('/history', methods=['GET'])
@jwt_required()
def history():
    """
    获取历史语录

    查询参数：
    - page: 页码（默认1）
    - per_page: 每页数量（默认10）
    """
    try:
        # 获取当前用户ID (JWT identity is string, convert to int)
        user_id = int(get_jwt_identity())

        # 获取分页参数
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)

        # 限制每页数量
        per_page = min(per_page, 50)

        # 调用服务
        result = QuoteService.get_history(
            user_id=user_id,
            page=page,
            per_page=per_page
        )

        return success_response(
            data=result,
            message='获取成功'
        )

    except Exception as e:
        return error_response(
            message='获取失败',
            code=500
        )
