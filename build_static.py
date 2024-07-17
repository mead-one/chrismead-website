#!/usr/bin/python3

import os
from shutil import copy2, copytree
from flask import Flask, render_template

app = Flask(__name__)

# Ensure the export directory exists
EXPORT_DIR = './export/'
if not os.path.exists(EXPORT_DIR):
    os.makedirs(EXPORT_DIR)

# Routes to render templates and their corresponding titles
routes = {
    '/': ('index.html', 'Home'),
    '/projects': ('projects.html', 'My Projects'),
    '/workflow': ('workflow.html', 'My Workflow'),
    '/about': ('about.html', 'About Me')
}

def update_static_file_paths(file_path):
    try:
        with open(file_path, 'r', encoding='utf-8') as file:
            content = file.read()
        updated_content = content.replace('/static/', '/')
        with open(file_path, 'w', encoding='utf-8') as file:
            file.write(updated_content)
    except Exception as e:
        print(f"Error processing file {file_path}: {e}")

def build_static_site():
    # Copy static files to the root of the export directory and update paths
    if os.path.exists('static'):
        for root, dirs, files in os.walk('static'):
            for file_name in files:
                src_path = os.path.join(root, file_name)
                relative_path = os.path.relpath(src_path, 'static')
                dest_path = os.path.join(EXPORT_DIR, relative_path)
                os.makedirs(os.path.dirname(dest_path), exist_ok=True)
                copy2(src_path, dest_path)
                update_static_file_paths(dest_path)
                print(f"Copied and updated static file: {src_path} to {dest_path}")

    # Render templates and save them as static HTML files
    with app.app_context():
        for route, (template, title) in routes.items():
            rendered_template = render_template(template, title=title)
            # Update links in the rendered template
            updated_template = rendered_template.replace('href="/static/', 'href="/')
            updated_template = updated_template.replace('src="/static/', 'src="/')
            # Determine the output file path
            if route == '/':
                output_path = os.path.join(EXPORT_DIR, 'index.html')
            else:
                output_path = os.path.join(EXPORT_DIR, route.strip('/'), 'index.html')
                os.makedirs(os.path.dirname(output_path), exist_ok=True)
            # Write the updated template to the output path
            with open(output_path, 'w', encoding='utf-8') as f:
                f.write(updated_template)
            print(f"Generated static file: {output_path}")

# Run the static site generator
if __name__ == '__main__':
    build_static_site()
    print("Static site generation complete.")
