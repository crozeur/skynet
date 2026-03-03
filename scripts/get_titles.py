import os
import re

blog_dir = "content/blog"
for f in os.listdir(blog_dir):
    if f.endswith(".mdx"):
        path = os.path.join(blog_dir, f)
        with open(path, "r", encoding="utf-8") as file:
            content = file.read()
            match = re.search(r'title:\s*"(.*?)"', content)
            if match:
                print(f"{f}: {match.group(1)}")
