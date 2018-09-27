import PouchDB from 'pouchdb-browser';

let db = {
    series: new PouchDB('series'),
    episodes: new PouchDB('episodes')
};

export default db;
