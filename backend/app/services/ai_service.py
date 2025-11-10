# -*- coding: utf-8 -*-
"""AI服务 - DeepSeek API集成"""

import requests
from flask import current_app


class AIService:
    """DeepSeek API调用服务"""

    @staticmethod
    def generate_quote(user_info, context_info):
        """
        生成每日语录

        Args:
            user_info: 用户信息字典
                - name: 姓名
                - gender: 性别
                - age: 年龄
            context_info: 上下文信息字典
                - date: 日期
                - weekday: 星期几
                - time: 时间
                - is_birthday: 是否生日
                - birthday_coming: 是否临近生日
                - city: 城市
                - weather: 天气
                - temperature: 气温
                - event: 今日大事（可选）
                - mood: 目前心情（可选）

        Returns:
            生成的语录字符串

        Raises:
            Exception: API调用失败
        """
        # 构建提示词
        prompt = AIService._build_prompt(user_info, context_info)

        # 调用DeepSeek API
        try:
            api_key = current_app.config['DEEPSEEK_API_KEY']
            api_url = current_app.config['DEEPSEEK_API_URL']
            model = current_app.config['DEEPSEEK_MODEL']

            headers = {
                'Authorization': f'Bearer {api_key}',
                'Content-Type': 'application/json'
            }

            payload = {
                'model': model,
                'messages': [
                    {
                        'role': 'system',
                        'content': '你是一位富有情感智慧的励志导师。'
                    },
                    {
                        'role': 'user',
                        'content': prompt
                    }
                ],
                'temperature': 0.8,
                'max_tokens': 200
            }

            current_app.logger.info(f'调用DeepSeek API生成语录，用户：{user_info["name"]}')

            response = requests.post(
                api_url,
                headers=headers,
                json=payload,
                timeout=10
            )

            if response.status_code == 200:
                data = response.json()
                quote = data['choices'][0]['message']['content'].strip()

                # 验证长度
                if 30 <= len(quote) <= 80:
                    return quote
                else:
                    current_app.logger.warning(f'生成的语录长度不符合要求：{len(quote)}字')
                    return quote

            else:
                error_msg = f'DeepSeek API错误：{response.status_code} - {response.text}'
                current_app.logger.error(error_msg)
                raise Exception(error_msg)

        except requests.exceptions.Timeout:
            current_app.logger.error('DeepSeek API调用超时')
            raise Exception('AI服务响应超时，请稍后重试')
        except requests.exceptions.RequestException as e:
            current_app.logger.error(f'DeepSeek API调用失败：{str(e)}')
            raise Exception('AI服务暂时不可用，请稍后重试')

    @staticmethod
    def _build_prompt(user_info, context_info):
        """
        构建AI提示词

        Args:
            user_info: 用户信息
            context_info: 上下文信息

        Returns:
            提示词字符串
        """
        # 判断特殊日期
        if context_info.get('is_birthday'):
            date_type = '🎂 今天是用户生日！'
        elif context_info.get('birthday_coming'):
            days_left = context_info.get('days_to_birthday', 0)
            date_type = f'🎈 距离用户生日还有{days_left}天'
        else:
            date_type = '普通日期'

        prompt = f"""你是一位富有情感智慧的励志导师。请根据以下信息为用户生成一句今日励志语录：

【用户信息】
- 姓名：{user_info['name']}
- 性别：{user_info['gender']}
- 年龄：{user_info['age']}岁

【时间信息】
- 今日日期：{context_info['date']}（星期{context_info['weekday']}）
- 当前时间：{context_info['time']}
- 特殊日期：{date_type}

【环境信息】
- 天气：{context_info['weather']}
- 气温：{context_info['temperature']}°C
"""

        # 添加用户输入的状态（如果有）
        if context_info.get('event') or context_info.get('mood'):
            prompt += "\n【用户状态】\n"
            if context_info.get('event'):
                prompt += f"- 今日大事：{context_info['event']}\n"
            if context_info.get('mood'):
                prompt += f"- 目前心情：{context_info['mood']}\n"

        prompt += """
【输出要求】
1. 生成一句30-60字的励志语录
2. 语录需结合用户的特殊日期、天气、心情等因素
3. 风格：富有诗意、积极向上、贴近用户情境
4. 格式：直接输出语录内容，不要任何前缀、后缀或解释
5. 如果是生日或临近生日，需巧妙融入生日祝福
6. 根据天气和心情调整语录情感色调
7. 适当融入用户的姓名，让语录更有针对性
8. **重要：不要在语录中提及城市名称，城市信息仅用于了解天气背景**"""

        return prompt
