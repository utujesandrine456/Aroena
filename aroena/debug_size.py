import os

def get_size(start_path='.'):
    total_size = 0
    for dirpath, dirnames, filenames in os.walk(start_path):
        for f in filenames:
            fp = os.path.join(dirpath, f)
            # skip if it is symbolic link
            if not os.path.islink(fp):
                try:
                    total_size += os.path.getsize(fp)
                except OSError:
                    pass
    return total_size

def find_large_items(start_path='.', threshold_mb=10):
    items = []
    # Check top-level directories
    for item in os.listdir(start_path):
        item_path = os.path.join(start_path, item)
        if os.path.isdir(item_path):
            size = get_size(item_path)
            if size > threshold_mb * 1024 * 1024:
                items.append((item, size / (1024 * 1024), "DIR"))
        else:
            size = os.path.getsize(item_path)
            if size > threshold_mb * 1024 * 1024:
                items.append((item, size / (1024 * 1024), "FILE"))
    
    return sorted(items, key=lambda x: x[1], reverse=True)

def check_easignore():
    if not os.path.exists('.easignore'):
        print(".easignore not found")
        return
    
    with open('.easignore', 'rb') as f:
        content = f.read()
        print(f"First 10 bytes: {content[:10].hex(' ')}")
        print(f"Length: {len(content)}")
        
    try:
        text = content.decode('utf-8')
        print("Encoding: UTF-8 (or ASCII)")
        if '\r\n' in text:
            print("Line endings: CRLF")
        elif '\n' in text:
            print("Line endings: LF")
    except UnicodeDecodeError:
        try:
            content.decode('utf-16')
            print("Encoding: UTF-16")
        except UnicodeDecodeError:
            print("Encoding: Unknown")

if __name__ == "__main__":
    print("--- Large Items (>10MB) ---")
    for name, size, type in find_large_items():
        print(f"{type:4} {size:8.2f} MB  {name}")
    
    print("\n--- .easignore Check ---")
    check_easignore()
