-- =========================================================
-- Kurotsume — Scheda del Personaggio D&D 5e — schema Supabase
-- =========================================================
-- Esegui questo intero script una sola volta in:
-- Supabase → SQL Editor → New query → incolla → Run.
--
-- Crea 10 tabelle relazionali (una per ogni sezione modificabile
-- della scheda) più le policy di sicurezza necessarie per farle
-- usare all'app direttamente con la chiave "anon".
--
-- NOTA SULLA SICUREZZA: questa app non ha un sistema di login.
-- Le policy sotto permettono a chiunque abbia la tua "anon key"
-- di leggere e scrivere i dati. Va benissimo per un uso personale
-- (la anon key non va comunque pubblicata/condivisa), ma se in
-- futuro vuoi più protezione si può aggiungere autenticazione e
-- restringere le policy a "auth.uid() = owner_id".
-- =========================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------
-- 1) characters — dati anagrafici, caratteristiche, tiri
--    salvezza, combattimento e background (tutti i campi 1:1
--    con il personaggio, senza bisogno di righe multiple)
-- ---------------------------------------------------------
create table if not exists characters (
  id                  uuid primary key default gen_random_uuid(),
  nome                text not null default 'Nuovo Personaggio',
  immagine            text,
  razza               text,
  livello_totale      integer not null default 1,
  allineamento        text,
  eta                 integer,
  taglia              text,
  velocita            integer,
  esperienza          text,
  ispirazione_eroica  boolean not null default false,

  -- Caratteristiche (punteggi 1-30)
  ab_for              integer not null default 10,
  ab_des              integer not null default 10,
  ab_cos              integer not null default 10,
  ab_int              integer not null default 10,
  ab_sag              integer not null default 10,
  ab_car              integer not null default 10,

  -- Competenza nei tiri salvezza
  save_for            boolean not null default false,
  save_des            boolean not null default false,
  save_cos            boolean not null default false,
  save_int            boolean not null default false,
  save_sag            boolean not null default false,
  save_car            boolean not null default false,

  -- Combattimento
  ac_base             integer not null default 10,
  ac_dex_bonus        boolean not null default true,
  ac_altri_bonus      integer not null default 0,
  hp_max              integer not null default 10,
  hp_current          integer not null default 10,
  hp_temp             integer not null default 0,

  -- Background
  background_nome     text,
  background_testo    text,
  personalita         text,
  ideali              text,
  legami              text,
  difetti             text,

  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);

-- ---------------------------------------------------------
-- 2) character_classes — righe di multiclasse (nome, sottoclasse, livello)
-- ---------------------------------------------------------
create table if not exists character_classes (
  id            uuid primary key default gen_random_uuid(),
  character_id  uuid not null references characters(id) on delete cascade,
  ordine        integer not null default 0,
  nome          text not null,
  sottoclasse   text,
  livello       integer not null default 1
);

-- ---------------------------------------------------------
-- 3) skills — le 18 abilità con relativa caratteristica e competenza
-- ---------------------------------------------------------
create table if not exists skills (
  id            uuid primary key default gen_random_uuid(),
  character_id  uuid not null references characters(id) on delete cascade,
  ordine        integer not null default 0,
  skill_key     text not null,
  nome          text not null,
  abilita       text not null check (abilita in ('for','des','cos','int','sag','car')),
  competenza    boolean not null default false
);

alter table skills add column if not exists ordine integer not null default 0;

-- ---------------------------------------------------------
-- 4) attacks — armi/attacchi, completamente modificabili
-- ---------------------------------------------------------
create table if not exists attacks (
  id                  uuid primary key default gen_random_uuid(),
  character_id        uuid not null references characters(id) on delete cascade,
  ordine              integer not null default 0,
  nome                text not null,
  abilita             text not null check (abilita in ('for','des','cos','int','sag','car')),
  bonus_magico        integer not null default 0,
  bonus_danno_extra   integer not null default 0,
  dado_danno          text,
  tipo_danno          text,
  proprieta           text[] not null default '{}'
);

