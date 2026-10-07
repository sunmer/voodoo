import {randomBytes} from 'node:crypto';
import {getFirestore} from 'firebase-admin/firestore';
import {getStorage} from 'firebase-admin/storage';
import {HttpError, type Published, type Snapshot} from './model.ts';

export function createStore(bucketName: string) {
  const db = getFirestore();
  const bucket = getStorage().bucket(bucketName);
  return {
    async reserve(owner: string, key: string, value: Snapshot) {
      const ref = db.doc(`shareJobs/${key}`);
      return db.runTransaction(async (tx) => {
        const job = (await tx.get(ref)).data();
        if (job?.status === 'ready') {
          const existing = (await tx.get(db.doc(`shares/${job.id}`))).data();
          if (existing?.status === 'ready') return {ready: existing as Published};
        }
        if (job?.status === 'rendering' && job.leaseUntil > Date.now()) throw new HttpError(409, 'This video is still rendering. Try again shortly.');
        const day = new Date().toISOString().slice(0, 10);
        const userQuota = db.doc(`users/${owner}/shareQuota/${day}`);
        const globalQuota = db.doc(`shareQuota/${day}`);
        const [userCount, globalCount] = await Promise.all([tx.get(userQuota), tx.get(globalQuota)]);
        if ((userCount.data()?.count || 0) >= Number(process.env.SHARES_PER_USER_DAY || 10)) throw new HttpError(429, 'Your daily publishing limit has been reached. Try again tomorrow.');
        if ((globalCount.data()?.count || 0) >= Number(process.env.SHARES_PER_DAY || 100)) throw new HttpError(429, 'Publishing has reached its daily capacity. Please try again tomorrow.');
        const id = randomBytes(24).toString('base64url');
        const {meta: _, ...snapshot} = value;
        const video: Published = {...snapshot, id, owner, status: 'rendering', createdAt: Date.now()};
        tx.set(userQuota, {count: (userCount.data()?.count || 0) + 1});
        tx.set(globalQuota, {count: (globalCount.data()?.count || 0) + 1});
        if (job?.status === 'rendering') tx.delete(db.doc(`shares/${job.id}`));
        tx.set(ref, {id, status: 'rendering', leaseUntil: Date.now() + 600_000});
        tx.set(db.doc(`shares/${id}`), video);
        return {video};
      });
    },
    async finish(key: string, video: Published, paths: {image: string; video: string}) {
      const prefix = `shares/${video.id}`;
      try {
        await Promise.all([
          bucket.upload(paths.image, {destination: `${prefix}/preview.jpg`, metadata: {contentType: 'image/jpeg'}}),
          bucket.upload(paths.video, {destination: `${prefix}/video.mp4`, metadata: {contentType: 'video/mp4'}}),
        ]);
        const batch = db.batch();
        batch.update(db.doc(`shares/${video.id}`), {status: 'ready'});
        batch.set(db.doc(`users/${video.owner}/shares/${video.id}`), {id: video.id, title: video.title, createdAt: video.createdAt});
        batch.set(db.doc(`shareJobs/${key}`), {id: video.id, status: 'ready'});
        await batch.commit();
        return {...video, status: 'ready'};
      } catch (e) {
        await bucket.deleteFiles({prefix: `${prefix}/`}).catch(() => {});
        throw e;
      }
    },
    async fail(key: string, id: string) {
      const batch = db.batch();
      batch.set(db.doc(`shareJobs/${key}`), {id, status: 'failed'});
      batch.delete(db.doc(`shares/${id}`));
      await batch.commit();
    },
    async get(id: string): Promise<Published> {
      const data = (await db.doc(`shares/${id}`).get()).data();
      if (!data || data.status !== 'ready') throw new HttpError(404, 'This shared video is unavailable.');
      return data as Published;
    },
    async remove(id: string, uid: string) {
      const video = await this.get(id);
      if (video.owner !== uid) throw new HttpError(403, 'This video belongs to another account.');
      const batch = db.batch();
      batch.delete(db.doc(`shares/${id}`));
      batch.delete(db.doc(`users/${uid}/shares/${id}`));
      await batch.commit();
      await bucket.deleteFiles({prefix: `shares/${id}/`});
    },
    async asset(id: string, name: string) {
      const file = bucket.file(`shares/${id}/${name}`);
      const [metadata] = await file.getMetadata();
      return {size: Number(metadata.size), stream: (range?: {start: number; end: number}) => file.createReadStream(range)};
    },
  };
}
