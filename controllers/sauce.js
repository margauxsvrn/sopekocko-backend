const Sauce = require('../models/Sauce');
const fs = require('fs'); // fs signifie « file system » (soit « système de fichiers » en français). Il nous donne accès aux fonctions qui nous permettent de modifier le système de fichiers, y compris aux fonctions permettant de supprimer les fichiers.


// Pour ajouter un fichier à la requête, le front-end doit envoyer les données de la requête sous la forme form-data, et non sous forme de JSON. 
// Le corps de la requête contient une chaîne sauce , qui est simplement un objet sauce converti en chaîne. 
// Nous devons donc l'analyser à l'aide de JSON.parse() pour obtenir un objet utilisable.

// Nous devons également résoudre l'URL complète de notre image, car req.file.filename ne contient que le segment filename . 
// Nous utilisons req.protocol pour obtenir le premier segment (dans notre cas 'http' ). 
// Nous ajoutons '://' , puis utilisons req.get('host') pour résoudre l'hôte du serveur (ici, 'localhost:3000' ). 
// Nous ajoutons finalement '/images/' et le nom de fichier pour compléter notre URL.

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject, // L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de sauceObject
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save() // Méthode save() qui enregistre dans la base de données.
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};


// // Méthode POST pour liker ou disliker

exports.definedStatusSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    const sauce = new Sauce({
        ...sauceObject, // L'opérateur spread ... est utilisé pour faire une copie de tous les éléments de sauceObject
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    });
    sauce.save() // Méthode save() qui enregistre dans la base de données.
        .then(() => res.status(201).json({ message: 'Objet enregistré !' }))
        .catch(error => res.status(400).json({ error }));
};

// Méthode get() pour répondre uniquement aux demandes GET; 
// Nous utilisons deux-points : en face du segment dynamique de la route pour la rendre accessible en tant que paramètre

exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id }) // méthode findOne() dans notre modèle sauce pour trouver la sauce unique ayant le même _id que le paramètre de la requête ; 
        .then(sauce => res.status(200).json(sauce)) // cette sauce est ensuite retourné dans une Promise et envoyé au front-end ;
        .catch(error => res.status(404).json({ error })) // si aucune sauce n'est trouvé ou si une erreur se produit, nous envoyons une erreur 404 au front-end, avec l'erreur générée.
}

// Route qui répond aux requêtes PUT (pour modifier un objet) 
// On crée un objet sauceObject qui regarde si req.file existe ou non. 
// S'il existe, on traite la nouvelle image ; 
// S'il n'existe pas, on traite simplement l'objet entrant. 
// On crée ensuite une instance sauce à partir de sauceObject , puis on effectue la modification.

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
        {
            ...JSON.parse(req.body.sauce),
            imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
        } : { ...req.body };
    Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id }) // méthode updateOne() dans le modèle sauce . Permet de mettre à jour le sauce qui correspond à l'objet que nous passons comme premier argument. Nous utilisons aussi le paramètre id passé dans la demande et le remplaçons par le sauce passé comme second argument.
        .then(() => res.status(200).json({ message: 'Objet modifié !' }))
        .catch(error => res.status(400).json({ error }));
};


// Route DELETE qui permets de supprimer un élément
// Dans cette fonction :
// Nous utilisons l'ID que nous recevons comme paramètre pour accéder au sauce correspondant dans la base de données ;
// Nous utilisons le fait de savoir que notre URL d'image contient un segment /images/ pour séparer le nom de fichier ;
// Nous utilisons ensuite la fonction unlink du package fs pour supprimer ce fichier, en lui passant le fichier à supprimer et le callback à exécuter une fois ce fichier supprimé ;
// Dans le callback, nous implémentons la logique d'origine, en supprimant le sauce de la base de données.

exports.deleteSauce = (req, res, next) => {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({ _id: req.params.id })
            .then(() => res.status(200).json({ message: 'Objet supprimé !'}))
            .catch(error => res.status(400).json({ error }));
        });
      })
      .catch(error => res.status(500).json({ error }));
  };

// Je crée la route GET : nous utilisons la méthode find() dans notre modèle Mongoose afin de renvoyer un tableau contenant tous les sauces dans notre base de données.

exports.getAllSauce = (req, res, next) => {
    Sauce.find()
        .then(sauces => res.status(200).json(sauces))
        .catch(error => res.status(400).json({ error }));
}