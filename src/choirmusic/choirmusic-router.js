const path = require('path')
const express = require('express')
const xss = require('xss')
const ChoirMusicService = require('./choirmusic-service')

const choirMusicRouter = express.Router()
const jsonParser = express.json()

choirMusicRouter
    .route('/')
    .get((req, res, next) => {
        ChoirMusicService.getAllMusic(
            req.app.get('db')
        )
            .then(records => {
                res.json(records.map(ChoirMusicService.serializeRecord))
            })
            .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { composer, arranger, title, voicing, instrumentation, number_copies, lang, notes } = req.body
        const newRecord = { composer, arranger, title, voicing, instrumentation, number_copies, lang, notes }
        
        if(!title) {
            return res.status(400).json({
                error: { message: `Missing 'title' in request body` }
            })
        }
        ChoirMusicService.insertMusic(
            req.app.get('db'),
            newRecord
        )
            .then(record => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl,`${record.id}`))
                    .json(ChoirMusicService.serializeRecord(record))
            })
            .catch(next)
    })

    choirMusicRouter
        .route('/:music_id')
        .all((req, res, next) => {
            ChoirMusicService.getById(
                req.app.get('db'),
                req.params.music_id
            )
                .then(record => {
                    if (!record) {
                        return res.status(404).json({
                            error: { message: `Record doesn't exist` }
                        })
                    }
                    res.record = record
                    next()
                })
        })
        .get((req, res, next) => {
            res.json({
                id: res.record.id,
                composer: res.record.composer,
                arranger: res.record.arranger,
                title: xss(res.record.title),
                voicing: res.record.voicing,
                instrumentation: res.record.instrumentation,
                lang: res.record.lang,
                number_copies: res.record.number_copies,
                notes: xss(res.record.notes)

            })
           
        })
        .delete((req, res, next) => {
            ChoirMusicService.deleteRecord(
                req.app.get('db'),
                req.params.music_id
            )
                .then(() => {
                    res.status(204).end()
                })
                .catch(next)
        })
        .patch(jsonParser, (req, res, next) => {
            const { composer, arranger, title, voicing, instrumentation, number_copies, lang, notes } = req.body
            const recordToUpdate = { composer, arranger, title, voicing, instrumentation, number_copies, lang, notes } 
            ChoirMusicService.updateRecord(
                req.app.get('db'),
                req.params.music_id,
                recordToUpdate
            )
                .then(numRowsAffected => {
                    res.status(204).end()
                })
                .catch(next)
        })


module.exports = choirMusicRouter