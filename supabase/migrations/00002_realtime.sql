-- Habilitar Realtime para las tablas
-- Esto permite notificaciones en vivo cuando la pareja hace algo

alter publication supabase_realtime add table aportes;
alter publication supabase_realtime add table notas;
