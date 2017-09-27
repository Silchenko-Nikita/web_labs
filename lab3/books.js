const fs = require('fs-promise');

const data_file = 'books.json';
const id = 'id';
// const metadata_file = '.books_meta.json';

const INVALID_DATA_ERR_CODE = 1;

const params = {
     id: "number",
    'name': "string",
    'author': "string",
    'rating': "number",
    'likes_num': "number",
    'dislikes_num': "number",
    'pub_date': "string",
};

const validators = {
    'pub_date': [isDate]
};

let print = console.log;

function isDate(val) {
    return !isNaN(Date.parse(val))
}

function validate_el_for_update(el) {
    if (typeof el !== 'object') return null;
    if (!el[id]) return null;

    for (let key in el){
        if (el.hasOwnProperty(key)){
            if (params[key]){
                if (typeof el[key] !== params[key] && !el[key] instanceof params[key]){
                    return null;
                }
                if (validators[key]){
                    for (val of validators[key]){
                        if (!val(el[key])) return null;
                    }
                }
            } else{
                delete el[key];
            }
        }
    }
    return el;
}

function validate_el_for_create(data, el) {
    if (typeof el !== 'object') return null;

    for (let key in params){
        if (params.hasOwnProperty(key)){
            if (!el[key] || !(typeof el[key] === params[key] || el[key] instanceof params[key])){
                return null;
            }
            if (validators[key]){
                for (val of validators[key]){
                    if (!val(el[key])) return null;
                }
            }
        }
    }

    if (data.find((e, i, a) => e[id] === el[id])) {
        return null;
    }

    return el;
}

function getAll() {
    return fs.readFile(data_file)
        .then(function (buff) {
            return JSON.parse(buff.toString());
        });
}

function getById(x_id) {
    return getAll()
        .then(function (data) {
            return data.find((e, i, a) => e[id] === x_id);
        });
}

function create(x) {
    return getAll()
        .then(function (data) {
            x = validate_el_for_create(data, x);
            if (x){
                data.push(x);
                return data;
            } else {
                return null;
            }
        }).then(data =>  {
            if (data === null) return INVALID_DATA_ERR_CODE;

            if (data) {
                updateFile(data);
            }
        });
}

function update(x) {
    return getAll()
        .then(function (data) {
            let el = data.find((e, i, a) => e[id] === x[id]);
            x = validate_el_for_update(x);
            if (el && x){
                for (let key in el){
                    if (el.hasOwnProperty(key) && x[key]){
                        el[key] = x[key];
                    }
                }
                return data;
            } else {
                return null;
            }
        }).then(data =>  {
            if (data === null) return INVALID_DATA_ERR_CODE;

            if (data) {
                updateFile(data);
            }
        });
}

function remove(x_id) {
    return getAll()
        .then(function (data){
            return [data.filter(el => el[id] !== x_id), data.filter(el => el[id] === x_id)];
        })
        .then(function (data, el_arr) {
            if (!el_arr){
                return null;
            }
            updateFile(data, );
            return el_arr[0]
        });
}

function updateFile(els) {
    return fs.writeFile(data_file, JSON.stringify(els))
}

module.exports.getAll = getAll;
module.exports.getById = getById;
module.exports.create = create;
module.exports.update = update;
module.exports.remove = remove;