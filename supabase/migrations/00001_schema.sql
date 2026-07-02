-- ============================================================
-- PLAN: VIVIENDO JUNTOS - Schema completo para Supabase
-- ============================================================
-- Ejecutar en: Supabase Dashboard -> SQL Editor -> New Query

-- ------------------------------------------------------------
-- 1. EXTENSIONES NECESARIAS
-- ------------------------------------------------------------
create extension if not exists "uuid-ossp";

-- ------------------------------------------------------------
-- 2. TABLA: profiles
-- Perfil extendido de cada usuario (vinculado a auth.users)
-- ------------------------------------------------------------
create table profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  nombre text not null,
  avatar_color text default '#8B5CF6', -- para diferenciar visualmente a cada uno
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 3. TABLA: metas
-- Metas de ahorro (arriendo, depósito, muebles, etc.)
-- ------------------------------------------------------------
create table metas (
  id uuid primary key default uuid_generate_v4(),
  nombre text not null,
  monto_objetivo numeric(12,2) not null check (monto_objetivo > 0),
  descripcion text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 4. TABLA: aportes
-- Aportes individuales de cada usuario a cada meta
-- ------------------------------------------------------------
create table aportes (
  id uuid primary key default uuid_generate_v4(),
  meta_id uuid references metas(id) on delete cascade not null,
  usuario_id uuid references profiles(id) on delete cascade not null,
  monto numeric(12,2) not null check (monto > 0),
  fecha timestamptz default now(),
  nota text
);

-- ------------------------------------------------------------
-- 5. TABLA: secciones
-- Secciones de prioridad para productos (Prioritario, Secundario, etc.)
-- ------------------------------------------------------------
create table secciones (
  id uuid primary key default uuid_generate_v4(),
  nombre text not null,
  orden int not null default 0,
  created_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 6. TABLA: productos
-- Productos a comprar, organizados dentro de cada sección
-- ------------------------------------------------------------
create table productos (
  id uuid primary key default uuid_generate_v4(),
  seccion_id uuid references secciones(id) on delete cascade not null,
  nombre text not null,
  precio_estimado numeric(12,2),
  precio_real numeric(12,2),
  estado text not null default 'pendiente'
    check (estado in ('pendiente', 'ahorrando', 'comprado')),
  notas text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ------------------------------------------------------------
-- 7. TABLA: notas
-- Mensajitos entre los dos usuarios
-- ------------------------------------------------------------
create table notas (
  id uuid primary key default uuid_generate_v4(),
  usuario_id uuid references profiles(id) on delete cascade not null,
  contenido text not null,
  created_at timestamptz default now()
);

-- ============================================================
-- 8. TRIGGER: actualizar "updated_at" automáticamente
-- ============================================================
create or replace function actualizar_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_metas_updated_at
  before update on metas
  for each row execute function actualizar_updated_at();

create trigger trg_productos_updated_at
  before update on productos
  for each row execute function actualizar_updated_at();

-- ============================================================
-- 9. TRIGGER: crear perfil automáticamente al registrar usuario
-- ============================================================
create or replace function crear_perfil_nuevo_usuario()
returns trigger as $$
begin
  insert into public.profiles (id, nombre)
  values (new.id, coalesce(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

create trigger trg_crear_perfil
  after insert on auth.users
  for each row execute function crear_perfil_nuevo_usuario();

-- ============================================================
-- 10. VISTA: resumen de progreso por meta
-- Facilita calcular cuánto se ha ahorrado vs el objetivo
-- ============================================================
create view vista_progreso_metas as
select
  m.id,
  m.nombre,
  m.monto_objetivo,
  coalesce(sum(a.monto), 0) as monto_ahorrado,
  round(
    (coalesce(sum(a.monto), 0) / m.monto_objetivo) * 100, 1
  ) as porcentaje
from metas m
left join aportes a on a.meta_id = m.id
group by m.id, m.nombre, m.monto_objetivo;

-- ============================================================
-- 11. VISTA: aportes por usuario (cuánto ha puesto cada quien)
-- ============================================================
create view vista_aportes_por_usuario as
select
  p.id as usuario_id,
  p.nombre,
  coalesce(sum(a.monto), 0) as total_aportado
from profiles p
left join aportes a on a.usuario_id = p.id
group by p.id, p.nombre;

-- ============================================================
-- 12. ROW LEVEL SECURITY (RLS)
-- Solo usuarios autenticados (los 2 de la pareja) pueden acceder
-- ============================================================

alter table profiles enable row level security;
alter table metas enable row level security;
alter table aportes enable row level security;
alter table secciones enable row level security;
alter table productos enable row level security;
alter table notas enable row level security;

-- profiles: cualquier autenticado puede ver ambos perfiles, pero
-- solo puede editar el suyo
create policy "profiles_select_autenticados"
  on profiles for select
  using (auth.role() = 'authenticated');

create policy "profiles_update_propio"
  on profiles for update
  using (auth.uid() = id);

-- metas: cualquier autenticado puede ver, crear, editar y borrar
-- (es compartido entre los 2, no hay dueño individual)
create policy "metas_select_autenticados"
  on metas for select
  using (auth.role() = 'authenticated');

create policy "metas_insert_autenticados"
  on metas for insert
  with check (auth.role() = 'authenticated');

create policy "metas_update_autenticados"
  on metas for update
  using (auth.role() = 'authenticated');

create policy "metas_delete_autenticados"
  on metas for delete
  using (auth.role() = 'authenticated');

-- aportes: cualquier autenticado puede ver todos los aportes
-- pero solo puede crear aportes a su propio nombre
create policy "aportes_select_autenticados"
  on aportes for select
  using (auth.role() = 'authenticated');

create policy "aportes_insert_propio"
  on aportes for insert
  with check (auth.uid() = usuario_id);

create policy "aportes_delete_propio"
  on aportes for delete
  using (auth.uid() = usuario_id);

-- secciones: compartidas, cualquier autenticado gestiona
create policy "secciones_select_autenticados"
  on secciones for select
  using (auth.role() = 'authenticated');

create policy "secciones_insert_autenticados"
  on secciones for insert
  with check (auth.role() = 'authenticated');

create policy "secciones_update_autenticados"
  on secciones for update
  using (auth.role() = 'authenticated');

create policy "secciones_delete_autenticados"
  on secciones for delete
  using (auth.role() = 'authenticated');

-- productos: compartidos, cualquier autenticado gestiona
create policy "productos_select_autenticados"
  on productos for select
  using (auth.role() = 'authenticated');

create policy "productos_insert_autenticados"
  on productos for insert
  with check (auth.role() = 'authenticated');

create policy "productos_update_autenticados"
  on productos for update
  using (auth.role() = 'authenticated');

create policy "productos_delete_autenticados"
  on productos for delete
  using (auth.role() = 'authenticated');

-- notas: cualquier autenticado puede leer, pero solo crea/borra las suyas
create policy "notas_select_autenticados"
  on notas for select
  using (auth.role() = 'authenticated');

create policy "notas_insert_propio"
  on notas for insert
  with check (auth.uid() = usuario_id);

create policy "notas_delete_propio"
  on notas for delete
  using (auth.uid() = usuario_id);

-- ============================================================
-- 13. DATOS INICIALES (secciones por defecto)
-- ============================================================
insert into secciones (nombre, orden) values
  ('Prioritario', 1),
  ('Secundario', 2),
  ('Opcional', 3);

-- ============================================================
-- FIN DEL SCHEMA
-- ============================================================
