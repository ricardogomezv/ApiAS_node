//const functions = require('firebase-functions');
const admin = require('firebase-admin');

var serviceAccount = require("../../api-as1-firebase-adminsdk-pdsa6-fcc463fdc3.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://api-as1.firebaseio.com/'
});

const db = admin.database();

const { Router } = require('express');
const router = Router();
const bodyParser = require('body-parser');

router.get('/', (req, res) =>{
  
    const promise1 =  new Promise ((resolve, reject) => {
        db.ref('usuario').once('value', (snapshot) =>{
            const data = snapshot.val();
            resolve(data);
        }).catch(error => {
            reject(error)
        });
    });    

    const promise2 =  new Promise ((resolve, reject) => {
        db.ref('newhistorial').once('value', (snapshot) =>{
            const data = snapshot.val();
            
            resolve(data);
           console.log(data);
        }).catch(error => {
            reject(error);
        });    
         //let nuevo = document.getElementById('temperature');
    });   

    Promise.all([promise1, promise2]).then(results => {
        if (results [0] && results[1]){
            res.render('index', {usuario : results[0], newhistorial: results [1]})
        } 
    });
});

router.post('/new-usuario', (req,res)=>{
    console.log(req.body);
    const newUsuario = {
        nombre: req.body.nombre,
        correo: req.body.correo, 
        edad: req.body.edad,
        genero: req.body.genero, 
    }
    db.ref('usuario').push(newUsuario);
    res.redirect('/');
});

router.post('/new-historial', (req,res)=>{
    console.log(req.body);
    const newHistorial = {
        hora: req.body.hora,
        temperatura: req.body.temperatura
    };
    db.ref('historial').push(newHistorial);
    res.redirect('/');
});

router.get('/delete-usuario/:id', (req, res) => {
    db.ref('usuario/' + req.params.id).remove();
    res.redirect('/');
});

router.get('/delete-historial/:id', (req, res) => {
    db.ref('newhistorial/' + req.params.id).remove();
    res.redirect('/');
});

module.exports = router;