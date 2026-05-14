import gradio as gr
import numpy as np
from pipeline import WheatDiseasePipeline
import config
from pathlib import Path

# Pipeline başlatma
pipeline = WheatDiseasePipeline(
    cls_checkpoint = str(config.MODEL_CHECKPOINT_PATH),
    cls_mapping    = str(config.MODELS_DIR / "class_mapping.json"),
    device         = str(config.DEVICE),
    cls_conf       = config.CONFIDENCE_THRESHOLD,
)

def predict(image):
    if image is None:
        return "Görüntü yüklenmedi", {}, "N/A"
    
    # Görüntü Gradio'dan RGB numpy array olarak gelir, 
    # pipeline ise bytes veya PIL bekler (veya numpy BGR).
    # Biz bytes'a çevirip gönderelim ya da doğrudan numpy olarak işleyelim.
    result = pipeline.run(image, skip_quality=False)
    
    if result.predicted_class == "Reddedildi":
        return (
            f"❌ Analiz Reddedildi: {result.rejection_reason}", 
            {}, 
            f"Bulanıklık: {result.blur_score:.1f} (Düşük kalite)"
        )

    # Olasılıkları Gradio Label formatına çevir
    probs = {c: float(s) for c, s in result.top3_predictions}
    
    quality_info = f"Görüntü Kalite Skoru: {result.blur_score:.1f}"
    if result.quality_warnings:
        quality_info += f"\nUyarılar: {', '.join(result.quality_warnings)}"

    return result.predicted_class, probs, quality_info

# Gradio Arayüzü
with gr.Blocks(theme=gr.themes.Soft(), title="Bugday Hastaligi Teshis Sistemi") as demo:
    gr.Markdown("# Bugday Hastaligi Teshis Sistemi")
    gr.Markdown("Swin Transformer tabanli derin ogrenme modeli ile 15 farkli bugday hastaligini teshis edin.")
    
    with gr.Row():
        with gr.Column():
            input_img = gr.Image(label="Buğday Yaprağı Fotoğrafı Yükleyin", type="numpy")
            btn = gr.Button("🔍 Teşhis Et", variant="primary")
            
        with gr.Column():
            output_label = gr.Textbox(label="En Olası Teşhis")
            output_probs = gr.Label(label="Sınıf Olasılıkları", num_top_classes=3)
            output_quality = gr.Textbox(label="Görüntü Kalite Bilgisi")

    btn.click(fn=predict, inputs=input_img, outputs=[output_label, output_probs, output_quality])
    
    gr.Markdown("""
    ### ℹ️ Desteklenen Sınıflar
    Aphid, Blast, Black Rust, Brown Rust, Common Root Rot, Fusarium Head Blight, Healthy, 
    Leaf Blight, Mildew, Mite, Septoria, Smut, Stem fly, Tan spot, Yellow Rust
    """)

if __name__ == "__main__":
    demo.launch(server_name="0.0.0.0", server_port=7860)
