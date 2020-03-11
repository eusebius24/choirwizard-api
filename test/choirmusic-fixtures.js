function makeRecordsArray() {
    return [
        {   
            id: 1,
            arranger: ' ',
            instrumentation: 'Piano',
            voicing: 'SSA',
            notes: ' ',
            composer: 'Test composer',
            title: 'Test piece 1', 
            number_copies: 10,
            lang: 'Testish'
        },
        {   
            id: 2,
            arranger: null,
            composer: 'Test composer',
            instrumentation: 'Unaccompanied',
            title: 'Test piece 2', 
            number_copies: 10,
            lang: 'Testish',
            notes: "",
            voicing: null,
        },
        {   
            id: 3,
            arranger: null,
            composer: 'Test composer',
            instrumentation: 'Piano',
            notes: ' ',
            voicing: 'SATB',
            title: 'Test piece 3', 
            number_copies: 10,
            lang: 'Testish'
        },
    ];
}

module.exports = {
    makeRecordsArray,
}