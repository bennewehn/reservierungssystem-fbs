import pool from './index.js';

export async function createUserDB(firstName, lastName, email, password){
    await pool.query(`INSERT INTO user (firstName, lastName, email, password) VALUES (?, ?, ?, ?)`, [firstName, lastName, email, password]);
}

export async function getUserByEmailDB(email){
    const [result] =  await pool.query(`SELECT * FROM user WHERE email=?`, [email]);
    return result[0];
}

export async function getUserByIdDB(id){
    const [result] =  await pool.query(`SELECT * FROM user WHERE userId=?`, [id]);
    return result[0];
}