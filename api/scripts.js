// scripts.js

let videoStream = null; // Variável para armazenar o stream de vídeo

// Função para abrir a câmera
function openCamera() {
    // Verifica se o navegador suporta o acesso à câmera
    if ('mediaDevices' in navigator && 'getUserMedia' in navigator.mediaDevices) {
        // Solicita acesso à câmera
        navigator.mediaDevices.getUserMedia({ video: true })
            .then(function(stream) {
                // Armazena o stream de vídeo globalmente
                videoStream = stream;
                // Exibe o container da câmera e esconde o botão de carregar imagem
                document.getElementById('enviarImagem').style.display = 'none';
                document.getElementById('cameraContainer').classList.remove('hidden');
                // Exibe o stream no elemento de vídeo
                const videoElement = document.getElementById('cameraView');
                videoElement.srcObject = stream;
                console.log('Câmera aberta com sucesso!');
            })
            .catch(function(error) {
                console.error('Erro ao abrir a câmera:', error);
            });
    } else {
        console.error('Acesso à câmera não suportado pelo navegador.');
    }
}

// Função para tirar uma foto
function takePhoto() {
    if (videoStream) {
        const videoElement = document.getElementById('cameraView');
        const canvas = document.createElement('canvas');
        canvas.width = videoElement.videoWidth;
        canvas.height = videoElement.videoHeight;
        canvas.getContext('2d').drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        
        // Aqui você pode enviar o canvas para o servidor ou realizar outras operações com a imagem
        
        // Exemplo de como exibir a foto tirada no console
        const photoData = canvas.toDataURL('image/png');
        console.log('Foto tirada:', photoData);
        
        // Limpa a tela e reinicia o feed da câmera
        videoElement.srcObject = null;
        videoStream.getTracks().forEach(track => track.stop());
        videoStream = null;
        document.getElementById('enviarImagem').style.display = 'block';
        document.getElementById('cameraContainer').classList.add('hidden');
    }
}
