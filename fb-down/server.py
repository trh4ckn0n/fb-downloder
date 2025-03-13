from flask import Flask, render_template, request, jsonify, redirect
import yt_dlp
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests if needed

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/get_fb_video", methods=["POST"])
def get_fb_video():
    data = request.json
    video_url = data.get("url")

    if not video_url:
        return jsonify({"error": "No URL provided"}), 400

    ydl_opts = {"quiet": True}

    try:
        with yt_dlp.YoutubeDL(ydl_opts) as ydl:
            info = ydl.extract_info(video_url, download=False)
            formats = [
                {"quality": fmt.get("format_note", "Unknown"), "url": fmt["url"]}
                for fmt in info.get("formats", []) if "url" in fmt
            ]
        return jsonify({
            "title": info.get("title", "Facebook Video"),
            "thumbnail": info.get("thumbnail", ""),
            "formats": formats
        })
    except Exception as e:
        print("Error fetching video:", str(e))
        return jsonify({"error": "Failed to fetch video"}), 500

@app.route("/download")
def download():
    url = request.args.get("url")
    if url:
        return redirect(url, code=302)
    return "Invalid URL", 400

if __name__ == "__main__":
    app.run(debug=True)
