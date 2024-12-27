const express = require('express')
const router= express.Router()
const Book = require('../models/book_model')

//Obtener todos los libros [GET ALL]
router.get('/', async(req,res)=>{
    try{
        const books = await Book.find();
        console.log('GET ALL',books)
        if (books.length == 0){
            return res.status(204).json([])
        }
        res.json(books)
    }catch (error){
        res.status(500).json({message: error.message})
    }
})
//middeleware
const getBook= async(req,res,next) =>{
    let book;
    const {id}=req.params;
    if(!id.match(/^[0-9a-fA-F]{24}$/)){
        return res.status(404).json(
            {
                message: 'El ID del libro no es válida'
            }
        )
    }
    try{
        book = await Book.findById(id);
        if (!book){
            return res.status(404).json({
                message:'El libro n fue encontrado'
            })
        }
    }catch(error){
        return res.status(500).json({
            message: error.message
        })
    }
    res.book = book;
    next()
}
//crear un nuevo libro(recurso) [POST]

router.post('/', async(req,res)=>{
    const {title,author,genre,publication_data} = req?.body
    if(!title || !author || !genre || !publication_data){
        return res.status(400).json({
            message:'las campos son obligatorios'
        })
    }

    const book = new Book(
        {
            title,
            author,
            genre,
            publication_data
        }
    )
    try{
        const newBook = await book.save()
        res.status(201).json(newBook)
    }catch(error){
        res.status(400).json({
            message: error.message
        })
    }
})
router.get('/:id',getBook, async(req,res) => {
    res.json(res.book);
})
router.put('/:id',getBook, async(req,res) => {
    try{
        const book = res.book
        book.title = req.body.title || book.title
        book.author = req.body.author || book.author
        book.genre = req.body.genre || book.genre
        book.publication_data = req.body.publication_data || book.publication_data
        const updatedBook = await book.save()
        res.json(updatedBook)
    }catch(error){
        res.status(400).json({
            message: error.message
        })
    }
})

router.patch('/:id',getBook, async(req,res) => {
    
    if(!req.body.title && !req.body.author && !req.body.genre && !req.body.publication_data){
        res.status(400).json({
            message: 'Al menos uno obligatorio'
        })
    }
    
    try{
        const book = res.book
        book.title = req.body.title || book.title
        book.author = req.body.author || book.author
        book.genre = req.body.genre || book.genre
        book.publication_data = req.body.publication_data || book.publication_data
        const updatedBook = await book.save()
        res.json(updatedBook)
    }catch(error){
        res.status(400).json({
            message: error.message
        })
    }
})
router.delete('/:id',getBook, async(req,res) =>{
    try{
        const book = res.book
        await book.deleteOne({
            _id: book._id
        });
        res.json({
            message: `el libro ${book.title} fue eliminado`
        })
    }catch(error){
        res.status(500).json({
            message:error.message
        })
    }
})
module.exports = router