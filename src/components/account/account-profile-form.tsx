"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { RiImageAddLine, RiLinkM, RiUploadCloud2Line } from "@remixicon/react";
import { toast } from "sonner";

import { normalizeAvatarUrlInput } from "@/lib/auth/account-profile";
import type { SessionUser } from "@/lib/auth/session.ts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { UserAvatar } from "@/components/user-avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AccountProfileFormProps {
  user: SessionUser;
}

export function AccountProfileForm({ user }: AccountProfileFormProps) {
  const router = useRouter();
  const [isSubmitting, startSubmit] = useTransition();
  const [isUploadingAvatar, startAvatarUpload] = useTransition();
  const [displayName, setDisplayName] = useState(user.displayName ?? "");
  const [email, setEmail] = useState(user.email ?? "");
  const [photoURL, setPhotoURL] = useState(user.photoURL ?? "");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarMethod, setAvatarMethod] = useState<"upload" | "url">(
    user.photoURL && !user.photoURL.startsWith("/api/account/avatar")
      ? "url"
      : "upload",
  );

  const previewName = displayName.trim() || email.trim() || "Minha conta";
  const normalizedPhotoURL = normalizeAvatarUrlInput(photoURL);
  const isGoogleWrapperUrl =
    photoURL.trim().length > 0 && photoURL.trim() !== normalizedPhotoURL;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    startSubmit(async () => {
      try {
        const response = await fetch("/api/account", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            displayName,
            email,
            photoURL,
          }),
        });
        const payload = (await response.json()) as { error?: string };

        if (!response.ok) {
          toast.error("Não foi possível salvar", {
            description: payload.error ?? "Tente novamente em instantes.",
          });
          return;
        }

        toast.success("Conta atualizada", {
          description: "Seus dados foram salvos com sucesso.",
        });
        router.refresh();
      } catch {
        toast.error("Falha de conexão", {
          description: "Não foi possível atualizar sua conta agora.",
        });
      }
    });
  }

  function handleAvatarUpload() {
    if (!avatarFile) {
      toast.error("Selecione uma imagem", {
        description: "Escolha um arquivo PNG, JPG ou WEBP para continuar.",
      });
      return;
    }

    startAvatarUpload(async () => {
      try {
        const formData = new FormData();
        formData.append("avatar", avatarFile);

        const response = await fetch("/api/account/avatar", {
          method: "POST",
          body: formData,
        });
        const payload = (await response.json()) as {
          error?: string;
          photoURL?: string;
        };

        if (!response.ok) {
          toast.error("Não foi possível enviar o avatar", {
            description: payload.error ?? "Tente novamente em instantes.",
          });
          return;
        }

        setPhotoURL(payload.photoURL ?? "");
        setAvatarFile(null);
        setAvatarMethod("upload");
        toast.success("Avatar atualizado", {
          description: "Sua foto foi enviada com sucesso.",
        });
        router.refresh();
      } catch {
        toast.error("Falha de conexão", {
          description: "Não foi possível enviar sua imagem agora.",
        });
      }
    });
  }

  return (
    <Card className="rounded-[1.8rem] py-0 shadow-[0_20px_60px_rgba(0,0,0,0.08)]">
      <CardHeader className="px-6 py-5">
        <CardDescription>Perfil</CardDescription>
        <CardTitle className="mt-1 text-xl">Editar dados da conta</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5 px-6 pb-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-border bg-muted/20 p-4 sm:flex-row sm:items-center">
          <UserAvatar
            name={previewName}
            src={normalizedPhotoURL}
            className="size-16"
            fallbackClassName="text-2xl"
          />

          <div>
            <div className="text-sm font-semibold text-foreground">{previewName}</div>
            <p className="mt-1 text-sm text-muted-foreground">
              Escolha como quer atualizar sua foto e o restante da conta logo abaixo.
            </p>
            {isGoogleWrapperUrl ? (
              <p className="mt-1 text-sm text-primary">
                Detectei um link de busca e converti para a imagem direta automaticamente.
              </p>
            ) : null}
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="rounded-2xl border border-border bg-muted/20 p-4">
            <div>
              <div className="text-sm font-medium text-foreground">Foto do perfil</div>
              <p className="mt-1 text-xs text-muted-foreground">
                Envie uma imagem do seu dispositivo ou use um link direto.
              </p>
            </div>

            <Tabs
              value={avatarMethod}
              onValueChange={(value) => setAvatarMethod(value as "upload" | "url")}
              className="mt-4 gap-4"
            >
              <TabsList className="w-full sm:w-fit">
                <TabsTrigger value="upload">
                  <RiImageAddLine className="size-4" />
                  Enviar imagem
                </TabsTrigger>
                <TabsTrigger value="url">
                  <RiLinkM className="size-4" />
                  Usar URL
                </TabsTrigger>
              </TabsList>

              <TabsContent value="upload" className="mt-0">
                <div className="rounded-2xl border border-dashed border-border bg-background/70 p-4">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-start gap-3">
                      <div className="rounded-2xl bg-primary/10 p-3 text-primary">
                        <RiUploadCloud2Line className="size-5" />
                      </div>

                      <div>
                        <div className="text-sm font-semibold text-foreground">
                          Upload privado
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          PNG, JPG ou WEBP com até 5 MB.
                        </p>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="secondary"
                      className="rounded-xl"
                      disabled={isUploadingAvatar || !avatarFile}
                      onClick={handleAvatarUpload}
                    >
                      {isUploadingAvatar ? "Enviando..." : "Salvar foto"}
                    </Button>
                  </div>

                  <div className="mt-4 space-y-3">
                    <Input
                      id="avatarFile"
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(event) => {
                        const nextFile = event.target.files?.[0] ?? null;
                        setAvatarFile(nextFile);
                      }}
                    />

                    <div className="rounded-xl border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                      {avatarFile
                        ? `Arquivo pronto para envio: ${avatarFile.name}`
                        : "Nenhuma imagem selecionada ainda."}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="url" className="mt-0">
                <div className="space-y-2 rounded-2xl border border-border bg-background/70 p-4">
                  <label
                    className="text-sm font-medium text-foreground"
                    htmlFor="photoURL"
                  >
                    Avatar por URL
                  </label>
                  <Input
                    id="photoURL"
                    value={photoURL}
                    onChange={(event) => setPhotoURL(event.target.value)}
                    placeholder="https://exemplo.com/avatar.png"
                  />
                  <p className="text-xs text-muted-foreground">
                    Use o endereço direto da imagem. Links de páginas, como busca do Google, podem não abrir como avatar.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="displayName">
              Nome
            </label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(event) => setDisplayName(event.target.value)}
              placeholder="Seu nome"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="email">
              E-mail
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="voce@empresa.com"
            />
          </div>

          <Button className="w-full rounded-xl sm:w-auto" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Salvando..." : "Salvar alterações"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
