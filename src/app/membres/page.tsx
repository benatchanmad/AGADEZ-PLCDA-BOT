"use client";

import { useEffect, useState } from "react";
import AppShell from "@/components/layout/AppShell";
import {
  Users,
  UserPlus,
  Shield,
  Mail,
  Phone,
  Building2,
  CheckCircle2,
  XCircle,
  MoreVertical,
  Activity,
  Lock,
  Pencil,
  Trash2,
  AlertTriangle,
  X,
  Save,
} from "lucide-react";
import { formatDate, ROLE_CONFIG } from "@/lib/utils";

export default function MembersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [deletingUser, setDeletingUser] = useState<any | null>(null);

  // New member form
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("Agadez2026!");
  const [role, setRole] = useState("VERIFIER");
  const [department, setDepartment] = useState("Coordination Régionale Agadez");
  const [phone, setPhone] = useState("+227 ");
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // Edit form state
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("VERIFIER");
  const [editDepartment, setEditDepartment] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editIsActive, setEditIsActive] = useState(true);
  const [editPassword, setEditPassword] = useState("");
  const [editSaving, setEditSaving] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await fetch("/api/members");
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const showNotification = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSaving(true);

    try {
      const res = await fetch("/api/members", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role, department, phone }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur de création du membre.");
        setSaving(false);
        return;
      }

      await fetchUsers();
      setShowAddModal(false);
      setName("");
      setEmail("");
      showNotification(`Membre "${name}" créé avec succès.`);
    } catch {
      setError("Erreur de connexion.");
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (u: any) => {
    setEditingUser(u);
    setEditName(u.name);
    setEditEmail(u.email);
    setEditRole(u.role);
    setEditDepartment(u.department || "");
    setEditPhone(u.phone || "");
    setEditIsActive(u.isActive);
    setEditPassword("");
    setError(null);
  };

  const handleUpdateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;
    setError(null);
    setEditSaving(true);

    try {
      const payload: any = {
        name: editName,
        email: editEmail,
        role: editRole,
        department: editDepartment,
        phone: editPhone,
        isActive: editIsActive,
      };
      if (editPassword.trim()) {
        payload.password = editPassword.trim();
      }

      const res = await fetch(`/api/members/${editingUser.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur de mise à jour du membre.");
        setEditSaving(false);
        return;
      }

      await fetchUsers();
      setEditingUser(null);
      showNotification(`Membre "${editName}" mis à jour avec succès.`);
    } catch {
      setError("Erreur de connexion.");
    } finally {
      setEditSaving(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!deletingUser) return;
    setSaving(true);

    try {
      const res = await fetch(`/api/members/${deletingUser.id}`, {
        method: "DELETE",
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.error || "Impossible de supprimer ce compte.");
        setSaving(false);
        return;
      }

      await fetchUsers();
      const deletedName = deletingUser.name;
      setDeletingUser(null);
      showNotification(`Compte de "${deletedName}" supprimé avec succès.`);
    } catch {
      alert("Erreur réseau lors de la suppression.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
                Gestion des membres PLCDA & Équipes de terrain
              </h1>
              <span className="rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-bold text-emerald-800">
                {users.length} membres
              </span>
            </div>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Contrôle d&apos;accès par rôle (RBAC), affectation départementale, modification et suppression sécurisée
            </p>
          </div>

          <button
            onClick={() => {
              setError(null);
              setShowAddModal(true);
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-xs font-bold text-white shadow-md hover:bg-emerald-800 transition-colors cursor-pointer"
          >
            <UserPlus className="h-4 w-4" />
            Ajouter un membre
          </button>
        </div>

        {/* Success Alert */}
        {successMsg && (
          <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 p-4 text-xs font-bold text-emerald-800 border border-emerald-200 shadow-sm animate-fadeIn">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Members Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {loading ? (
            <div className="col-span-3 py-16 text-center text-slate-400">
              Chargement des membres de la plateforme...
            </div>
          ) : (
            users.map((u) => {
              const roleInfo = ROLE_CONFIG[u.role] || {
                label: u.role,
                description: "",
                color: "bg-slate-100 text-slate-800",
              };

              return (
                <div
                  key={u.id}
                  className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm shadow-inner ring-2 ring-emerald-300">
                          {u.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-slate-900 line-clamp-1">{u.name}</h3>
                          <span
                            className={`inline-block mt-1 rounded-md px-2 py-0.5 text-[10px] font-bold border ${roleInfo.color}`}
                          >
                            {roleInfo.label}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${
                            u.isActive ? "bg-emerald-500" : "bg-red-400"
                          }`}
                          title={u.isActive ? "Compte actif" : "Désactivé"}
                        />
                        <span className="text-[10px] text-slate-400 font-semibold uppercase">
                          {u.isActive ? "Actif" : "Inactif"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{u.department || "Coordination PLCDA Agadez"}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                        <span className="truncate font-mono text-[11px]">{u.email}</span>
                      </div>
                      {u.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          <span className="font-mono text-[11px]">{u.phone}</span>
                        </div>
                      )}
                    </div>

                    {/* Performance metrics */}
                    <div className="grid grid-cols-2 gap-2 text-center text-xs">
                      <div className="rounded-xl bg-emerald-50/60 p-2 border border-emerald-100">
                        <span className="text-[10px] text-emerald-800 font-semibold block">
                          Missions assignées
                        </span>
                        <span className="text-base font-black text-emerald-950">
                          {u._count?.assignments || 0}
                        </span>
                      </div>
                      <div className="rounded-xl bg-blue-50/60 p-2 border border-blue-100">
                        <span className="text-[10px] text-blue-800 font-semibold block">
                          Vérifications faites
                        </span>
                        <span className="text-base font-black text-blue-950">
                          {u._count?.verifications || 0}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Bar: Modifier & Supprimer */}
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] text-slate-400">
                      Inscrit : {formatDate(u.createdAt, false)}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {/* Bouton Modifier */}
                      <button
                        onClick={() => openEditModal(u)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/50 transition-colors cursor-pointer"
                        title="Modifier ce membre"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                        <span>Modifier</span>
                      </button>

                      {/* Bouton Supprimer */}
                      <button
                        onClick={() => setDeletingUser(u)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-red-600 hover:border-red-400 hover:bg-red-50 transition-colors cursor-pointer"
                        title="Supprimer ce membre"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>Supprimer</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Add Member Modal */}
        {showAddModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Ajouter un nouveau membre habilité
                  </h3>
                  <p className="text-xs text-slate-500">
                    Création d&apos;un compte avec attribution de rôle RBAC sécurisé
                  </p>
                </div>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 p-3 text-xs text-red-700 font-medium border border-red-200 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleCreateUser} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nom complet *</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ex: Ibrahim Moussa Dan Koulou"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email professionnel *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nom@plcda-agadez.ne"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Mot de passe initial *</label>
                  <input
                    type="text"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rôle dans la plateforme *</label>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs bg-white font-semibold focus:outline-none focus:border-emerald-600"
                  >
                    <option value="VERIFIER">Vérificateur de terrain (Enquêtes, preuves)</option>
                    <option value="COMMUNICATION">Responsable Communication (Validation, diffusion alertes)</option>
                    <option value="ADMIN">Administrateur PLCDA (Gestion générale)</option>
                    <option value="OBSERVER">Observateur (Partenaire, ONG, lecture seule)</option>
                    <option value="SUPER_ADMIN">Super Administrateur (Contrôle total)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Département ou Antenne</label>
                  <input
                    type="text"
                    value={department}
                    onChange={(e) => setDepartment(e.target.value)}
                    placeholder="Ex: Antenne Bassin Minier Arlit..."
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Téléphone officiel</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+227 90 00 00 00"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-emerald-700 px-5 py-2 font-bold text-white hover:bg-emerald-800 disabled:opacity-70 cursor-pointer shadow-sm"
                  >
                    {saving ? "Création..." : "Enregistrer le membre"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Member Modal */}
        {editingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-slate-100">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Modifier le membre PLCDA
                  </h3>
                  <p className="text-xs text-slate-500">
                    Mise à jour du profil, du rôle et des autorisations d&apos;accès
                  </p>
                </div>
                <button
                  onClick={() => setEditingUser(null)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {error && (
                <div className="rounded-xl bg-red-50 p-3 text-xs text-red-700 font-medium border border-red-200 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleUpdateUser} className="space-y-3 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nom complet *</label>
                  <input
                    type="text"
                    required
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email professionnel *</label>
                  <input
                    type="email"
                    required
                    value={editEmail}
                    onChange={(e) => setEditEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Rôle dans la plateforme *</label>
                  <select
                    value={editRole}
                    onChange={(e) => setEditRole(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs bg-white font-semibold focus:outline-none focus:border-emerald-600"
                  >
                    <option value="VERIFIER">Vérificateur de terrain (Enquêtes, preuves)</option>
                    <option value="COMMUNICATION">Responsable Communication (Validation, diffusion alertes)</option>
                    <option value="ADMIN">Administrateur PLCDA (Gestion générale)</option>
                    <option value="OBSERVER">Observateur (Partenaire, ONG, lecture seule)</option>
                    <option value="SUPER_ADMIN">Super Administrateur (Contrôle total)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Département ou Antenne</label>
                  <input
                    type="text"
                    value={editDepartment}
                    onChange={(e) => setEditDepartment(e.target.value)}
                    placeholder="Ex: Antenne Agadez Ville..."
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Téléphone officiel</label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Nouveau mot de passe (laisser vide pour ne pas modifier)
                  </label>
                  <input
                    type="password"
                    value={editPassword}
                    onChange={(e) => setEditPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full rounded-xl border border-slate-300 p-2.5 text-xs focus:outline-none focus:border-emerald-600"
                  />
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="editActive"
                    checked={editIsActive}
                    onChange={(e) => setEditIsActive(e.target.checked)}
                    className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 h-4 w-4"
                  />
                  <label htmlFor="editActive" className="font-semibold text-slate-700 cursor-pointer">
                    Compte activé (Autoriser la connexion à la plateforme)
                  </label>
                </div>

                <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    disabled={editSaving}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-700 px-5 py-2 font-bold text-white hover:bg-emerald-800 disabled:opacity-70 cursor-pointer shadow-sm"
                  >
                    <Save className="h-4 w-4" />
                    <span>{editSaving ? "Enregistrement..." : "Mettre à jour"}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {deletingUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl space-y-4 border border-slate-100">
              <div className="flex items-center gap-3 text-red-600">
                <div className="h-10 w-10 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
                  <Trash2 className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Confirmer la suppression du compte
                  </h3>
                  <p className="text-xs text-slate-500">Cette action est irréversible</p>
                </div>
              </div>

              <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-2xl border border-slate-200">
                Êtes-vous certain de vouloir supprimer définitivement le compte de{" "}
                <strong className="text-slate-900">{deletingUser.name}</strong> ({deletingUser.email}) ?
                Toutes ses notifications et assignations associées seront nettoyées de manière sécurisée.
              </p>

              <div className="pt-2 flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setDeletingUser(null)}
                  className="rounded-xl border border-slate-200 px-4 py-2 font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="button"
                  onClick={handleDeleteUser}
                  disabled={saving}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-red-600 px-5 py-2 font-bold text-white hover:bg-red-700 disabled:opacity-70 cursor-pointer shadow-md shadow-red-600/20"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>{saving ? "Suppression..." : "Supprimer définitivement"}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
