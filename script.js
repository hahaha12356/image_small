document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const imageInput = document.getElementById('imageInput');
    const compressionControls = document.getElementById('compressionControls');
    const previewContainer = document.getElementById('previewContainer');
    const downloadArea = document.getElementById('downloadArea');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');

    let originalImage = null;

    // 上传区域点击事件
    uploadArea.addEventListener('click', () => {
        imageInput.click();
    });

    // 拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#007AFF';
    });

    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#c7c7c7';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#c7c7c7';
        const file = e.dataTransfer.files[0];
        if (file && file.type.match('image.*')) {
            handleImageUpload(file);
        }
    });

    // 文件选择处理
    imageInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleImageUpload(file);
        }
    });

    // 质量滑块变化事件
    qualitySlider.addEventListener('input', (e) => {
        qualityValue.textContent = `${e.target.value}%`;
        if (originalImage) {
            compressImage(originalImage, e.target.value / 100);
        }
    });

    // 下载按钮点击事件
    downloadBtn.addEventListener('click', () => {
        const link = document.createElement('a');
        link.download = 'compressed-image.jpg';
        link.href = compressedPreview.src;
        link.click();
    });

    // 处理图片上传
    function handleImageUpload(file) {
        originalImage = file;
        const reader = new FileReader();
        
        reader.onload = (e) => {
            originalPreview.src = e.target.result;
            originalSize.textContent = `文件大小: ${formatFileSize(file.size)}`;
            
            compressionControls.style.display = 'block';
            previewContainer.style.display = 'grid';
            downloadArea.style.display = 'block';

            compressImage(file, qualitySlider.value / 100);
        };

        reader.readAsDataURL(file);
    }

    // 压缩图片
    function compressImage(file, quality) {
        const img = new Image();
        img.src = URL.createObjectURL(file);

        img.onload = () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');

            canvas.width = img.width;
            canvas.height = img.height;

            ctx.drawImage(img, 0, 0);

            canvas.toBlob(
                (blob) => {
                    compressedPreview.src = URL.createObjectURL(blob);
                    compressedSize.textContent = `文件大小: ${formatFileSize(blob.size)}`;
                },
                'image/jpeg',
                quality
            );
        };
    }

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 