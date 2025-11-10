# -*- coding: utf-8 -*-
"""认证API路由"""

from flask import Blueprint, request
from marshmallow import ValidationError
from app.services import AuthService
from app.utils import (
    success_response,
    error_response,
    validate_schema,
    RegisterSchema,
    LoginSchema
)

auth_bp = Blueprint('auth', __name__, url_prefix='/api/v1/auth')


@auth_bp.route('/register', methods=['POST'])
def register():
    """
    用户注册

    请求体：
    {
        "phone": "13800138000",
        "password": "Abc123456",
        "name": "张三",
        "gender": "male",
        "birthday": "1995-06-15"
    }
    """
    try:
        # 验证数据
        data = validate_schema(RegisterSchema, request.json)

        # 调用服务
        user = AuthService.register(
            phone=data['phone'],
            password=data['password'],
            name=data['name'],
            gender=data['gender'],
            birthday=data['birthday']
        )

        return success_response(
            data={
                'user_id': user.id,
                'phone': user.phone,
                'name': user.name
            },
            message='注册成功',
            code=201
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
        import traceback
        traceback.print_exc()
        return error_response(
            message=f'注册失败: {str(e)}',
            code=500
        )


@auth_bp.route('/login', methods=['POST'])
def login():
    """
    用户登录

    请求体：
    {
        "phone": "13800138000",
        "password": "Abc123456"
    }
    """
    try:
        # 验证数据
        data = validate_schema(LoginSchema, request.json)

        # 调用服务
        user, token = AuthService.login(
            phone=data['phone'],
            password=data['password']
        )

        return success_response(
            data={
                'access_token': token,
                'user': user.to_dict()
            },
            message='登录成功'
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
            message='登录失败',
            code=500
        )
