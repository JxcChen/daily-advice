import { NextRequest, NextResponse } from 'next/server';

interface GenerateRequest {
  name: string;
  event?: string;
  mood?: string;
  city?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: GenerateRequest = await request.json();
    const { name, event, mood, city = '北京' } = body;

    // 验证必填字段
    if (!name || name.trim().length === 0) {
      return NextResponse.json(
        { error: '姓名不能为空' },
        { status: 400 }
      );
    }

    // 获取当前日期和时间
    const now = new Date();
    const dateStr = now.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    const weekday = ['日', '一', '二', '三', '四', '五', '六'][now.getDay()];
    const timeStr = now.toLocaleTimeString('zh-CN', {
      hour: '2-digit',
      minute: '2-digit',
    });

    // 获取天气信息
    let weatherInfo = {
      condition: '晴',
      temperature: 20,
      city: city,
    };

    try {
      const qweatherKey = process.env.QWEATHER_API_KEY;
      if (qweatherKey) {
        // 先获取城市ID
        const geoResponse = await fetch(
          `https://geoapi.qweather.com/v2/city/lookup?location=${encodeURIComponent(city)}&key=${qweatherKey}`,
          { next: { revalidate: 3600 } } // 缓存1小时
        );

        if (geoResponse.ok) {
          const geoData = await geoResponse.json();
          if (geoData.code === '200' && geoData.location?.[0]) {
            const locationId = geoData.location[0].id;

            // 获取实时天气
            const weatherResponse = await fetch(
              `https://devapi.qweather.com/v7/weather/now?location=${locationId}&key=${qweatherKey}`,
              { next: { revalidate: 3600 } }
            );

            if (weatherResponse.ok) {
              const weatherData = await weatherResponse.json();
              if (weatherData.code === '200' && weatherData.now) {
                weatherInfo = {
                  condition: weatherData.now.text,
                  temperature: parseInt(weatherData.now.temp),
                  city: city,
                };
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('获取天气信息失败:', error);
      // 使用默认天气信息
    }

    // 构建 AI 提示词
    let prompt = `你是一位富有情感智慧的励志导师。请根据以下信息为用户生成一句今日励志语录：

【用户信息】
- 姓名：${name}

【时间信息】
- 今日日期：${dateStr}（星期${weekday}）
- 当前时间：${timeStr}

【环境信息】
- 天气：${weatherInfo.condition}
- 气温：${weatherInfo.temperature}°C
`;

    // 添加用户输入的状态（如果有）
    if (event || mood) {
      prompt += '\n【用户状态】\n';
      if (event) {
        prompt += `- 今日大事：${event}\n`;
      }
      if (mood) {
        prompt += `- 目前心情：${mood}\n`;
      }
    }

    prompt += `
【输出要求】
1. 生成一句30-60字的励志语录
2. 语录需结合天气、心情等因素
3. 风格：富有诗意、积极向上、贴近用户情境
4. 格式：直接输出语录内容，不要任何前缀、后缀或解释
5. 根据天气和心情调整语录情感色调
6. 适当融入用户的姓名，让语录更有针对性
7. **重要：不要在语录中提及城市名称，城市信息仅用于了解天气背景**`;

    // 调用 DeepSeek API
    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    if (!deepseekKey) {
      return NextResponse.json(
        { error: 'DeepSeek API 密钥未配置' },
        { status: 500 }
      );
    }

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${deepseekKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'system',
            content: '你是一位富有情感智慧的励志导师。',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: 0.8,
        max_tokens: 200,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || '生成失败');
    }

    const data = await response.json();
    const quote = data.choices[0].message.content.trim();

    // 识别情绪
    const emotion = detectEmotion(mood || '');
    const emotionInfo = getEmotionInfo(emotion);

    return NextResponse.json({
      quote: {
        content: quote,
        emotion: emotion,
        emotion_icon: emotionInfo.icon,
        emotion_color: emotionInfo.color,
        weather: weatherInfo,
        is_birthday: false,
        created_at: now.toISOString(),
      },
    });
  } catch (error: any) {
    console.error('生成语录失败:', error);
    return NextResponse.json(
      { error: error.message || '生成失败，请稍后重试' },
      { status: 500 }
    );
  }
}

// 情绪识别函数
function detectEmotion(mood: string): string {
  if (!mood) return 'default';

  const moodLower = mood.toLowerCase();

  // 开心
  if (/开心|高兴|愉快|快乐|兴奋|喜悦/.test(moodLower)) {
    return 'happy';
  }
  // 焦虑
  if (/焦虑|紧张|担心|不安|压力/.test(moodLower)) {
    return 'anxious';
  }
  // 疲惫
  if (/疲惫|累|困|乏|倦/.test(moodLower)) {
    return 'tired';
  }
  // 伤心
  if (/伤心|难过|悲伤|沮丧|失落/.test(moodLower)) {
    return 'sad';
  }
  // 愤怒
  if (/愤怒|生气|恼火|烦躁|不爽/.test(moodLower)) {
    return 'angry';
  }
  // 期待
  if (/期待|期盼|憧憬|向往|希望/.test(moodLower)) {
    return 'expectant';
  }
  // 平静
  if (/平静|平和|淡定|安静|放松/.test(moodLower)) {
    return 'calm';
  }

  return 'default';
}

// 获取情绪配置
function getEmotionInfo(emotion: string) {
  const emotions: Record<string, { icon: string; color: string }> = {
    happy: { icon: '😊', color: '#d4af37' },
    calm: { icon: '😌', color: '#00ced1' },
    tired: { icon: '😔', color: '#808080' },
    anxious: { icon: '😰', color: '#4169e1' },
    angry: { icon: '😤', color: '#dc143c' },
    sad: { icon: '😢', color: '#9370db' },
    expectant: { icon: '🤩', color: '#ff8c00' },
    default: { icon: '🧘', color: '#ffffff' },
  };

  return emotions[emotion] || emotions.default;
}
