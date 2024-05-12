const pool = require('../db/currency');

async function getByPage(page_num, per_page_count) {
    try {
        page_num = parseInt(page_num, 10);;
        per_page_count = parseInt(per_page_count, 10);
        if (page_num >= 0 && per_page_count > 0){
            offset = page_num * per_page_count;

            // const [rows, fields] = await pool.query(`SELECT * FROM cur_rate_vs_rub LIMIT ${offset}, ${per_page_count}`);
            const [results, fields] = await pool.query(`SELECT SQL_CALC_FOUND_ROWS * FROM cur_rate_vs_rub LIMIT ?, ?;`,
                                                    [offset, per_page_count]);
            data = {};
            data['currencies'] = results;
            const [results2] = await pool.query(`SELECT FOUND_ROWS() AS total_count;`);
            data['total'] = results2[0]['total_count'];

            return JSON.stringify(data);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

async function getById(id) {
    try {
        // id = parseInt(id, 10);
        if (id){
            const [rows, fields] = await pool.query(`SELECT * FROM cur_rate_vs_rub WHERE id=?`, [id]);
            return JSON.stringify(rows);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

module.exports = {
    getByPage,
    getById
};
