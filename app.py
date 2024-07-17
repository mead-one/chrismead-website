#!/usr/bin/python3

from flask import Flask, render_template, send_from_directory

app = Flask(__name__)

@app.route('/')
def index():
    return render_template('index.html', title='Home')

@app.route('/favicon.ico')
def favicon():
    return send_from_directory('.', 'favicon.ico')

@app.route('/projects')
def projects():
    return render_template('projects.html', title='My Projects')

@app.route('/workflow')
def workflow():
    return render_template('workflow.html', title='My Workflow')

@app.route('/about')
def about():
    return render_template('about.html', title='About Me')

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0")
