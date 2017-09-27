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

// function getNextId() {
//     try {
//         return new Promise((res, rej) => {
//             let buff = fs.readFileSync(metadata_file);
//             return JSON.parse(buff.toString())['id']}
//         )
//     } catch (e){
//         return getAll().then(function (data) {
//             let max_id = 0;
//             for (el of data){
//                 if (max_id < el['id']){
//                     max_id = el['id']
//                 }
//             }
//
//             next_id = max_id + 1;
//             fs.writeFileSync(metadata_file, JSON.stringify({ 'id': next_id }));
//             return next_id;
//         })
//     }
// }

// function getNextId() {
//     return fs.readFile(metadata_file)
//         .then(function (buff) {
//             return JSON.parse(buff.toString())['id'];
//         }).catch(err => print(err));
// }
//
// function updateNextId() {
//     return getNextId()
//         .then(function (next_id) {
//             return fs.writeFile(metadata_file, JSON.stringify({ 'id': next_id  + 1}));
//         }).catch(err => print(err));
// }

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

function print_res(pr) {
    pr.then(res => print(res))
}

function askQuestion(nl=true) {
    process.stdout.write((nl ? '-----\n': '') + 'Enter your command (type "help" for help): ');
}

function processInput(buffer) {
    let inputString = buffer.toString().trim();
    // print(`You've entered: '${inputString}'`);
    if (inputString === '\\q') {
        // exit
        print(`Exit.`);
        process.stdin.end();  // stop listening input
    }
    else if (inputString === "help") {

        print("Commands:\n" +
            "\\q: quit\n" +
            "get all: get all books\n" +
            "remove id={id}: remove book with id={id}\n" +
            "get id={id}: get book with id={id}\n" +
            "update {book JSON}: update book with id specified in {book JSON}\n" +
            "create {book JSON}: create book with data specified in {book JSON}");
        askQuestion();
    }
    else if (inputString === "get all") {
        getAll().then(el => print(el)).then(_ => askQuestion())
            .catch(err => print(err));

    } else if (inputString.match(/^remove id=\d+$/)) {
        let id = parseInt(inputString.substring(inputString.indexOf('=') + 1));
        remove(id).then(el => print(el ? ('Removed:' + el) : 'Invalid id')).then(_ => askQuestion())
            .catch(err => print(err));

    } else if (inputString.match(/^get id=\d+$/)) {
        let id = parseInt(inputString.substring(inputString.indexOf('=') + 1));
        getById(id).then(el => print(el ? el: 'Invalid id')).then(_ => askQuestion())
            .catch(err => print(err));

    } else if (inputString.match(/^update .+$/)) {
        try {
            let el = JSON.parse(inputString.substring(inputString.indexOf(' ') + 1));
            update(el).then(res => print(res !== INVALID_DATA_ERR_CODE ? 'Success': 'Invalid input'))
                .then(_ => askQuestion())
                .catch(err => print(err));
        } catch (e){
            print("Invalid input");
            askQuestion();
        }

    } else if (inputString.match(/^create .+$/)) {
        try {
            let el = JSON.parse(inputString.substring(inputString.indexOf(' ') + 1));
            create(el).then(res => print(res !== INVALID_DATA_ERR_CODE ? 'Success': 'Invalid input'))
                .then(_ => askQuestion())
                .catch(err => print(err));
        } catch (e){
            print("Invalid input");
            askQuestion();
        }

    } else {
        print("No such command");
        askQuestion();
    }
}

process.stdin.addListener('data', processInput);

askQuestion(false);
