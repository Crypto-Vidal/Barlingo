import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { authRouter } from './api/auth';
import { coursesRouter } from './api/courses';
import { lessonsRouter } from './api/lessons';
import { progressRouter } from './api/progress';
import { adminRouter } from './api/admin';
import { webhooksRouter } from './api/webhooks';

admin.initializeApp();

export const api = functions.https.onRequest((req, res) => {
  const path = req.path;

  if (path.startsWith('/auth')) {
    return authRouter(req, res);
  } else if (path.startsWith('/courses')) {
    return coursesRouter(req, res);
  } else if (path.startsWith('/lessons')) {
    return lessonsRouter(req, res);
  } else if (path.startsWith('/progress') || path.startsWith('/leaderboard')) {
    return progressRouter(req, res);
  } else if (path.startsWith('/admin')) {
    return adminRouter(req, res);
  } else if (path.startsWith('/webhooks')) {
    return webhooksRouter(req, res);
  }

  res.status(404).json({ success: false, error: 'Not found' });
});
