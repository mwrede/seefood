"""
SeeFood backend: runs Roboflow workflow on uploaded images and returns yes/no.
"""
import os
import tempfile
import json
from flask import Flask, request, jsonify
from flask_cors import CORS
from inference_sdk import InferenceHTTPClient

app = Flask(__name__)
CORS(app)

client = InferenceHTTPClient(
    api_url="https://serverless.roboflow.com",
    api_key="jIlsPhHeCYPv0LCOooQT",
)


def is_hotdog(result) -> bool:
    """Determine if workflow result indicates a hotdog. Adapt keys to your workflow output."""
    if not result:
        return False
    # Handle dict: check common prediction shapes
    s = json.dumps(result).lower()
    if "hotdog" in s or "hot_dog" in s or "hot-dog" in s:
        return True
    # Some workflows return list of predictions with class names
    if isinstance(result, dict):
        for v in result.values():
            if isinstance(v, list) and v:
                for item in v:
                    if isinstance(item, dict):
                        c = item.get("class") or item.get("label") or item.get("name") or ""
                        if "hotdog" in str(c).lower() or "hot_dog" in str(c).lower():
                            return True
    return False


@app.route("/predict", methods=["POST"])
def predict():
    if "image" not in request.files and not request.json:
        return jsonify({"error": "No image provided"}), 400

    try:
        if request.files.get("image"):
            f = request.files["image"]
            with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp:
                f.save(tmp.name)
                path = tmp.name
            try:
                result = client.run_workflow(
                    workspace_name="michael-h89ju",
                    workflow_id="custom-workflow-8",
                    images={"image": path, "dog": path},
                    use_cache=True,
                )
            finally:
                os.unlink(path)
        else:
            # Base64 image from frontend
            data = request.get_json()
            b64 = data.get("image")
            if not b64:
                return jsonify({"error": "No image in body"}), 400
            # inference_sdk can accept base64 or URL; check if it accepts base64 string
            result = client.run_workflow(
                workspace_name="michael-h89ju",
                workflow_id="custom-workflow-8",
                images={"image": b64, "dog": b64},
                use_cache=True,
            )

        is_yes = is_hotdog(result)
        return jsonify({"result": "yes" if is_yes else "no", "raw": result})
    except Exception as e:
        return jsonify({"error": str(e), "result": "no"}), 200


@app.route("/health")
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
