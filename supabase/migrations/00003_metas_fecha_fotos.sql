-- Agregar fecha límite a metas
alter table metas add column fecha_limite date;

-- Bucket de Storage para fotos
insert into storage.buckets (id, name, public, avif_autodetection)
values ('fotos', 'fotos', true, false)
on conflict (id) do nothing;

-- Tabla para galería de fotos
create table fotos (
  id uuid primary key default uuid_generate_v4(),
  usuario_id uuid references profiles(id) on delete cascade not null,
  url text not null,
  descripcion text,
  created_at timestamptz default now()
);

alter table fotos enable row level security;

create policy "fotos_select_autenticados"
  on fotos for select
  using (auth.role() = 'authenticated');

create policy "fotos_insert_autenticados"
  on fotos for insert
  with check (auth.role() = 'authenticated');

create policy "fotos_delete_propio"
  on fotos for delete
  using (auth.uid() = usuario_id);
