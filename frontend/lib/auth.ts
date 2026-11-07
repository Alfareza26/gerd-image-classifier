// shortcut: backend belum punya endpoint autentikasi, jadi fungsi ini hanya menyelesaikan promise.
// Ganti isinya dengan fetch ke endpoint login/registrasi/reset saat backend menyediakannya.
const done = () => new Promise<void>((r) => setTimeout(r, 400));
export const signIn = async (_email: string, _password: string) => done();
export const register = async (_data: Record<string, string>) => done();
export const requestReset = async (_id: string, _method: string) => done();

export function passwordStrength(p: string): { score: number; label: string } {
  const score = [p.length >= 8, /[A-Z]/.test(p), /\d/.test(p), /[^A-Za-z0-9]/.test(p)].filter(Boolean).length;
  return { score, label: ["Terlalu pendek", "Lemah", "Cukup", "Baik", "Kuat"][score] };
}
