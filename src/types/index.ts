export interface Profile {
  id: string;
  nombre: string;
  avatar_color: string;
  created_at: string;
}

export interface Meta {
  id: string;
  nombre: string;
  monto_objetivo: number;
  descripcion: string | null;
  fecha_limite: string | null;
  created_at: string;
  updated_at: string;
}

export interface Aporte {
  id: string;
  meta_id: string;
  usuario_id: string;
  monto: number;
  fecha: string;
  nota: string | null;
  profiles?: Pick<Profile, "nombre" | "avatar_color">;
  metas?: Pick<Meta, "nombre">;
}

export interface Seccion {
  id: string;
  nombre: string;
  orden: number;
  created_at: string;
}

export interface Producto {
  id: string;
  seccion_id: string;
  nombre: string;
  precio_estimado: number | null;
  precio_real: number | null;
  estado: "pendiente" | "ahorrando" | "comprado";
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export interface Nota {
  id: string;
  usuario_id: string;
  contenido: string;
  created_at: string;
  profiles?: Pick<Profile, "nombre" | "avatar_color">;
}

export interface Foto {
  id: string;
  usuario_id: string;
  url: string;
  descripcion: string | null;
  created_at: string;
  profiles?: Pick<Profile, "nombre">;
}

export type AppStatus = "inicio" | "ahorrando" | "cerca" | "mudanza";

export interface MetaConAportes extends Meta {
  total_aportado: number;
  porcentaje: number;
  aportes_usuario: Record<string, number>;
}
