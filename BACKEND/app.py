import os
import sys
import gradio as gr
from pathlib import Path
from PIL import Image

# Add current directory to path
project_root = Path(__file__).resolve().parent
if str(project_root) not in sys.path:
    sys.path.append(str(project_root))

from pipeline import WheatDiseasePipeline
import config

# Initialize Pipeline
pipeline = WheatDiseasePipeline(
    cls_checkpoint = str(config.MODEL_CHECKPOINT_PATH),
    cls_mapping    = str(config.MODELS_DIR / "class_mapping.json"),
    device         = "cpu", # Spaces typically use CPU unless paid
    cls_conf       = 0.50,
)

def predict(image):
    if image is None:
        return "Lütfen bir görüntü yükleyin.", None, None
    
    # Run pipeline
    result = pipeline.run(image)
    data = pipeline.result_to_dict(result)
    
    # Format results for Gradio
    classification = data["classification"]
    top3 = classification["top3_predictions"]
    
    label_output = {item["class"]: item["score"] for item in top3}
    
    # Quality info
    quality = data["quality"]
    quality_text = f"Geçerli: {quality['is_valid']}\nBulanıklık Skoru: {quality['blur_score']}\n"
    if quality["warnings"]:
        quality_text += f"Uyarılar: {', '.join(quality['warnings'])}"
    
    return classification["predicted_class"], label_output, quality_text

# Create Gradio Interface
with gr.Blocks(theme=gr.themes.Soft()) as demo:
    gr.Markdown("# 🌾 Buğday Hastalık Teşhis Sistemi")
    gr.Markdown("Bu uygulama, Swin Transformer (Tiny) mimarisini kullanarak buğday yapraklarındaki hastalıkları tespit eder.")
    
    with gr.Row():
        with gr.Column():
            input_img = gr.Image(type="pil", label="Buğday Yaprağı Görüntüsü")
            btn = gr.Button("Teşhis Et", variant="primary")
        
        with gr.Column():
            output_label = gr.Textbox(label="En Olası Teşhis")
            output_probs = gr.Label(label="Sınıf Olasılıkları", num_top_classes=3)
            output_quality = gr.Textbox(label="Görüntü Kalite Bilgisi")

    btn.click(fn=predict, inputs=input_img, outputs=[output_label, output_probs, output_quality])
    
    gr.Examples(
        examples=[], # Add example images if available
        inputs=input_img
    )

if __name__ == "__main__":
    demo.launch()
