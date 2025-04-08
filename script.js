const canvas = document.getElementById('imageCanvas');
const ctx = canvas.getContext('2d');
let img = new Image();
let history = [];
let isCropping = false;
let startX, startY;

function loadImage(event) {
    const file = event.target.files[0];
    img.src = URL.createObjectURL(file);
    img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        saveState();
    };
}

function saveState() {
    history.push(canvas.toDataURL());
    if (history.length > 10) history.shift();
}

function undo() {
    if (history.length > 1) {
        history.pop();
        const lastState = new Image();
        lastState.onload = () => {
            canvas.width = lastState.width;
            canvas.height = lastState.height;
            ctx.drawImage(lastState, 0, 0);
        };
        lastState.src = history[history.length - 1];
    }
}

function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.style.display = 'none');
    document.getElementById(tabName).style.display = 'block';
}

function showHelp() {
    document.getElementById('helpModal').style.display = 'block';
}

function hideHelp() {
    document.getElementById('helpModal').style.display = 'none';
}

function applyFilters() {
    const brightness = document.getElementById('brightness').value;
    const contrast = document.getElementById('contrast').value;
    const saturation = document.getElementById('saturation').value;
    ctx.filter = `brightness(${100 + Number(brightness)}%) contrast(${100 + Number(contrast)}%) saturate(${saturation}%)`;
    ctx.drawImage(img, 0, 0);
    saveState();
}

function applyGrayscale() {
    ctx.filter = 'grayscale(100%)';
    ctx.drawImage(img, 0, 0);
    saveState();
}

function applySilhouette() {
    ctx.filter = 'contrast(1000%) brightness(1000%)';
    ctx.drawImage(img, 0, 0);
    saveState();
}

function applyColoredArea() {
    const color = prompt("Digite a cor em formato hexadecimal (ex: #ff0000 para vermelho):", "#ff0000");
    if (color) {
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveState();
    }
}

function applyAging() {
    const level = document.getElementById('agingLevel').value;
    ctx.filter = `sepia(${level}%)`;
    ctx.drawImage(img, 0, 0);
    saveState();
}

function applyPaintEffect() {
    const level = document.getElementById('paintEffectLevel').value;
    const contrast = 100 + (level * 10);
    const saturate = 100 + (level * 20);
    ctx.filter = `contrast(${contrast}%) saturate(${saturate}%)`;
    ctx.drawImage(img, 0, 0);
    saveState();
}

function applyHueRotate() {
    const level = document.getElementById('hueRotateLevel').value;
    ctx.filter = `hue-rotate(${level}deg)`;
    ctx.drawImage(img, 0, 0);
    saveState();
}

function applyInvert() {
    const level = document.getElementById('invertLevel').value;
    ctx.filter = `invert(${level})`;
    ctx.drawImage(img, 0, 0);
    saveState();
}

function enableCrop() {
    isCropping = true;
    canvas.addEventListener('mousedown', startSelection);
    canvas.addEventListener('mouseup', cropImage);
}

function startSelection(e) {
    if (isCropping) {
        startX = e.offsetX;
        startY = e.offsetY;
    }
}

function cropImage(e) {
    if (isCropping) {
        const endX = e.offsetX;
        const endY = e.offsetY;
        const width = endX - startX;
        const height = endY - startY;
        const imageData = ctx.getImageData(startX, startY, width, height);
        canvas.width = width;
        canvas.height = height;
        ctx.putImageData(imageData, 0, 0);
        saveState();
        isCropping = false;
        canvas.removeEventListener('mousedown', startSelection);
        canvas.removeEventListener('mouseup', cropImage);
    }
}

function printImage() {
    window.print();
}

function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const imgData = canvas.toDataURL('image/png');
    doc.addImage(imgData, 'PNG', 0, 0);
    doc.save('imagem_editada.pdf');
}
