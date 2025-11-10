# -*- coding: utf-8 -*-
"""用户API路由"""

from flask import Blueprint
from flask_jwt_extended import jwt_required, get_jwt_identity
from app.models import User
from app.utils import success_response, error_response

user_bp = Blueprint('user', __name__, url_prefix='/api/v1/user')


@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """
    获取用户信息
    """
    try:
        # 获取当前用户ID (JWT identity is string, convert to int)
        user_id = int(get_jwt_identity())

        # 查询用户
        user = User.query.get(user_id)
        if not user:
            return error_response(
                message='用户不存在',
                code=404
            )

        return success_response(
            data=user.to_dict(),
            message='获取成功'
        )

    except Exception as e:
        return error_response(
            message='获取失败',
            code=500
        )
