const UsersService = {
    getAllUsers(knex) {
        return knex.select('*').from('choirmusic_users')
    },

    insertUser(knex, newUser) {
        return knex
            .insert(newUser)
            .into('choirmusic_users')
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },

    getById(knex, id) {
        return knex 
            .from('choirmusic_users')
            .select('*')
            .where('id', id)
            .first()
    },

    deleteUser(knex, id) {
        return knex('choirmusic_users')
            .where({ id })
            .delete()
            
    },

    updateUser(knex, id, newUserFields) {
        return knex('choirmusic_users') 
            .where({ id })
            .update(newUserFields)
    },
 }

 module.exports = UsersService