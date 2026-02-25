import os
import re
from datetime import datetime

# Configuration
ARTIKEL_DIR = 'artikel'
INDEX_FILE = 'index.html'
START_MARKER = '<!-- POPULAR_START -->'
END_MARKER = '<!-- POPULAR_END -->'

def get_article_title(filepath):
    """Extracts title from <h1> tag in the HTML file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            # Look for <h1>...</h1>
            match = re.search(r'<h1[^>]*>(.*?)</h1>', content, re.DOTALL)
            if match:
                title = match.group(1).strip()
                # Remove nested tags if any (like <span>)
                title = re.sub(r'<[^>]+>', '', title)
                return title
    except Exception as e:
        print(f"Error reading {filepath}: {e}")
    return None

def main():
    if not os.path.exists(ARTIKEL_DIR):
        print(f"Directory {ARTIKEL_DIR} not found.")
        return

    articles = []
    for filename in os.listdir(ARTIKEL_DIR):
        if filename.endswith('.html'):
            filepath = os.path.join(ARTIKEL_DIR, filename)
            title = get_article_title(filepath)
            if title:
                # Get modification time for sorting
                mtime = os.path.getmtime(filepath)
                articles.append({
                    'filename': filename,
                    'title': title,
                    'mtime': mtime
                })

    # Sort by mtime descending (most recent first)
    articles.sort(key=lambda x: x['mtime'], reverse=True)

    # Take top 5
    top_articles = articles[:5]

    # Generate HTML
    html_lines = []
    for i, art in enumerate(top_articles, 1):
        num = f"{i:02d}"
        link = f"artikel/{art['filename']}"
        item_html = f"""                        <a href="{link}" class="popular-item">
                            <div class="popular-item__number">{num}</div>
                            <div class="popular-item__content">
                                <div class="popular-item__title">{art['title']}</div>
                            </div>
                        </a>"""
        html_lines.append(item_html)

    new_content = "\n".join(html_lines)

    # Update index.html
    if not os.path.exists(INDEX_FILE):
        print(f"{INDEX_FILE} not found.")
        return

    with open(INDEX_FILE, 'r', encoding='utf-8') as f:
        index_html = f.read()

    pattern = re.escape(START_MARKER) + r".*?" + re.escape(END_MARKER)
    replacement = f"{START_MARKER}\n{new_content}\n                        {END_MARKER}"
    
    if re.search(pattern, index_html, re.DOTALL):
        updated_html = re.sub(pattern, replacement, index_html, flags=re.DOTALL)
        with open(INDEX_FILE, 'w', encoding='utf-8') as f:
            f.write(updated_html)
        print(f"Successfully updated {INDEX_FILE} with {len(top_articles)} articles.")
    else:
        print(f"Markers not found in {INDEX_FILE}.")

if __name__ == "__main__":
    main()
