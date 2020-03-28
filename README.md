# ChoirWizard API Documentation

**URL**: [https://cryptic-sea-55654.herokuapp.com/api/music/](https://cryptic-sea-55654.herokuapp.com/api/music/)

* **Method**: `GET`, `POST`, `PATCH`, `DELETE`
* **Data Params**: `{ title: “title”, composer: “composer”, arranger: “arranger”, voicing: “voicing”, instrumentation: “instrumentation”, number_copies: 10, lang: “lang”, notes: “notes” }`

 **Success Response**: 
`POST` Code: `201`
		
`GET` Code: `200`
		
**Content:**  `{ id: 51, title: “title”, composer: “composer”, arranger: “arranger”, voicing: “voicing”, instrumentation: “instrumentation”, number_copies: 10, lang: “lang”, notes: “notes” }`
		
`PATCH` Code: `204`
		
`DELETE` Code: `204`

* **Error Response**:
		`POST` Code: `400`
		**Content**: ``{ error: { message: `Missing 'title' in request body` } }``

**Sample Calls:**
  `POST` `fetch('https://cryptic-sea-55654.herokuapp.com/api/music’,{method:'POST', headers: {content-type: 'application/json'}, body: JSON.stringify({title: “title”, composer: “composer”})})`
	`GET`  `fetch('https://cryptic-sea-55654.herokuapp.com/api/music’)`
	`PATCH` `fetch('https://cryptic-sea-55654.herokuapp.com/api/music/42’, { method: ‘PATCH’, headers: {content-type: ‘application/json’}, body: JSON.stringify({title: “title”})})`
	`DELETE`  `fetch('https://cryptic-sea-55654.herokuapp.com/api/music/42’, {method: ‘DELETE’})`
