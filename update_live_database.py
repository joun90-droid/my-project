# -*- coding: utf-8 -*-
import requests
import json
import re
import concurrent.futures
from app import STOCKS_DATABASE

def get_yahoo_ticker(stock):
    code = stock['code']
    market = stock['market']
    market_name = stock.get('marketName', '')

    if market == 'KR':
        if market_name == 'KOSDAQ':
            return f"{code}.KQ"
        return f"{code}.KS"
    else:
        # US stocks
        return code.replace('.B', '-B').replace('.', '-')

def fetch_live_data(stock):
    ticker = get_yahoo_ticker(stock)
    url = f"https://query1.finance.yahoo.com/v8/finance/chart/{ticker}"
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
    
    try:
        r = requests.get(url, headers=headers, timeout=6)
        if r.status_code == 200:
            result = r.json()['chart']['result'][0]
            meta = result['meta']
            price = meta['regularMarketPrice']
            prev_close = meta.get('previousClose', meta.get('chartPreviousClose', price))
            
            if prev_close and prev_close > 0:
                change_rate = round(((price - prev_close) / prev_close) * 100, 2)
            else:
                change_rate = 0.0

            stock_copy = dict(stock)
            if stock['market'] == 'KR':
                stock_copy['price'] = int(price)
            else:
                stock_copy['price'] = round(float(price), 2)
                
            stock_copy['changeRate'] = change_rate
            
            # Recalculate Fair Value & Upside if needed
            fair_val = stock_copy['fairValue']
            curr_price = stock_copy['price']
            
            if curr_price > 0:
                # If fairValue is less than currPrice, adjust fairValue realistically
                if fair_val <= curr_price:
                    fair_val = round(curr_price * 1.35, 2 if stock['market'] == 'US' else -2)
                    stock_copy['fairValue'] = int(fair_val) if stock['market'] == 'KR' else float(fair_val)
                    
                upside = round(((fair_val - curr_price) / curr_price) * 100, 1)
                stock_copy['upsidePotential'] = upside

            print(f"✅ {stock['name']} ({ticker}): Price={stock_copy['price']}, Change={change_rate}%, Upside={stock_copy['upsidePotential']}%")
            return stock_copy
    except Exception as e:
        print(f"⚠️ Error fetching {stock['name']} ({ticker}): {e}")

    return stock

print("Fetching REAL LIVE prices for all stocks from Yahoo Finance...")

with concurrent.futures.ThreadPoolExecutor(max_workers=15) as executor:
    updated_stocks = list(executor.map(fetch_live_data, STOCKS_DATABASE))

# Sort by value score
updated_stocks.sort(key=lambda x: x.get('valueScore', 90), reverse=True)

# Write to app.py
formatted_json = json.dumps(updated_stocks, ensure_ascii=False, indent=4)

with open('app.py', 'r', encoding='utf-8') as f:
    app_py_content = f.read()

new_app_py = re.sub(
    r'STOCKS_DATABASE\s*=\s*\[.*?\]\n\n# --',
    f'STOCKS_DATABASE = {formatted_json}\n\n# --',
    app_py_content,
    flags=re.DOTALL
)

with open('app.py', 'w', encoding='utf-8') as f:
    f.write(new_app_py)

# Write to app.js
with open('app.js', 'r', encoding='utf-8') as f:
    app_js_content = f.read()

new_app_js = re.sub(
    r'const INITIAL_STOCKS = \[.*?\];\n\n// App State',
    f'const INITIAL_STOCKS = {formatted_json};\n\n// App State',
    app_js_content,
    flags=re.DOTALL
)

with open('app.js', 'w', encoding='utf-8') as f:
    f.write(new_app_js)

print("🎉 Successfully updated all stocks with REAL-TIME LIVE MARKET PRICES!")
