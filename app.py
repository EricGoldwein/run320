from flask import Flask, render_template, request, redirect, url_for, flash
import os
from werkzeug.utils import secure_filename
from wingo_checker import verify_wingo_run
import gpxpy

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'  # Change this in production
app.config['UPLOAD_FOLDER'] = 'uploads'
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size
ALLOWED_EXTENSIONS = {'gpx'}

# Ensure upload directory exists
os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        # Check if a file was uploaded
        if 'file' not in request.files:
            flash('No file selected')
            return redirect(request.url)
        
        file = request.files['file']
        if file.filename == '':
            flash('No file selected')
            return redirect(request.url)
        
        if file and allowed_file(file.filename):
            filename = secure_filename(file.filename)
            filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(filepath)
            
            # Get user name from form
            user_name = request.form.get('user_name', 'Runner')
            
            # Extract run coordinates for the map
            run_coords = []
            with open(filepath, 'r') as gpx_file:
                gpx = gpxpy.parse(gpx_file)
                for track in gpx.tracks:
                    for segment in track.segments:
                        for point in segment.points:
                            run_coords.append([point.latitude, point.longitude])
            
            # Verify the WINGO run
            results = verify_wingo_run(filepath, user_name)
            
            # Clean up the uploaded file
            os.remove(filepath)
            
            return render_template('results.html', results=results, run_coords=run_coords)
        
        flash('Invalid file type. Please upload a GPX file.')
        return redirect(request.url)
    
    return render_template('upload.html')

# WSGI wrapper for PythonAnywhere
def simple_wsgi_app(environ, start_response):
    return app(environ, start_response)

# Mount WSGI fallback endpoint
app.wsgi_app = simple_wsgi_app

if __name__ == '__main__':
    app.run(debug=True) 