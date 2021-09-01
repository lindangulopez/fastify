/**
 * 1. Créer un plugin fastify dans ce fichier
 * 2. Brancher le plugin dans le fichier
 *    src/index.js
 * 3. Couper / Coller et retoucher le code
 *    des routes: get /categories et post /categories
 */

 const mongodb = require('mongodb')

 module.exports = async (app) => {
   // Récupére les catégories
   app.get('/categories', async () => {
     // Récupération de toutes les categories
     const categories = await app.db.collection('categories').find().toArray()

     return categories
   })

   // Création d'une catégorie
   app.post(
     '/categories',
     {
       schema: {
         body: {
           type: 'object',
           properties: {
             title: {
               type: 'string',
             },
           },
           required: ['title'],
         },
       },
     },
     async (request, reply) => {
       const category = request.body

       // On insére la catégorie
       const result = await app.db.collection('categories').insertOne(category)

       // On récupére la catégorie qui vient d'être enregistré
       const insertedCategory = await app.db.collection('categories').findOne({
         _id: mongodb.ObjectId(result.insertedId),
       })

       // Changement du status code pour être 201
       reply.code(201)
       // Ajouter un header http
       reply.header('Inserted-Id', result.insertedId)

       return insertedCategory
     }
   )
 }


