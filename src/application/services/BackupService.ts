import type { Bottle } from '@/domain/entities/Bottle'

export const BACKUP_APP_ID = 'ma-cave'

/**
 * Version du **format de sauvegarde** (l'enveloppe + le schéma des bouteilles).
 * À incrémenter à chaque évolution du modèle de données nécessitant une
 * transformation des anciens fichiers — et ajouter la migration correspondante
 * dans `MIGRATIONS` ci-dessous.
 */
export const BACKUP_FORMAT_VERSION = 2

/** Version applicative, embarquée pour diagnostic (informatif, non bloquant). */
export const APP_VERSION = '0.1.0'

/** Alias rétro-compatible : certains appels historiques référençaient ce nom. */
export const BACKUP_VERSION = BACKUP_FORMAT_VERSION

export interface CaveBackup {
  app: typeof BACKUP_APP_ID
  version: number // version du format (BACKUP_FORMAT_VERSION)
  appVersion: string // version de l'app qui a produit / migré la sauvegarde
  exportedAt: string // ISO datetime
  bottleCount: number
  bottles: Bottle[]
}

/** Construit l'objet de sauvegarde sérialisable à partir des bouteilles. */
export function buildBackup(bottles: Bottle[]): CaveBackup {
  return {
    app: BACKUP_APP_ID,
    version: BACKUP_FORMAT_VERSION,
    appVersion: APP_VERSION,
    exportedAt: new Date().toISOString(),
    bottleCount: bottles.length,
    bottles,
  }
}

/** Nom de fichier horodaté pour la sauvegarde téléchargée. */
export function backupFileName(date = new Date()): string {
  const stamp = date.toISOString().slice(0, 19).replace(/[:T]/g, '-')
  return `ma-cave-sauvegarde-${stamp}.json`
}

// ─── Migrations ─────────────────────────────────────────────────────────────

type RawBackup = Record<string, unknown>

/**
 * Backfill défensif d'une bouteille vers le schéma courant : garantit la présence
 * des champs ajoutés au fil des versions, sans écraser les valeurs existantes.
 */
function backfillBottle(raw: unknown): unknown {
  if (typeof raw !== 'object' || raw === null) return raw
  const b = raw as Record<string, unknown>
  return {
    ...b,
    priceHistory: Array.isArray(b.priceHistory) ? b.priceHistory : [],
    tastingNotes: Array.isArray(b.tastingNotes) ? b.tastingNotes : [],
    updatedAt: typeof b.updatedAt === 'string' ? b.updatedAt : (b.createdAt ?? new Date().toISOString()),
  }
}

/**
 * Registre des migrations. `MIGRATIONS[n]` transforme une sauvegarde de la
 * version `n` vers la version `n + 1`. Appliquées en chaîne par `migrateBackup`.
 */
const MIGRATIONS: Record<number, (b: RawBackup) => RawBackup> = {
  // v1 → v2 : ajout des champs priceHistory / tastingNotes / updatedAt garantis.
  1: (b) => ({
    ...b,
    version: 2,
    bottles: Array.isArray(b.bottles) ? b.bottles.map(backfillBottle) : [],
  }),
}

/**
 * Applique en chaîne les migrations nécessaires pour amener une sauvegarde brute
 * à `BACKUP_FORMAT_VERSION`. Lève une erreur FR si la version est inconnue ou
 * postérieure à celle supportée par cette build.
 */
function migrateBackup(data: RawBackup): RawBackup {
  let current = data
  let version = typeof current.version === 'number' ? current.version : 1

  if (version > BACKUP_FORMAT_VERSION) {
    throw new Error(
      'Cette sauvegarde a été créée par une version plus récente de Ma Cave. ' +
        'Mettez l’application à jour avant de l’importer.',
    )
  }

  while (version < BACKUP_FORMAT_VERSION) {
    const migrate = MIGRATIONS[version]
    if (!migrate) {
      throw new Error(`Impossible de migrer la sauvegarde (version ${version} non gérée).`)
    }
    current = migrate(current)
    version = typeof current.version === 'number' ? current.version : version + 1
  }

  return current
}

// ─── Validation & parsing ───────────────────────────────────────────────────

const REQUIRED_FIELDS: (keyof Bottle)[] = ['id', 'type', 'name', 'quantity', 'createdAt']

function isValidBottle(b: unknown): b is Bottle {
  if (typeof b !== 'object' || b === null) return false
  const obj = b as Record<string, unknown>
  if (!REQUIRED_FIELDS.every((f) => f in obj)) return false
  if (typeof obj.id !== 'string' || obj.id.length === 0) return false
  if (obj.type !== 'wine' && obj.type !== 'spirit') return false
  if (typeof obj.name !== 'string') return false
  if (typeof obj.quantity !== 'number') return false
  return true
}

/**
 * Analyse et valide un fichier de sauvegarde (JSON brut).
 * Migre automatiquement les anciens formats vers la version courante.
 * Lève une Error explicite (message en français) si le format est invalide.
 */
export function parseBackup(raw: string): CaveBackup {
  let data: unknown
  try {
    data = JSON.parse(raw)
  } catch {
    throw new Error('Fichier illisible : ce n’est pas un JSON valide.')
  }

  if (typeof data !== 'object' || data === null) {
    throw new Error('Fichier de sauvegarde invalide.')
  }
  const obj = data as Record<string, unknown>

  if (obj.app !== BACKUP_APP_ID) {
    throw new Error('Ce fichier ne provient pas de Ma Cave.')
  }
  if (!Array.isArray(obj.bottles)) {
    throw new Error('Fichier de sauvegarde invalide : aucune bouteille trouvée.')
  }

  const migrated = migrateBackup(obj)
  const rawBottles = Array.isArray(migrated.bottles) ? migrated.bottles : []

  const bottles = rawBottles.filter(isValidBottle) as Bottle[]
  if (bottles.length !== rawBottles.length) {
    const dropped = rawBottles.length - bottles.length
    throw new Error(`${dropped} entrée(s) corrompue(s) dans la sauvegarde — import annulé.`)
  }

  return {
    app: BACKUP_APP_ID,
    version: BACKUP_FORMAT_VERSION,
    appVersion: typeof migrated.appVersion === 'string' ? migrated.appVersion : APP_VERSION,
    exportedAt: typeof migrated.exportedAt === 'string' ? migrated.exportedAt : new Date().toISOString(),
    bottleCount: bottles.length,
    bottles,
  }
}
