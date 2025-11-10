# -*- coding: utf-8 -*-
"""数据验证工具"""

from marshmallow import Schema, fields, validate, ValidationError


class RegisterSchema(Schema):
    """注册数据验证"""
    phone = fields.Str(
        required=True,
        validate=validate.Regexp(r'^1[3-9]\d{9}$', error="手机号格式错误")
    )
    password = fields.Str(
        required=True,
        validate=[
            validate.Length(min=8, max=20, error="密码长度8-20位"),
            validate.Regexp(
                r'^(?=.*[A-Za-z])(?=.*\d).+$',
                error="密码必须包含字母和数字"
            )
        ]
    )
    name = fields.Str(
        required=True,
        validate=validate.Length(min=2, max=20, error="姓名长度2-20字符")
    )
    gender = fields.Str(
        required=True,
        validate=validate.OneOf(['male', 'female', 'other'], error="性别必须是male/female/other")
    )
    birthday = fields.Date(required=True)


class LoginSchema(Schema):
    """登录数据验证"""
    phone = fields.Str(
        required=True,
        validate=validate.Regexp(r'^1[3-9]\d{9}$', error="手机号格式错误")
    )
    password = fields.Str(required=True)


class QuoteGenerateSchema(Schema):
    """语录生成数据验证"""
    event = fields.Str(
        required=False,
        validate=validate.Length(max=100, error="今日大事最多100字符")
    )
    mood = fields.Str(
        required=False,
        validate=validate.Length(max=50, error="目前心情最多50字符")
    )
    city = fields.Str(required=False)
    latitude = fields.Float(required=False)
    longitude = fields.Float(required=False)


def validate_schema(schema_class, data):
    """
    验证数据

    Args:
        schema_class: Schema类
        data: 待验证的数据

    Returns:
        验证后的数据

    Raises:
        ValidationError: 验证失败
    """
    schema = schema_class()
    return schema.load(data)
