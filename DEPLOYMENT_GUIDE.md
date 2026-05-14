# 🚀 Deployment and Automation Guide

This guide explains how to use the automation scripts and deploy your backend to Hugging Face Spaces.

## 1. Kaggle Dataset Automation

To download the dataset automatically:
1. **Install Dependencies:**
   ```bash
   pip install kaggle
   ```
2. **Setup API Key:**
   - Go to [Kaggle Settings](https://www.kaggle.com/settings).
   - Click **"Create New API Token"**. This downloads `kaggle.json`.
   - Place `kaggle.json` in `~/.kaggle/` (Linux/Mac) or `C:\Users\<User>\.kaggle\` (Windows).
3. **Run Script:**
   ```bash
   python BACKEND/utils/download_data.py
   ```

## 2. GitHub LFS (Large File Storage)

Since the model file (`best_swin_model.pth`) is **335MB**, you must use Git LFS to push it to GitHub.

1. **Install Git LFS:** [git-lfs.github.com](https://git-lfs.github.com/)
2. **Initialize LFS in your repo:**
   ```bash
   git lfs install
   ```
3. **Track .pth files:**
   ```bash
   git lfs track "*.pth"
   ```
4. **Commit & Push:**
   ```bash
   git add .gitattributes
   git add BACKEND/models/checkpoints/best_swin_model.pth
   git commit -m "Add pre-trained model weights via LFS"
   git push origin main
   ```

## 3. Hugging Face Spaces Deployment

You can deploy the backend as a **Docker Space**.

1. Create a new Space on [Hugging Face](https://huggingface.co/new-space).
2. Select **Docker** as the SDK.
3. Choose the **Blank** template or **FastAPI**.
4. Push your `BACKEND` directory to the Space repository.
   - Ensure `Dockerfile`, `api.py`, `app.py`, and `requirements.txt` are in the root of the Space repo (or adjust paths).
5. **Environment Variables:** If you have secrets, add them in the Space Settings.
6. The API will be available at `https://<user>-<space_name>.hf.space`.

## 4. Training vs. Using Pre-trained

- **To use pre-trained:** Ensure `BACKEND/models/checkpoints/best_swin_model.pth` exists. The API will load it automatically.
- **To re-train:** 
  1. Download data (Step 1).
  2. Run `python BACKEND/training/train.py`.
  3. The new model will be saved to `BACKEND/models/checkpoints/`.
