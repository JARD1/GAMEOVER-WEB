import { getApps, initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";
import path from "path";

function hasFirebaseAdminConfig() {
  return Boolean(
    process.env.FIREBASE_PROJECT_ID &&
      process.env.FIREBASE_CLIENT_EMAIL &&
      process.env.FIREBASE_PRIVATE_KEY
  );
}

function getLocalServiceAccountPath() {
  const cwd = process.cwd();
  const files = fs.readdirSync(cwd);
  const serviceAccountFile = files.find((file) => /firebase-adminsdk-.*\.json$/i.test(file));

  return serviceAccountFile ? path.join(cwd, serviceAccountFile) : null;
}

function getServiceAccountFromLocalFile() {
  try {
    const serviceAccountPath = getLocalServiceAccountPath();

    if (!serviceAccountPath) {
      return null;
    }

    const fileContents = fs.readFileSync(serviceAccountPath, "utf-8");
    const credentials = JSON.parse(fileContents);

    return {
      projectId: credentials.project_id,
      clientEmail: credentials.client_email,
      privateKey: credentials.private_key
    };
  } catch {
    return null;
  }
}

function getServiceAccount() {
  if (hasFirebaseAdminConfig()) {
    return {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n")
    };
  }

  return getServiceAccountFromLocalFile();
}

function createFirebaseAdminApp() {
  const credentials = getServiceAccount();

  if (!credentials) {
    return null;
  }

  if (getApps().length) {
    return getApps()[0];
  }

  return initializeApp({
    credential: cert({
      projectId: credentials.projectId,
      clientEmail: credentials.clientEmail,
      privateKey: credentials.privateKey
    })
  });
}

export function getAdminDb() {
  const app = createFirebaseAdminApp();
  return app ? getFirestore(app) : null;
}

export function isFirebaseConfigured() {
  return Boolean(getServiceAccount());
}
