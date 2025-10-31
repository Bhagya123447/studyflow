from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)  # ✅ Allow Node.js + frontend to access Flask APIs


# -------------------------------
# 🔹 Helper Function
# -------------------------------
def parse_sessions(sessions):
    """
    Convert session list into DataFrame with start, end, and duration in minutes.
    Each session: {startTime, endTime, focusedMinutes}
    """
    rows = []
    for s in sessions:
        start = pd.to_datetime(s.get('startTime'))
        if s.get('endTime'):
            end = pd.to_datetime(s.get('endTime'))
        else:
            end = start + timedelta(minutes=s.get('focusedMinutes', 0))
        duration = s.get('focusedMinutes', int((end - start).total_seconds() / 60))
        rows.append({'start': start, 'end': end, 'minutes': duration})
    return pd.DataFrame(rows)


# -------------------------------
# 🔹 Route 1: Predict Peak Focus Hours
# -------------------------------
@app.route('/predict_peak_hours', methods=['POST'])
def predict_peak_hours():
    try:
        data = request.json
        sessions = data.get('sessions', [])
        if not sessions:
            return jsonify({"peak_hours": [], "message": "no sessions"}), 200

        df = parse_sessions(sessions)
        df['hour'] = df['start'].dt.hour
        hour_sum = df.groupby('hour')['minutes'].sum()

        # get top 3 peak focus hours
        top = hour_sum.sort_values(ascending=False).head(3)
        peak_hours = [{"hour": int(idx), "minutes": int(val)} for idx, val in top.items()]

        # median continuous focus duration
        median_focus = int(df['minutes'].median())
        rec_break_after = median_focus if median_focus > 0 else 25

        return jsonify({
            "peak_hours": peak_hours,
            "median_focus_minutes": median_focus,
            "recommended_break_after_min": rec_break_after
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------
# 🔹 Route 2: Energy Pattern Analysis
# -------------------------------
@app.route('/energy_pattern', methods=['POST'])
def energy_pattern():
    try:
        data = request.json
        sessions = data.get('sessions', [])
        df = parse_sessions(sessions)
        if df.empty:
            return jsonify({"message": "no data"}), 200

        q25 = int(df['minutes'].quantile(0.25))
        q50 = int(df['minutes'].quantile(0.5))
        q75 = int(df['minutes'].quantile(0.75))

        # basic recommendation message
        suggestion = "Try shorter sessions (~{} mins) followed by short breaks.".format(q50)
        if q50 > 50:
            suggestion = "You can handle longer sessions (~{} mins). Take breaks every hour.".format(q50)

        return jsonify({
            "q25": q25,
            "median": q50,
            "q75": q75,
            "suggestion": suggestion
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# -------------------------------
# 🔹 Root / Health Check
# -------------------------------
@app.route('/', methods=['GET'])
def home():
    return jsonify({"message": "AI Service running successfully 🚀"})


# -------------------------------
# 🔹 Run Server
# -------------------------------
if __name__ == "__main__":
    app.run(port=5000, debug=True)
