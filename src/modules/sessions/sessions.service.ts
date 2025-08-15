import pgPool from '../../config/db';
import redis from '../../config/redis';
import { computeScoreRaw, computeScoreRounded } from '../../common/scoring';

export class SessionsService {
  async startSession(userId: string, countryCode: string, questionIds: string[]) {
    const res = await pgPool.query(
      `INSERT INTO sessions (user_id, country_code, question_ids, status, start_ts, last_heartbeat, total_test_time_ms)
       VALUES($1,$2,$3,'active',now(),now(),$4) RETURNING *`,
      [userId, countryCode, JSON.stringify(questionIds), 600000]
    );
    const session = res.rows[0];
    return { session };
  }

  // gonna add more methods as I implement APIs
}
