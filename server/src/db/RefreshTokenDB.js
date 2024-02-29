import pool from './index.js';

export async function createRefreshTokenDB(userId, token, expiryDate){
    await pool.query(`INSERT INTO refreshToken (userId, token, expiryDate) VALUES
    (?,?,?)`, [userId, token, expiryDate]);
}

export async function getRefreshTokenDB(token){
    const [result] = await pool.query(`SELECT * FROM refreshToken WHERE token=?`, [token]);
    return result[0];
}

export async function deleteRefreshTokenByIdDB(tokenId){
    const result = await pool.query(`DELETE FROM refreshToken WHERE refreshTokenId=?`, [tokenId]);
    return result;
}

export async function getRefreshTokenByUserIdDB(userId){
    const [result] = await pool.query(`SELECT * FROM refreshToken WHERE userId=?`, [userId]);
    return result[0];
}