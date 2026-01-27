import xss from "xss";

const ChoirMusicService = {
  getAllMusic(knex, query) {
    if (query.id) {
      // BUGFIX: you used `id` but never defined it
      return knex.select("*").from("choir_music").where("id", query.id).first();
    }

    if (query.title) {
      return knex
        .select("*")
        .from("choir_music")
        .where("title", "ilike", `%${query.title}%`);
    }

    if (query.composer) {
      return knex
        .select("*")
        .from("choir_music")
        .where("composer", "ilike", `%${query.composer}%`);
    }

    if (query.arranger) {
      return knex
        .select("*")
        .from("choir_music")
        .where("arranger", "ilike", `%${query.arranger}%`);
    }

    if (query.voicing) {
      return knex
        .select("*")
        .from("choir_music")
        .where("voicing", "ilike", `%${query.voicing}%`);
    }

    if (query.instrumentation) {
      return knex
        .select("*")
        .from("choir_music")
        .where("instrumentation", "ilike", `%${query.instrumentation}%`);
    }

    if (query.lang) {
      return knex
        .select("*")
        .from("choir_music")
        .where("lang", "ilike", `%${query.lang}%`);
    }

    if (query.number_copies) {
      return knex
        .select("*")
        .from("choir_music")
        .where("number_copies", ">=", query.number_copies);
    }

    if (query.notes) {
      return knex
        .select("*")
        .from("choir_music")
        .where("notes", "ilike", `%${query.notes}%`);
    }

    return knex.select("*").from("choir_music");
  },

  insertMusic(knex, newRecord) {
    return knex
      .insert(newRecord)
      .into("choir_music")
      .returning("*")
      .then((rows) => rows[0]);
  },

  getById(knex, id) {
    return knex.from("choir_music").select("*").where("id", id).first();
  },

  deleteRecord(knex, id) {
    return knex("choir_music").where({ id }).delete();
  },

  updateRecord(knex, id, newRecordFields) {
    return knex("choir_music").where({ id }).update(newRecordFields);
  },

  // NOTE: this function never worked as written (no knex param in scope).
  // Keep it only if you actually use it; otherwise delete it.
  searchMusic(knex, searchTerm) {
    return knex("choir_music").where("title", "ILIKE", `%${searchTerm}%`);
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
    };
  },
};

export default ChoirMusicService;
