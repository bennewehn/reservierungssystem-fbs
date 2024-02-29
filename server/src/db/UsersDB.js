import pool from './index.js';

export async function createUserDB(name, email, password){
    await pool.query(`INSERT INTO user (email, name, password) VALUES (?, ?, ?)`, [email, name, password]);
}

export async function getUserByEmailDB(email){
    const [result] =  await pool.query(`SELECT * FROM user WHERE email=?`, [email]);
    return result[0];
}

export async function getUserByIdDB(id){
    const [result] =  await pool.query(`SELECT * FROM user WHERE userId=?`, [id]);
    return result[0];
}