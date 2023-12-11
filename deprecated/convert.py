from easygoogletranslate import EasyGoogleTranslate
import pandas as pd

# 初始化EasyGoogleTranslate对象
translator = EasyGoogleTranslate()

# 读取CSV文件
csv_file = 'output.csv'
df = pd.read_csv(csv_file)

# 遍历CSV文件的第一列（假设第一列包含需要翻译的文本）
translated_texts = []
for text in df.iloc[:, 0]:
    result = translator.translate(text, target_language='zh-CN')  # 将目标语言设置为需要的语言
    translated_texts.append(result)

# 将翻译结果添加到CSV文件的第二列
df['Translated_Text'] = translated_texts

# 保存包含翻译结果的CSV文件
translated_csv_file = 'translated_output.csv'
df.to_csv(translated_csv_file, index=False, header=True, encoding='utf-8')

print("翻译完成，结果保存在", translated_csv_file)
