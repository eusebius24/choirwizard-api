const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeRecordsArray } = require('./choirmusic-fixtures')

describe('Music Endpoints', function() {
    let db 

    before('make knex knstance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db('choir_music').truncate())

    afterEach('cleanup', () => db('choir_music').truncate())

    describe(`GET /api/music`, () => {
        context('Given no records in database', () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/music')
                    .expect(200, [])
            })
        })

        context(`Given an XSS attack record`, () => {
            const maliciousRecord = {
                id: 911,
                title: 'Naughty naughty very naughty <script>alert("xss");</script>',
                notes: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
            }


            beforeEach('insert malicious record', () => {
                return db 
                    .into('choir_music')
                    .insert([ maliciousRecord ])
            })

            it('removes XSS attack content', () => {
                return supertest(app)
                    .get(`/api/music`)
                    .expect(200)
                    .expect(res => {
                        expect(res.body[0].title).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;')
                        expect(res.body[0].notes).to.eql(`Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`)
                    })
            })
        })

        context('Given there are music records in the database', () => {
            const testMusic = makeRecordsArray()
    
            beforeEach('insert records', () => {
                return db 
                    .into('choir_music')
                    .insert(testMusic)
            })
    
            it(`GET /api/music responds with 200 and all of the records in the database`, () => {
                return supertest(app)
                    .get('/api/music')
                    .expect(200, testMusic)
            })
        })
    
    })
    
    describe(`GET /api/music/:music_id`, () => {
        context(`Given no records in database`, () => {
            it(`responds with 404`, () => {
                const recordId = 123456 
                return supertest(app)
                    .get(`/api/music/${recordId}`)
                    .expect(404, { error: { message: `Record doesn't exist` } })
            })
        })

        context(`Given an XSS attack record`, () => {
            const maliciousRecord = {
                id: 911,
                title: 'Naughty naughty very naughty <script>alert("xss");</script>',
                notes: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`
            }

            beforeEach('insert malicious record', () => {
                return db 
                    .into('choir_music')
                    .insert([ maliciousRecord ])
            })

            it('removes XSS attack content', () => {
                return supertest(app)
                    .get(`/api/music/${maliciousRecord.id}`)
                    .expect(200)
                    .expect(res => {
                        expect(res.body.title).to.eql('Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;')
                        expect(res.body.notes).to.eql(`Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`)
                    })
            })
        })

        context('Given there are records in the database', () => {
            const testMusic = makeRecordsArray()
    
            beforeEach('insert records', () => {
                return db 
                    .into('choir_music')
                    .insert(testMusic)
            })

            it(`GET /api/music/:music_id responds with 200 and the specified music record`, () => {
                const recordId = 2 
                const expectedRecord = testMusic[recordId - 1] 
                return supertest(app)
                    .get(`/api/music/${recordId}`)
                    .expect(200, expectedRecord)
            })

        })
    })

    describe(`POST /api/music`, () => {
        it(`creates a record, responding with 201 and the new record`, function () {
            const newRecord = {composer: 'Test new composer',
            arranger: '',
            title: 'Test new title',
            voicing: 'Test new voicing',
            instrumentation: 'Test new instrumentation',
            number_copies: 30,
            lang: 'Testish',
            notes: '',
        }
            return supertest(app)
                .post('/api/music')
                .send(newRecord)
                .expect(res => {
                    expect(res.body.composer).to.eql(newRecord.composer)
                    expect(res.body.arranger).to.eql(newRecord.arranger)
                    expect(res.body.title).to.eql(newRecord.title)
                    expect(res.body.voicing).to.eql(newRecord.voicing)
                    expect(res.body.instrumentation).to.eql(newRecord.instrumentation)
                    expect(res.body.number_copies).to.eql(newRecord.number_copies)
                    expect(res.body.lang).to.eql(newRecord.lang)
                    expect(res.body.notes).to.eql(newRecord.notes)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/api/music/${res.body.id}`)
                })
                .then(postRes => 
                    supertest(app)
                        .get(`/api/music/${postRes.body.id}`)
                        .expect(postRes.body)
                )
        })

        it(`responds with 400 and an error message when the 'title' is missing,`, () => {
            return supertest(app)
                .post(`/api/music`)
                .send({
                    composer: 'Beethoven',
                    voicing: 'SSAA',
                })
                .expect(400, {
                    error: { message: `Missing 'title' in request body` }
                })
        })
    })

    describe(`DELETE /api/music/:music_id`, () => {
        context(`Given no articles`, () => {
            it(`responds with 404`, () => {
                const recordId = 123456
                return supertest(app)
                    .delete(`/api/music/${recordId}`)
                    .expect(404, { error: { message: `Record doesn't exist` }})
            })
        })
        context('Given there are records in the database', () => {
            const testMusic = makeRecordsArray()

            beforeEach('insert records', () => {
                return db 
                .into('choir_music')
                .insert(testMusic)
            })

            it(`responds with 204 and removes the record`, () => {
                const idToRemove = 2 
                const expectedMusic = testMusic.filter(record => record.id !== idToRemove)
                return supertest(app)
                    .delete(`/api/music/${idToRemove}`)
                    .expect(204)
                    .then(res => 
                        supertest(app)
                            .get(`/api/music`)
                            .expect(expectedMusic)
                    )
            })
        })
    })

    describe.only(`PATCH /api/music/:music_id`, () => {
        context(`Given no records`, () => {
            it(`responds with 404`, () => {
                const recordId = 123456
                return supertest(app)
                    .patch(`/api/music/${recordId}`)
                    .expect(404, { error: { message: `Record doesn't exist` } })
            })
        })

        context(`Given there are records in the database`, () => {
            const testMusic = makeRecordsArray()

            beforeEach('insert articles', () => {
                return db
                    .into('choir_music')
                    .insert(testMusic)
            })

            it(`responds with 204 and updates the record`, () => {
                const idToUpdate = 2 
                const updateRecord = {
                    title: 'updated title',
                    composer: 'updated composer',
                }
                const expectedRecord = {
                    ...testMusic[idToUpdate - 1],
                    ...updateRecord
                }
                return supertest(app)
                    .patch(`/api/music/${idToUpdate}`)
                    .send(updateRecord)
                    .expect(204)
                    .then(res => 
                        supertest(app)
                            .get(`/api/music/${idToUpdate}`)
                            .expect(expectedRecord)
                    )
            })

            it(`responds with 204 when updating only a subset of fields`, () => {
                const idToUpdate = 2 
                const updateRecord = {
                    title: 'updated title',
                }
                const expectedRecord = {
                    ...testMusic[idToUpdate - 1],
                    ...updateRecord
                }

                return supertest(app)
                    .patch(`/api/music/${idToUpdate}`)
                    .send({
                        ...updateRecord,
                        fieldToIgnore: 'should not be in GET response'
                    })
                    .expect(204)
                    .then(res => 
                        supertest(app)
                            .get(`/api/music/${idToUpdate}`)
                            .expect(expectedRecord)
                    )
            })
        })
    })
})
