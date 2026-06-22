# Audit de complétude — appellations Ma Cave vs INAO

> Source officielle : Référentiel SIQO de l'INAO (data.gouv.fr, Licence Ouverte Etalab), extraction du 2025-12-31.
> Filtre : secteur VITICOLE, signe AOC/AOP, état « Publié ». Matching par nom normalisé (accents, suffixes couleur, alias « ou »/virgules neutralisés).
> Rapport généré le 2026-06-22.

## Synthèse

| Mesure | Valeur |
|---|---|
| AOC/AOP viticoles officielles (INAO) | **368** |
| Couvertes par l'app | **210** |
| Manquantes | **158** |
| → vins tranquilles/effervescents | 98 |
| → Alsace Grand Cru (lieux-dits) | 51 |
| → vins doux/de liqueur | 3 |
| → cidres (hors périmètre) | 6 |

## 1. Vins manquants — candidats prioritaires (98)

AOC tranquilles/effervescentes absentes de `appellations.ts`. Chacune nécessite couleur + fenêtre de garde sourcée + enrichissement (cépages, style, investmentPotential).

- Anjou Brissac
- Anjou-Coteaux de la Loire
- Béarn
- Beaumes de Venise
- Bienvenues-Bâtard-Montrachet
- Blagny
- Bourgogne Passe-tout-grains
- Boutenac
- Brulhois
- Bugey
- Cabernet d'Anjou
- Cérons
- Chapelle-Chambertin
- Charlemagne
- Châteaumeillant
- Châtillon-en-Diois
- Cheverny
- Clairette de Bellegarde
- Clairette du Languedoc
- Clos Saint-Denis
- Corrèze
- Côte de Beaune
- Côte de Beaune-Villages
- Côte roannaise
- Coteaux Bourguignons ou Bourgogne grand ordinaire ou Bourgogne ordinaire
- Coteaux d'Aix-en-Provence
- Coteaux d'Ancenis
- Coteaux de Die
- Coteaux de l'Aubance
- Coteaux de Saumur
- Coteaux du Giennois
- Coteaux du Loir
- Coteaux du Lyonnais
- Coteaux du Quercy
- Coteaux du Vendômois
- Côtes d'Auvergne
- Côtes de Bergerac
- Côtes de Bordeaux
- Côtes de Bordeaux-Saint-Macaire
- Côtes de Millau
- Côtes de Montravel
- Côtes de Toul
- Côtes du Forez
- Côtes du Vivarais
- Coulée de Serrant
- Crémant d'Alsace
- Crémant de Die
- Criots-Bâtard-Montrachet
- Duché d'Uzès
- Entraygues - Le Fel
- Estaing
- Fiefs Vendéens
- Gaillac premières côtes
- Graves de Vayres
- Graves supérieures
- Grignan-les-Adhémar
- Griotte-Chambertin
- Gros Plant du Pays Nantais
- Haut-Montravel
- Haut-Poitou
- L'Etoile
- La Grande Rue
- La Livinière
- La Romanée
- Latricières-Chambertin
- Lussac Saint-Emilion
- Malepère
- Mazoyères-Chambertin
- Montravel
- Moselle
- Muscadet Coteaux de la Loire
- Muscadet Côtes de Grandlieu
- Muscat de Lunel
- Muscat de Mireval
- Muscat de Saint-Jean-de-Minervois
- Orléans
- Orléans-Cléry
- Pierrevert
- Pouilly-Loché
- Pouilly-sur-Loire
- Pouilly-Vinzelles
- Premières Côtes de Bordeaux
- Puisseguin Saint-Emilion
- Rosé d'Anjou
- Rosé de Loire
- Rosette
- Roussette du Bugey
- Ruchottes-Chambertin
- Sable de Camargue
- Saint-Bris
- Saint-Georges-Saint-Emilion
- Saint-Pourçain
- Saint-Sardos
- Touraine Noble Joué
- Tursan
- Valençay
- Vézelay
- Vougeot

## 2. Alsace Grand Cru — lieux-dits (51)

L'app a un seul profil générique « Alsace Grand Cru ». L'INAO reconnaît 51 grands crus distincts (cépages quasi identiques : Riesling, Gewurztraminer, Pinot Gris, Muscat). Décision produit : garder le générique vs éclater.

- Altenberg de Bergbieten
- Altenberg de Bergheim
- Altenberg de Wolxheim
- Brand
- Bruderthal
- Eichberg
- Engelberg
- Florimont
- Frankstein
- Froehn
- Furstentum
- Geisberg
- Gloeckelberg
- Goldert
- Hatschbourg
- Hengst
- Kaefferkopf
- Kanzlerberg
- Kastelberg
- Kessler
- Kirchberg de Barr
- Kirchberg de Ribeauvillé
- Kitterlé
- Mambourg
- Mandelberg
- Marckrain
- Moenchberg
- Muenchberg
- Ollwiller
- Osterberg
- Pfersigberg
- Pfingstberg
- Praelatenberg
- Rangen
- Rosacker
- Saering
- Schlossberg
- Schoenenbourg
- Sommerberg
- Sonnenglanz
- Spiegel
- Sporen
- Steinert
- Steingrubler
- Steinklotz
- Vorbourg
- Wiebelsberg
- Wineck-Schlossberg
- Winzenberg
- Zinnkoepfle
- Zotzenberg

## 3. Vins doux / de liqueur (3)

- Grand Roussillon
- Pineau des Charentes
- Floc de Gascogne

## 4. Cidres — hors périmètre (6)

- Pays d'Auge
- Cornouaille
- Cidre Cotentin ou Cotentin
- Cidre du Perche ou Perche
- Domfront
- Euskal Sagardoa ou Sidra Del País Vasco ou Cidre Du Pays Basque ou Cidre Du Pays Basque-Eu
