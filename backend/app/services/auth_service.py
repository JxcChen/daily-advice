# -*- coding: utf-8 -*-
"""认证服务"""

from datetime import datetime, date
import bcrypt
from flask_jwt_extended import create_access_token
from app.extensions import db
from app.models import User


class AuthService:
    """认证服务"""

    @staticmethod
    def register(phone, password, name, gender, birthday):
        """
        用户注册

        Args:
            phone: 手机号
            password: 密码
            name: 姓名
            gender: 性别
            birthday: 生日（date对象）

        Returns:
            用户对象

        Raises:
            ValueError: 注册失败
        """
        # 检查手机号是否已注册
        existing_user = User.query.filter_by(phone=phone).first()
        if existing_user:
            raise ValueError('该手机号已注册')

        # 检查年龄（必须满18岁）
        today = date.today()
        age = today.year - birthday.year - ((today.month, today.day) < (birthday.month, birthday.day))
        if age < 18:
            raise ValueError('用户必须年满18岁')

        # 加密密码
        password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt(rounds=12))

        # 创建用户
        user = User(
            phone=phone,
            password_hash=password_hash.decode('utf-8'),
            name=name,
            gender=gender,
            birthday=birthday
        )

        db.session.add(user)
        db.session.commit()

        return user

    @staticmethod
    def login(phone, password):
        """
        用户登录

        Args:
            phone: 手机号
            password: 密码

        Returns:
            tuple: (用户对象, JWT Token)

        Raises:
            ValueError: 登录失败
        """
        # 查找用户
        user = User.query.filter_by(phone=phone).first()
        if not user:
            raise ValueError('该手机号未注册')

        # 验证密码
        is_valid = bcrypt.checkpw(
            password.encode('utf-8'),
            user.password_hash.encode('utf-8')
        )

        if not is_valid:
            raise ValueError('密码错误')

        # 更新最后登录时间
        user.last_login_at = datetime.utcnow()
        db.session.commit()

        # 生成JWT Token (identity must be string)
        token = create_access_token(identity=str(user.id))

        return user, token
