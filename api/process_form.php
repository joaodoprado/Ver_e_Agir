<?php
$servername = "127.0.0.1";
$username = "root";
$password = "123456";
$dbname = "progeo_db";

// Cria a conexão
$conn = new mysqli($servername, $username, $password, $dbname);

// Verifica a conexão
if ($conn->connect_error) {
    die("Falha na conexão com o banco de dados: " . $conn->connect_error);
}

// Função para validar e limpar os dados do formulário
function clean_input($data) {
    return htmlspecialchars(stripslashes(trim($data)));
}

// Obtém os dados do formulário
$nome = isset($_POST['nome']) ? clean_input($_POST['nome']) : null;
$cpf = isset($_POST['cpf']) ? clean_input($_POST['cpf']) : null;
$tipoDeSolicitacao = isset($_POST['tipoDeSolicitacao']) ? clean_input($_POST['tipoDeSolicitacao']) : null;
$latitude = isset($_POST['latitude']) ? clean_input($_POST['latitude']) : null;
$longitude = isset($_POST['longitude']) ? clean_input($_POST['longitude']) : null;
$descricao = isset($_POST['descricao']) ? clean_input($_POST['descricao']) : null;

// Prepara a declaração SQL
$stmt = $conn->prepare("INSERT INTO solicitacoes (nome, cpf, tipoDeSolicitacao, latitude, longitude, descricao) VALUES (?, ?, ?, ?, ?, ?)");

// Verifica se a preparação foi bem-sucedida
if ($stmt === false) {
    die("Erro na preparação da declaração: " . $conn->error);
}

// Vincula os parâmetros aos valores
$stmt->bind_param("ssssss", $nome, $cpf, $tipoDeSolicitacao, $latitude, $longitude, $descricao);

// Executa a declaração
if ($stmt->execute()) {
    echo "Dados inseridos com sucesso";
} else {
    echo "Erro ao inserir dados: " . $stmt->error;
}

// Fecha a declaração e a conexão
$stmt->close();
$conn->close();
?>
