import fs from 'fs';
import path from 'path';

// Chemin du fichier à créer et supprimer
const FILE_PATH = path.join(__dirname, 'tempfile.txt');

// Fonction pour créer un fichier
function createFile() {
    return new Promise<void>((resolve, reject) => {
        fs.writeFile(FILE_PATH, 'Serverless keep-alive file', (err: any) => {
            if (err) reject(err);
            else {
                console.log(`Fichier créé : ${FILE_PATH}`);
                resolve();
            }
        });
    });
}

// Fonction pour supprimer un fichier
function deleteFile() {
    return new Promise<void>((resolve, reject) => {
        fs.unlink(FILE_PATH, (err) => {
            if (err) reject(err);
            else {
                console.log(`Fichier supprimé : ${FILE_PATH}`);
                resolve();
            }
        });
    });
}

// Routine pour créer et supprimer le fichier toutes les 2 minutes
setInterval(async () => {
    try {
        console.log('Début de la routine...');
        await createFile();
        setTimeout(async () => {
            await deleteFile();
        }, 5000); // Supprimer le fichier après 5 secondes
    } catch (error: any) {
        console.error('Erreur lors de la routine :', error.message);
    }
}, 2 * 60 * 1000); // Toutes les 2 minutes