const ObjectsToCsv = require('objects-to-csv');
const fs = require('fs');
const archiver = require('archiver');

const createArchive = async (data, name = 'data') => {
    const csv = new ObjectsToCsv(data);
    await csv.toDisk('./csv/data.csv')

    const output = fs.createWriteStream(`./csv/${name}.zip`)
    const archive = archiver('zip', {zLib: {level: 9}})
    archive.file('./csv/data.csv')
    await archive.finalize();

    output.on('close', () => {
        console.log('close')
        return Promise.resolve( archive.pointer()) //return archive size
    })

    output.on('end', () => {
        console.log('end')
    })

    archive.on('warning', (err) => {
        if (err.code === 'ENOENT') {
            // log warning
        } else {
            // throw error
            throw err;
        }
    });
}

module.exports = createArchive;
