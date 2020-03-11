const xss = require('xss');

const ChoirMusicService = {
    getAllMusic(knex) {
        return knex.select('*').from('choir_music')
    },
    insertMusic(knex, newRecord) {
        return knex
            .insert(newRecord)
            .into('choir_music')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    getById(knex, id) {
        return knex.from('choir_music').select('*').where('id', id).first()
    },
    deleteRecord(knex, id) {
        return knex('choir_music')
            .where({ id })
            .delete()
    },
    updateRecord(knex, id, newRecordFields) {
        return knex('choir_music')
            .where({ id })
            .update(newRecordFields)
    },
    serializeRecord(record) {
        return {
            id: record.id,
            composer: record.composer,
            arranger: record.arranger,
            title: xss(record.title),
            voicing: record.voicing,
            instrumentation: record.instrumentation,
            lang: record.lang,
            number_copies: record.number_copies,
            notes: xss(record.notes),

        }
    },
}
   

module.exports = ChoirMusicService