-- ---------------------------------------------------------
-- 5) feature_items — Talenti e Capacità (4 gruppi), con contatore utilizzi
-- ---------------------------------------------------------
create table if not exists feature_items (
  id            uuid primary key default gen_random_uuid(),
  character_id  uuid not null references characters(id) on delete cascade,
  gruppo        text not null check (gruppo in ('talenti','guerriero','stregone','razziali')),
  ordine        integer not null default 0,
  nome          text not null,
  descrizione   text,
  usi_max       integer not null default 0,
  usi_spesi     integer not null default 0
);

-- ---------------------------------------------------------
-- 6) spells — incantesimi con tutti i dettagli
-- ---------------------------------------------------------
create table if not exists spells (
  id            uuid primary key default gen_random_uuid(),
  character_id  uuid not null references characters(id) on delete cascade,
  ordine        integer not null default 0,
  nome          text not null,
  livello       integer not null default 0,
  tempo_lancio  text,
  tipo_azione   text,
  gittata       text,
  componenti    text,
  effetti       text,
  da_talento    boolean not null default false
);

-- ---------------------------------------------------------
-- 7) spell_slots — slot incantesimo disponibili/usati per livello
-- ---------------------------------------------------------
create table if not exists spell_slots (
  id            uuid primary key default gen_random_uuid(),
  character_id  uuid not null references characters(id) on delete cascade,
  livello       integer not null,
  usi_max       integer not null default 0,
  usi_spesi     integer not null default 0,
  unique (character_id, livello)
);

-- ---------------------------------------------------------
-- 8) hit_dice — dadi vita per classe
-- ---------------------------------------------------------
create table if not exists hit_dice (
  id            uuid primary key default gen_random_uuid(),
  character_id  uuid not null references characters(id) on delete cascade,
  ordine        integer not null default 0,
  dado          text not null,
  classe        text,
  totale        integer not null default 1,
  usati         integer not null default 0
);

-- ---------------------------------------------------------
-- 9) inventory_items — oggetti, peso, quantità e descrizione
-- ---------------------------------------------------------
create table if not exists inventory_items (
  id            uuid primary key default gen_random_uuid(),
  character_id  uuid not null references characters(id) on delete cascade,
  ordine        integer not null default 0,
  nome          text not null,
  descrizione   text,
  peso          numeric not null default 0,
  quantita      numeric not null default 1
);

-- ---------------------------------------------------------
-- 10) player_notes — note libere del giocatore
-- ---------------------------------------------------------
create table if not exists player_notes (
  id            uuid primary key default gen_random_uuid(),
  character_id  uuid not null references characters(id) on delete cascade,
  ordine        integer not null default 0,
  testo         text not null default ''
);

-- ---------------------------------------------------------
-- Indici utili per le query filtrate per personaggio
-- ---------------------------------------------------------
create index if not exists idx_classes_char   on character_classes(character_id);
create index if not exists idx_skills_char    on skills(character_id);
create index if not exists idx_attacks_char   on attacks(character_id);
create index if not exists idx_features_char  on feature_items(character_id);
create index if not exists idx_spells_char    on spells(character_id);
create index if not exists idx_slots_char     on spell_slots(character_id);
create index if not exists idx_hitdice_char   on hit_dice(character_id);
create index if not exists idx_inventory_char on inventory_items(character_id);
create index if not exists idx_notes_char     on player_notes(character_id);

-- ---------------------------------------------------------
-- Aggiorna automaticamente "updated_at" su characters
-- ---------------------------------------------------------
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_characters_updated_at on characters;
create trigger trg_characters_updated_at
  before update on characters
  for each row execute function set_updated_at();

-- ---------------------------------------------------------
-- Row Level Security: abilitata su tutte le tabelle, con una
-- policy aperta (lettura/scrittura libera) per l'uso con la
-- chiave "anon" senza sistema di login. Vedi nota di sicurezza
-- in cima al file.
-- ---------------------------------------------------------
do $$
declare
  t text;
begin
  for t in
    select unnest(array[
      'characters','character_classes','skills','attacks','feature_items',
      'spells','spell_slots','hit_dice','inventory_items','player_notes'
    ])
  loop
    execute format('alter table %I enable row level security;', t);
    execute format('drop policy if exists "allow all - anon" on %I;', t);
    execute format(
      'create policy "allow all - anon" on %I for all using (true) with check (true);',
      t
    );
  end loop;
end $$;
