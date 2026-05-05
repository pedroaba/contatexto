import { getAuth } from "firebase-admin/auth";
import { getStorage } from "firebase-admin/storage";

import {
  buildAbsoluteAccountAvatarUrl,
  buildAccountAvatarObjectPath,
  getAccountAvatarExtension,
  isSupportedAccountAvatarMimeType,
  validateAccountAvatarFile,
} from "@/lib/auth/account-avatar";
import { getFirebaseAdminApp } from "@/lib/auth/firebase-admin";
import { getSessionUser } from "@/lib/auth/session";
import { json } from "@/utils/http";

export const runtime = "nodejs";

function getAvatarPrefix(userId: string) {
  return `avatars/${userId}/`;
}

export async function POST(request: Request) {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return json({ error: "Sessão inválida." }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("avatar");

    if (!(file instanceof File)) {
      return json({ error: "Selecione uma imagem para continuar." }, { status: 400 });
    }

    const validation = validateAccountAvatarFile(file);

    if (!validation.ok) {
      return json({ error: validation.error }, { status: 400 });
    }

    if (!isSupportedAccountAvatarMimeType(file.type)) {
      return json({ error: "Envie uma imagem PNG, JPG ou WEBP." }, { status: 400 });
    }

    const app = getFirebaseAdminApp();
    const storage = getStorage(app);
    const bucket = storage.bucket();
    const objectPath = buildAccountAvatarObjectPath(sessionUser.uid, file.type);
    const avatarVersion = Date.now();
    const avatarExtension = getAccountAvatarExtension(file.type);
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    await bucket.deleteFiles({
      force: true,
      prefix: getAvatarPrefix(sessionUser.uid),
    });

    await bucket.file(objectPath).save(fileBuffer, {
      resumable: false,
      metadata: {
        cacheControl: "private, max-age=0, no-transform",
        contentDisposition: "inline",
        contentType: file.type,
        metadata: {
          userId: sessionUser.uid,
        },
      },
    });

    const photoURL = buildAbsoluteAccountAvatarUrl(
      request.url,
      avatarVersion,
      avatarExtension,
    );

    await getAuth(app).updateUser(sessionUser.uid, {
      photoURL,
    });

    return json(
      {
        photoURL,
      },
      { status: 200 },
    );
  } catch {
    return json(
      { error: "Não foi possível enviar seu avatar agora." },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  const sessionUser = await getSessionUser();

  if (!sessionUser) {
    return new Response("Sessão inválida.", { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const extension = searchParams.get("ext");

  if (!extension) {
    return new Response("Avatar não encontrado.", { status: 404 });
  }

  try {
    const bucket = getStorage(getFirebaseAdminApp()).bucket();
    const file = bucket.file(`avatars/${sessionUser.uid}/avatar.${extension}`);
    const [exists] = await file.exists();

    if (!exists) {
      return new Response("Avatar não encontrado.", { status: 404 });
    }

    const [metadata] = await file.getMetadata();
    const [fileBuffer] = await file.download();

    return new Response(new Uint8Array(fileBuffer), {
      status: 200,
      headers: {
        "Cache-Control": "private, max-age=60",
        "Content-Type": metadata.contentType ?? "application/octet-stream",
      },
    });
  } catch {
    return new Response("Avatar não encontrado.", { status: 404 });
  }
}
