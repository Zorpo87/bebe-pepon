import re

path = r'c:\Users\anton\Projects\BEBE-PEPON\index.html'
with open(path, 'r', encoding='utf-8') as f:
    html = f.read()

replacements = [
    (r'https://s6\.imginn\.com/474485313[^"\']*', 'assets/images/products/logo.jpg'),
    (r'https://s6\.imginn\.com/662553135[^"\']*', 'assets/images/products/04-jesusito-bebe.jpg'),
    (r'https://s6\.imginn\.com/669429281[^"\']*', 'assets/images/products/01-pelele-lazo.jpg'),
    (r'https://s6\.imginn\.com/669032982[^"\']*', 'assets/images/products/02-ranita-volantes.jpg'),
    (r'https://s6\.imginn\.com/658136489[^"\']*', 'assets/images/products/05-jesusito-ninos.jpg'),
    (r'https://s6\.imginn\.com/669620861[^"\']*', 'assets/images/products/03-saquito-elasticos.jpg'),
    (r'https://s6\.imginn\.com/651482418[^"\']*', 'assets/images/products/07-blusa-volante-floral.jpg'),
    (r'https://s6\.imginn\.com/662002508[^"\']*', 'assets/images/products/06-jesusito-bebe-2.jpg'),
    (r'https://s6\.imginn\.com/657362693[^"\']*', 'assets/images/products/11-jesusito-ninos-2.jpg'),
    (r'https://s6\.imginn\.com/640935601[^"\']*', 'assets/images/products/13-jesusito-bebe-3.jpg'),
    (r'https://s6\.imginn\.com/658934349[^"\']*', 'assets/images/products/15-jesusito-ninos-3.jpg'),
]

for pattern, repl in replacements:
    html = re.sub(pattern, repl, html)

with open(path, 'w', encoding='utf-8') as f:
    f.write(html)

remaining = len(re.findall('imginn', html))
print(f'Done. Remaining imginn refs: {remaining}')
