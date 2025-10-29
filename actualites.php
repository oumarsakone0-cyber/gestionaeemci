<?php
// API pour la gestion des actualités - Compatible avec sogetrag.com
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Gérer les requêtes OPTIONS pour CORS
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// Configuration de la base de données
$host = '91.216.107.162';
$dbname = 'soget2616263';
$username = 'soget2616263';
$password = '0Objectif-';

// Test de connexion
if (isset($_GET['test'])) {
    try {
        $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
        echo json_encode([
            'success' => true, 
            'message' => 'API Actualités accessible',
            'timestamp' => date('Y-m-d H:i:s')
        ]);
    } catch(PDOException $e) {
        echo json_encode(['success' => false, 'message' => 'Erreur DB: ' . $e->getMessage()]);
    }
    exit();
}

// Récupérer l'action
$action = $_GET['action'] ?? '';

// Connexion à la base de données
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname;charset=utf8mb4", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch(PDOException $e) {
    http_response_code(500);
    echo json_encode(['success' => false, 'message' => 'Erreur de connexion DB']);
    exit();
}

// Actions disponibles
switch ($action) {
    case 'list':
        $search = $_GET['search'] ?? '';
        $type = $_GET['type'] ?? '';
        $statut = $_GET['statut'] ?? '';
        
        $sql = "SELECT * FROM aeemciste_actualites WHERE 1=1";
        $params = [];
        
        if (!empty($search)) {
            $sql .= " AND (titre LIKE :search OR texte_affichage LIKE :search)";
            $params[':search'] = "%$search%";
        }
        
        if (!empty($type)) {
            $sql .= " AND type = :type";
            $params[':type'] = $type;
        }
        
        if (!empty($statut)) {
            $sql .= " AND statut = :statut";
            $params[':statut'] = $statut;
        }
        
        $sql .= " ORDER BY created_at DESC";
        
        try {
            $stmt = $pdo->prepare($sql);
            $stmt->execute($params);
            $actualites = $stmt->fetchAll();
            
            foreach ($actualites as &$actualite) {
                $actualite['photos'] = json_decode($actualite['photos'], true) ?? [];
            }
            
            echo json_encode(['success' => true, 'data' => $actualites]);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Erreur: ' . $e->getMessage()]);
        }
        break;
        
    case 'create':
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (empty($input['titre']) || empty($input['type']) || empty($input['lieu'])) {
            echo json_encode(['success' => false, 'message' => 'Données manquantes']);
            break;
        }
        
        $sql = "INSERT INTO aeemciste_actualites 
                (titre, type, date_debut, date_fin, date_specifique, lieu, texte_affichage, texte_detaille, statut, photos) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
        
        try {
            $stmt = $pdo->prepare($sql);
            $result = $stmt->execute([
                $input['titre'],
                $input['type'],
                $input['date_debut'] ?? null,
                $input['date_fin'] ?? null,
                $input['date_specifique'] ?? '',
                $input['lieu'],
                $input['texte_affichage'] ?? '',
                $input['texte_detaille'] ?? '',
                $input['statut'] ?? 'BROUILLON',
                json_encode($input['photos'] ?? [])
            ]);
            
            if ($result) {
                echo json_encode(['success' => true, 'message' => 'Actualité créée', 'id' => $pdo->lastInsertId()]);
            } else {
                echo json_encode(['success' => false, 'message' => 'Erreur lors de la création']);
            }
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Erreur: ' . $e->getMessage()]);
        }
        break;
        
    case 'update':
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? 0;
        
        if (empty($id)) {
            echo json_encode(['success' => false, 'message' => 'ID requis']);
            break;
        }
        
        $sql = "UPDATE aeemciste_actualites SET 
                titre = ?, type = ?, date_debut = ?, date_fin = ?, 
                date_specifique = ?, lieu = ?, texte_affichage = ?, 
                texte_detaille = ?, statut = ?, photos = ? 
                WHERE id = ?";
        
        try {
            $stmt = $pdo->prepare($sql);
            $result = $stmt->execute([
                $input['titre'],
                $input['type'],
                $input['date_debut'] ?? null,
                $input['date_fin'] ?? null,
                $input['date_specifique'] ?? '',
                $input['lieu'],
                $input['texte_affichage'] ?? '',
                $input['texte_detaille'] ?? '',
                $input['statut'] ?? 'BROUILLON',
                json_encode($input['photos'] ?? []),
                $id
            ]);
            
            if ($result) {
                echo json_encode(['success' => true, 'message' => 'Actualité mise à jour']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Actualité non trouvée']);
            }
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Erreur: ' . $e->getMessage()]);
        }
        break;
        
    case 'delete':
        $id = $_GET['id'] ?? 0;
        
        if (empty($id)) {
            echo json_encode(['success' => false, 'message' => 'ID requis']);
            break;
        }
        
        try {
            $stmt = $pdo->prepare("DELETE FROM aeemciste_actualites WHERE id = ?");
            $result = $stmt->execute([$id]);
            
            if ($result && $stmt->rowCount() > 0) {
                echo json_encode(['success' => true, 'message' => 'Actualité supprimée']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Actualité non trouvée']);
            }
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Erreur: ' . $e->getMessage()]);
        }
        break;
        
    case 'stats':
        try {
            $stats = [];
            
            // Total des actualités
            $stmt = $pdo->query("SELECT COUNT(*) as total FROM aeemciste_actualites");
            $stats['total'] = $stmt->fetch()['total'];
            
            // Actualités publiées
            $stmt = $pdo->query("SELECT COUNT(*) as publiees FROM aeemciste_actualites WHERE statut = 'PUBLIÉ'");
            $stats['publiees'] = $stmt->fetch()['publiees'];
            
            // Brouillons
            $stmt = $pdo->query("SELECT COUNT(*) as brouillons FROM aeemciste_actualites WHERE statut = 'BROUILLON'");
            $stats['brouillons'] = $stmt->fetch()['brouillons'];
            
            echo json_encode(['success' => true, 'data' => $stats]);
        } catch (PDOException $e) {
            echo json_encode(['success' => false, 'message' => 'Erreur: ' . $e->getMessage()]);
        }
        break;
        
    default:
        echo json_encode(['success' => false, 'message' => 'Action non trouvée']);
        break;
}
?>
