let videoStream = null;
let useFrontCamera = false; // Variável para alternar entre câmera frontal e traseira

// Função para abrir a câmera (frontal ou traseira)
function openCamera() {
    console.log('openCamera chamado');
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        const constraints = {
            video: {
                facingMode: useFrontCamera ? 'user' : 'environment' // Alterna entre frontal e traseira
            }
        };

        navigator.mediaDevices.getUserMedia(constraints)
            .then(function(stream) {
                console.log('Stream de vídeo obtido');
                videoStream = stream;
                document.getElementById('enviarImagem').style.display = 'none';
                document.getElementById('cameraContainer').style.display = 'flex';
                const videoElement = document.getElementById('cameraView');
                videoElement.srcObject = stream;
                videoElement.play();
                console.log('Câmera aberta com sucesso!');
            })
            .catch(function(error) {
                console.error('Erro ao abrir a câmera:', error);
            });
    } else {
        console.error('Acesso à câmera não suportado pelo navegador.');
    }
}

// Função para alternar entre as câmeras
function switchCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop()); // Para o stream atual
    }
    useFrontCamera = !useFrontCamera; // Alterna a variável
    openCamera(); // Reabre a câmera com a nova configuração
}

// Função para fechar a câmera
function closeCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop()); // Para o stream atual
        videoStream = null;
        document.getElementById('cameraView').srcObject = null;
        document.getElementById('cameraContainer').style.display = 'none';
        document.getElementById('enviarImagem').style.display = 'block';
    }
}

// Função para tirar uma foto
function takePhoto() {
    if (videoStream) {
        console.log('takePhoto chamado');
        const videoElement = document.getElementById('cameraView');
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        const photoDataURL = canvas.toDataURL('image/png');
        const capturedImage = document.createElement('img');
        capturedImage.src = photoDataURL;
        capturedImage.style.width = '100%';

        // Mostra a imagem capturada no campo de pré-visualização
        const imagePreview = document.getElementById('imagePreview');
        if (imagePreview) {
            imagePreview.innerHTML = '';
            imagePreview.appendChild(capturedImage);
        } else {
            console.error('Elemento imagePreview não encontrado.');
        }

        // Obtém coordenadas de geolocalização
        if ('geolocation' in navigator) {
            navigator.geolocation.getCurrentPosition(function(position) {
                const latitudeField = document.querySelector('.latitude');
                const longitudeField = document.querySelector('.longitude');
                if (latitudeField && longitudeField) {
                    latitudeField.value = position.coords.latitude.toFixed(6);
                    longitudeField.value = position.coords.longitude.toFixed(6);
                } else {
                    console.error('Campos de latitude e/ou longitude não encontrados.');
                }
            }, function(error) {
                console.error('Erro ao obter a localização:', error);
            });
        } else {
            console.error('Geolocalização não suportada pelo navegador.');
        }

        videoElement.srcObject = null;
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
        document.getElementById('enviarImagem').style.display = 'block';
        document.getElementById('cameraContainer').style.display = 'none';
    }
}